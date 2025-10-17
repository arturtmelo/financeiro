# 🏗️ Estrutura do Projeto

Documentação completa da arquitetura e organização do código.

---

## 📁 Estrutura de Diretórios

```
Financeiro/
│
├── 📄 index.html                 # Página HTML principal
├── 📄 package.json               # Dependências e scripts
├── 📄 tsconfig.json             # Configuração TypeScript
├── 📄 vite.config.ts            # Configuração Vite
├── 📄 tailwind.config.js        # Configuração Tailwind CSS
├── 📄 postcss.config.js         # Configuração PostCSS
├── 📄 .prettierrc               # Configuração formatação
├── 📄 .gitignore                # Arquivos ignorados pelo Git
│
├── 📁 .vscode/                  # Configurações VS Code
│   ├── extensions.json          # Extensões recomendadas
│   └── settings.json            # Configurações do editor
│
├── 📁 public/                   # Arquivos públicos
│   └── vite.svg                 # Ícone
│
├── 📁 src/                      # Código fonte
│   │
│   ├── 📄 main.tsx              # Ponto de entrada
│   ├── 📄 App.tsx               # Componente raiz
│   ├── 📄 index.css             # Estilos globais
│   ├── 📄 types.ts              # Definições de tipos
│   │
│   ├── 📁 components/           # Componentes React
│   │   ├── Header.tsx           # Cabeçalho
│   │   ├── Dashboard.tsx        # Dashboard com cards
│   │   ├── TransactionForm.tsx  # Formulário de transação
│   │   └── TransactionList.tsx  # Lista de transações
│   │
│   └── 📁 utils/                # Funções utilitárias
│       ├── storage.ts           # LocalStorage operations
│       └── calculations.ts      # Cálculos financeiros
│
└── 📁 Documentação/
    ├── 📄 README.md             # Documentação principal
    ├── 📄 INICIO_RAPIDO.md      # Guia início rápido
    ├── 📄 GUIA_INSTALACAO.md    # Guia instalação detalhado
    ├── 📄 IDEIAS_MELHORIAS.md   # Sugestões futuras
    ├── 📄 COMO_CONTRIBUIR.md    # Guia desenvolvimento
    ├── 📄 EXEMPLOS_USO.md       # Casos de uso práticos
    └── 📄 ESTRUTURA_PROJETO.md  # Este arquivo
```

---

## 🔄 Fluxo de Dados

```
┌─────────────────────────────────────────────────────┐
│                      App.tsx                         │
│  - Estado principal (transactions)                   │
│  - Gerencia showForm e editingTransaction            │
│  - Handlers: add, update, delete, edit              │
└─────────────────────┬───────────────────────────────┘
                      │
        ┌─────────────┼─────────────┐
        │             │             │
        ▼             ▼             ▼
┌──────────┐   ┌──────────┐   ┌──────────┐
│Dashboard │   │  Form    │   │   List   │
│          │   │          │   │          │
│ Recebe:  │   │ Recebe:  │   │ Recebe:  │
│ - trans  │   │ - onSub  │   │ - trans  │
│          │   │ - onCanc │   │ - onDel  │
│ Calcula: │   │ - edit?  │   │ - onEdit │
│ - stats  │   │          │   │          │
│ - graphs │   │ Emite:   │   │ Emite:   │
│          │   │ - trans  │   │ - id/obj │
└──────────┘   └──────────┘   └──────────┘
```

---

## 🗃️ Gerenciamento de Estado

### Estado Global (App.tsx)

```typescript
const [transactions, setTransactions] = useState<Transaction[]>([]);
const [showForm, setShowForm] = useState(false);
const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
```

### Persistência (LocalStorage)

```typescript
// Carregar ao iniciar
useEffect(() => {
  const loaded = loadTransactions();
  setTransactions(loaded);
}, []);

// Salvar a cada mudança
saveTransactions(transactions);
```

### Fluxo de Atualização

```
1. Usuário clica "Salvar"
   ↓
2. Form chama onSubmit(transaction)
   ↓
3. App atualiza state: setTransactions([...transactions, transaction])
   ↓
4. storage.ts salva no localStorage
   ↓
5. React re-renderiza componentes afetados
   ↓
6. Dashboard e List mostram novos dados
```

