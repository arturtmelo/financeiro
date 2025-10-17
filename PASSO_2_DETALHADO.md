# 🔥 PASSO 2 DETALHADO - Configurar Serviços Firebase

## ✅ Você já fez:

- [x] Projeto `financeiro-lenise` criado no Firebase

---

## 📱 2.1 - REGISTRAR WEB APP (3 minutos)

### Você está aqui: Console do Firebase

Você deve estar vendo a tela do seu projeto `financeiro-lenise`.

### Passo a Passo:

**1. Encontre o ícone Web**

- No centro da tela, você verá uma caixa "Comece adicionando o Firebase ao seu app"
- Verá 4 ícones: iOS, Android, **Web** (`</>`), Unity
- **CLIQUE** no ícone **`</>`** (Web)

**2. Tela "Adicionar o Firebase ao seu app da Web"**

- Campo **"Apelido do app"**: Digite `financeiro-web`
- Checkbox **"Configurar também o Firebase Hosting"**: **NÃO MARQUE** ❌
- **CLIQUE** no botão azul **"Registrar app"**

**3. Aguarde 2 segundos...**

- Uma tela com código JavaScript aparecerá

**4. COPIE AS CREDENCIAIS** ⚠️ **IMPORTANTE!**

Você verá algo assim:

```javascript
// Adicione os SDKs do Firebase
const firebaseConfig = {
  apiKey: 'AIzaSyC123abc456def789ghi',
  authDomain: 'financeiro-lenise-123abc.firebaseapp.com',
  projectId: 'financeiro-lenise-123abc',
  storageBucket: 'financeiro-lenise-123abc.appspot.com',
  messagingSenderId: '123456789012',
  appId: '1:123456789012:web:abc123def456ghi789',
};
```

**AÇÃO:**

- Abra o **Bloco de Notas** (Notepad)
- **COPIE** os 6 valores e salve:

```
apiKey: AIzaSyC123abc456def789ghi
authDomain: financeiro-lenise-123abc.firebaseapp.com
projectId: financeiro-lenise-123abc
storageBucket: financeiro-lenise-123abc.appspot.com
messagingSenderId: 123456789012
appId: 1:123456789012:web:abc123def456ghi789
```

⚠️ **GUARDE BEM ISSO!** Vamos usar em alguns minutos.

**5. Continue**

- Depois de copiar, **CLIQUE** em **"Continuar no console"** (botão azul embaixo)

✅ **PRONTO! Web App registrado!**

---

## 🔐 2.2 - ATIVAR AUTHENTICATION (2 minutos)

### Você está aqui: Console do projeto

### Passo a Passo:

**1. Abra o menu Authentication**

- No lado **ESQUERDO** da tela, você verá um menu vertical
- Procure o item **"Criação"** ou **"Build"**
- Embaixo dele, **CLIQUE** em **"Authentication"** 🔐

**2. Primeira vez no Authentication**

- Você verá uma tela com um botão grande no centro
- **CLIQUE** em **"Vamos começar"** ou **"Get started"**

**3. Tela de métodos de login**

- Você verá uma aba chamada **"Sign-in method"** (deve já estar selecionada)
- Verá uma lista de provedores: Google, Email/senha, Facebook, etc.

**4. Ativar Email/Password**

- **CLIQUE** na linha **"Email/Password"** (primeira da lista)
- Uma janela lateral abrirá à direita

**5. Na janela lateral:**

- Você verá dois toggles (botões liga/desliga):

  - **"Email/senha"** ← Este você vai ativar
  - **"Link de e-mail (login sem senha)"** ← Este deixe DESLIGADO

- **CLIQUE** no primeiro toggle para **ATIVAR** (ficará azul/roxo)
- Deixe o segundo toggle **DESLIGADO** (cinza)

**6. Salvar**

- **CLIQUE** no botão **"Salvar"** (canto inferior direito da janela)

**7. Confirme que funcionou**

