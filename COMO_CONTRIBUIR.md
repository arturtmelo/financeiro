# 🤝 Como Adicionar Novas Funcionalidades

Guia prático para expandir o sistema financeiro com novas features!

---

## 📝 Exemplo 1: Adicionar Nova Categoria

### Passo 1: Atualizar os Tipos

Edite `src/types.ts`:

```typescript
export interface Transaction {
  id: string;
  description: string;
  amount: number;
  type: TransactionType;
  paymentMethod: PaymentMethod;
  date: string;
  category: string; // Tornar obrigatório
  subcategory?: string; // Adicionar subcategoria
}

// Adicionar enum de categorias
export type Category = 'Mercado' | 'Ceveja' | 'Conta de Luz' | 'Outros';
```

### Passo 2: Atualizar o Formulário

Edite `src/components/TransactionForm.tsx`:

```typescript
// Adicionar lista de categorias
const categories: Category[] = [
  'Alimentação',
  'Transporte',
  'Saúde',
  // ... outras
];

// Adicionar select de categoria no JSX
<select
  value={category}
  onChange={(e) => setCategory(e.target.value as Category)}
  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl"
>
  {categories.map((cat) => (
    <option key={cat} value={cat}>
      {cat}
    </option>
  ))}
</select>;
```

---

## 📊 Exemplo 2: Adicionar Gráfico de Pizza

### Passo 1: Instalar Biblioteca

```bash
npm install recharts
```

### Passo 2: Criar Componente

Crie `src/components/PieChart.tsx`:

```typescript
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from 'recharts';
import { Transaction } from '../types';

interface Props {
  transactions: Transaction[];
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

const ExpensePieChart = ({ transactions }: Props) => {
  // Agrupar gastos por categoria
  const data = transactions
    .filter((t) => t.type === 'saida')
    .reduce((acc, t) => {
      const existing = acc.find((item) => item.name === t.category);
      if (existing) {
        existing.value += t.amount;
      } else {
        acc.push({ name: t.category || 'Sem categoria', value: t.amount });
      }
      return acc;
    }, [] as { name: string; value: number }[]);

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={(entry) => `${entry.name}: ${entry.value.toFixed(2)}`}
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default ExpensePieChart;
```

### Passo 3: Usar no Dashboard

Edite `src/components/Dashboard.tsx`:

```typescript
import ExpensePieChart from './PieChart';

// Adicionar no JSX
<div className="bg-white rounded-2xl shadow-xl p-6">
  <h3 className="text-xl font-bold mb-4">Gastos por Categoria</h3>
  <ExpensePieChart transactions={transactions} />
</div>;
```

---

## 🎯 Exemplo 3: Adicionar Metas Financeiras

### Passo 1: Criar Tipo

Adicione em `src/types.ts`:

```typescript
export interface Goal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  deadline: string;
  icon?: string;
  color?: string;
}
```

### Passo 2: Criar Componente de Meta

Crie `src/components/GoalCard.tsx`:

```typescript
import { Goal } from '../types';
import { formatCurrency } from '../utils/calculations';
import { Target, TrendingUp } from 'lucide-react';

interface Props {
  goal: Goal;
  onUpdate: (goal: Goal) => void;
}

const GoalCard = ({ goal, onUpdate }: Props) => {
  const progress = (goal.currentAmount / goal.targetAmount) * 100;

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="bg-blue-100 p-3 rounded-lg">
            <Target className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h3 className="font-bold text-gray-800">{goal.name}</h3>
            <p className="text-sm text-gray-500">Meta: {formatCurrency(goal.targetAmount)}</p>
          </div>
        </div>
      </div>

      {/* Barra de Progresso */}
      <div className="mb-3">
        <div className="flex justify-between text-sm mb-1">
          <span className="text-gray-600">Progresso</span>
          <span className="font-bold text-blue-600">{progress.toFixed(0)}%</span>
        </div>
        <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-blue-500 to-green-500 transition-all"
            style={{ width: `${Math.min(progress, 100)}%` }}
          />
        </div>
      </div>

      <div className="flex justify-between items-center">
        <span className="text-sm text-gray-600">
          {formatCurrency(goal.currentAmount)} economizado
        </span>
        <span className="text-sm text-gray-500">
          Faltam {formatCurrency(goal.targetAmount - goal.currentAmount)}
        </span>
      </div>
    </div>
  );
};

export default GoalCard;
```

### Passo 3: Adicionar Gerenciamento de Metas

Em `src/App.tsx`:

```typescript
const [goals, setGoals] = useState<Goal[]>([]);

// Carregar do localStorage
useEffect(() => {
  const savedGoals = localStorage.getItem('financeiro_goals');
  if (savedGoals) {
    setGoals(JSON.parse(savedGoals));
  }
}, []);

// Salvar no localStorage
useEffect(() => {
  localStorage.setItem('financeiro_goals', JSON.stringify(goals));
}, [goals]);
```

---

## 🌙 Exemplo 4: Implementar Modo Escuro

### Passo 1: Criar Contexto de Tema

Crie `src/contexts/ThemeContext.tsx`:

