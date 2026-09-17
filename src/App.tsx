import { useState, useEffect, useRef } from 'react';
import { Transaction, Budget } from './types';
import {
  loadTransactions,
  addTransaction as addTransactionToFirestore,
  updateTransaction as updateTransactionInFirestore,
  deleteTransaction as deleteTransactionFromFirestore,
  loadPaymentMethods,
  savePaymentMethods,
  loadCategories,
  saveCategories,
  loadCategoryColors,
  saveCategoryColors,
  loadBudgets,
  addBudget as addBudgetToFirestore,
  updateBudget as updateBudgetInFirestore,
  deleteBudget as deleteBudgetFromFirestore,
} from './services/dataService';
import { resetDemoData } from './services/demoDataService';
import { calculateBudgetProgress } from './utils/calculations';
import { useAuth } from './contexts/AuthContext';
import { useToast } from './contexts/ToastContext';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import Analytics from './components/Analytics';
import TransactionForm from './components/TransactionForm';
import TransactionList from './components/TransactionList';
import ListManager from './components/ListManager';
import BudgetManager from './components/BudgetManager';
import BottomNav from './components/BottomNav';
import Login from './components/Login';
import { Wallet, ArrowUp, DollarSign, BarChart3, List, CreditCard, Tag } from 'lucide-react';

