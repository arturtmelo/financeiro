import { Transaction, Budget, User } from '../types';

export const DEMO_USER_ID = 'demo-user';

export const DEMO_USER: User = {
  id: DEMO_USER_ID,
  name: 'Visitante Demo',
  email: 'demo@financas.app',
  password: '',
  createdAt: '2024-01-01T00:00:00.000Z',
};

const STORAGE_PREFIX = 'financeiro_demo_';

const KEYS = {
  transactions: `${STORAGE_PREFIX}transactions`,
  paymentMethods: `${STORAGE_PREFIX}paymentMethods`,
  categories: `${STORAGE_PREFIX}categories`,
  categoryColors: `${STORAGE_PREFIX}categoryColors`,
  budgets: `${STORAGE_PREFIX}budgets`,
  seeded: `${STORAGE_PREFIX}seeded`,
};

const readJSON = <T,>(key: string, fallback: T): T => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
};

const writeJSON = (key: string, value: unknown): void => {
  localStorage.setItem(key, JSON.stringify(value));
};

const DEFAULT_PAYMENT_METHODS = ['Pix', 'Cartão de Crédito', 'Dinheiro'];
const DEFAULT_CATEGORIES = ['Mercado', 'Transporte', 'Lazer', 'Contas', 'Salário'];
const DEFAULT_CATEGORY_COLORS: Record<string, string> = {
  Mercado: 'green',
  Transporte: 'blue',
  Lazer: 'pink',
  Contas: 'orange',
  Salário: 'purple',
};

