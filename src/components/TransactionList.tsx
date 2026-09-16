import { useMemo, useState } from 'react';
import { Transaction, TransactionType } from '../types';
import { formatCurrency, formatDate } from '../utils/calculations';
import { downloadTransactionsCsv } from '../utils/csvExport';
import {
  Trash2,
  Edit,
  Search,
  Filter,
  ArrowUpCircle,
  ArrowDownCircle,
  Inbox,
  Download,
} from 'lucide-react';
import ConfirmDialog from './ConfirmDialog';

interface TransactionListProps {
  transactions: Transaction[];
  onDelete: (id: string) => void;
  onEdit: (transaction: Transaction) => void;
  paymentMethods: string[];
}

const TransactionList = ({
  transactions,
  onDelete,
  onEdit,
  paymentMethods,
}: TransactionListProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<TransactionType | 'all'>('all');
  const [filterPayment, setFilterPayment] = useState<string>('all');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [amountMin, setAmountMin] = useState('');
  const [amountMax, setAmountMax] = useState('');
  const [showMoreFilters, setShowMoreFilters] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<{
    isOpen: boolean;
    id: string;
    description: string;
  }>({ isOpen: false, id: '', description: '' });

  const filteredTransactions = useMemo(() => {
    const minValue = amountMin ? parseFloat(amountMin) : null;
    const maxValue = amountMax ? parseFloat(amountMax) : null;

    return transactions
      .filter((t) => {
        // Busca global: pesquisa em descrição, valor, método de pagamento e categoria
        const searchLower = searchTerm.toLowerCase();
        const matchesDescription = t.description.toLowerCase().includes(searchLower);
        const matchesAmount = t.amount.toString().includes(searchTerm);
        const matchesPaymentMethodSearch = t.paymentMethod.toLowerCase().includes(searchLower);
        const matchesCategory = t.category?.toLowerCase().includes(searchLower) || false;

        const matchesSearch =
          matchesDescription || matchesAmount || matchesPaymentMethodSearch || matchesCategory;
        const matchesType = filterType === 'all' || t.type === filterType;
        const matchesPayment = filterPayment === 'all' || t.paymentMethod === filterPayment;
        const matchesDateFrom = !dateFrom || t.date >= dateFrom;
        const matchesDateTo = !dateTo || t.date <= dateTo;
        const matchesAmountMin = minValue === null || t.amount >= minValue;
        const matchesAmountMax = maxValue === null || t.amount <= maxValue;

        return (
          matchesSearch &&
          matchesType &&
          matchesPayment &&
          matchesDateFrom &&
          matchesDateTo &&
          matchesAmountMin &&
          matchesAmountMax
        );
      })
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [transactions, searchTerm, filterType, filterPayment, dateFrom, dateTo, amountMin, amountMax]);

  const handleDeleteClick = (id: string, description: string) => {
    setDeleteConfirm({ isOpen: true, id, description });
  };

  const handleDeleteConfirm = () => {
    onDelete(deleteConfirm.id);
    setDeleteConfirm({ isOpen: false, id: '', description: '' });
  };

  const handleDeleteCancel = () => {
    setDeleteConfirm({ isOpen: false, id: '', description: '' });
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4">
          Histórico de Transações
        </h2>

        {/* Filtros */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Busca */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-5 h-5" />
            <input
              type="text"
              placeholder="Buscar por título, valor, método..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border-2 border-gray-200 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 rounded-xl focus:border-purple-500 focus:outline-none transition-colors"
            />
          </div>

          {/* Filtro por Tipo */}
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-5 h-5" />
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as TransactionType | 'all')}
              className="w-full pl-10 pr-4 py-2 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:border-purple-500 focus:outline-none transition-colors bg-white dark:bg-gray-900 dark:text-gray-100 appearance-none"
            >
              <option value="all">Entradas e Saídas</option>
              <option value="entrada">Entradas</option>
              <option value="saida">Saídas</option>
            </select>
          </div>

          {/* Filtro por Método */}
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-5 h-5" />
            <select
              value={filterPayment}
              onChange={(e) => setFilterPayment(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:border-purple-500 focus:outline-none transition-colors bg-white dark:bg-gray-900 dark:text-gray-100 appearance-none"
            >
              <option value="all">Todos Pagamentos</option>
              {paymentMethods.map((method) => (
                <option key={method} value={method}>
                  {method}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Alternar mais filtros / exportar */}
        <div className="flex items-center justify-between mt-3">
          <button
            onClick={() => setShowMoreFilters(!showMoreFilters)}
            className="text-sm text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 font-medium"
          >
            {showMoreFilters ? 'Ocultar filtros avançados' : 'Mais filtros (data e valor)'}
          </button>
          <button
            onClick={() => downloadTransactionsCsv(filteredTransactions)}
            disabled={filteredTransactions.length === 0}
            className="flex items-center gap-1.5 text-sm text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 font-medium disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Download className="w-4 h-4" />
            Exportar CSV
          </button>
        </div>

        {/* Filtros avançados: intervalo de data e valor */}
        {showMoreFilters && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-3 p-3 sm:p-4 bg-gray-50 dark:bg-gray-900 rounded-xl">
            <div>
              <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">
                Data inicial
              </label>
              <input
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                className="w-full px-3 py-2 border-2 border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 rounded-xl focus:border-purple-500 focus:outline-none transition-colors text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">
                Data final
              </label>
              <input
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                className="w-full px-3 py-2 border-2 border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 rounded-xl focus:border-purple-500 focus:outline-none transition-colors text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">
                Valor mínimo
              </label>
              <input
                type="number"
                inputMode="decimal"
                min="0"
                placeholder="R$ 0,00"
                value={amountMin}
                onChange={(e) => setAmountMin(e.target.value)}
                className="w-full px-3 py-2 border-2 border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 rounded-xl focus:border-purple-500 focus:outline-none transition-colors text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">
                Valor máximo
              </label>
              <input
                type="number"
                inputMode="decimal"
                min="0"
                placeholder="R$ 0,00"
                value={amountMax}
                onChange={(e) => setAmountMax(e.target.value)}
                className="w-full px-3 py-2 border-2 border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 rounded-xl focus:border-purple-500 focus:outline-none transition-colors text-sm"
              />
            </div>
          </div>
        )}
      </div>

      {/* Lista de Transações */}
      <div className="space-y-3">
        {filteredTransactions.length === 0 ? (
          <div className="text-center py-16">
            <div className="flex justify-center mb-4">
              <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded-full">
                <Inbox className="w-12 h-12 text-gray-400 dark:text-gray-500" />
              </div>
            </div>
            <p className="text-gray-600 dark:text-gray-300 text-lg font-medium mb-2">
              Nenhuma transação encontrada
            </p>
            <p className="text-gray-400 dark:text-gray-500 text-sm">
              {transactions.length === 0
                ? 'Comece adicionando sua primeira transação'
                : 'Tente ajustar os filtros de busca'}
            </p>
          </div>
        ) : (
          filteredTransactions.map((transaction) => (
            <div
              key={transaction.id}
              className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl hover:shadow-md hover:border-purple-200 dark:hover:border-purple-800 transition-all group"
            >
              {/* Desktop Layout */}
              <div className="hidden sm:flex items-center justify-between p-4">
                <div className="flex items-center gap-4 flex-1">
                  <div
                    className={`p-3 rounded-xl ${
                      transaction.type === 'entrada'
                        ? 'bg-green-100 dark:bg-green-950 text-green-600 dark:text-green-400'
                        : 'bg-red-100 dark:bg-red-950 text-red-600 dark:text-red-400'
                    }`}
                  >
                    {transaction.type === 'entrada' ? (
                      <ArrowUpCircle className="w-6 h-6" />
                    ) : (
                      <ArrowDownCircle className="w-6 h-6" />
                    )}
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <h3 className="font-semibold text-gray-800 dark:text-gray-100">
                        {transaction.description}
                      </h3>
                      <span className="px-3 py-1 bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 text-xs font-medium rounded-full">
                        {transaction.paymentMethod}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 mt-1">
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {formatDate(transaction.date)}
                      </p>
                      {transaction.category && (
                        <span className="text-sm text-gray-400 dark:text-gray-500">
                          • {transaction.category}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="text-right">
                    <p
                      className={`text-xl font-bold ${
                        transaction.type === 'entrada'
                          ? 'text-green-600 dark:text-green-400'
                          : 'text-red-600 dark:text-red-400'
                      }`}
                    >
                      {transaction.type === 'entrada' ? '+' : '-'}{' '}
                      {formatCurrency(transaction.amount)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 ml-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => onEdit(transaction)}
                    className="p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950 rounded-lg transition-colors"
                    title="Editar"
                  >
                    <Edit className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleDeleteClick(transaction.id, transaction.description)}
                    className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950 rounded-lg transition-colors"
                    title="Excluir"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Mobile Layout */}
              <div className="sm:hidden p-4">
                <div className="flex items-start gap-3 mb-3">
                  <div
                    className={`p-2 rounded-lg flex-shrink-0 ${
                      transaction.type === 'entrada'
                        ? 'bg-green-100 dark:bg-green-950 text-green-600 dark:text-green-400'
                        : 'bg-red-100 dark:bg-red-950 text-red-600 dark:text-red-400'
                    }`}
                  >
                    {transaction.type === 'entrada' ? (
                      <ArrowUpCircle className="w-5 h-5" />
                    ) : (
                      <ArrowDownCircle className="w-5 h-5" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-800 dark:text-gray-100 mb-1">
                      {transaction.description}
                    </h3>
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <span className="px-2 py-0.5 bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 text-xs font-medium rounded-full">
                        {transaction.paymentMethod}
                      </span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {formatDate(transaction.date)}
                      </span>
                    </div>
                    {transaction.category && (
                      <span className="text-xs text-gray-400 dark:text-gray-500">
                        {transaction.category}
                      </span>
                    )}
                  </div>

                  <p
                    className={`text-lg font-bold flex-shrink-0 ${
                      transaction.type === 'entrada'
                        ? 'text-green-600 dark:text-green-400'
                        : 'text-red-600 dark:text-red-400'
                    }`}
                  >
                    {transaction.type === 'entrada' ? '+' : '-'}
                    {formatCurrency(transaction.amount)}
                  </p>
                </div>

                <div className="flex items-center gap-2 pt-2 border-t border-gray-300 dark:border-gray-600">
                  <button
                    onClick={() => onEdit(transaction)}
                    className="flex-1 flex items-center justify-center p-2.5 text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950 active:bg-blue-100 dark:active:bg-blue-900 rounded-lg transition-colors"
                    title="Editar"
                  >
                    <Edit className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleDeleteClick(transaction.id, transaction.description)}
                    className="flex-1 flex items-center justify-center p-2.5 text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950 active:bg-red-100 dark:active:bg-red-900 rounded-lg transition-colors"
                    title="Excluir"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Confirm Delete Dialog */}
      <ConfirmDialog
        isOpen={deleteConfirm.isOpen}
        title="Excluir Transação"
        message={`Confirmar exclusão de "${deleteConfirm.description}"?`}
        confirmText="Sim, excluir"
        cancelText="Cancelar"
        confirmColor="red"
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
      />

      {filteredTransactions.length > 0 && (
        <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
          <p className="text-center text-gray-500 dark:text-gray-400 text-sm">
            Mostrando {filteredTransactions.length} de {transactions.length} transações
          </p>
        </div>
      )}
    </div>
  );
};

export default TransactionList;