---

## 🧩 Componentes Detalhados

### 1. App.tsx (Componente Raiz)

**Responsabilidades:**

- Gerenciar estado global
- Orquestrar comunicação entre componentes
- Handlers para CRUD de transações

**Props que passa:**

```typescript
<Dashboard transactions={transactions} />
<TransactionForm
  onSubmit={handleAddOrUpdate}
  onCancel={handleCancel}
  editingTransaction={editingTransaction}
/>
<TransactionList
  transactions={transactions}
  onDelete={handleDelete}
  onEdit={handleEdit}
/>
```

### 2. Header.tsx

**Responsabilidades:**

- Exibir logo e nome do app
- Mostrar data atual
- (Futuro: botões de tema, notificações)

**Props:** Nenhuma

### 3. Dashboard.tsx

**Responsabilidades:**

- Calcular estatísticas mensais
- Exibir cards de resumo
- Mostrar gráfico de gastos por método

**Props:**

```typescript
interface DashboardProps {
  transactions: Transaction[];
}
```

**Sub-componentes:**

- StatCard: Card individual de estatística

### 4. TransactionForm.tsx

**Responsabilidades:**

- Coletar dados do usuário
- Validar inputs
- Modo criação vs edição

**Props:**

```typescript
interface TransactionFormProps {
  onSubmit: (transaction: Transaction) => void;
  onCancel: () => void;
  editingTransaction?: Transaction | null;
}
```

**Estado Interno:**

```typescript
const [description, setDescription] = useState('');
const [amount, setAmount] = useState('');
const [type, setType] = useState<TransactionType>('saida');
const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('Pix');
const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
const [category, setCategory] = useState('');
```

### 5. TransactionList.tsx

**Responsabilidades:**

- Exibir lista de transações
- Filtrar e buscar transações
- Botões de edição e exclusão

**Props:**

```typescript
interface TransactionListProps {
  transactions: Transaction[];
  onDelete: (id: string) => void;
  onEdit: (transaction: Transaction) => void;
}
```

**Estado Interno (Filtros):**

```typescript
const [searchTerm, setSearchTerm] = useState('');
const [filterType, setFilterType] = useState<TransactionType | 'all'>('all');
const [filterPayment, setFilterPayment] = useState<PaymentMethod | 'all'>('all');
```

---

## 📊 Tipos TypeScript

### Transaction

```typescript
interface Transaction {
  id: string; // Identificador único
  description: string; // Descrição da transação
  amount: number; // Valor em reais
  type: TransactionType; // 'entrada' | 'saida'
  paymentMethod: PaymentMethod; // Forma de pagamento
  date: string; // Data no formato ISO
  category?: string; // Categoria opcional
}
```

### MonthlyStats

```typescript
interface MonthlyStats {
  totalIncome: number; // Total de entradas
  totalExpense: number; // Total de saídas
  balance: number; // Saldo (entrada - saída)
  transactionCount: number; // Quantidade de transações
}
```

### Tipos Auxiliares

```typescript
type TransactionType = 'entrada' | 'saida';

type PaymentMethod =
  | 'Pix'
  | 'Cartão Santander'
  | 'Cartão Visa'
  | 'Dinheiro'
  | 'Débito'
  | 'Transferência'
  | 'Outro';
```

---

## 🛠️ Utilitários

### storage.ts

**Funções:**

```typescript
saveTransactions(transactions: Transaction[]): void
loadTransactions(): Transaction[]
addTransaction(transaction: Transaction): Transaction[]
deleteTransaction(id: string): Transaction[]
updateTransaction(id: string, updated: Transaction): Transaction[]
```

**Storage Key:** `'financeiro_transactions'`

### calculations.ts

**Funções:**

```typescript
// Calcular estatísticas de um mês
calculateMonthlyStats(
  transactions: Transaction[],
  month?: Date
): MonthlyStats

// Formatar valor como moeda
formatCurrency(value: number): string
// Exemplo: 1500.50 → "R$ 1.500,50"

// Formatar data
formatDate(date: string): string
// Exemplo: "2024-01-15" → "15/01/2024"

// Estatísticas por método de pagamento
getPaymentMethodStats(transactions: Transaction[]): Array<{
  method: string;
  total: number;
}>
```