const dateStringDaysAgo = (daysAgo: number): string => {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const buildSeedTransactions = (): Transaction[] => [
  {
    id: 'demo-1',
    description: 'Salário',
    amount: 4500,
    type: 'entrada',
    paymentMethod: 'Pix',
    date: dateStringDaysAgo(35),
    category: 'Salário',
  },
  {
    id: 'demo-2',
    description: 'Compras do mês',
    amount: 380.5,
    type: 'saida',
    paymentMethod: 'Cartão de Crédito',
    date: dateStringDaysAgo(32),
    category: 'Mercado',
  },
  {
    id: 'demo-3',
    description: 'Uber',
    amount: 28.9,
    type: 'saida',
    paymentMethod: 'Pix',
    date: dateStringDaysAgo(30),
    category: 'Transporte',
  },
  {
    id: 'demo-4',
    description: 'Cinema',
    amount: 65,
    type: 'saida',
    paymentMethod: 'Cartão de Crédito',
    date: dateStringDaysAgo(27),
    category: 'Lazer',
  },
  {
    id: 'demo-5',
    description: 'Conta de luz',
    amount: 210.4,
    type: 'saida',
    paymentMethod: 'Pix',
    date: dateStringDaysAgo(25),
    category: 'Contas',
  },
  {
    id: 'demo-6',
    description: 'Internet',
    amount: 99.9,
    type: 'saida',
    paymentMethod: 'Cartão de Crédito',
    date: dateStringDaysAgo(24),
    category: 'Contas',
  },
  {
    id: 'demo-7',
    description: 'Freelance design',
    amount: 800,
    type: 'entrada',
    paymentMethod: 'Pix',
    date: dateStringDaysAgo(20),
    category: 'Salário',
  },
  {
    id: 'demo-8',
    description: 'Supermercado',
    amount: 145.3,
    type: 'saida',
    paymentMethod: 'Dinheiro',
    date: dateStringDaysAgo(18),
    category: 'Mercado',
  },
  {
    id: 'demo-9',
    description: 'Gasolina',
    amount: 120,
    type: 'saida',
    paymentMethod: 'Cartão de Crédito',
    date: dateStringDaysAgo(15),
    category: 'Transporte',
  },
  {
    id: 'demo-10',
    description: 'Show de música',
    amount: 150,
    type: 'saida',
    paymentMethod: 'Pix',
    date: dateStringDaysAgo(10),
    category: 'Lazer',
  },
  {
    id: 'demo-11',
    description: 'Salário',
    amount: 4500,
    type: 'entrada',
    paymentMethod: 'Pix',
    date: dateStringDaysAgo(5),
    category: 'Salário',
  },
  {
    id: 'demo-12',
    description: 'Feira',
    amount: 90.2,
    type: 'saida',
    paymentMethod: 'Dinheiro',
    date: dateStringDaysAgo(3),
    category: 'Mercado',
  },
  {
    id: 'demo-13',
    description: 'Aplicativo de transporte',
    amount: 34.5,
    type: 'saida',
    paymentMethod: 'Pix',
    date: dateStringDaysAgo(1),
    category: 'Transporte',
  },
];

const buildSeedBudgets = (): Budget[] => [
  { id: 'demo-budget-1', category: 'Mercado', limit: 600 },
  { id: 'demo-budget-2', category: 'Lazer', limit: 200 },
  { id: 'demo-budget-3', category: 'Transporte', limit: 250 },
];

const ensureSeeded = (): void => {
  if (localStorage.getItem(KEYS.seeded)) return;

  writeJSON(KEYS.transactions, buildSeedTransactions());
  writeJSON(KEYS.paymentMethods, DEFAULT_PAYMENT_METHODS);
  writeJSON(KEYS.categories, DEFAULT_CATEGORIES);
  writeJSON(KEYS.categoryColors, DEFAULT_CATEGORY_COLORS);
  writeJSON(KEYS.budgets, buildSeedBudgets());
  localStorage.setItem(KEYS.seeded, '1');
};

/**
 * Apaga e recria os dados fictícios do modo demo, usado pelo botão
 * "Reiniciar dados demo" para desfazer qualquer alteração de um visitante.
 */
export const resetDemoData = (): void => {
  Object.values(KEYS).forEach((key) => localStorage.removeItem(key));
  ensureSeeded();
};

// ==================== TRANSAÇÕES ====================

export const loadTransactions = async (): Promise<Transaction[]> => {
  ensureSeeded();
  return readJSON<Transaction[]>(KEYS.transactions, []).sort((a, b) =>
    b.date.localeCompare(a.date)
  );
};

export const addTransaction = async (transaction: Transaction): Promise<void> => {
  ensureSeeded();
  const list = readJSON<Transaction[]>(KEYS.transactions, []);
  writeJSON(KEYS.transactions, [...list, transaction]);
};

export const updateTransaction = async (transaction: Transaction): Promise<void> => {
  ensureSeeded();
  const list = readJSON<Transaction[]>(KEYS.transactions, []);
  writeJSON(
    KEYS.transactions,
    list.map((t) => (t.id === transaction.id ? transaction : t))
  );
};

export const deleteTransaction = async (transactionId: string): Promise<void> => {
  ensureSeeded();
  const list = readJSON<Transaction[]>(KEYS.transactions, []);
  writeJSON(
    KEYS.transactions,
    list.filter((t) => t.id !== transactionId)
  );
};

// ==================== MÉTODOS DE PAGAMENTO ====================

export const loadPaymentMethods = async (): Promise<string[]> => {
  ensureSeeded();
  return readJSON(KEYS.paymentMethods, DEFAULT_PAYMENT_METHODS);
};

export const savePaymentMethods = async (methods: string[]): Promise<void> => {
  writeJSON(KEYS.paymentMethods, methods);
};

// ==================== CATEGORIAS ====================

export const loadCategories = async (): Promise<string[]> => {
  ensureSeeded();
  return readJSON(KEYS.categories, DEFAULT_CATEGORIES);
};

export const saveCategories = async (categories: string[]): Promise<void> => {
  writeJSON(KEYS.categories, categories);
};

// ==================== CORES DAS CATEGORIAS ====================

export const loadCategoryColors = async (): Promise<Record<string, string>> => {
  ensureSeeded();
  return readJSON(KEYS.categoryColors, DEFAULT_CATEGORY_COLORS);
};

export const saveCategoryColors = async (colors: Record<string, string>): Promise<void> => {
  writeJSON(KEYS.categoryColors, colors);
};

// ==================== ORÇAMENTOS ====================

export const loadBudgets = async (): Promise<Budget[]> => {
  ensureSeeded();
  return readJSON<Budget[]>(KEYS.budgets, []);
};

export const addBudget = async (budget: Budget): Promise<void> => {
  const list = readJSON<Budget[]>(KEYS.budgets, []);
  writeJSON(KEYS.budgets, [...list, budget]);
};

export const updateBudget = async (budget: Budget): Promise<void> => {
  const list = readJSON<Budget[]>(KEYS.budgets, []);
  writeJSON(
    KEYS.budgets,
    list.map((b) => (b.id === budget.id ? budget : b))
  );
};

export const deleteBudget = async (budgetId: string): Promise<void> => {
  const list = readJSON<Budget[]>(KEYS.budgets, []);
  writeJSON(
    KEYS.budgets,
    list.filter((b) => b.id !== budgetId)
  );
};
