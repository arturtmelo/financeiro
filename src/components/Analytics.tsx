import { useState, useMemo } from 'react';
import { Transaction } from '../types';
import {
  PieChart,
  Pie,
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Calendar,
  Target,
  ArrowUpCircle,
  ArrowDownCircle,
  Wallet,
} from 'lucide-react';
import { formatCurrency } from '../utils/calculations';

interface AnalyticsProps {
  transactions: Transaction[];
}

const COLORS = [
  '#8b5cf6', // purple
  '#ec4899', // pink
  '#f59e0b', // amber
  '#10b981', // emerald
  '#3b82f6', // blue
  '#ef4444', // red
  '#06b6d4', // cyan
  '#f97316', // orange
];

type PeriodFilter = 'week' | 'month' | 'quarter' | 'year' | 'all';

const Analytics = ({ transactions }: AnalyticsProps) => {
  const [periodFilter, setPeriodFilter] = useState<PeriodFilter>('month');

  // Filtrar transações por período
  const filteredTransactions = useMemo(() => {
    const now = new Date();
    const startDate = new Date();

    switch (periodFilter) {
      case 'week':
        startDate.setDate(now.getDate() - 7);
        break;
      case 'month':
        startDate.setMonth(now.getMonth() - 1);
        break;
      case 'quarter':
        startDate.setMonth(now.getMonth() - 3);
        break;
      case 'year':
        startDate.setFullYear(now.getFullYear() - 1);
        break;
      case 'all':
        return transactions;
    }

    return transactions.filter((t) => {
      const [year, month, day] = t.date.split('-').map(Number);
      const transactionDate = new Date(year, month - 1, day);
      return transactionDate >= startDate;
    });
  }, [transactions, periodFilter]);

  // Calcular estatísticas gerais
  const stats = useMemo(() => {
    const entradas = filteredTransactions
      .filter((t) => t.type === 'entrada')
      .reduce((sum, t) => sum + t.amount, 0);

    const saidas = filteredTransactions
      .filter((t) => t.type === 'saida')
      .reduce((sum, t) => sum + t.amount, 0);

    const saldo = entradas - saidas;

    const avgEntrada =
      filteredTransactions.filter((t) => t.type === 'entrada').length > 0
        ? entradas / filteredTransactions.filter((t) => t.type === 'entrada').length
        : 0;

    const avgSaida =
      filteredTransactions.filter((t) => t.type === 'saida').length > 0
        ? saidas / filteredTransactions.filter((t) => t.type === 'saida').length
        : 0;

    const maiorGasto = Math.max(
      ...filteredTransactions.filter((t) => t.type === 'saida').map((t) => t.amount),
      0
    );

    return {
      entradas,
      saidas,
      saldo,
      avgEntrada,
      avgSaida,
      maiorGasto,
      totalTransactions: filteredTransactions.length,
    };
  }, [filteredTransactions]);

  // Dados para gráfico de gastos por categoria
  const categoryData = useMemo(() => {
    const gastosPorCategoria = filteredTransactions
      .filter((t) => t.type === 'saida' && t.category)
      .reduce((acc, t) => {
        const cat = t.category || 'Sem categoria';
        acc[cat] = (acc[cat] || 0) + t.amount;
        return acc;
      }, {} as Record<string, number>);

    return Object.entries(gastosPorCategoria)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  }, [filteredTransactions]);

  // Dados para gráfico de gastos por método
  const paymentMethodData = useMemo(() => {
    const gastosPorMetodo = filteredTransactions
      .filter((t) => t.type === 'saida')
      .reduce((acc, t) => {
        acc[t.paymentMethod] = (acc[t.paymentMethod] || 0) + t.amount;
        return acc;
      }, {} as Record<string, number>);

    return Object.entries(gastosPorMetodo)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  }, [filteredTransactions]);

  // Dados para gráfico de evolução temporal
  const timelineData = useMemo(() => {
    const dataByMonth = filteredTransactions.reduce((acc, t) => {
      const [year, month] = t.date.split('-');
      const key = `${year}-${month}`;

      if (!acc[key]) {
        acc[key] = { month: key, entradas: 0, saidas: 0 };
      }

      if (t.type === 'entrada') {
        acc[key].entradas += t.amount;
      } else {
        acc[key].saidas += t.amount;
      }

      return acc;
    }, {} as Record<string, { month: string; entradas: number; saidas: number }>);

    return Object.values(dataByMonth).sort((a, b) => a.month.localeCompare(b.month));
  }, [filteredTransactions]);

  // Formatar label do mês
  const formatMonthLabel = (monthStr: string) => {
    const [year, month] = monthStr.split('-');
    const date = new Date(parseInt(year), parseInt(month) - 1);
    return date.toLocaleDateString('pt-BR', { month: 'short', year: '2-digit' });
  };

  const periodLabels: Record<PeriodFilter, string> = {
    week: 'Últimos 7 Dias',
    month: 'Último Mês',
    quarter: 'Últimos 3 Meses',
    year: 'Último Ano',
    all: 'Tudo',
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header com filtros */}
      <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6">
        <div className="flex flex-col gap-3 sm:gap-4">
          <div>
            <h2 className="text-lg sm:text-2xl font-bold text-gray-800 flex items-center gap-2">
              <Target className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600" />
              Análise Financeira
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              {periodLabels[periodFilter]} • {stats.totalTransactions} transações
            </p>
          </div>

          {/* Filtros de período */}
          <div className="grid grid-cols-3 sm:flex sm:flex-wrap gap-2">
            {(Object.keys(periodLabels) as PeriodFilter[]).map((period) => (
              <button
                key={period}
                onClick={() => setPeriodFilter(period)}
                className={`px-2 sm:px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                  periodFilter === period
                    ? 'bg-purple-600 text-white shadow-md'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200 active:bg-gray-300'
                }`}
              >
                {periodLabels[period].replace('Últimos ', '').replace('Último ', '')}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Cards de estatísticas */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Card: Entradas */}
        <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl sm:rounded-2xl shadow-lg p-3 sm:p-4 lg:p-6 text-white">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-0 mb-2">
            <ArrowUpCircle className="w-6 h-6 sm:w-8 sm:h-8 opacity-80" />
            <span className="text-xs sm:text-sm font-semibold opacity-90">Entradas</span>
          </div>
          <p className="text-xl sm:text-2xl lg:text-3xl font-bold break-all">
            {formatCurrency(stats.entradas)}
          </p>
          <p className="text-xs sm:text-sm mt-1 sm:mt-2 opacity-90">
            Média: {formatCurrency(stats.avgEntrada)}
          </p>
        </div>

        {/* Card: Saídas */}
        <div className="bg-gradient-to-br from-red-500 to-pink-600 rounded-xl sm:rounded-2xl shadow-lg p-3 sm:p-4 lg:p-6 text-white">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-0 mb-2">
            <ArrowDownCircle className="w-6 h-6 sm:w-8 sm:h-8 opacity-80" />
            <span className="text-xs sm:text-sm font-semibold opacity-90">Saídas</span>
          </div>
          <p className="text-xl sm:text-2xl lg:text-3xl font-bold break-all">
            {formatCurrency(stats.saidas)}
          </p>
          <p className="text-xs sm:text-sm mt-1 sm:mt-2 opacity-90">
            Média: {formatCurrency(stats.avgSaida)}
          </p>
        </div>

        {/* Card: Saldo */}
        <div
          className={`bg-gradient-to-br ${
            stats.saldo >= 0 ? 'from-blue-500 to-indigo-600' : 'from-orange-500 to-red-600'
          } rounded-xl sm:rounded-2xl shadow-lg p-3 sm:p-4 lg:p-6 text-white`}
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-0 mb-2">
            {stats.saldo >= 0 ? (
              <TrendingUp className="w-6 h-6 sm:w-8 sm:h-8 opacity-80" />
            ) : (
              <TrendingDown className="w-6 h-6 sm:w-8 sm:h-8 opacity-80" />
            )}
            <span className="text-xs sm:text-sm font-semibold opacity-90">Saldo</span>
          </div>
          <p className="text-xl sm:text-2xl lg:text-3xl font-bold break-all">
            {formatCurrency(stats.saldo)}
          </p>
          <p className="text-xs sm:text-sm mt-1 sm:mt-2 opacity-90">
            {stats.saldo >= 0 ? 'Positivo' : 'Negativo'}
          </p>
        </div>

        {/* Card: Maior Gasto */}
        <div className="bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl sm:rounded-2xl shadow-lg p-3 sm:p-4 lg:p-6 text-white">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-0 mb-2">
            <DollarSign className="w-6 h-6 sm:w-8 sm:h-8 opacity-80" />
            <span className="text-xs sm:text-sm font-semibold opacity-90">Maior Gasto</span>
          </div>
          <p className="text-xl sm:text-2xl lg:text-3xl font-bold break-all">
            {formatCurrency(stats.maiorGasto)}
          </p>
          <p className="text-xs sm:text-sm mt-1 sm:mt-2 opacity-90">Transação única</p>
        </div>
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Gráfico: Gastos por Categoria */}
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6">
          <h3 className="text-base sm:text-lg font-bold text-gray-800 mb-3 sm:mb-4 flex items-center gap-2">
            <Wallet className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600" />
            Gastos por Categoria
          </h3>
          {categoryData.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }: any) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {categoryData.map((_entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: number) => formatCurrency(value)}
                  contentStyle={{
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    border: 'none',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[250px] flex items-center justify-center text-gray-400 text-sm">
              <p>Sem dados de categorias</p>
            </div>
          )}
        </div>

        {/* Gráfico: Gastos por Método */}
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6">
          <h3 className="text-base sm:text-lg font-bold text-gray-800 mb-3 sm:mb-4 flex items-center gap-2">
            <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600" />
            Gastos por Método de Pagamento
          </h3>
          {paymentMethodData.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={paymentMethodData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }: any) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {paymentMethodData.map((_entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: number) => formatCurrency(value)}
                  contentStyle={{
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    border: 'none',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[250px] flex items-center justify-center text-gray-400 text-sm">
              <p>Sem dados de métodos</p>
            </div>
          )}
        </div>

        {/* Gráfico Combinado: Entradas vs Saídas + Evolução do Saldo */}
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 lg:col-span-2">
          <h3 className="text-base sm:text-lg font-bold text-gray-800 mb-3 sm:mb-4 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600" />
            Evolução: Entradas, Saídas e Saldo
          </h3>
          {timelineData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <ComposedChart
                data={timelineData.reduce((acc, d) => {
                  const saldoMes = d.entradas - d.saidas;
                  const ultimoSaldo = acc.length > 0 ? acc[acc.length - 1].saldo : 0;
                  acc.push({
                    ...d,
                    saldo: ultimoSaldo + saldoMes,
                  });
                  return acc;
                }, [] as Array<(typeof timelineData)[0] & { saldo: number }>)}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis
                  dataKey="month"
                  tickFormatter={formatMonthLabel}
                  style={{ fontSize: '12px' }}
                />
                <YAxis tickFormatter={(value) => `R$ ${value}`} style={{ fontSize: '12px' }} />
                <Tooltip
                  formatter={(value: number) => formatCurrency(value)}
                  labelFormatter={formatMonthLabel}
                  contentStyle={{
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    border: 'none',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                  }}
                />
                <Legend />
                <Bar dataKey="entradas" fill="#10b981" name="Entradas" radius={[8, 8, 0, 0]} />
                <Bar dataKey="saidas" fill="#ef4444" name="Saídas" radius={[8, 8, 0, 0]} />
                <Line
                  type="monotone"
                  dataKey="saldo"
                  stroke="#8b5cf6"
                  strokeWidth={3}
                  name="Saldo"
                  dot={{ fill: '#8b5cf6', r: 5 }}
                  activeDot={{ r: 7 }}
                />
              </ComposedChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[300px] flex items-center justify-center text-gray-400 text-sm">
              <p>Sem dados de evolução</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Analytics;