function App() {
  const { user, isAuthenticated, isLoading, isDemo } = useAuth();
  const { showToast } = useToast();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [paymentMethods, setPaymentMethods] = useState<string[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [categoryColors, setCategoryColors] = useState<Record<string, string>>({});
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [activeTab, setActiveTab] = useState<'overview' | 'analytics'>('overview');
  const [showPaymentMethodsManager, setShowPaymentMethodsManager] = useState(false);
  const [showCategoriesManager, setShowCategoriesManager] = useState(false);
  const [showBudgetManager, setShowBudgetManager] = useState(false);
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

      // Carregar cores das categorias do Firestore
      loadCategoryColors(user.id).then((colors) => {
        setCategoryColors(colors);
      });

      // Carregar orçamentos do Firestore
      loadBudgets(user.id).then((loadedBudgets) => {
        setBudgets(loadedBudgets);
      });
    } else {
      // Limpar dados quando usuário deslogar
      setTransactions([]);
      setPaymentMethods([]);
      setCategories([]);
      setCategoryColors({});
      setBudgets([]);
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

  const checkBudgetAlert = (transaction: Transaction, updatedTransactions: Transaction[]) => {
    if (transaction.type !== 'saida' || !transaction.category) return;
    const relevantBudget = budgets.find((b) => b.category === transaction.category);
    if (!relevantBudget) return;

    const [progress] = calculateBudgetProgress(updatedTransactions, [relevantBudget]);
    if (progress.isOverBudget) {
      showToast(`Você ultrapassou o orçamento de "${relevantBudget.category}"!`, 'error');
    } else if (progress.isNearThreshold) {
      showToast(`Você está perto do limite de orçamento de "${relevantBudget.category}"`, 'info');
    }
  };

  const handleAddTransaction = async (transaction: Transaction) => {
    if (!user) return;
    try {
      await addTransactionToFirestore(transaction, user.id);
      const updatedTransactions = [...transactions, transaction];
      setTransactions(updatedTransactions);
      showToast('Transação adicionada com sucesso!', 'success');
      checkBudgetAlert(transaction, updatedTransactions);
    } catch (error) {
      console.error('Erro ao adicionar transação:', error);
      showToast('Erro ao adicionar transação. Tente novamente.', 'error');
    }
  };

  const handleUpdateTransaction = async (transaction: Transaction) => {
    if (!user) return;
    try {
      await updateTransactionInFirestore(transaction, user.id);
      const updatedTransactions = transactions.map((t) =>
        t.id === transaction.id ? transaction : t
      );
      setTransactions(updatedTransactions);
      setEditingTransaction(null);
      showToast('Transação atualizada com sucesso!', 'success');
      checkBudgetAlert(transaction, updatedTransactions);
    } catch (error) {
      console.error('Erro ao atualizar transação:', error);
      showToast('Erro ao atualizar transação. Tente novamente.', 'error');
    }
  };

  const handleDeleteTransaction = async (id: string) => {
    if (!user) return;
    try {
      await deleteTransactionFromFirestore(id, user.id);
      setTransactions((prev) => prev.filter((t) => t.id !== id));
      showToast('Transação excluída com sucesso!', 'success');
    } catch (error) {
      console.error('Erro ao deletar transação:', error);
      showToast('Erro ao deletar transação. Tente novamente.', 'error');
    }
  };

  const handleEditTransaction = (transaction: Transaction) => {
    setEditingTransaction(transaction);
    // Scroll para o formulário após um pequeno delay
    setTimeout(() => {
      formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  const handleCancelForm = () => {
    setEditingTransaction(null);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleResetDemoData = () => {
    resetDemoData();
    if (user) {
      loadTransactions(user.id).then(setTransactions);
      loadPaymentMethods(user.id).then(setPaymentMethods);
      loadCategories(user.id).then(setCategories);
      loadCategoryColors(user.id).then(setCategoryColors);
      loadBudgets(user.id).then(setBudgets);
    }
    showToast('Dados demo reiniciados!', 'success');
  };

  const handleNewTransactionClick = () => {
    // Se estiver na aba Análises, muda para Visão Geral antes de rolar
    if (activeTab === 'analytics') {
      setActiveTab('overview');
      setTimeout(() => {
        formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 150);
    } else {
      formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handlePaymentMethodsChange = async (methods: string[]) => {
    if (!user) return;
    try {
      await savePaymentMethods(methods, user.id);
      setPaymentMethods(methods);
      showToast('Métodos de pagamento atualizados!', 'success');
    } catch (error) {
      console.error('Erro ao salvar métodos de pagamento:', error);
      showToast('Erro ao salvar métodos. Tente novamente.', 'error');
    }
  };

  const handleCategoriesChange = async (cats: string[]) => {
    if (!user) return;
    try {
      await saveCategories(cats, user.id);
      setCategories(cats);
      showToast('Categorias atualizadas!', 'success');
    } catch (error) {
      console.error('Erro ao salvar categorias:', error);
      showToast('Erro ao salvar categorias. Tente novamente.', 'error');
    }
  };

  const handleCategoryColorsChange = async (colors: Record<string, string>) => {
    if (!user) return;
    try {
      await saveCategoryColors(colors, user.id);
      setCategoryColors(colors);
    } catch (error) {
      console.error('Erro ao salvar cores das categorias:', error);
      showToast('Erro ao salvar cores das categorias. Tente novamente.', 'error');
    }
  };

  const handleAddBudget = async (budget: Budget) => {
    if (!user) return;
    try {
      await addBudgetToFirestore(budget, user.id);
      setBudgets((prev) => [...prev, budget]);
      showToast('Orçamento criado com sucesso!', 'success');
    } catch (error) {
      console.error('Erro ao criar orçamento:', error);
      showToast('Erro ao criar orçamento. Tente novamente.', 'error');
    }
  };

  const handleUpdateBudget = async (budget: Budget) => {
    if (!user) return;
    try {
      await updateBudgetInFirestore(budget, user.id);
      setBudgets((prev) => prev.map((b) => (b.id === budget.id ? budget : b)));
      showToast('Orçamento atualizado com sucesso!', 'success');
    } catch (error) {
      console.error('Erro ao atualizar orçamento:', error);
      showToast('Erro ao atualizar orçamento. Tente novamente.', 'error');
    }
  };

  const handleDeleteBudget = async (id: string) => {
    if (!user) return;
    try {
      await deleteBudgetFromFirestore(id, user.id);
      setBudgets((prev) => prev.filter((b) => b.id !== id));
      showToast('Orçamento excluído com sucesso!', 'success');
    } catch (error) {
      console.error('Erro ao excluir orçamento:', error);
      showToast('Erro ao excluir orçamento. Tente novamente.', 'error');
    }
  };

  // Mostrar loading enquanto verifica autenticação
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-600 via-pink-500 to-red-500">
        <div className="flex flex-col items-center gap-6">
          {/* Spinner animado */}
          <div className="relative">
            {/* Círculo externo */}
            <div className="w-20 h-20 border-4 border-white/20 rounded-full"></div>
            {/* Círculo animado */}
            <div className="absolute top-0 left-0 w-20 h-20 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
            {/* Círculo interno pulsante */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-white/30 rounded-full animate-pulse"></div>
          </div>
          {/* Texto */}
          <div className="flex flex-col items-center gap-2">
            <p className="text-white text-xl font-bold animate-pulse">Carregando</p>
            <div className="flex gap-1">
              <span
                className="w-2 h-2 bg-white rounded-full animate-bounce"
                style={{ animationDelay: '0ms' }}
              ></span>
              <span
                className="w-2 h-2 bg-white rounded-full animate-bounce"
                style={{ animationDelay: '150ms' }}
              ></span>
              <span
                className="w-2 h-2 bg-white rounded-full animate-bounce"
                style={{ animationDelay: '300ms' }}
              ></span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Mostrar login se não autenticado
  if (!isAuthenticated || !user) {
    return <Login />;
  }

  return (
    <div id="top" className="min-h-screen pb-24 sm:pb-8">
      <Header />

      {isDemo && (
        <div className="bg-amber-500 text-amber-950 text-sm px-4 py-2 flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-center">
          <span className="font-semibold">Modo Demo</span>
          <span>— dados fictícios, nada é enviado ao servidor.</span>
          <button
            onClick={handleResetDemoData}
            className="underline font-semibold hover:text-amber-800 p-2 -m-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-900 rounded-lg"
          >
            Reiniciar dados demo
          </button>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="bg-white/20 backdrop-blur-sm p-2 sm:p-3 rounded-xl">
                <Wallet className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white">Finanças</h1>
              </div>
            </div>

            {/* Navegação por Abas (desktop) */}
            <div className="hidden sm:flex gap-2 bg-white/10 backdrop-blur-sm p-1 rounded-xl w-full sm:w-auto">
              <button
                onClick={() => setActiveTab('overview')}
                className={`flex-1 sm:flex-auto flex items-center justify-center gap-2 px-3 sm:px-4 py-2.5 rounded-lg font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white ${
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
                className={`flex-1 sm:flex-auto flex items-center justify-center gap-2 px-3 sm:px-4 py-2.5 rounded-lg font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white ${
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
              <Dashboard
                transactions={transactions}
                budgets={budgets}
                onManageBudgets={() => setShowBudgetManager(true)}
              />
            </div>

            <div ref={formRef} className="mb-8 scroll-mt-20">
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
        <ListManager
          title="Gerenciar Métodos"
          icon={CreditCard}
          itemLabelSingular="Método de Pagamento"
          addPlaceholder="Ex: Cartão Santander, Pix..."
          items={paymentMethods}
          onItemsChange={handlePaymentMethodsChange}
          onClose={() => setShowPaymentMethodsManager(false)}
          gradientTheme="purple"
        />
      )}

      {showCategoriesManager && (
        <ListManager
          title="Gerenciar Categorias"
          icon={Tag}
          itemLabelSingular="Categoria"
          addPlaceholder="Ex: Mercado, IPVA, Lazer..."
          items={categories}
          onItemsChange={handleCategoriesChange}
          onClose={() => setShowCategoriesManager(false)}
          gradientTheme="green"
          colors={categoryColors}
          onColorsChange={handleCategoryColorsChange}
        />
      )}

      {showBudgetManager && (
        <BudgetManager
          budgets={budgets}
          categories={categories}
          onAdd={handleAddBudget}
          onUpdate={handleUpdateBudget}
          onDelete={handleDeleteBudget}
          onClose={() => setShowBudgetManager(false)}
        />
      )}

      {/* Botão FAB: Nova Transação (desktop) */}
      <button
        onClick={handleNewTransactionClick}
        className="hidden sm:flex items-center justify-center fixed bottom-6 right-6 p-3 bg-gradient-to-br from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-full shadow-lg transition-all duration-200 ease-in-out transform hover:scale-105 active:scale-95 z-30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-300"
        aria-label="Nova transação"
        title="Nova transação"
      >
        <DollarSign className="w-6 h-6" />
      </button>

      {/* Botão Voltar ao Topo */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-28 sm:bottom-20 right-6 p-3 bg-white/90 dark:bg-gray-800/90 hover:bg-white dark:hover:bg-gray-800 text-purple-600 dark:text-purple-400 rounded-full shadow-lg transition-all duration-200 ease-in-out transform hover:scale-105 z-30 animate-fadeIn border border-black dark:border-gray-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500"
          aria-label="Voltar ao topo"
          title="Voltar ao topo"
        >
          <ArrowUp className="w-6 h-6" />
        </button>
      )}

      {/* Navegação inferior (mobile) */}
      <BottomNav
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onNewTransaction={handleNewTransactionClick}
      />
    </div>
  );
}

export default App;
