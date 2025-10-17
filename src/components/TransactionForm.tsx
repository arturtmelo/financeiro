import { useState, useEffect } from 'react';
import { Transaction, TransactionType } from '../types';
import { Save, X, Settings } from 'lucide-react';

interface TransactionFormProps {
  onSubmit: (transaction: Transaction) => void;
  onCancel: () => void;
  editingTransaction?: Transaction | null;
  paymentMethods: string[];
  onManagePaymentMethods: () => void;
}

const TransactionForm = ({
  onSubmit,
  onCancel,
  editingTransaction,
  paymentMethods,
  onManagePaymentMethods,
}: TransactionFormProps) => {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState<TransactionType>('saida');
  const [paymentMethod, setPaymentMethod] = useState(paymentMethods[0] || '');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [category, setCategory] = useState('');

  useEffect(() => {
    if (editingTransaction) {
      setDescription(editingTransaction.description);
      setAmount(editingTransaction.amount.toString());
      setType(editingTransaction.type);
      setPaymentMethod(editingTransaction.paymentMethod);
      setDate(editingTransaction.date);
      setCategory(editingTransaction.category || '');
    }
  }, [editingTransaction]);

  // Atualizar método de pagamento se a lista mudar e o atual não existir mais
  useEffect(() => {
    if (paymentMethods.length > 0 && !paymentMethods.includes(paymentMethod)) {
      setPaymentMethod(paymentMethods[0]);
    }
  }, [paymentMethods, paymentMethod]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!description.trim() || !amount || parseFloat(amount) <= 0) {
      alert('Por favor, preencha todos os campos obrigatórios corretamente.');
      return;
    }

    const transaction: Transaction = {
      id: editingTransaction?.id || Date.now().toString(),
      description: description.trim(),
      amount: parseFloat(amount),
      type,
      paymentMethod,
      date,
      category: category.trim() || undefined,
    };

    onSubmit(transaction);

    // Reset form
    if (!editingTransaction) {
      setDescription('');
      setAmount('');
      setType('saida');
      setPaymentMethod('Pix');
      setDate(new Date().toISOString().split('T')[0]);
      setCategory('');
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-4 sm:p-6 lg:p-8">
      <div className="flex items-center justify-between mb-4 sm:mb-6">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
          {editingTransaction ? 'Editar Transação' : 'Nova Transação'}
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Tipo */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Tipo *</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setType('entrada')}
                className={`py-3 px-4 rounded-xl font-semibold transition-all ${
                  type === 'entrada'
                    ? 'bg-green-500 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Entrada
              </button>
              <button
                type="button"
                onClick={() => setType('saida')}
                className={`py-3 px-4 rounded-xl font-semibold transition-all ${
                  type === 'saida'
                    ? 'bg-red-500 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Saída
              </button>
            </div>
          </div>

          {/* Valor */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Valor (R$) *</label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0,00"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none transition-colors"
              required
            />
          </div>

          {/* Descrição */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Descrição *</label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Ex: Compra no supermercado"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none transition-colors"
              required
            />
          </div>

          {/* Método de Pagamento */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-semibold text-gray-700">
                Método de Pagamento *
              </label>
              <button
                type="button"
                onClick={onManagePaymentMethods}
                className="text-sm text-purple-600 hover:text-purple-700 font-medium flex items-center gap-1"
              >
                <Settings className="w-4 h-4" />
                Gerenciar
              </button>
            </div>
            {paymentMethods.length > 0 ? (
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none transition-colors bg-white"
                required
              >
                {paymentMethods.map((method) => (
                  <option key={method} value={method}>
                    {method}
                  </option>
                ))}
              </select>
            ) : (
              <div className="p-4 bg-yellow-50 border-2 border-yellow-200 rounded-xl text-sm text-yellow-800">
                Nenhum método cadastrado.{' '}
                <button
                  type="button"
                  onClick={onManagePaymentMethods}
                  className="font-semibold underline hover:text-yellow-900"
                >
                  Clique aqui para adicionar
                </button>
              </div>
            )}
          </div>

          {/* Data */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Data *</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none transition-colors"
              required
            />
          </div>

          {/* Categoria */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Categoria (opcional)
            </label>
            <input
              type="text"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="Ex: Alimentação, Transporte..."
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none transition-colors"
            />
          </div>
        </div>

        {/* Botões */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-end pt-4">
          <button
            type="button"
            onClick={onCancel}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl transition-colors order-2 sm:order-1"
          >
            <X className="w-5 h-5" />
            Cancelar
          </button>
          <button
            type="submit"
            className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white font-semibold rounded-xl shadow-lg transition-all transform hover:scale-105 order-1 sm:order-2"
          >
            <Save className="w-5 h-5" />
            {editingTransaction ? 'Atualizar' : 'Salvar'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default TransactionForm;
