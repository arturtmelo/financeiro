import { Transaction, MonthlyStats, Budget, BudgetProgressItem } from '../types';
import { format, isWithinInterval, startOfMonth, endOfMonth } from 'date-fns';

const DEFAULT_ALERT_THRESHOLD = 0.8;

/**
 * Filtra transações que caem dentro de um mês (mês atual por padrão).
 * Reaproveitada por calculateMonthlyStats, calculateBudgetProgress e pelo
 * Dashboard, para que todas as seções da Visão Geral usem o mesmo escopo.
 */
export const getTransactionsInMonth = (transactions: Transaction[], month?: Date): Transaction[] => {
  const targetMonth = month || new Date();
  const start = startOfMonth(targetMonth);
  const end = endOfMonth(targetMonth);

  return transactions.filter((t) => {
    // Evita problema de fuso horário ao criar date a partir de string YYYY-MM-DD
    const [year, monthNum, day] = t.date.split('-').map(Number);
    const transactionDate = new Date(year, monthNum - 1, day);
    return isWithinInterval(transactionDate, { start, end });
  });
};

/**
 * Agrega entradas/saídas/saldo/contagem de um conjunto de transações já
 * filtrado (por período, categoria, etc). Não faz nenhum filtro de data —
 * quem chama decide o recorte (ver filterTransactionsByPeriod/getTransactionsInMonth).
 */
export const calculateStats = (transactions: Transaction[]): MonthlyStats => {
  const totalIncome = transactions
    .filter((t) => t.type === 'entrada')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = transactions
    .filter((t) => t.type === 'saida')
    .reduce((sum, t) => sum + t.amount, 0);

  return {
    totalIncome,
    totalExpense,
    balance: totalIncome - totalExpense,
    transactionCount: transactions.length,
  };
};

export type PeriodFilter = 'week' | 'month' | 'quarter' | '6months' | 'year' | 'all';

/**
 * Filtra transações dentro de uma janela relativa a hoje (últimos 7 dias,
 * último mês, etc). Usada pelos seletores de período do Dashboard e da
 * Analytics para que ambos compartilhem a mesma definição de cada período.
 */
export const filterTransactionsByPeriod = (
  transactions: Transaction[],
  period: PeriodFilter
): Transaction[] => {
  if (period === 'all') return transactions;

  const now = new Date();
  const startDate = new Date();

  switch (period) {
    case 'week':
      startDate.setDate(now.getDate() - 7);
      break;
    case 'month':
      startDate.setMonth(now.getMonth() - 1);
      break;
    case 'quarter':
      startDate.setMonth(now.getMonth() - 3);
      break;
    case '6months':
      startDate.setMonth(now.getMonth() - 6);
      break;
    case 'year':
      startDate.setFullYear(now.getFullYear() - 1);
      break;
  }

  return transactions.filter((t) => {
    const [year, month, day] = t.date.split('-').map(Number);
    const transactionDate = new Date(year, month - 1, day);
    return transactionDate >= startDate;
  });
};

export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
};

export const formatDate = (date: string): string => {
  // Evita problema de fuso horário ao criar date a partir de string YYYY-MM-DD
  const [year, month, day] = date.split('-').map(Number);
  return format(new Date(year, month - 1, day), 'dd/MM/yyyy');
};

export const calculateBudgetProgress = (
  transactions: Transaction[],
  budgets: Budget[],
  month?: Date
): BudgetProgressItem[] => {
  const expensesThisMonth = getTransactionsInMonth(transactions, month).filter(
    (t) => t.type === 'saida'
  );

  return budgets.map((budget) => {
    const spent = expensesThisMonth
      .filter((t) => t.category === budget.category)
      .reduce((sum, t) => sum + t.amount, 0);

    const threshold = budget.alertThreshold ?? DEFAULT_ALERT_THRESHOLD;
    const percentage = budget.limit > 0 ? spent / budget.limit : 0;

    return {
      budget,
      spent,
      percentage,
      isOverBudget: percentage >= 1,
      isNearThreshold: percentage >= threshold && percentage < 1,
    };
  });
};

export const getPaymentMethodStats = (transactions: Transaction[]) => {
  const stats = new Map<string, number>();

  transactions.forEach((t) => {
    const current = stats.get(t.paymentMethod) || 0;
    const value = t.type === 'entrada' ? t.amount : -t.amount;
    stats.set(t.paymentMethod, current + value);
  });

  return Array.from(stats.entries())
    .map(([method, total]) => ({
      method,
      total,
    }))
    .sort((a, b) => Math.abs(b.total) - Math.abs(a.total));
};
