# 🚀 Guia de Instalação - Sistema Financeiro

## Passo a Passo para Começar

### 1️⃣ Instalação do Node.js

Se você ainda não tem o Node.js instalado:

1. Acesse: https://nodejs.org/
2. Baixe a versão LTS (recomendada)
3. Execute o instalador
4. Verifique a instalação abrindo o PowerShell e digitando:
   ```bash
   node --version
   npm --version
   ```

### 2️⃣ Instalando as Dependências

No Visual Studio Code, abra o terminal integrado:

- Pressione `` Ctrl + ` `` (Ctrl + aspas simples)
- Ou vá em: **Terminal → Novo Terminal**

Digite o comando:

```bash
npm install
```

⏳ Aguarde alguns minutos enquanto todas as dependências são baixadas...

### 3️⃣ Iniciando o Projeto

Após a instalação, inicie o servidor de desenvolvimento:

```bash
npm run dev
```

Você verá algo assim:

```
  VITE v4.4.5  ready in 500 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

### 4️⃣ Acessando o Sistema

1. Abra seu navegador (Chrome, Firefox, Edge...)
2. Digite na barra de endereços: `http://localhost:5173`
3. Pronto! Seu sistema está rodando! 🎉

## ⚡ Comandos Úteis

| Comando           | O que faz                            |
| ----------------- | ------------------------------------ |
| `npm run dev`     | Inicia o servidor de desenvolvimento |
| `npm run build`   | Cria versão otimizada para produção  |
| `npm run preview` | Visualiza a versão de produção       |

## 🛠️ Solucionando Problemas

### Problema: "npm não é reconhecido"

**Solução**: Node.js não está instalado ou não está no PATH. Reinstale o Node.js.

### Problema: Porta 5173 já está em uso

**Solução**:

1. Feche outros projetos Vite que estejam rodando
2. Ou mude a porta no arquivo `vite.config.ts`:

```typescript
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000, // Use outra porta
  },
});
```

### Problema: Erro ao instalar dependências

**Solução**:

1. Delete a pasta `node_modules`
2. Delete o arquivo `package-lock.json`
3. Execute novamente `npm install`

### Problema: Página em branco

**Solução**:

1. Abra o Console do navegador (F12)
2. Verifique se há erros
3. Limpe o cache do navegador (Ctrl + Shift + Delete)

## 📱 Testando em Dispositivos Móveis

Para testar no seu celular/tablet na mesma rede:

1. Inicie o servidor com:

```bash
npm run dev -- --host
```

2. O terminal mostrará:

```
➜  Local:   http://localhost:5173/
➜  Network: http://192.168.x.x:5173/
```

3. Acesse o endereço "Network" no seu dispositivo móvel

## 🎯 Próximos Passos

Agora que o sistema está rodando:

1. ✅ Adicione sua primeira transação
2. ✅ Teste os filtros e busca
3. ✅ Explore o dashboard
4. ✅ Experimente editar e excluir transações

## 💡 Dicas

- **Mantenha o terminal aberto**: Enquanto estiver usando o sistema
- **Salve automaticamente**: Os dados são salvos automaticamente no navegador
- **Modo escuro**: Seu navegador respeita as preferências do sistema
- **Atalhos**: Ctrl+C no terminal para parar o servidor

## 🆘 Precisa de Ajuda?

Se encontrar algum problema:

1. Verifique se o Node.js está atualizado
2. Verifique se todas as dependências foram instaladas
3. Tente reiniciar o servidor (Ctrl+C e depois `npm run dev` novamente)

---

**Bom controle financeiro! 💰📊**