```typescript
import { createContext, useContext, useState, useEffect } from 'react';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [theme, setTheme] = useState<Theme>('light');

  useEffect(() => {
    const saved = localStorage.getItem('theme') as Theme;
    if (saved) setTheme(saved);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <div className={theme}>{children}</div>
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within ThemeProvider');
  return context;
};
```

### Passo 2: Configurar Tailwind para Dark Mode

Edite `tailwind.config.js`:

```javascript
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class', // Ativar modo escuro
  theme: {
    extend: {
      // suas extensões
    },
  },
};
```

### Passo 3: Adicionar Classes Dark

Use classes `dark:` nos componentes:

```tsx
<div className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white">{/* conteúdo */}</div>
```

### Passo 4: Botão de Toggle

Adicione no Header:

```tsx
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

const Header = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button onClick={toggleTheme} className="p-2 rounded-lg hover:bg-white/20">
      {theme === 'light' ? <Moon /> : <Sun />}
    </button>
  );
};
```

---

## 📱 Exemplo 5: Transformar em PWA

### Passo 1: Criar Manifest

Crie `public/manifest.json`:

```json
{
  "name": "Sistema Financeiro",
  "short_name": "Lê",
  "description": "Controle suas finanças pessoais",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#667eea",
  "icons": [
    {
      "src": "/icon-192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/icon-512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
```

### Passo 2: Adicionar no HTML

Edite `index.html`:

```html
<head>
  <!-- ... -->
  <link rel="manifest" href="/manifest.json" />
  <meta name="theme-color" content="#667eea" />
</head>
```

### Passo 3: Service Worker (opcional)

Instale o plugin Vite PWA:

```bash
npm install vite-plugin-pwa -D
```

Edite `vite.config.ts`:

```typescript
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: false, // usar o manual
    }),
  ],
});
```

---

## 🎨 Dicas de Boas Práticas

### 1. Organização de Arquivos

```
src/
├── components/
│   ├── common/          # Componentes reutilizáveis
│   ├── forms/           # Formulários
│   └── dashboard/       # Componentes do dashboard
├── hooks/               # Custom hooks
├── contexts/            # Context API
├── utils/               # Funções utilitárias
├── types/               # Tipos TypeScript
└── constants/           # Constantes
```

### 2. Criar Custom Hooks

Exemplo: `src/hooks/useLocalStorage.ts`:

```typescript
import { useState, useEffect } from 'react';

export function useLocalStorage<T>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(() => {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : initialValue;
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue] as const;
}
```

### 3. Criar Constantes

`src/constants/paymentMethods.ts`:

```typescript
export const PAYMENT_METHODS = [
  { value: 'Pix', label: 'Pix', icon: '💸' },
  { value: 'Cartão Santander', label: 'Cartão Santander', icon: '💳' },
  // ...
] as const;
```

### 4. Componentizar

Quebre componentes grandes em pequenos:

```typescript
// ❌ Ruim: Componente gigante
const TransactionList = () => {
  // 300 linhas de código
};

// ✅ Bom: Componentes pequenos
const TransactionList = () => (
  <div>
    <TransactionFilters />
    <TransactionItems />
    <TransactionPagination />
  </div>
);
```

---

## 🧪 Adicionar Testes

### Instalar Vitest

```bash
npm install -D vitest @testing-library/react @testing-library/jest-dom
```

### Exemplo de Teste

`src/utils/__tests__/calculations.test.ts`:

```typescript
import { describe, it, expect } from 'vitest';
import { formatCurrency, calculateMonthlyStats } from '../calculations';

describe('formatCurrency', () => {
  it('should format number as BRL currency', () => {
    expect(formatCurrency(1000)).toBe('R$ 1.000,00');
  });
});

describe('calculateMonthlyStats', () => {
  it('should calculate correct totals', () => {
    const transactions = [
      { type: 'entrada', amount: 1000, date: '2024-01-15' },
      { type: 'saida', amount: 500, date: '2024-01-20' },
    ];

    const stats = calculateMonthlyStats(transactions);
    expect(stats.totalIncome).toBe(1000);
    expect(stats.totalExpense).toBe(500);
    expect(stats.balance).toBe(500);
  });
});
```

---

## 📚 Recursos Úteis

### React

- [React Hooks](https://react.dev/reference/react)
- [Context API](https://react.dev/learn/passing-data-deeply-with-context)
- [Performance](https://react.dev/learn/render-and-commit)

### TypeScript

- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [React TypeScript](https://react-typescript-cheatsheet.netlify.app/)

### Tailwind

- [Tailwind Components](https://tailwindui.com/components)
- [Headless UI](https://headlessui.com/) - Componentes acessíveis

### Ícones

- [Lucide Icons](https://lucide.dev/icons/)
- [Heroicons](https://heroicons.com/)

---

## ✅ Checklist para Nova Feature

- [ ] Atualizar tipos em `types.ts`
- [ ] Criar/atualizar componentes necessários
- [ ] Atualizar lógica de storage se necessário
- [ ] Adicionar validações
- [ ] Testar responsividade
- [ ] Testar em diferentes navegadores
- [ ] Atualizar documentação
- [ ] Considerar acessibilidade
- [ ] Otimizar performance se necessário

---

**Bom desenvolvimento! 🚀 Se tiver dúvidas, consulte os outros guias ou a documentação oficial das bibliotecas!**
