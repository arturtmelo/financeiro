import { useState } from 'react';
import { PiggyBank, Plus, Trash2, Edit2, X, Save } from 'lucide-react';
import { Budget } from '../types';
import { formatCurrency } from '../utils/calculations';
import ConfirmDialog from './ConfirmDialog';

interface BudgetManagerProps {
  budgets: Budget[];
  categories: string[];
  onAdd: (budget: Budget) => void;
  onUpdate: (budget: Budget) => void;
  onDelete: (id: string) => void;
  onClose: () => void;
}

const formatCurrencyInput = (value: string): string => {
  let cleaned = value.replace(/\./g, ',');
  cleaned = cleaned.replace(/[^\d,]/g, '');

  const parts = cleaned.split(',');
  if (parts.length > 2) {
    cleaned = parts[0] + ',' + parts.slice(1).join('');
  }
  if (parts.length === 2 && parts[1].length > 2) {
    cleaned = parts[0] + ',' + parts[1].substring(0, 2);
  }

  const [integerPart, decimalPart] = cleaned.split(',');
  if (!integerPart) return '';

  const formattedInteger = parseInt(integerPart).toLocaleString('pt-BR');
  return decimalPart !== undefined ? `${formattedInteger},${decimalPart}` : formattedInteger;
};

const parseFormattedValue = (formattedValue: string): number => {
  if (!formattedValue) return 0;
  const cleanValue = formattedValue.replace(/\./g, '').replace(',', '.');
  return parseFloat(cleanValue) || 0;
};

