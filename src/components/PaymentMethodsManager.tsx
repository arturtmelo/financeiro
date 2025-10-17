import { useState } from 'react';
import { CreditCard, Plus, Trash2, Edit2, X, Save } from 'lucide-react';
import ConfirmDialog from './ConfirmDialog';

interface PaymentMethodsManagerProps {
  methods: string[];
  onMethodsChange: (methods: string[]) => void;
  onClose: () => void;
}

const PaymentMethodsManager = ({
  methods,
  onMethodsChange,
  onClose,
}: PaymentMethodsManagerProps) => {
  const [newMethod, setNewMethod] = useState('');
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editingValue, setEditingValue] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState<{
    isOpen: boolean;
    method: string;
  }>({ isOpen: false, method: '' });

  const handleAdd = () => {
    const trimmed = newMethod.trim();
    if (trimmed && !methods.includes(trimmed)) {
      const updated = [...methods, trimmed];
      onMethodsChange(updated);
      setNewMethod('');
    }
  };

  const handleDeleteClick = (method: string) => {
    setDeleteConfirm({ isOpen: true, method });
  };

  const handleDeleteConfirm = () => {
    const updated = methods.filter((m) => m !== deleteConfirm.method);
    onMethodsChange(updated);
    setDeleteConfirm({ isOpen: false, method: '' });
  };

  const handleDeleteCancel = () => {
    setDeleteConfirm({ isOpen: false, method: '' });
  };

  const handleStartEdit = (index: number) => {
    setEditingIndex(index);
    setEditingValue(methods[index]);
  };

  const handleSaveEdit = () => {
    if (editingIndex !== null) {
      const trimmed = editingValue.trim();
      if (trimmed && !methods.includes(trimmed)) {
        const updated = [...methods];
        updated[editingIndex] = trimmed;
        onMethodsChange(updated);
      }
      setEditingIndex(null);
      setEditingValue('');
    }
  };

  const handleCancelEdit = () => {
    setEditingIndex(null);
    setEditingValue('');
  };

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // Fecha o modal apenas se clicar diretamente no backdrop (não no conteúdo)
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[5000] p-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[85vh] sm:max-h-[80vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-500 to-indigo-600 p-4 sm:p-6 text-white">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 sm:gap-3 min-w-0">
              <CreditCard className="w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0" />
              <h2 className="text-lg sm:text-xl lg:text-2xl font-bold truncate">
                Gerenciar Métodos de Pagamento
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors flex-shrink-0"
            >
              <X className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 sm:space-y-6">
          {/* Add new method */}
          <div className="bg-gray-50 p-3 sm:p-4 rounded-xl">
            <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">
              Adicionar Novo Método
            </label>
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                value={newMethod}
                onChange={(e) => setNewMethod(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAdd()}
                placeholder="Ex: Cartão Nubank, PayPal..."
                className="flex-1 px-3 sm:px-4 py-2 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none transition-colors text-sm sm:text-base"
              />
              <button
                onClick={handleAdd}
                disabled={!newMethod.trim()}
                className="bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-4 py-2 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all text-sm sm:text-base"
              >
                <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
                Adicionar
              </button>
            </div>
          </div>

          {/* Methods list */}
          <div>
            <h3 className="text-base sm:text-lg font-bold text-gray-800 mb-3">
              Métodos Cadastrados ({methods.length})
            </h3>
            <div className="space-y-2">
              {methods.map((method, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-2 sm:p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors group"
                >
                  {editingIndex === index ? (
                    <>
                      <input
                        type="text"
                        value={editingValue}
                        onChange={(e) => setEditingValue(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSaveEdit()}
                        className="flex-1 px-3 py-1 border-2 border-purple-500 rounded-lg focus:outline-none text-sm sm:text-base"
                        autoFocus
                      />
                      <div className="flex items-center gap-1 sm:gap-2 ml-2">
                        <button
                          onClick={handleSaveEdit}
                          className="p-1.5 sm:p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                          title="Salvar"
                        >
                          <Save className="w-4 h-4" />
                        </button>
                        <button
                          onClick={handleCancelEdit}
                          className="p-1.5 sm:p-2 text-gray-600 hover:bg-gray-200 rounded-lg transition-colors"
                          title="Cancelar"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                        <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-xs sm:text-sm flex-shrink-0">
                          {index + 1}
                        </div>
                        <span className="font-medium text-gray-800 text-sm sm:text-base truncate">
                          {method}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 sm:gap-2 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => handleStartEdit(index)}
                          className="p-1.5 sm:p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Editar"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteClick(method)}
                          className="p-1.5 sm:p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Excluir"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ))}

              {methods.length === 0 && (
                <div className="text-center py-8 text-gray-400">
                  <CreditCard className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-2 opacity-50" />
                  <p className="text-sm sm:text-base">Nenhum método de pagamento cadastrado</p>
                  <p className="text-xs sm:text-sm mt-1">Adicione seu primeiro método acima</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 p-3 sm:p-4 bg-gray-50">
          <button
            onClick={onClose}
            className="w-full bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white font-semibold py-2.5 sm:py-3 rounded-xl transition-all transform hover:scale-105 text-sm sm:text-base"
          >
            Concluído
          </button>
        </div>
      </div>

      {/* Confirm Delete Dialog */}
      <ConfirmDialog
        isOpen={deleteConfirm.isOpen}
        title="Excluir Método de Pagamento"
        message={`Tem certeza que deseja excluir "${deleteConfirm.method}"? As transações existentes com este método não serão afetadas.`}
        confirmText="Sim, excluir"
        cancelText="Cancelar"
        confirmColor="red"
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
      />
    </div>
  );
};

export default PaymentMethodsManager;
