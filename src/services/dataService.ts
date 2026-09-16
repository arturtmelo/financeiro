import { Transaction, Budget } from '../types';
import * as firestoreService from './firestoreService';
import * as demoDataService from './demoDataService';
import { DEMO_USER_ID } from './demoDataService';

export { DEMO_USER_ID };

// ==================== TRANSAÇÕES ====================

export const loadTransactions = (userId: string): Promise<Transaction[]> =>
  userId === DEMO_USER_ID
    ? demoDataService.loadTransactions()
    : firestoreService.loadTransactions(userId);

export const addTransaction = (transaction: Transaction, userId: string): Promise<void> =>
  userId === DEMO_USER_ID
    ? demoDataService.addTransaction(transaction)
    : firestoreService.addTransaction(transaction, userId);

export const updateTransaction = (transaction: Transaction, userId: string): Promise<void> =>
  userId === DEMO_USER_ID
    ? demoDataService.updateTransaction(transaction)
    : firestoreService.updateTransaction(transaction, userId);

export const deleteTransaction = (transactionId: string, userId: string): Promise<void> =>
  userId === DEMO_USER_ID
    ? demoDataService.deleteTransaction(transactionId)
    : firestoreService.deleteTransaction(transactionId, userId);

// ==================== MÉTODOS DE PAGAMENTO ====================

export const loadPaymentMethods = (userId: string): Promise<string[]> =>
  userId === DEMO_USER_ID
    ? demoDataService.loadPaymentMethods()
    : firestoreService.loadPaymentMethods(userId);

export const savePaymentMethods = (methods: string[], userId: string): Promise<void> =>
  userId === DEMO_USER_ID
    ? demoDataService.savePaymentMethods(methods)
    : firestoreService.savePaymentMethods(methods, userId);

// ==================== CATEGORIAS ====================

export const loadCategories = (userId: string): Promise<string[]> =>
  userId === DEMO_USER_ID
    ? demoDataService.loadCategories()
    : firestoreService.loadCategories(userId);

export const saveCategories = (categories: string[], userId: string): Promise<void> =>
  userId === DEMO_USER_ID
    ? demoDataService.saveCategories(categories)
    : firestoreService.saveCategories(categories, userId);

// ==================== CORES DAS CATEGORIAS ====================

export const loadCategoryColors = (userId: string): Promise<Record<string, string>> =>
  userId === DEMO_USER_ID
    ? demoDataService.loadCategoryColors()
    : firestoreService.loadCategoryColors(userId);

export const saveCategoryColors = (
  colors: Record<string, string>,
  userId: string
): Promise<void> =>
  userId === DEMO_USER_ID
    ? demoDataService.saveCategoryColors(colors)
    : firestoreService.saveCategoryColors(colors, userId);

// ==================== ORÇAMENTOS ====================

export const loadBudgets = (userId: string): Promise<Budget[]> =>
  userId === DEMO_USER_ID ? demoDataService.loadBudgets() : firestoreService.loadBudgets(userId);

export const addBudget = (budget: Budget, userId: string): Promise<void> =>
  userId === DEMO_USER_ID
    ? demoDataService.addBudget(budget)
    : firestoreService.addBudget(budget, userId);

export const updateBudget = (budget: Budget, userId: string): Promise<void> =>
  userId === DEMO_USER_ID
    ? demoDataService.updateBudget(budget)
    : firestoreService.updateBudget(budget, userId);

export const deleteBudget = (budgetId: string, userId: string): Promise<void> =>
  userId === DEMO_USER_ID
    ? demoDataService.deleteBudget(budgetId)
    : firestoreService.deleteBudget(budgetId, userId);