const BudgetManager = ({
  budgets,
  categories,
  onAdd,
  onUpdate,
  onDelete,
  onClose,
}: BudgetManagerProps) => {
  const availableCategories = categories.filter(
    (cat) => !budgets.some((b) => b.category === cat)
  );

  const [newCategory, setNewCategory] = useState(availableCategories[0] || '');
  const [newLimit, setNewLimit] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingLimit, setEditingLimit] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState<{
    isOpen: boolean;
    id: string;
    category: string;
  }>({ isOpen: false, id: '', category: '' });

  const handleAdd = () => {
    const limitValue = parseFormattedValue(newLimit);
    if (!newCategory || limitValue <= 0) return;

    onAdd({
      id: Date.now().toString(),
      category: newCategory,
      limit: limitValue,
    });
    setNewLimit('');
    setNewCategory(availableCategories.filter((c) => c !== newCategory)[0] || '');
  };

  const handleStartEdit = (budget: Budget) => {
    setEditingId(budget.id);
    setEditingLimit(
      budget.limit.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    );
  };

  const handleSaveEdit = (budget: Budget) => {
    const limitValue = parseFormattedValue(editingLimit);
    if (limitValue > 0) {
      onUpdate({ ...budget, limit: limitValue });
    }
    setEditingId(null);
    setEditingLimit('');
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditingLimit('');
  };

  const handleDeleteClick = (id: string, category: string) => {
    setDeleteConfirm({ isOpen: true, id, category });
  };

  const handleDeleteConfirm = () => {
    onDelete(deleteConfirm.id);
    setDeleteConfirm({ isOpen: false, id: '', category: '' });
  };

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={handleBackdropClick}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="budget-manager-title"
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[85vh] sm:max-h-[80vh] overflow-hidden flex flex-col"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-500 to-orange-600 p-4 sm:p-6 text-white">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 sm:gap-3 min-w-0">
              <PiggyBank className="w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0" />
              <h2 id="budget-manager-title" className="text-lg sm:text-xl lg:text-2xl font-bold truncate">
                Orçamentos por Categoria
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors flex-shrink-0"
              aria-label="Fechar"
            >
              <X className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 sm:space-y-6">
          {/* Add new budget */}
          {availableCategories.length > 0 ? (
            <div className="bg-gray-50 dark:bg-gray-900 p-3 sm:p-4 rounded-xl">
              <label className="block text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Novo Orçamento
              </label>
              <div className="flex flex-col sm:flex-row gap-2">
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="flex-1 px-3 sm:px-4 py-2 border-2 border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 rounded-xl focus:border-amber-500 focus:outline-none transition-colors text-sm sm:text-base"
                >
                  {availableCategories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
                <input
                  type="text"
                  inputMode="decimal"
                  value={newLimit}
                  onChange={(e) => setNewLimit(formatCurrencyInput(e.target.value))}
                  placeholder="Limite (R$)"
                  className="flex-1 px-3 sm:px-4 py-2 border-2 border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 rounded-xl focus:border-amber-500 focus:outline-none transition-colors text-sm sm:text-base"
                />
                <button
                  onClick={handleAdd}
                  disabled={!newCategory || parseFormattedValue(newLimit) <= 0}
                  className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-4 py-2 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all text-sm sm:text-base"
                >
                  <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
                  Adicionar
                </button>
              </div>
            </div>
          ) : (
            <div className="p-4 bg-yellow-50 dark:bg-yellow-950 border-2 border-yellow-200 dark:border-yellow-900 rounded-xl text-sm text-yellow-800 dark:text-yellow-300">
              {categories.length === 0
                ? 'Cadastre categorias primeiro para poder definir orçamentos.'
                : 'Todas as categorias já têm um orçamento definido.'}
            </div>
          )}

          {/* Budgets list */}
          <div>
            <h3 className="text-base sm:text-lg font-bold text-gray-800 dark:text-gray-100 mb-3">
              Orçamentos Ativos ({budgets.length})
            </h3>
            <div className="space-y-2">
              {budgets.map((budget) => (
                <div
                  key={budget.id}
                  className="flex items-center justify-between p-2 sm:p-3 bg-gray-50 dark:bg-gray-900 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors group"
                >
                  {editingId === budget.id ? (
                    <>
                      <span className="font-medium text-gray-800 dark:text-gray-100 text-sm sm:text-base mr-2">
                        {budget.category}
                      </span>
                      <input
                        type="text"
                        inputMode="decimal"
                        value={editingLimit}
                        onChange={(e) => setEditingLimit(formatCurrencyInput(e.target.value))}
                        onKeyDown={(e) => e.key === 'Enter' && handleSaveEdit(budget)}
                        className="flex-1 px-3 py-1 border-2 border-amber-500 dark:bg-gray-800 dark:text-gray-100 rounded-lg focus:outline-none text-sm sm:text-base"
                        autoFocus
                      />
                      <div className="flex items-center gap-1 sm:gap-2 ml-2">
                        <button
                          onClick={() => handleSaveEdit(budget)}
                          className="p-1.5 sm:p-2 text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-950 rounded-lg transition-colors"
                          title="Salvar"
                        >
                          <Save className="w-4 h-4" />
                        </button>
                        <button
                          onClick={handleCancelEdit}
                          className="p-1.5 sm:p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
                          title="Cancelar"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex-1 min-w-0">
                        <span className="font-medium text-gray-800 dark:text-gray-100 text-sm sm:text-base">
                          {budget.category}
                        </span>
                        <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                          Limite: {formatCurrency(budget.limit)}
                        </p>
                      </div>
                      <div className="flex items-center gap-1 sm:gap-2 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => handleStartEdit(budget)}
                          className="p-1.5 sm:p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950 rounded-lg transition-colors"
                          title="Editar"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteClick(budget.id, budget.category)}
                          className="p-1.5 sm:p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950 rounded-lg transition-colors"
                          title="Excluir"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ))}

              {budgets.length === 0 && (
                <div className="text-center py-8 text-gray-400 dark:text-gray-500">
                  <PiggyBank className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-2 opacity-50" />
                  <p className="text-sm sm:text-base">Nenhum orçamento definido</p>
                  <p className="text-xs sm:text-sm mt-1">Defina um limite por categoria acima</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 dark:border-gray-700 p-3 sm:p-4 bg-gray-50 dark:bg-gray-900">
          <button
            onClick={onClose}
            className="w-full bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-semibold py-2.5 sm:py-3 rounded-xl transition-all transform hover:scale-105 text-sm sm:text-base"
          >
            Concluído
          </button>
        </div>
      </div>

      {/* Confirm Delete Dialog */}
      <ConfirmDialog
        isOpen={deleteConfirm.isOpen}
        title="Excluir Orçamento"
        message={`Tem certeza que deseja excluir o orçamento de "${deleteConfirm.category}"?`}
        confirmText="Sim, excluir"
        cancelText="Cancelar"
        confirmColor="red"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteConfirm({ isOpen: false, id: '', category: '' })}
      />
    </div>
  );
};

export default BudgetManager;
