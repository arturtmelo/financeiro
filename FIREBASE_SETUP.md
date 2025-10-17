# 🔥 Configuração do Firebase - Guia Completo

## Por que Firebase?

- ✅ **Gratuito** para começar (plano Spark)
- ✅ **Autenticação** integrada e segura
- ✅ **Banco de dados** em tempo real (Firestore)
- ✅ **Funciona** perfeitamente com Vercel
- ✅ **Dados na nuvem** acessíveis de qualquer lugar
- ✅ **Segurança** profissional do Google

---

## 📋 PASSO 1: Criar Conta no Firebase

1. Acesse: https://firebase.google.com/
2. Clique em **"Começar"** ou **"Get Started"**
3. Faça login com sua conta Google
4. Aceite os termos de serviço

---

## 📋 PASSO 2: Criar Projeto no Firebase

1. No console do Firebase, clique em **"Adicionar projeto"** ou **"Add project"**
2. **Nome do projeto**: `financeiro-app` (ou o nome que preferir)
3. Clique em **"Continuar"**
4. **Google Analytics**:
   - Pode desativar se quiser (não é necessário para este projeto)
   - Ou deixe ativado e selecione uma conta
5. Clique em **"Criar projeto"**
6. Aguarde alguns segundos...
7. Clique em **"Continuar"**

---

## 📋 PASSO 3: Configurar Aplicativo Web

1. No painel do projeto, clique no ícone **</>** (Web)
2. **Apelido do app**: `financeiro-web`
3. **Firebase Hosting**: NÃO marque (vamos usar Vercel)
4. Clique em **"Registrar app"**
5. **COPIE as credenciais** que aparecem (vamos usar depois):

```javascript
const firebaseConfig = {
  apiKey: 'sua-api-key-aqui',
  authDomain: 'seu-projeto.firebaseapp.com',
  projectId: 'seu-projeto-id',
  storageBucket: 'seu-projeto.appspot.com',
  messagingSenderId: '123456789',
  appId: '1:123456789:web:abcdef',
};
```

6. Clique em **"Continuar no console"**

---

## 📋 PASSO 4: Ativar Authentication

1. No menu lateral, clique em **"Authentication"** (🔐)
2. Clique em **"Vamos começar"** ou **"Get started"**
3. Clique na aba **"Sign-in method"**
4. Clique em **"Email/Password"**
5. **Ative** o primeiro toggle (Email/senha)
6. **NÃO ative** "Email link" (não vamos usar)
7. Clique em **"Salvar"**

✅ **Pronto!** Authentication configurado!

---

## 📋 PASSO 5: Configurar Firestore Database

1. No menu lateral, clique em **"Firestore Database"** (🗃️)
2. Clique em **"Criar banco de dados"** ou **"Create database"**
3. **Local do Firestore**:
   - Escolha uma região próxima (ex: `southamerica-east1` para Brasil)
   - Clique em **"Avançar"**
4. **Regras de segurança**:
   - Selecione **"Iniciar no modo de produção"** ou **"Start in production mode"**
   - Clique em **"Criar"** ou **"Enable"**
5. Aguarde alguns segundos...

### 5.1: Configurar Regras de Segurança

1. Na tela do Firestore, clique na aba **"Regras"** ou **"Rules"**
2. **SUBSTITUA** o conteúdo por:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Regra para usuários - cada um só acessa seus próprios dados
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;

      // Transações do usuário
      match /transactions/{transactionId} {
        allow read, write: if request.auth != null && request.auth.uid == userId;
      }

      // Métodos de pagamento do usuário
      match /paymentMethods/{methodId} {
        allow read, write: if request.auth != null && request.auth.uid == userId;
      }
    }
  }
}
```

3. Clique em **"Publicar"** ou **"Publish"**

✅ **Pronto!** Firestore configurado com segurança!

---

## 📋 PASSO 6: Instalar Dependências

No seu terminal, na pasta do projeto:

```bash
npm install firebase
```

---

## 📋 PASSO 7: Criar Arquivo de Configuração

Vou criar os arquivos necessários para você.

---

## 🔐 PASSO 8: Variáveis de Ambiente

Crie um arquivo `.env.local` na raiz do projeto:

```env
VITE_FIREBASE_API_KEY=sua-api-key-aqui
VITE_FIREBASE_AUTH_DOMAIN=seu-projeto.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=seu-projeto-id
VITE_FIREBASE_STORAGE_BUCKET=seu-projeto.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abcdef
```

**⚠️ IMPORTANTE:**

- Substitua pelos valores que você copiou no PASSO 3
- Adicione `.env.local` ao `.gitignore` (para não subir no GitHub)

---

## 📋 PASSO 9: Configurar Vercel

Quando for fazer deploy:

1. Acesse: https://vercel.com
2. Faça login e importe seu repositório
3. Em **"Environment Variables"**, adicione as mesmas variáveis do `.env.local`:
   - `VITE_FIREBASE_API_KEY`
   - `VITE_FIREBASE_AUTH_DOMAIN`
   - `VITE_FIREBASE_PROJECT_ID`
   - `VITE_FIREBASE_STORAGE_BUCKET`
   - `VITE_FIREBASE_MESSAGING_SENDER_ID`
   - `VITE_FIREBASE_APP_ID`
4. Clique em **"Deploy"**

---

## ✅ Verificação Final

Antes de testar:

- [ ] Projeto criado no Firebase
- [ ] Authentication ativado (Email/Senha)
- [ ] Firestore criado
- [ ] Regras de segurança configuradas
- [ ] Dependências instaladas (`npm install firebase`)
- [ ] Arquivo `.env.local` criado com as credenciais
- [ ] Código atualizado (vou fazer isso agora)

---

## 🎯 Próximos Passos

Agora vou:

1. ✅ Criar configuração do Firebase
2. ✅ Atualizar utilitários de autenticação
3. ✅ Atualizar utilitários de storage
4. ✅ Testar localmente
5. ✅ Você faz deploy no Vercel

---

## 💰 Limites do Plano Gratuito

O plano gratuito (Spark) do Firebase inclui:

- **Authentication**: 10.000 verificações/mês
- **Firestore**:
  - 1 GB de armazenamento
  - 50.000 leituras/dia
  - 20.000 escritas/dia
  - 20.000 exclusões/dia
- **Transferência**: 10 GB/mês

✅ **Suficiente** para milhares de usuários!

---

## 🆘 Suporte

Se tiver problemas:

1. Verifique se copiou as credenciais corretamente
2. Verifique se as regras do Firestore foram aplicadas
3. Verifique o console do navegador (F12) para erros
4. Verifique o console do Firebase para logs

---

## 🔒 Segurança

✅ **O que melhorou:**

- Senhas são hasheadas pelo Firebase
- Autenticação segura com tokens JWT
- Regras de segurança no Firestore
- Dados protegidos no servidor do Google
- HTTPS obrigatório

❌ **Não precisa mais se preocupar com:**

- Armazenar senhas em texto plano
- Validação manual de tokens
- Segurança do localStorage
