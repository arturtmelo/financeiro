import { useState } from 'react';
import { Transaction, TransactionType } from '../types';
import { formatCurrency, formatDate } from '../utils/calculations';
import { Trash2, Edit, Search, Filter, ArrowUpCircle, ArrowDownCircle, Inbox } from 'lucide-react';
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
  const [deleteConfirm, setDeleteConfirm] = useState<{
    isOpen: boolean;
    id: string;
    description: string;
  }>({ isOpen: false, id: '', description: '' });

  const filteredTransactions = transactions
    .filter((t) => {
      const matchesSearch = t.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = filterType === 'all' || t.type === filterType;
      const matchesPayment = filterPayment === 'all' || t.paymentMethod === filterPayment;
      return matchesSearch && matchesType && matchesPayment;
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

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
    <div className="bg-white rounded-2xl shadow-xl p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Histórico de Transações</h2>

        {/* Filtros */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Busca */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Buscar transação..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none transition-colors"
            />
          </div>

          {/* Filtro por Tipo */}
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as TransactionType | 'all')}
              className="w-full pl-10 pr-4 py-2 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none transition-colors bg-white appearance-none"
            >
              <option value="all">Todos os tipos</option>
              <option value="entrada">Entradas</option>
              <option value="saida">Saídas</option>
            </select>
          </div>

          {/* Filtro por Método */}
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <select
              value={filterPayment}
              onChange={(e) => setFilterPayment(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none transition-colors bg-white appearance-none"
            >
              <option value="all">Todos os métodos</option>
              {paymentMethods.map((method) => (
                <option key={method} value={method}>
                  {method}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Lista de Transações */}
      <div className="space-y-3">
        {filteredTransactions.length === 0 ? (
          <div className="text-center py-16">
            <div className="flex justify-center mb-4">
              <div className="p-4 bg-gray-100 rounded-full">
                <Inbox className="w-12 h-12 text-gray-400" />
              </div>
            </div>
            <p className="text-gray-600 text-lg font-medium mb-2">Nenhuma transação encontrada</p>
            <p className="text-gray-400 text-sm">
              {transactions.length === 0
                ? 'Comece adicionando sua primeira transação'
                : 'Tente ajustar os filtros de busca'}
            </p>
          </div>
        ) : (
          filteredTransactions.map((transaction) => (
            <div
              key={transaction.id}
              className="bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors group"
            >
              {/* Desktop Layout */}
              <div className="hidden sm:flex items-center justify-between p-4">
                <div className="flex items-center gap-4 flex-1">
                  <div
                    className={`p-3 rounded-xl ${
                      transaction.type === 'entrada'
                        ? 'bg-green-100 text-green-600'
                        : 'bg-red-100 text-red-600'
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
                      <h3 className="font-semibold text-gray-800">{transaction.description}</h3>
                      <span className="px-3 py-1 bg-purple-100 text-purple-700 text-xs font-medium rounded-full">
                        {transaction.paymentMethod}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 mt-1">
                      <p className="text-sm text-gray-500">{formatDate(transaction.date)}</p>
                      {transaction.category && (
                        <span className="text-sm text-gray-400">• {transaction.category}</span>
                      )}
                    </div>
                  </div>

                  <div className="text-right">
                    <p
                      className={`text-xl font-bold ${
                        transaction.type === 'entrada' ? 'text-green-600' : 'text-red-600'
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
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="Editar"
                  >
                    <Edit className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleDeleteClick(transaction.id, transaction.description)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
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
                        ? 'bg-green-100 text-green-600'
                        : 'bg-red-100 text-red-600'
                    }`}
                  >
                    {transaction.type === 'entrada' ? (
                      <ArrowUpCircle className="w-5 h-5" />
                    ) : (
                      <ArrowDownCircle className="w-5 h-5" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-800 mb-1">{transaction.description}</h3>
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <span className="px-2 py-0.5 bg-purple-100 text-purple-700 text-xs font-medium rounded-full">
                        {transaction.paymentMethod}
                      </span>
                      <span className="text-xs text-gray-500">{formatDate(transaction.date)}</span>
                    </div>
                    {transaction.category && (
                      <span className="text-xs text-gray-400">{transaction.category}</span>
                    )}
                  </div>

                  <p
                    className={`text-lg font-bold flex-shrink-0 ${
                      transaction.type === 'entrada' ? 'text-green-600' : 'text-red-600'
                    }`}
                  >
                    {transaction.type === 'entrada' ? '+' : '-'}
                    {formatCurrency(transaction.amount)}
                  </p>
                </div>

                <div className="flex items-center gap-2 pt-2 border-t border-gray-200">
                  <button
                    onClick={() => onEdit(transaction)}
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors text-sm font-medium"
                  >
                    <Edit className="w-4 h-4" />
                    Editar
                  </button>
                  <button
                    onClick={() => handleDeleteClick(transaction.id, transaction.description)}
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors text-sm font-medium"
                  >
                    <Trash2 className="w-4 h-4" />
                    Excluir
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
        <div className="mt-6 pt-6 border-t border-gray-200">
          <p className="text-center text-gray-500 text-sm">
            Mostrando {filteredTransactions.length} de {transactions.length} transações
          </p>
        </div>
      )}
    </div>
  );
};

export default TransactionList;
