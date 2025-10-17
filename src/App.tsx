import { useState, useEffect, useRef } from 'react';
import { Transaction } from './types';
import {
  loadTransactions,
  addTransaction as addTransactionToFirestore,
  updateTransaction as updateTransactionInFirestore,
  deleteTransaction as deleteTransactionFromFirestore,
} from './services/firestoreService';
import { loadPaymentMethods, savePaymentMethods } from './services/firestoreService';
import { useAuth } from './contexts/AuthContext';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import TransactionForm from './components/TransactionForm';
import TransactionList from './components/TransactionList';
import PaymentMethodsManager from './components/PaymentMethodsManager';
import Login from './components/Login';
import { Wallet, ArrowUp } from 'lucide-react';

function App() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [paymentMethods, setPaymentMethods] = useState<string[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [showPaymentMethodsManager, setShowPaymentMethodsManager] = useState(false);
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
    } else {
      // Limpar dados quando usuário deslogar
      setTransactions([]);
      setPaymentMethods([]);
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
    <div className="min-h-screen pb-8">
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        {/* Header - Mobile: Empilhado | Desktop: Lado a lado */}
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="bg-white/20 backdrop-blur-sm p-2 sm:p-3 rounded-xl">
                <Wallet className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white">
                  Meu Controle Financeiro
                </h1>
                <p className="text-white/80 mt-1 text-sm sm:text-base">
                  Gerencie suas finanças de forma inteligente
                </p>
              </div>
            </div>

            <button
              onClick={() => {
                setShowForm(!showForm);
                // Scroll para o formulário no mobile após um pequeno delay
                if (!showForm) {
                  setTimeout(() => {
                    formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }, 100);
                }
              }}
              className="w-full sm:w-auto bg-white hover:bg-gray-100 text-purple-700 font-semibold px-6 py-3 rounded-xl shadow-lg transition-all transform hover:scale-105"
            >
              {showForm ? 'Fechar' : '+ Nova Transação'}
            </button>
          </div>
        </div>

        <Dashboard transactions={transactions} />

        {showForm && (
          <div ref={formRef} className="mb-8 animate-slideDown">
            <TransactionForm
              onSubmit={editingTransaction ? handleUpdateTransaction : handleAddTransaction}
              onCancel={handleCancelForm}
              editingTransaction={editingTransaction}
              paymentMethods={paymentMethods}
              onManagePaymentMethods={() => setShowPaymentMethodsManager(true)}
            />
          </div>
        )}

        <TransactionList
          transactions={transactions}
          onDelete={handleDeleteTransaction}
          onEdit={handleEditTransaction}
          paymentMethods={paymentMethods}
        />
      </div>

      {showPaymentMethodsManager && (
        <PaymentMethodsManager
          methods={paymentMethods}
          onMethodsChange={handlePaymentMethodsChange}
          onClose={() => setShowPaymentMethodsManager(false)}
        />
      )}

      {/* Botão Voltar ao Topo */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 p-3 bg-purple-600 hover:bg-purple-700 text-white rounded-full shadow-lg transition-all transform hover:scale-110 z-50 animate-fadeIn"
          title="Voltar ao topo"
        >
          <ArrowUp className="w-6 h-6" />
        </button>
      )}
    </div>
  );
}

export default App;