- Você voltará para a lista de provedores
- A linha "Email/Password" deve mostrar:
  - **"Ativado"** ou **"Enabled"** ✅
  - Um ponto verde ou azul

✅ **PRONTO! Authentication configurado!**

---

## 🗃️ 2.3 - CRIAR FIRESTORE DATABASE (3 minutos)

### Você está aqui: Ainda no console

### Passo a Passo:

**1. Abra o menu Firestore**

- No menu **ESQUERDO**, em **"Criação"** ou **"Build"**
- **CLIQUE** em **"Firestore Database"** 🗃️

**2. Tela inicial do Firestore**

- Você verá uma tela vazia com um botão grande
- **CLIQUE** em **"Criar banco de dados"** ou **"Create database"**

**3. Escolher localização**
Uma janela "Criar banco de dados" aparecerá:

- **Título:** "Localização do Cloud Firestore"
- **Dropdown:** Selecione a região mais próxima

  - Para **Brasil**: `southamerica-east1 (São Paulo)`
  - Para **Portugal**: `europe-west1 (Bélgica)`
  - Para **EUA**: `us-central1 (Iowa)`

- **CLIQUE** em **"Avançar"** ou **"Next"**

**4. Configurar segurança**
Nova tela: "Proteger seus dados do Cloud Firestore"

Você verá duas opções:

- ⚪ Iniciar no modo de teste (não recomendado para produção)
- 🔘 **Iniciar no modo de produção** ← **SELECIONE ESTE**

**Por quê?** Vamos configurar regras personalizadas daqui a pouco!

- **CLIQUE** em **"Criar"** ou **"Create"**

**5. Aguarde...**

- Uma mensagem "Criando banco de dados..." aparecerá
- Aguarde 10-20 segundos ⏳
- A tela do Firestore carregará

**6. Tela do Firestore**
Você verá:

- Abas no topo: **"Dados"**, **"Regras"**, **"Índices"**, **"Uso"**
- Uma tabela vazia (está tudo certo, não tem dados ainda!)

✅ **PRONTO! Firestore criado!**

---

## 🔒 2.4 - CONFIGURAR REGRAS DE SEGURANÇA (2 minutos)

### Você está aqui: Tela do Firestore

### Passo a Passo:

**1. Abrir aba de Regras**

- No topo da tela do Firestore, você verá várias abas
- **CLIQUE** na aba **"Regras"** ou **"Rules"**

**2. Você verá um editor de código**
O código atual provavelmente é algo assim:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

**3. SUBSTITUA TODO O CÓDIGO**

