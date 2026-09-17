import { useState, useEffect } from 'react';
import { Transaction, TransactionType } from '../types';
import { Save, X, Settings } from 'lucide-react';
import { SECTION_HEADING_CLASS, SECONDARY_BUTTON_CLASS, getButtonClass } from '../utils/uiClasses';

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
  const [error, setError] = useState('');

  // Função para formatar valor com separadores de milhar
  const formatCurrencyInput = (value: string): string => {
    // Converte ponto para vírgula (caso o usuário use ponto no teclado)
    let cleaned = value.replace(/\./g, ',');

    // Remove tudo exceto números e vírgula
    cleaned = cleaned.replace(/[^\d,]/g, '');

    // Garante apenas uma vírgula (mantém a primeira, remove as demais)
    const parts = cleaned.split(',');
    if (parts.length > 2) {
      cleaned = parts[0] + ',' + parts.slice(1).join('');
    }

    // Limita a 2 casas decimais após a vírgula
    if (parts.length === 2 && parts[1].length > 2) {
      cleaned = parts[0] + ',' + parts[1].substring(0, 2);
    }

    // Separa parte inteira e decimal
    const [integerPart, decimalPart] = cleaned.split(',');

    if (!integerPart) return '';

    // Formata a parte inteira com separadores de milhar
    const formattedInteger = parseInt(integerPart).toLocaleString('pt-BR');

    // Retorna com ou sem parte decimal
    return decimalPart !== undefined ? `${formattedInteger},${decimalPart}` : formattedInteger;
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

    // Se o campo estiver vazio, limpa
    if (!inputValue) {
      setAmount('');
      return;
    }

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
      setError('');
    } else {
      // Volta para os valores em branco ao cancelar uma edição (o formulário
      // fica sempre montado na página, então isso não acontece sozinho)
      setDescription('');
      setAmount('');
      setType('saida');
      setPaymentMethod(paymentMethods[0] || '');
      setDate(getLocalDateString());
      setCategory('');
      setError('');
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
      setError('Por favor, preencha todos os campos obrigatórios corretamente.');
      return;
    }

    setError('');

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
      setPaymentMethod(paymentMethods[0] || '');
      setDate(getLocalDateString());
      setCategory('');
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-4 sm:p-6 lg:p-8">
      <div className="flex items-center justify-between mb-4 sm:mb-6">
        <h2 className={SECTION_HEADING_CLASS}>
          <Save className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600 dark:text-purple-400" />
          {editingTransaction ? 'Editar Transação' : 'Nova Transação'}
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Tipo */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Tipo *</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setType('entrada')}
                className={`py-3 px-4 rounded-xl font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-800 ${
                  type === 'entrada'
                    ? 'bg-green-500 text-white shadow-lg'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                Entrada
              </button>
              <button
                type="button"
                onClick={() => setType('saida')}
                className={`py-3 px-4 rounded-xl font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-800 ${
                  type === 'saida'
                    ? 'bg-red-500 text-white shadow-lg'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                Saída
              </button>
            </div>
          </div>

          {/* Valor */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Valor (R$) *</label>
            <input
              type="text"
              inputMode="decimal"
              value={amount}
              onChange={handleAmountChange}
              placeholder="Ex: 100 ou 100,50"
              className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 rounded-xl focus:border-purple-500 focus:outline-none transition-colors text-lg"
              required
            />
          </div>

          {/* Descrição */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Descrição *</label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Ex: Compra no supermercado"
              className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 rounded-xl focus:border-purple-500 focus:outline-none transition-colors"
              required
            />
          </div>

          {/* Método de Pagamento */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                Método de Pagamento *
              </label>
              <button
                type="button"
                onClick={onManagePaymentMethods}
                className="text-sm text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 font-medium flex items-center gap-1 p-2 -m-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 rounded-lg"
              >
                <Settings className="w-4 h-4" />
                Gerenciar
              </button>
            </div>
            {paymentMethods.length > 0 ? (
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:border-purple-500 focus:outline-none transition-colors bg-white dark:bg-gray-900 dark:text-gray-100"
                required
              >
                {paymentMethods.map((method) => (
                  <option key={method} value={method}>
                    {method}
                  </option>
                ))}
              </select>
            ) : (
              <div className="p-4 bg-amber-50 dark:bg-amber-950 border-2 border-amber-200 dark:border-amber-900 rounded-xl text-sm text-amber-800 dark:text-amber-300">
                Nenhum método cadastrado.{' '}
                <button
                  type="button"
                  onClick={onManagePaymentMethods}
                  className="font-semibold underline hover:text-amber-900 dark:hover:text-amber-200"
                >
                  Clique aqui para adicionar
                </button>
              </div>
            )}
          </div>

          {/* Data */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Data *</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 rounded-xl focus:border-purple-500 focus:outline-none transition-colors"
              required
            />
          </div>

          {/* Categoria */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                Categoria (opcional)
              </label>
              <button
                type="button"
                onClick={onManageCategories}
                className="text-sm text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 font-medium flex items-center gap-1 p-2 -m-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500 rounded-lg"
              >
                <Settings className="w-4 h-4" />
                Gerenciar
              </button>
            </div>
            {categories.length > 0 ? (
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:border-purple-500 focus:outline-none transition-colors bg-white dark:bg-gray-900 dark:text-gray-100"
              >
                <option value="">Selecione uma categoria</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            ) : (
              <div className="p-4 bg-amber-50 dark:bg-amber-950 border-2 border-amber-200 dark:border-amber-900 rounded-xl text-sm text-amber-800 dark:text-amber-300">
                Nenhuma categoria cadastrada.{' '}
                <button
                  type="button"
                  onClick={onManageCategories}
                  className="font-semibold underline hover:text-amber-900 dark:hover:text-amber-200"
                >
                  Clique aqui para adicionar
                </button>
              </div>
            )}
          </div>
        </div>

        {error && (
          <div
            role="alert"
            className="p-4 bg-red-50 dark:bg-red-950 border-2 border-red-200 dark:border-red-900 rounded-xl text-sm text-red-700 dark:text-red-300"
          >
            {error}
          </div>
        )}

        {/* Botões */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-end pt-4">
          <button
            type="button"
            onClick={onCancel}
            className={`order-2 sm:order-1 ${SECONDARY_BUTTON_CLASS}`}
          >
            <X className="w-5 h-5" />
            {editingTransaction ? 'Cancelar Edição' : 'Limpar'}
          </button>
          <button type="submit" className={`order-1 sm:order-2 ${getButtonClass('purple')}`}>
            <Save className="w-5 h-5" />
            {editingTransaction ? 'Atualizar' : 'Salvar'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default TransactionForm;
