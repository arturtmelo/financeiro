import { Transaction, MonthlyStats, Budget, BudgetProgressItem } from '../types';
import { format, isWithinInterval, startOfMonth, endOfMonth } from 'date-fns';

const DEFAULT_ALERT_THRESHOLD = 0.8;

export const calculateMonthlyStats = (transactions: Transaction[], month?: Date): MonthlyStats => {
  const targetMonth = month || new Date();
  const start = startOfMonth(targetMonth);
  const end = endOfMonth(targetMonth);

  const filteredTransactions = transactions.filter((t) => {
    // Evita problema de fuso horário ao criar date a partir de string YYYY-MM-DD
    const [year, month, day] = t.date.split('-').map(Number);
    const transactionDate = new Date(year, month - 1, day);
    return isWithinInterval(transactionDate, { start, end });
  });

  const totalIncome = filteredTransactions
    .filter((t) => t.type === 'entrada')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = filteredTransactions
    .filter((t) => t.type === 'saida')
    .reduce((sum, t) => sum + t.amount, 0);

  return {
    totalIncome,
    totalExpense,
    balance: totalIncome - totalExpense,
    transactionCount: filteredTransactions.length,
  };
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
  const targetMonth = month || new Date();
  const start = startOfMonth(targetMonth);
  const end = endOfMonth(targetMonth);

  const expensesThisMonth = transactions.filter((t) => {
    if (t.type !== 'saida') return false;
    const [year, monthNum, day] = t.date.split('-').map(Number);
    const transactionDate = new Date(year, monthNum - 1, day);
    return isWithinInterval(transactionDate, { start, end });
  });

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