- **SELECIONE TODO** o código (Ctrl+A)
- **DELETE**
- **COPIE E COLE** este código:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;

      match /transactions/{transactionId} {
        allow read, write: if request.auth != null && request.auth.uid == userId;
      }

      match /settings/{document=**} {
        allow read, write: if request.auth != null && request.auth.uid == userId;
      }
    }
  }
}
```

**4. Publicar as regras**

- Acima do editor, **CLIQUE** em **"Publicar"** ou **"Publish"**
- Uma mensagem de confirmação aparecerá brevemente

**5. Verifique**

- As regras devem estar salvas
- Não deve ter nenhum erro vermelho

**O que essas regras fazem?**

- ✅ Cada usuário só pode acessar **seus próprios** dados
- ✅ Ninguém pode ver dados de outros usuários
- ✅ Precisa estar **logado** para acessar qualquer coisa
- ✅ Segurança máxima! 🔒

✅ **PRONTO! Regras configuradas!**

---

## 🎉 PARABÉNS! FIREBASE CONFIGURADO!

### ✅ Você completou:

- [x] Web App registrado
- [x] Credenciais copiadas
- [x] Authentication ativado
- [x] Firestore criado
- [x] Regras de segurança configuradas

---

## 📝 PRÓXIMO PASSO: Configurar o código

Agora vamos usar aquelas credenciais que você copiou!

### Abra o projeto no seu computador

1. Abra a pasta `Financeiro` no VS Code (ou seu editor)

2. **Crie um arquivo** chamado `.env.local` na **raiz do projeto**

   - **IMPORTANTE:** Na raiz, não dentro de `src/`!
   - Deve ficar no mesmo nível de `package.json`

3. **Cole este conteúdo** no arquivo:

```env
VITE_FIREBASE_API_KEY=Cole_seu_apiKey_aqui
VITE_FIREBASE_AUTH_DOMAIN=Cole_seu_authDomain_aqui
VITE_FIREBASE_PROJECT_ID=Cole_seu_projectId_aqui
VITE_FIREBASE_STORAGE_BUCKET=Cole_seu_storageBucket_aqui
VITE_FIREBASE_MESSAGING_SENDER_ID=Cole_seu_messagingSenderId_aqui
VITE_FIREBASE_APP_ID=Cole_seu_appId_aqui
```

4. **SUBSTITUA** pelos valores que você copiou no Bloco de Notas!

### Exemplo de como deve ficar:

```env
VITE_FIREBASE_API_KEY=AIzaSyC123abc456def789ghi
VITE_FIREBASE_AUTH_DOMAIN=financeiro-lenise-123abc.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=financeiro-lenise-123abc
VITE_FIREBASE_STORAGE_BUCKET=financeiro-lenise-123abc.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789012
VITE_FIREBASE_APP_ID=1:123456789012:web:abc123def456ghi789
```

⚠️ **ATENÇÃO:**

- **SEM espaços** antes ou depois do `=`
- **SEM aspas** nos valores
- Cada linha começa com `VITE_`

5. **SALVE** o arquivo `.env.local`

---

## 🚀 TESTAR!

No terminal, reinicie o servidor:

```bash
# Se o servidor está rodando, pare com Ctrl+C
# Depois rode:
npm run dev
```

Abra o navegador em: **http://localhost:5174**

### O que testar:

1. ✅ A tela de login deve aparecer
2. ✅ Clique em "Criar conta"
3. ✅ Preencha:
   - Nome: Seu nome
   - Email: seu@email.com
   - Senha: 123456
   - Confirmar: 123456
4. ✅ Clique em "Criar Conta"
5. ✅ Você deve ser logado automaticamente!
6. ✅ Adicione uma transação
7. ✅ Faça logout (botão no topo)
8. ✅ Faça login novamente
9. ✅ **A transação deve estar lá!** 🎉

---

## 🆘 Deu erro?

### "Firebase: Error (auth/invalid-api-key)"

- Verifique se copiou o `apiKey` corretamente
- Verifique se tem o `VITE_` no início

### "Firebase: Error (auth/...)"

- Verifique se ativou Authentication no Console
- Volte ao Firebase Console → Authentication → Sign-in method

### "Missing or insufficient permissions"

- Verifique as regras do Firestore
- Volte ao Firebase Console → Firestore → Regras
- Cole as regras novamente

### Nada aparece, tela branca

- Abra o Console do navegador (F12)
- Veja os erros
- Verifique se o servidor está rodando
- Verifique se o `.env.local` está na raiz do projeto

---

## 🎊 FUNCIONOU?

### Próximos passos:

1. ✅ Teste criar várias transações
2. ✅ Teste editar transações
3. ✅ Teste deletar transações
4. ✅ Crie outra conta e veja que os dados são separados
5. ✅ Pronto para fazer deploy no Vercel!

### Para fazer deploy:

Veja o arquivo **`PROXIMO_PASSO.md`** - Passo 8 (Deploy no Vercel)

---

**PARABÉNS! 🎉🔥**

Seu app está rodando com Firebase!

- ✅ Dados na nuvem
- ✅ Autenticação segura
- ✅ Sincronização automática
- ✅ Pronto para produção!

**Agora é só fazer o deploy e compartilhar! 🚀**
