import { useState } from 'react';
import { Transaction, Budget } from '../types';
import {
  calculateStats,
  filterTransactionsByPeriod,
  formatCurrency,
  getPaymentMethodStats,
  PeriodFilter,
} from '../utils/calculations';
import { TrendingUp, TrendingDown, Wallet, CreditCard, Target } from 'lucide-react';
import BudgetProgress from './BudgetProgress';
import PeriodTabs from './PeriodTabs';
import { SECTION_HEADING_CLASS, SUBSECTION_HEADING_CLASS } from '../utils/uiClasses';

interface DashboardProps {
  transactions: Transaction[];
  budgets: Budget[];
  onManageBudgets: () => void;
}

type DashboardPeriod = Extract<PeriodFilter, 'month' | '6months' | 'year' | 'all'>;

const PERIOD_OPTIONS: { value: DashboardPeriod; label: string }[] = [
  { value: 'month', label: 'Último Mês' },
  { value: '6months', label: 'Últimos 6 Meses' },
  { value: 'year', label: 'Último Ano' },
  { value: 'all', label: 'Tudo' },
];

const PERIOD_LABELS: Record<DashboardPeriod, string> = {
  month: 'Último Mês',
  '6months': 'Últimos 6 Meses',
  year: 'Último Ano',
  all: 'Tudo',
};

const Dashboard = ({ transactions, budgets, onManageBudgets }: DashboardProps) => {
  const [period, setPeriod] = useState<DashboardPeriod>('month');

  // Cards de resumo e total por método usam o mesmo recorte de período.
  // Orçamentos (BudgetProgress) continuam sempre por mês-calendário, à parte.
  const filteredTransactions = filterTransactionsByPeriod(transactions, period);
  const stats = calculateStats(filteredTransactions);
  const paymentStats = getPaymentMethodStats(filteredTransactions);

  return (
    <div className="mb-8 space-y-6">
      {/* Header com filtro de período */}
      <div className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6">
        <div className="flex flex-col gap-3 sm:gap-4">
          <div>
            <h2 className={SECTION_HEADING_CLASS}>
              <Target className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600 dark:text-purple-400" />
              Visão Geral
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">
              {PERIOD_LABELS[period]} • {stats.transactionCount} transações
            </p>
          </div>
          <PeriodTabs value={period} onChange={setPeriod} options={PERIOD_OPTIONS} />
        </div>
      </div>

      <BudgetProgress transactions={transactions} budgets={budgets} onManageBudgets={onManageBudgets} />

      {/* Cards de Resumo */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
        <StatCard
          title="Entradas"
          value={formatCurrency(stats.totalIncome)}
          icon={<TrendingUp className="w-6 h-6" />}
          color="green"
        />
        <StatCard
          title="Saídas"
          value={formatCurrency(stats.totalExpense)}
          icon={<TrendingDown className="w-6 h-6" />}
          color="red"
        />
        <StatCard
          title="Saldo"
          value={formatCurrency(stats.balance)}
          icon={<Wallet className="w-6 h-6" />}
          color={stats.balance >= 0 ? 'blue' : 'orange'}
        />
        <StatCard
          title="Transações"
          value={stats.transactionCount.toString()}
          icon={<CreditCard className="w-6 h-6" />}
          color="purple"
        />
      </div>

      {/* Estatísticas por Método de Pagamento */}
      {paymentStats.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-4 sm:p-6">
          <h3 className={`${SUBSECTION_HEADING_CLASS} mb-1`}>Total por Método de Pagamento</h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">{PERIOD_LABELS[period]}</p>
          <div className="space-y-3">
            {paymentStats.slice(0, 5).map((stat, index) => {
              const isPositive = stat.total >= 0;
              const maxAbsValue = Math.max(...paymentStats.map((s) => Math.abs(s.total)));

              return (
                <div
                  key={stat.method}
                  className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-xs sm:text-sm flex-shrink-0">
                      {index + 1}
                    </div>
                    <span className="font-medium text-gray-700 dark:text-gray-300 text-sm sm:text-base truncate">
                      {stat.method}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 sm:gap-4 ml-10 sm:ml-0">
                    <div className="w-24 sm:w-32 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${
                          isPositive
                            ? 'bg-gradient-to-r from-green-500 to-emerald-500'
                            : 'bg-gradient-to-r from-red-500 to-rose-500'
                        }`}
                        style={{
                          width: `${(Math.abs(stat.total) / maxAbsValue) * 100}%`,
                        }}
                      />
                    </div>
                    <span
                      className={`font-bold min-w-[100px] sm:min-w-[120px] text-right text-sm sm:text-base ${
                        isPositive ? 'text-green-600' : 'text-red-600'
                      }`}
                    >
                      {isPositive ? '+' : ''}
                      {formatCurrency(stat.total)}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

interface StatCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  color: 'green' | 'red' | 'blue' | 'purple' | 'orange';
}

const StatCard = ({ title, value, icon, color }: StatCardProps) => {
  const colorClasses = {
    green: 'from-green-500 to-emerald-600',
    red: 'from-red-500 to-rose-600',
    blue: 'from-blue-500 to-cyan-600',
    purple: 'from-purple-500 to-indigo-600',
    orange: 'from-orange-500 to-amber-600',
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-4 sm:p-6 transform transition-all hover:scale-105">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm font-medium mb-1 sm:mb-2 truncate">
            {title}
          </p>
          <p className="text-lg sm:text-2xl font-bold text-gray-800 dark:text-gray-100 break-all">
            {value}
          </p>
        </div>
        <div
          className={`bg-gradient-to-br ${colorClasses[color]} p-2 sm:p-3 rounded-xl text-white flex-shrink-0`}
        >
          {icon}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