---

## 🎨 Estilização

### Tailwind CSS

**Configuração:** `tailwind.config.js`

**Cores Personalizadas:**

```javascript
colors: {
  primary: {
    500: '#0ea5e9',
    600: '#0284c7',
    // ... outros tons
  },
}
```

**Classes Customizadas:**

```css
/* index.css */
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
```

### Gradientes Usados

```css
/* Background do body */
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);

/* Cards de estatísticas */
from-green-500 to-emerald-600    /* Entradas */
from-red-500 to-rose-600         /* Saídas */
from-blue-500 to-cyan-600        /* Saldo */
from-purple-500 to-indigo-600    /* Transações */
```

---

## ⚙️ Configurações

### Vite (vite.config.ts)

```typescript
export default defineConfig({
  plugins: [react()],
});
```

### TypeScript (tsconfig.json)

- Target: ES2020
- Strict mode: ativado
- JSX: react-jsx

### Prettier (.prettierrc)

- Single quotes
- Semicolons
- 2 spaces indentation
- Print width: 100

---

## 📦 Dependências

### Produção

```json
{
  "react": "^18.2.0",
  "react-dom": "^18.2.0",
  "lucide-react": "^0.263.1", // Ícones
  "date-fns": "^2.30.0" // Manipulação de datas
}
```

### Desenvolvimento

```json
{
  "@types/react": "^18.2.15",
  "@types/react-dom": "^18.2.7",
  "@vitejs/plugin-react": "^4.0.3",
  "typescript": "^5.0.2",
  "vite": "^4.4.5",
  "tailwindcss": "^3.3.3",
  "autoprefixer": "^10.4.14",
  "postcss": "^8.4.27"
}
```

---

## 🔧 Scripts NPM

```json
{
  "dev": "vite", // Servidor desenvolvimento
  "build": "tsc && vite build", // Build produção
  "preview": "vite preview" // Preview build
}
```

---

## 🌊 Fluxo de Criação de Transação

```
1. Usuário clica "+ Nova Transação"
   ↓
2. App.tsx: setShowForm(true)
   ↓
3. TransactionForm é renderizado
   ↓
4. Usuário preenche campos
   ↓
5. Usuário clica "Salvar"
   ↓
6. TransactionForm valida dados
   ↓
7. TransactionForm chama onSubmit(transaction)
   ↓
8. App.tsx: handleAddTransaction
   ↓
9. Atualiza state: setTransactions([...transactions, newTransaction])
   ↓
10. storage.ts: saveTransactions(updated)
    ↓
11. localStorage.setItem('financeiro_transactions', JSON.stringify(updated))
    ↓
12. React re-renderiza
    ↓
13. Dashboard recalcula stats
    ↓
14. TransactionList adiciona novo item
    ↓
15. Form fecha: setShowForm(false)
```

---

## 🔄 Fluxo de Edição

```
1. Usuário clica ícone de edição
   ↓
2. TransactionList chama onEdit(transaction)
   ↓
3. App.tsx: setEditingTransaction(transaction)
   ↓
4. App.tsx: setShowForm(true)
   ↓
5. Form carrega dados em useEffect
   ↓
6. Usuário edita campos
   ↓
7. Usuário clica "Atualizar"
   ↓
8. Form chama onSubmit (agora é update)
   ↓
9. App.tsx: handleUpdateTransaction
   ↓
10. Atualiza state (map e substitui)
    ↓
11. Salva no localStorage
    ↓
12. Limpa: setEditingTransaction(null)
    ↓
13. Fecha: setShowForm(false)
```

---

## 🗑️ Fluxo de Exclusão

```
1. Usuário clica ícone de lixeira
   ↓
2. TransactionList: window.confirm()
   ↓
3. Usuário confirma
   ↓
4. TransactionList chama onDelete(id)
   ↓
5. App.tsx: handleDeleteTransaction
   ↓
6. Filtra: transactions.filter(t => t.id !== id)
   ↓
7. Atualiza state
   ↓
8. Salva no localStorage
   ↓
9. React re-renderiza sem o item
```

---

