import { Transaction } from '../types';

const getStorageKey = (userId: string): string => {
  return `financeiro_transactions_${userId}`;
};

export const saveTransactions = (transactions: Transaction[], userId: string): void => {
  const key = getStorageKey(userId);
  localStorage.setItem(key, JSON.stringify(transactions));
};

export const loadTransactions = (userId: string): Transaction[] => {
  const key = getStorageKey(userId);
  const data = localStorage.getItem(key);
  if (!data) return [];

  try {
    return JSON.parse(data);
  } catch {
    return [];
  }
};

export const addTransaction = (transaction: Transaction, userId: string): Transaction[] => {
  const transactions = loadTransactions(userId);
  transactions.push(transaction);
  saveTransactions(transactions, userId);
  return transactions;
};

export const deleteTransaction = (id: string, userId: string): Transaction[] => {
  const transactions = loadTransactions(userId);
  const filtered = transactions.filter((t) => t.id !== id);
  saveTransactions(filtered, userId);
  return filtered;
};

export const updateTransaction = (
  id: string,
  updatedTransaction: Transaction,
  userId: string
): Transaction[] => {
  const transactions = loadTransactions(userId);
  const index = transactions.findIndex((t) => t.id === id);
  if (index !== -1) {
    transactions[index] = updatedTransaction;
    saveTransactions(transactions, userId);
  }
  return transactions;
};
