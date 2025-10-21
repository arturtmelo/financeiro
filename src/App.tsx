import { useState, useEffect, useRef } from 'react';
import { Transaction } from './types';
import {
  loadTransactions,
  addTransaction as addTransactionToFirestore,
  updateTransaction as updateTransactionInFirestore,
  deleteTransaction as deleteTransactionFromFirestore,
} from './services/firestoreService';
import {
  loadPaymentMethods,
  savePaymentMethods,
  loadCategories,
  saveCategories,
} from './services/firestoreService';
import { useAuth } from './contexts/AuthContext';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import Analytics from './components/Analytics';
import TransactionForm from './components/TransactionForm';
import TransactionList from './components/TransactionList';
import PaymentMethodsManager from './components/PaymentMethodsManager';
import CategoriesManager from './components/CategoriesManager';
import Login from './components/Login';
import { Wallet, ArrowUp, Plus, X, BarChart3, List } from 'lucide-react';

function App() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [paymentMethods, setPaymentMethods] = useState<string[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<'overview' | 'analytics'>('overview');
  const [showForm, setShowForm] = useState(false);
  const [showPaymentMethodsManager, setShowPaymentMethodsManager] = useState(false);
  const [showCategoriesManager, setShowCategoriesManager] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const formRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (user) {
      // Carregar transações do Firestore
      loadTransactions(user.id).then((loaded) => {
        setTransactions(loaded);
      });

      // Carregar métodos de pagamento do Firestore
      loadPaymentMethods(user.id).then((methods) => {
        setPaymentMethods(methods);
      });

      // Carregar categorias do Firestore
      loadCategories(user.id).then((cats) => {
        setCategories(cats);
      });
    } else {
      // Limpar dados quando usuário deslogar
      setTransactions([]);
      setPaymentMethods([]);
      setCategories([]);
    }
  }, [user]);

  // Mostrar botão de voltar ao topo
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleAddTransaction = async (transaction: Transaction) => {
    if (!user) return;
    try {
      await addTransactionToFirestore(transaction, user.id);
      setTransactions((prev) => [...prev, transaction]);
      setShowForm(false);
    } catch (error) {
      console.error('Erro ao adicionar transação:', error);
      alert('Erro ao adicionar transação. Tente novamente.');
    }
  };

  const handleUpdateTransaction = async (transaction: Transaction) => {
    if (!user) return;
    try {
      await updateTransactionInFirestore(transaction, user.id);
      setTransactions((prev) => prev.map((t) => (t.id === transaction.id ? transaction : t)));
      setEditingTransaction(null);
      setShowForm(false);
    } catch (error) {
      console.error('Erro ao atualizar transação:', error);
      alert('Erro ao atualizar transação. Tente novamente.');
    }
  };

  const handleDeleteTransaction = async (id: string) => {
    if (!user) return;
    try {
      await deleteTransactionFromFirestore(id, user.id);
      setTransactions((prev) => prev.filter((t) => t.id !== id));
    } catch (error) {
      console.error('Erro ao deletar transação:', error);
      alert('Erro ao deletar transação. Tente novamente.');
    }
  };

  const handleEditTransaction = (transaction: Transaction) => {
    setEditingTransaction(transaction);
    setShowForm(true);
    // Scroll para o formulário após um pequeno delay
    setTimeout(() => {
      formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setEditingTransaction(null);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePaymentMethodsChange = async (methods: string[]) => {
    if (!user) return;
    try {
      await savePaymentMethods(methods, user.id);
      setPaymentMethods(methods);
    } catch (error) {
      console.error('Erro ao salvar métodos de pagamento:', error);
      alert('Erro ao salvar métodos. Tente novamente.');
    }
  };

  const handleCategoriesChange = async (cats: string[]) => {
    if (!user) return;
    try {
      await saveCategories(cats, user.id);
      setCategories(cats);
    } catch (error) {
      console.error('Erro ao salvar categorias:', error);
      alert('Erro ao salvar categorias. Tente novamente.');
    }
  };

  // Mostrar loading enquanto verifica autenticação
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-white text-xl">Carregando...</div>
      </div>
    );
  }

  // Mostrar login se não autenticado
  if (!isAuthenticated || !user) {
    return <Login />;
  }

  return (
    <div id="top" className="min-h-screen pb-8">
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="bg-white/20 backdrop-blur-sm p-2 sm:p-3 rounded-xl">
                <Wallet className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white">Financeiro</h1>
              </div>
            </div>

            {/* Navegação por Abas */}
            <div className="flex gap-2 bg-white/10 backdrop-blur-sm p-1 rounded-xl w-full sm:w-auto">
              <button
                onClick={() => setActiveTab('overview')}
                className={`flex-1 sm:flex-auto flex items-center justify-center gap-2 px-3 sm:px-4 py-2.5 rounded-lg font-semibold transition-all ${
                  activeTab === 'overview'
                    ? 'bg-white text-purple-600 shadow-md'
                    : 'text-white hover:bg-white/10'
                }`}
              >
                <List className="w-4 h-4" />
                <span>Visão Geral</span>
              </button>
              <button
                onClick={() => setActiveTab('analytics')}
                className={`flex-1 sm:flex-auto flex items-center justify-center gap-2 px-3 sm:px-4 py-2.5 rounded-lg font-semibold transition-all ${
                  activeTab === 'analytics'
                    ? 'bg-white text-purple-600 shadow-md'
                    : 'text-white hover:bg-white/10'
                }`}
              >
                <BarChart3 className="w-4 h-4" />
                <span>Análises</span>
              </button>
            </div>
          </div>
        </div>

        {/* Conteúdo das Abas */}
        {activeTab === 'overview' ? (
          <>
            <div id="dashboard">
              <Dashboard transactions={transactions} />
            </div>

            {showForm && (
              <div ref={formRef} className="mb-8 animate-slideDown scroll-mt-14">
                <TransactionForm
                  onSubmit={editingTransaction ? handleUpdateTransaction : handleAddTransaction}
                  onCancel={handleCancelForm}
                  editingTransaction={editingTransaction}
                  paymentMethods={paymentMethods}
                  onManagePaymentMethods={() => setShowPaymentMethodsManager(true)}
                  categories={categories}
                  onManageCategories={() => setShowCategoriesManager(true)}
                />
              </div>
            )}

            <div id="transactions">
              <TransactionList
                transactions={transactions}
                onDelete={handleDeleteTransaction}
                onEdit={handleEditTransaction}
                paymentMethods={paymentMethods}
              />
            </div>
          </>
        ) : (
          <Analytics transactions={transactions} />
        )}
      </div>

      {showPaymentMethodsManager && (
        <PaymentMethodsManager
          methods={paymentMethods}
          onMethodsChange={handlePaymentMethodsChange}
          onClose={() => setShowPaymentMethodsManager(false)}
        />
      )}

      {showCategoriesManager && (
        <CategoriesManager
          categories={categories}
          onCategoriesChange={handleCategoriesChange}
          onClose={() => setShowCategoriesManager(false)}
        />
      )}

      {/* Botão FAB: Nova Transação */}
      <button
        onClick={() => {
          // Se estiver na aba Análises, muda para Visão Geral
          if (activeTab === 'analytics') {
            setActiveTab('overview');
            setShowForm(true);
            // Scroll para o formulário após um delay maior para dar tempo de mudar a aba
            setTimeout(() => {
              formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 150);
          } else {
            // Se já estiver na aba Visão Geral, alterna o formulário
            setShowForm(!showForm);
            // Scroll para o formulário após um pequeno delay
            if (!showForm) {
              setTimeout(() => {
                formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }, 100);
            } else {
              // Se está fechando, volta ao topo
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }
          }
        }}
        className={`fixed bottom-6 right-6 p-3 ${
          showForm && activeTab === 'overview'
            ? 'bg-red-600 hover:bg-red-700'
            : 'bg-gray-900 hover:bg-green-600'
        } text-white rounded-full shadow-xl transition-all duration-200 ease-in-out transform hover:scale-[0.93] active:scale-95 z-[9999]`}
        title={showForm && activeTab === 'overview' ? 'Fechar formulário' : 'Nova transação'}
      >
        {showForm && activeTab === 'overview' ? (
          <X className="w-6 h-6" />
        ) : (
          <Plus className="w-6 h-6" />
        )}
      </button>

      {/* Botão Voltar ao Topo */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-20 right-6 p-3 bg-white/90 hover:bg-white text-purple-600 rounded-full shadow-lg transition-all duration-200 ease-in-out transform hover:scale-[0.93] z-[1000] animate-fadeIn border border-black"
          title="Voltar ao topo"
        >
          <ArrowUp className="w-6 h-6" />
        </button>
      )}
    </div>
  );
}

export default App;