## 🔍 Fluxo de Filtro

```
1. Usuário digita na busca
   ↓
2. TransactionList: setSearchTerm(value)
   ↓
3. React re-renderiza
   ↓
4. filteredTransactions recalcula:
   - Filtra por searchTerm
   - Filtra por filterType
   - Filtra por filterPayment
   ↓
5. Exibe apenas itens filtrados
```

---

## 💾 Persistência de Dados

### LocalStorage

**Vantagens:**

- ✅ Não precisa backend
- ✅ Dados salvos localmente
- ✅ Funciona offline
- ✅ Rápido

**Limitações:**

- ❌ Máximo ~5-10MB
- ❌ Não sincroniza entre dispositivos
- ❌ Dados podem ser apagados pelo usuário
- ❌ Sem backup automático

**Estrutura no localStorage:**

```json
{
  "financeiro_transactions": "[
    {
      \"id\": \"1234567890\",
      \"description\": \"Compra\",
      \"amount\": 100,
      \"type\": \"saida\",
      \"paymentMethod\": \"Pix\",
      \"date\": \"2024-01-15\",
      \"category\": \"Alimentação\"
    }
  ]"
}
```

---

## 🚀 Build e Deploy

### Build Local

```bash
npm run build
```

Gera pasta `dist/` com arquivos otimizados.

### Visualizar Build

```bash
npm run preview
```

### Deploy Sugerido

#### Opção 1: Vercel

```bash
npm install -g vercel
vercel
```

#### Opção 2: Netlify

1. Conectar repositório GitHub
2. Build command: `npm run build`
3. Publish directory: `dist`

#### Opção 3: GitHub Pages

1. Instalar: `npm install gh-pages --save-dev`
2. Adicionar em package.json:

```json
{
  "homepage": "https://[username].github.io/[repo]",
  "scripts": {
    "predeploy": "npm run build",
    "deploy": "gh-pages -d dist"
  }
}
```

3. Deploy: `npm run deploy`

---

## 📊 Performance

### Otimizações Implementadas

- ✅ React 18 (Concurrent Mode)
- ✅ Vite (Fast HMR)
- ✅ Tailwind CSS (Purge unused)
- ✅ TypeScript (Type safety)

### Futuras Otimizações

- [ ] React.memo para componentes
- [ ] useMemo para cálculos pesados
- [ ] useCallback para handlers
- [ ] Virtualização de listas longas
- [ ] Lazy loading de componentes
- [ ] Service Worker (PWA)

---

## 🧪 Testabilidade

### Estrutura Favorece Testes

**Componentes puros:**

```typescript
// Fácil de testar - só props, sem side effects
<Dashboard transactions={mockTransactions} />
```

**Funções utilitárias puras:**

```typescript
// Fácil de testar - entrada → saída
expect(formatCurrency(1000)).toBe('R$ 1.000,00');
```

**Separação de lógica:**

- Componentes: UI
- Utils: Lógica de negócio
- Types: Contratos

---

## 🔐 Segurança

### Implementado

- ✅ TypeScript (Type safety)
- ✅ Validação de inputs no form
- ✅ Sanitização via React (XSS protection)

### Futuras Melhorias

- [ ] Autenticação
- [ ] Criptografia de dados
- [ ] Validação server-side
- [ ] Rate limiting
- [ ] HTTPS obrigatório

---

## 📱 Responsividade

### Breakpoints Tailwind

```css
sm: 640px   /* Tablets pequenos */
md: 768px   /* Tablets */
lg: 1024px  /* Desktops */
xl: 1280px  /* Telas grandes */
2xl: 1536px /* Telas muito grandes */
```

### Grid Responsivo

```jsx
className = 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6';
```

---

## 📚 Recursos de Aprendizado

### React

- [Documentação Oficial](https://react.dev)
- [React Hooks](https://react.dev/reference/react)

### TypeScript

- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [React TypeScript Cheatsheet](https://react-typescript-cheatsheet.netlify.app/)

### Tailwind

- [Documentação](https://tailwindcss.com/docs)
- [Tailwind UI](https://tailwindui.com/)

---

**Estrutura bem definida = Código mais fácil de entender e manter! 🏗️✨**
