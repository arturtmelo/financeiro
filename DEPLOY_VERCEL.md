# 🚀 Deploy no Vercel - Guia Completo Passo a Passo

## ✅ Pré-requisitos

- [x] Firebase configurado e funcionando localmente
- [x] Conta no GitHub
- [ ] Código no GitHub
- [ ] Conta no Vercel

---

## 📋 PASSO 1: Preparar o código (2 minutos)

### 1.1 - Verificar se `.env.local` não vai para o GitHub

O arquivo `.env.local` **NÃO DEVE** ir para o GitHub (por segurança).

**Verificar:**

1. Abra o arquivo `.gitignore` na raiz do projeto
2. Verifique se tem esta linha: `*.local`
3. ✅ Se tiver, está OK! O `.env.local` não será enviado ao GitHub

---

## 📋 PASSO 2: Criar repositório no GitHub (3 minutos)

### 2.1 - No site do GitHub

1. Acesse: **https://github.com**
2. Faça login com sua conta
3. Clique no botão **"+"** (canto superior direito)
4. Clique em **"New repository"**

### 2.2 - Configurar o repositório

1. **Repository name**: `financeiro-lenise` (ou o nome que quiser)
2. **Description**: `Controle Financeiro com Firebase` (opcional)
3. **Visibilidade**:
   - **Public** (recomendado) - qualquer um pode ver o código
   - Ou **Private** - só você vê (funciona com Vercel também)
4. **NÃO marque:**
   - ❌ Add a README file
   - ❌ Add .gitignore
   - ❌ Choose a license
5. Clique em **"Create repository"**

### 2.3 - Copie os comandos

Você verá uma tela com comandos. **IGNORE POR ENQUANTO!** Vamos usar no terminal.

✅ **Repositório criado!**

---

## 📋 PASSO 3: Enviar código para o GitHub (2 minutos)

### No terminal (dentro da pasta do projeto):

```bash
# 1. Inicializar Git (se ainda não fez)
git init

# 2. Adicionar todos os arquivos
git add .

# 3. Fazer o primeiro commit
git commit -m "Migração para Firebase completa"

# 4. Conectar com o GitHub
# SUBSTITUA "seu-usuario" pelo seu usuário do GitHub!
git remote add origin https://github.com/seu-usuario/financeiro-lenise.git

# 5. Renomear branch para main (se necessário)
git branch -M main

# 6. Enviar para o GitHub
git push -u origin main
```

**⚠️ IMPORTANTE:** Substitua `seu-usuario` pelo seu nome de usuário do GitHub!

Exemplo:

```bash
git remote add origin https://github.com/joaosilva/financeiro-lenise.git
```

### Se pedir login:

- **Username**: Seu usuário do GitHub
- **Password**: Use um **Personal Access Token** (não a senha)
  - Se não tem: https://github.com/settings/tokens
  - Crie um novo token com permissão de `repo`

✅ **Código enviado para o GitHub!**

---

## 📋 PASSO 4: Criar conta no Vercel (2 minutos)

### 4.1 - Acessar Vercel

1. Acesse: **https://vercel.com**
2. Clique em **"Sign Up"** (se não tem conta)
3. **Recomendado**: Clique em **"Continue with GitHub"**
4. Autorize o Vercel a acessar seu GitHub
5. Você será redirecionado para o dashboard

✅ **Conta criada!**

---

## 📋 PASSO 5: Importar projeto (1 minuto)

### 5.1 - No Dashboard do Vercel

1. Clique no botão **"Add New..."** (canto superior direito)
2. Clique em **"Project"**

### 5.2 - Importar do GitHub

1. Você verá uma lista dos seus repositórios do GitHub
2. Encontre **`financeiro-lenise`** (ou o nome que você usou)
3. Clique em **"Import"** ao lado do repositório

✅ **Projeto importado!**

---

## 📋 PASSO 6: Configurar Environment Variables (3 minutos)

### 6.1 - Tela de configuração

Você verá a tela "Configure Project".

Role para baixo até encontrar **"Environment Variables"**.

### 6.2 - Adicionar TODAS as variáveis

**IMPORTANTE:** Você precisa adicionar as **MESMAS** 6 variáveis que estão no seu `.env.local`!

#### Adicionar uma por uma:

**Variável 1:**

- **Name**: `VITE_FIREBASE_API_KEY`
- **Value**: `AIzaSyAymkGPMxjFs-R5NoKYACti-iX6k7QKN84`
- Clique em **"Add"**

**Variável 2:**

- **Name**: `VITE_FIREBASE_AUTH_DOMAIN`
- **Value**: `financeiro-lenise.firebaseapp.com`
- Clique em **"Add"**

**Variável 3:**

- **Name**: `VITE_FIREBASE_PROJECT_ID`
- **Value**: `financeiro-lenise`
- Clique em **"Add"**

**Variável 4:**

- **Name**: `VITE_FIREBASE_STORAGE_BUCKET`
- **Value**: `financeiro-lenise.firebasestorage.app`
- Clique em **"Add"**

**Variável 5:**

- **Name**: `VITE_FIREBASE_MESSAGING_SENDER_ID`
- **Value**: `607671869649`
- Clique em **"Add"**

**Variável 6:**

- **Name**: `VITE_FIREBASE_APP_ID`
- **Value**: `1:607671869649:web:c943cbe053a252032f65f0`
- Clique em **"Add"**

### 6.3 - Verificar

Você deve ter **6 variáveis** adicionadas:

- ✅ VITE_FIREBASE_API_KEY
- ✅ VITE_FIREBASE_AUTH_DOMAIN
- ✅ VITE_FIREBASE_PROJECT_ID
- ✅ VITE_FIREBASE_STORAGE_BUCKET
- ✅ VITE_FIREBASE_MESSAGING_SENDER_ID
- ✅ VITE_FIREBASE_APP_ID

**⚠️ ATENÇÃO:**

- Todas devem começar com `VITE_`
- Use os **seus valores** do Firebase (os que você copiou)

✅ **Variáveis configuradas!**

---

## 📋 PASSO 7: Deploy! (2-3 minutos)

### 7.1 - Fazer o deploy

1. Depois de adicionar todas as variáveis
2. **NÃO mude** nenhuma outra configuração
3. Clique no botão **"Deploy"** (grande e azul)

### 7.2 - Aguarde...

Você verá:

- ⏳ "Building..." (Construindo)
- 🔨 Logs de build aparecendo
- ⏳ "Deploying..." (Fazendo deploy)

**Tempo:** 2-3 minutos ⏱️

### 7.3 - Sucesso! 🎉

Quando terminar, você verá:

- 🎊 Confetes animados
- ✅ "Congratulations!"
- 🔗 Link do seu site

✅ **SITE NO AR!**

---

## 📋 PASSO 8: Acessar seu site! (1 minuto)

### 8.1 - Pegar a URL

Na tela de sucesso, você verá:

```
https://financeiro-lenise.vercel.app
```

ou

```
https://financeiro-lenise-seu-usuario.vercel.app
```

### 8.2 - Clicar e testar!

1. **Clique** na URL
2. Seu site abrirá em uma nova aba! 🎉

---

## ✅ PASSO 9: Testar tudo! (2 minutos)

### No seu site online:

1. ✅ Tela de login apareceu?
2. ✅ Clique em "Criar conta"
3. ✅ Crie uma conta nova (pode ser diferente da local)
4. ✅ Você consegue logar?
5. ✅ Adicione uma transação
6. ✅ A transação aparece na lista?
7. ✅ Faça logout
8. ✅ Faça login novamente
9. ✅ A transação ainda está lá?
10. ✅ Abra em outro dispositivo (celular, por exemplo)
11. ✅ Faça login com a mesma conta
12. ✅ As transações estão sincronizadas?

### ✅ SE TUDO FUNCIONOU:

**PARABÉNS! 🎉🎉🎉**

Seu app está:

- 🌍 Online e acessível de qualquer lugar
- ☁️ Com dados na nuvem (Firebase)
- 🔒 Seguro (autenticação do Google)
- 📱 Responsivo (funciona em mobile)
- 🚀 Rápido (hospedado no Vercel)
- 🆓 Grátis!

---

## 🔗 Configurar domínio personalizado (Opcional)

### Se quiser um domínio bonito:

1. No dashboard do Vercel
2. Clique no seu projeto
3. Vá em **"Settings"** → **"Domains"**
4. Você pode:
   - Adicionar um domínio próprio (ex: `financeiro.com.br`)
   - Ou mudar para: `seu-nome.vercel.app`

---

## 🔄 Fazer atualizações no futuro

### Quando fizer mudanças no código:

```bash
# 1. Adicionar mudanças
git add .

# 2. Fazer commit
git commit -m "Descrição das mudanças"

# 3. Enviar para GitHub
git push

# 4. Vercel faz deploy AUTOMÁTICO! 🎉
```

O Vercel detecta mudanças no GitHub e faz deploy automaticamente!

---

## 🆘 Problemas comuns

### Site mostra tela branca

**Solução:**

1. Abra o Console (F12 no navegador)
2. Veja os erros
3. Provavelmente faltou alguma variável de ambiente
4. Volte no Vercel → Settings → Environment Variables
5. Verifique se todas as 6 variáveis estão lá

### Erro de autenticação

**Solução:**

1. Vá no Firebase Console
2. Authentication → Settings → Authorized domains
3. Adicione seu domínio do Vercel: `seu-projeto.vercel.app`

### Site não atualiza

**Solução:**

- Limpe o cache: Ctrl+Shift+R
- Ou abra em aba anônima

---

## 📊 Monitorar seu site

### No Vercel Dashboard:

- **Analytics**: Veja quantas visitas tem
- **Logs**: Veja erros que acontecem
- **Deployments**: Veja histórico de deploys

### No Firebase Console:

- **Authentication → Users**: Veja usuários cadastrados
- **Firestore → Data**: Veja os dados salvos
- **Usage**: Veja quanto está usando (fica no free!)

---

## 🎯 Checklist final

- [ ] Código no GitHub
- [ ] Projeto importado no Vercel
- [ ] 6 variáveis de ambiente configuradas
- [ ] Deploy realizado com sucesso
- [ ] Site online funcionando
- [ ] Testado criar conta
- [ ] Testado adicionar transações
- [ ] Testado logout/login
- [ ] Compartilhado a URL com alguém! 🎉

---

## 🎊 PARABÉNS!

Você acabou de:

- ✅ Criar um app financeiro completo
- ✅ Com autenticação segura (Firebase)
- ✅ Banco de dados na nuvem (Firestore)
- ✅ Interface responsiva (React + Tailwind)
- ✅ Hospedagem profissional (Vercel)
- ✅ 100% GRÁTIS!

**Agora é só compartilhar com todo mundo! 🚀**

Sua URL: `https://seu-projeto.vercel.app`

---

**Desenvolvido com ❤️ usando Firebase 🔥 e Vercel ▲**
