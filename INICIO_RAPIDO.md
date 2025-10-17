# ⚡ Início Rápido - 3 Passos

## 📋 Checklist Antes de Começar

- [ ] Node.js instalado? ([Baixar aqui](https://nodejs.org/))
- [ ] Visual Studio Code aberto na pasta do projeto?
- [ ] Terminal aberto?

---

## 🚀 Começar em 3 Passos

### Passo 1: Instalar Dependências

```bash
npm install
```

⏳ **Tempo estimado:** 2-3 minutos

---

### Passo 2: Iniciar o Servidor

```bash
npm run dev
```

✅ **Pronto!** O terminal mostrará: `Local: http://localhost:5173/`

---

### Passo 3: Abrir no Navegador

🌐 **Acesse:** http://localhost:5173

---

## 🎉 Parabéns! Seu sistema está rodando!

### ➡️ Próximos Passos:

1. **Adicione sua primeira transação**

   - Clique em "+ Nova Transação"
   - Preencha os dados
   - Clique em "Salvar"

2. **Explore o Dashboard**

   - Veja suas entradas e saídas
   - Confira o saldo
   - Analise os gastos por método de pagamento

3. **Teste os Filtros**
   - Use a busca para encontrar transações
   - Filtre por tipo (entrada/saída)
   - Filtre por método de pagamento

---

## 🆘 Problemas?

### ❌ Erro: "npm não é reconhecido"

**Solução:** Instale o Node.js: https://nodejs.org/

### ❌ Erro ao instalar dependências

**Solução:**

```bash
npm cache clean --force
npm install
```

### ❌ Página em branco

**Solução:**

1. Pressione F12 no navegador
2. Veja erros no Console
3. Recarregue a página (Ctrl+R)

### ❌ Porta já em uso

**Solução:** Feche outros projetos ou mude a porta no `vite.config.ts`

---

## 💡 Dicas Rápidas

| Ação                      | Como fazer                     |
| ------------------------- | ------------------------------ |
| 🛑 Parar o servidor       | Ctrl + C no terminal           |
| 🔄 Reiniciar              | Ctrl + C, depois `npm run dev` |
| 🧹 Limpar cache           | `npm cache clean --force`      |
| 📦 Atualizar dependências | `npm update`                   |

---

## 📱 Testar no Celular

1. Certifique-se que o PC e celular estão na mesma rede WiFi
2. Execute:

```bash
npm run dev -- --host
```

3. Acesse o IP mostrado no terminal no seu celular

---

## 🎯 Exemplos de Transações para Testar

### Entradas (💰)

- Salário - R$ 5.000,00 - Transferência
- Freelance - R$ 800,00 - Pix
- Cashback - R$ 50,00 - Pix

### Saídas (💸)

- Supermercado Extra - R$ 450,00 - Cartão Visa
- Uber - R$ 35,00 - Cartão Santander
- Restaurante - R$ 120,00 - Dinheiro
- Netflix - R$ 55,90 - Cartão Visa
- Academia - R$ 89,90 - Débito
- Farmácia - R$ 67,80 - Pix

---

## ⌨️ Atalhos Úteis

| Atalho            | Função                |
| ----------------- | --------------------- |
| Ctrl + \`         | Abrir/Fechar Terminal |
| Ctrl + B          | Abrir/Fechar Sidebar  |
| Ctrl + P          | Buscar arquivo        |
| Ctrl + Shift + P  | Paleta de comandos    |
| Ctrl + K Ctrl + S | Atalhos do VS Code    |

---

## 📚 Arquivos Importantes

| Arquivo               | O que é                        |
| --------------------- | ------------------------------ |
| `README.md`           | Documentação completa          |
| `GUIA_INSTALACAO.md`  | Guia detalhado de instalação   |
| `IDEIAS_MELHORIAS.md` | Sugestões de melhorias futuras |
| `src/App.tsx`         | Componente principal           |
| `src/types.ts`        | Definições de tipos            |

---

## 🎨 Personalizar o Sistema

### Mudar Cores

Edite `tailwind.config.js`:

```javascript
colors: {
  primary: {
    500: '#sua-cor-aqui',
  },
}
```

### Adicionar Métodos de Pagamento

Edite `src/types.ts`:

```typescript
export type PaymentMethod =
  | 'Pix'
  | 'Seu Novo Método'
  | ...
```

---

## 🎓 Aprender Mais

- 📘 [React Tutorial](https://react.dev/learn)
- 📙 [TypeScript Basics](https://www.typescriptlang.org/docs/handbook/intro.html)
- 📗 [Tailwind CSS](https://tailwindcss.com/docs)

---

**Tudo pronto! Agora é só começar a organizar suas finanças! 💰📊✨**

---

## 📞 Ajuda Adicional

Se tiver dúvidas:

1. Leia o `README.md` completo
2. Confira o `GUIA_INSTALACAO.md`
3. Veja as ideias em `IDEIAS_MELHORIAS.md`

**Bom controle financeiro! 🚀**
