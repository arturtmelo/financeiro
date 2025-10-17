import { Transaction } from '../types';
import {
  calculateMonthlyStats,
  formatCurrency,
  getPaymentMethodStats,
} from '../utils/calculations';
import { TrendingUp, TrendingDown, Wallet, CreditCard } from 'lucide-react';

interface DashboardProps {
  transactions: Transaction[];
}

const Dashboard = ({ transactions }: DashboardProps) => {
  const stats = calculateMonthlyStats(transactions);
  const paymentStats = getPaymentMethodStats(transactions);

  return (
    <div className="mb-8 space-y-6">
      {/* Cards de Resumo */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
        <div className="bg-white rounded-2xl shadow-xl p-4 sm:p-6">
          <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-4">
            Total por Método de Pagamento
          </h3>
          <div className="space-y-3">
            {paymentStats.slice(0, 5).map((stat, index) => {
              const isPositive = stat.total >= 0;
              const maxAbsValue = Math.max(...paymentStats.map((s) => Math.abs(s.total)));

              return (
                <div
                  key={stat.method}
                  className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-xs sm:text-sm flex-shrink-0">
                      {index + 1}
                    </div>
                    <span className="font-medium text-gray-700 text-sm sm:text-base">
                      {stat.method}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 sm:gap-4 ml-10 sm:ml-0">
                    <div className="w-24 sm:w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
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
    <div className="bg-white rounded-2xl shadow-xl p-6 transform transition-all hover:scale-105">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-gray-600 text-sm font-medium mb-2">{title}</p>
          <p className="text-2xl font-bold text-gray-800">{value}</p>
        </div>
        <div className={`bg-gradient-to-br ${colorClasses[color]} p-3 rounded-xl text-white`}>
          {icon}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
