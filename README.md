# 💰 Sistema de Controle Financeiro

Um sistema moderno e intuitivo para gerenciar suas finanças pessoais, desenvolvido com React, TypeScript e Tailwind CSS.

## ✨ Funcionalidades

- 📊 **Dashboard Completo**: Visualize suas entradas, saídas, saldo e estatísticas em tempo real
- 💳 **Múltiplos Métodos de Pagamento**: Pix, Cartões, Dinheiro, e mais
- 🔍 **Busca e Filtros Avançados**: Encontre transações por descrição, tipo ou método de pagamento
- 📅 **Controle por Data**: Registre e visualize transações com datas específicas
- 🏷️ **Categorias Personalizadas**: Organize suas transações por categorias
- 💾 **Armazenamento Local**: Seus dados ficam salvos no navegador (localStorage)
- 🎨 **Interface Moderna**: Design bonito e responsivo que funciona em todos os dispositivos
- ✏️ **Edição Fácil**: Edite ou exclua transações com apenas um clique

## 🚀 Como Usar

### Pré-requisitos

- Node.js (versão 16 ou superior)
- npm ou yarn

### Instalação

1. Instale as dependências:

```bash
npm install
```

2. Inicie o servidor de desenvolvimento:

```bash
npm run dev
```

3. Abra seu navegador em `http://localhost:5173`

### Build para Produção

```bash
npm run build
```

Os arquivos otimizados serão gerados na pasta `dist/`.

## 🎯 Como Funciona

### Adicionar Nova Transação

1. Clique no botão **"+ Nova Transação"**
2. Escolha o tipo (Entrada ou Saída)
3. Preencha os campos:
   - **Valor**: Quanto foi a transação
   - **Descrição**: O que foi comprado/recebido
   - **Método de Pagamento**: Como foi pago
   - **Data**: Quando aconteceu
   - **Categoria** (opcional): Para organizar melhor
4. Clique em **"Salvar"**

### Editar ou Excluir

- Passe o mouse sobre uma transação
- Clique no ícone de **lápis** para editar
- Clique no ícone de **lixeira** para excluir

### Filtrar Transações

Use os campos de busca e filtros no topo da lista:

- **Buscar**: Digite parte da descrição
- **Filtro de Tipo**: Mostre apenas entradas ou saídas
- **Filtro de Método**: Filtre por forma de pagamento

## 🛠️ Tecnologias Utilizadas

- **React 18**: Biblioteca JavaScript para interfaces
- **TypeScript**: JavaScript com tipagem estática
- **Vite**: Build tool super rápido
- **Tailwind CSS**: Framework CSS utilitário
- **Lucide React**: Ícones modernos
- **date-fns**: Manipulação de datas

## 📱 Responsividade

O sistema é totalmente responsivo e funciona perfeitamente em:

- 🖥️ Desktops
- 💻 Laptops
- 📱 Tablets
- 📱 Smartphones

## 💡 Dicas de Uso

1. **Seja consistente**: Use sempre os mesmos nomes para métodos de pagamento
2. **Use categorias**: Ajuda a entender onde seu dinheiro vai
3. **Registre imediatamente**: Não deixe para depois, registre suas transações assim que acontecem
4. **Revise mensalmente**: Use o dashboard para entender seus hábitos financeiros

## 🎨 Personalização

Você pode personalizar as cores editando o arquivo `tailwind.config.js`:

```javascript
theme: {
  extend: {
    colors: {
      primary: {
        // Suas cores personalizadas aqui
      },
    },
  },
}
```

## 📝 Estrutura do Projeto

```
financeiro/
├── src/
│   ├── components/        # Componentes React
│   │   ├── Dashboard.tsx
│   │   ├── Header.tsx
│   │   ├── TransactionForm.tsx
│   │   └── TransactionList.tsx
│   ├── utils/            # Funções utilitárias
│   │   ├── calculations.ts
│   │   └── storage.ts
│   ├── types.ts          # Definições TypeScript
│   ├── App.tsx           # Componente principal
│   ├── main.tsx          # Ponto de entrada
│   └── index.css         # Estilos globais
├── index.html
├── package.json
└── README.md
```

## 🔒 Privacidade

Todos os seus dados são armazenados localmente no seu navegador. Nenhuma informação é enviada para servidores externos.

## 🤝 Contribuindo

Sugestões e melhorias são sempre bem-vindas! Sinta-se à vontade para:

- Reportar bugs
- Sugerir novas funcionalidades
- Melhorar a documentação

## 📄 Licença

Este projeto é livre para uso pessoal e educacional.

---

Desenvolvido com ❤️ para ajudar você a ter controle total sobre suas finanças!
