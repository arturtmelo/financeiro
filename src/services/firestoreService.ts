import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  deleteDoc,
  query,
  orderBy,
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { Transaction } from '../types';

// ==================== TRANSAÇÕES ====================

/**
 * Salvar todas as transações do usuário
 */
export const saveTransactions = async (
  transactions: Transaction[],
  userId: string
): Promise<void> => {
  try {
    const userTransactionsRef = collection(db, 'users', userId, 'transactions');

    // Salvar cada transação individualmente
    for (const transaction of transactions) {
      // Remover campos undefined antes de salvar
      const transactionData: any = { ...transaction };
      if (transactionData.category === undefined) {
        delete transactionData.category;
      }

      await setDoc(doc(userTransactionsRef, transaction.id), transactionData);
    }
  } catch (error) {
    console.error('Erro ao salvar transações:', error);
    throw error;
  }
};

/**
 * Carregar todas as transações do usuário
 */
export const loadTransactions = async (userId: string): Promise<Transaction[]> => {
  try {
    const userTransactionsRef = collection(db, 'users', userId, 'transactions');
    const q = query(userTransactionsRef, orderBy('date', 'desc'));
    const querySnapshot = await getDocs(q);

    const transactions: Transaction[] = [];
    querySnapshot.forEach((doc) => {
      transactions.push(doc.data() as Transaction);
    });

    return transactions;
  } catch (error) {
    console.error('Erro ao carregar transações:', error);
    return [];
  }
};

/**
 * Adicionar uma transação
 */
export const addTransaction = async (transaction: Transaction, userId: string): Promise<void> => {
  try {
    const transactionRef = doc(db, 'users', userId, 'transactions', transaction.id);

    // Remover campos undefined antes de salvar
    const transactionData: any = { ...transaction };
    if (transactionData.category === undefined) {
      delete transactionData.category;
    }

    await setDoc(transactionRef, transactionData);
  } catch (error) {
    console.error('Erro ao adicionar transação:', error);
    throw error;
  }
};

/**
 * Atualizar uma transação
 */
export const updateTransaction = async (
  transaction: Transaction,
  userId: string
): Promise<void> => {
  try {
    const transactionRef = doc(db, 'users', userId, 'transactions', transaction.id);

    // Remover campos undefined antes de salvar
    const transactionData: any = { ...transaction };
    if (transactionData.category === undefined) {
      delete transactionData.category;
    }

    await setDoc(transactionRef, transactionData);
  } catch (error) {
    console.error('Erro ao atualizar transação:', error);
    throw error;
  }
};

/**
 * Deletar uma transação
 */
export const deleteTransaction = async (transactionId: string, userId: string): Promise<void> => {
  try {
    const transactionRef = doc(db, 'users', userId, 'transactions', transactionId);
    await deleteDoc(transactionRef);
  } catch (error) {
    console.error('Erro ao deletar transação:', error);
    throw error;
  }
};

// ==================== MÉTODOS DE PAGAMENTO ====================

const DEFAULT_METHODS = [
  'Pix',
  'Cartão Santander',
  'Cartão Visa',
  'Dinheiro',
  'Débito',
  'Transferência',
  'Outro',
];

/**
 * Carregar métodos de pagamento do usuário
 */
export const loadPaymentMethods = async (userId: string): Promise<string[]> => {
  try {
    const methodsDoc = await getDoc(doc(db, 'users', userId, 'settings', 'paymentMethods'));

    if (methodsDoc.exists()) {
      return methodsDoc.data().methods || DEFAULT_METHODS;
    }

    // Se não existir, criar com os métodos padrão
    await savePaymentMethods(DEFAULT_METHODS, userId);
    return DEFAULT_METHODS;
  } catch (error) {
    console.error('Erro ao carregar métodos de pagamento:', error);
    return DEFAULT_METHODS;
  }
};

/**
 * Salvar métodos de pagamento do usuário
 */
export const savePaymentMethods = async (methods: string[], userId: string): Promise<void> => {
  try {
    const methodsRef = doc(db, 'users', userId, 'settings', 'paymentMethods');
    await setDoc(methodsRef, { methods });
  } catch (error) {
    console.error('Erro ao salvar métodos de pagamento:', error);
    throw error;
  }
};

// ==================== CATEGORIAS ====================

const DEFAULT_CATEGORIES = [
  'Alimentação',
  'Transporte',
  'Saúde',
  'Educação',
  'Lazer',
  'Moradia',
  'Vestuário',
  'Outro',
];

/**
 * Carregar categorias do usuário
 */
export const loadCategories = async (userId: string): Promise<string[]> => {
  try {
    const categoriesDoc = await getDoc(doc(db, 'users', userId, 'settings', 'categories'));

    if (categoriesDoc.exists()) {
      return categoriesDoc.data().categories || DEFAULT_CATEGORIES;
    }

    // Se não existir, criar com as categorias padrão
    await saveCategories(DEFAULT_CATEGORIES, userId);
    return DEFAULT_CATEGORIES;
  } catch (error) {
    console.error('Erro ao carregar categorias:', error);
    return DEFAULT_CATEGORIES;
  }
};

/**
 * Salvar categorias do usuário
 */
export const saveCategories = async (categories: string[], userId: string): Promise<void> => {
  try {
    const categoriesRef = doc(db, 'users', userId, 'settings', 'categories');
    await setDoc(categoriesRef, { categories });
  } catch (error) {
    console.error('Erro ao salvar categorias:', error);
    throw error;
  }
};
