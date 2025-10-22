import { useState, useEffect } from 'react';
import { Transaction, TransactionType } from '../types';
import { Save, X, Settings } from 'lucide-react';

interface TransactionFormProps {
  onSubmit: (transaction: Transaction) => void;
  onCancel: () => void;
  editingTransaction?: Transaction | null;
  paymentMethods: string[];
  onManagePaymentMethods: () => void;
  categories: string[];
  onManageCategories: () => void;
}

const TransactionForm = ({
  onSubmit,
  onCancel,
  editingTransaction,
  paymentMethods,
  onManagePaymentMethods,
  categories,
  onManageCategories,
}: TransactionFormProps) => {
  // Função para obter data local no formato YYYY-MM-DD
  const getLocalDateString = (date: Date = new Date()) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState<TransactionType>('saida');
  const [paymentMethod, setPaymentMethod] = useState(paymentMethods[0] || '');
  const [date, setDate] = useState(getLocalDateString());
  const [category, setCategory] = useState<string>('');

  // Função para formatar valor com separadores de milhar e vírgula decimal
  const formatCurrencyInput = (value: string): string => {
    // Remove tudo que não é número
    const numbersOnly = value.replace(/\D/g, '');

    if (!numbersOnly) return '';

    // Converte para número e divide por 100 para ter os centavos
    const numberValue = parseInt(numbersOnly) / 100;

    // Formata com separadores de milhar e vírgula decimal
    return numberValue.toLocaleString('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  // Função para converter valor formatado para número
  const parseFormattedValue = (formattedValue: string): number => {
    if (!formattedValue) return 0;
    // Remove pontos de milhar e substitui vírgula por ponto
    const cleanValue = formattedValue.replace(/\./g, '').replace(',', '.');
    return parseFloat(cleanValue) || 0;
  };

  // Handler para mudança no campo de valor
  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    const formatted = formatCurrencyInput(inputValue);
    setAmount(formatted);
  };

  useEffect(() => {
    if (editingTransaction) {
      setDescription(editingTransaction.description);
      // Formata o valor ao editar
      const formatted = editingTransaction.amount.toLocaleString('pt-BR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
      setAmount(formatted);
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

  // Atualizar categoria se a lista mudar e a atual não existir mais
  useEffect(() => {
    if (category && categories.length > 0 && !categories.includes(category)) {
      setCategory('');
    }
  }, [categories, category]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const numericAmount = parseFormattedValue(amount);

    if (!description.trim() || !amount || numericAmount <= 0) {
      alert('Por favor, preencha todos os campos obrigatórios corretamente.');
      return;
    }

    const transaction: Transaction = {
      id: editingTransaction?.id || Date.now().toString(),
      description: description.trim(),
      amount: numericAmount,
      type,
      paymentMethod,
      date,
      category: category || undefined,
    };

    onSubmit(transaction);

    // Reset form
    if (!editingTransaction) {
      setDescription('');
      setAmount('');
      setType('saida');
      setPaymentMethod('Pix');
      setDate(getLocalDateString());
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
              type="text"
              inputMode="decimal"
              value={amount}
              onChange={handleAmountChange}
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
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-semibold text-gray-700">
                Categoria (opcional)
              </label>
              <button
                type="button"
                onClick={onManageCategories}
                className="text-sm text-green-600 hover:text-green-700 font-medium flex items-center gap-1"
              >
                <Settings className="w-4 h-4" />
                Gerenciar
              </button>
            </div>
            {categories.length > 0 ? (
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none transition-colors bg-white"
              >
                <option value="">Selecione uma categoria</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            ) : (
              <div className="p-4 bg-yellow-50 border-2 border-yellow-200 rounded-xl text-sm text-yellow-800">
                Nenhuma categoria cadastrada.{' '}
                <button
                  type="button"
                  onClick={onManageCategories}
                  className="font-semibold underline hover:text-yellow-900"
                >
                  Clique aqui para adicionar
                </button>
              </div>
            )}
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
