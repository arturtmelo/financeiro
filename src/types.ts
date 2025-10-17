export type TransactionType = 'entrada' | 'saida';

export interface Transaction {
  id: string;
  description: string;
  amount: number;
  type: TransactionType;
  paymentMethod: string;
  date: string;
  category?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  createdAt: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}

export interface MonthlyStats {
  totalIncome: number;
  totalExpense: number;
  balance: number;
  transactionCount: number;
}
