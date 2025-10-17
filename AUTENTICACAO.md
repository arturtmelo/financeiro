# 🔐 Sistema de Autenticação

## Visão Geral

O aplicativo agora possui um sistema completo de cadastro e login que permite que múltiplos usuários tenham suas próprias carteiras financeiras separadas.

## Características

### ✅ Funcionalidades Implementadas

1. **Cadastro de Usuários**

   - Nome completo
   - Email (único)
   - Senha (mínimo 6 caracteres)
   - Confirmação de senha

2. **Login de Usuários**

   - Email e senha
   - Sessão persistente

3. **Separação de Dados**

   - Cada usuário tem suas próprias transações
   - Cada usuário tem seus próprios métodos de pagamento
   - Os dados são isolados por ID do usuário

4. **Interface**
   - Tela de login/registro moderna e responsiva
   - Header mostra nome do usuário logado
   - Botão de logout com confirmação

## Estrutura Técnica

### Arquivos Criados

```
src/
├── types.ts                    # Adicionados tipos User e AuthState
├── utils/
│   └── auth.ts                 # Funções de autenticação
├── contexts/
│   └── AuthContext.tsx         # Contexto React de autenticação
└── components/
    └── Login.tsx               # Componente de login/registro
```

### Arquivos Modificados

```
src/
├── main.tsx                    # Adicionado AuthProvider
├── App.tsx                     # Integração com autenticação
├── components/
│   └── Header.tsx              # Adicionado info do usuário e logout
├── utils/
│   ├── storage.ts              # Atualizado para userId
│   └── paymentMethods.ts       # Atualizado para userId
```

## Armazenamento de Dados

### LocalStorage Keys

```javascript
// Usuários cadastrados
financeiro_users

// Usuário atual logado
financeiro_current_user

// Transações por usuário
financeiro_transactions_{userId}

// Métodos de pagamento por usuário
financeiro_payment_methods_{userId}
```

## Fluxo de Uso

### 1. Primeiro Acesso

```
1. Abrir aplicativo
2. Ver tela de login
3. Clicar em "Criar conta"
4. Preencher formulário de cadastro
5. Fazer login automaticamente
6. Começar a usar o app
```

### 2. Acessos Seguintes

```
1. Abrir aplicativo
2. Ver tela de login
3. Inserir email e senha
4. Fazer login
5. Ver seus dados carregados
```

### 3. Múltiplos Usuários

```
1. Usuário A faz login → Vê dados do Usuário A
2. Usuário A faz logout
3. Usuário B faz login → Vê dados do Usuário B
4. Os dados são completamente separados
```

## Segurança

### ⚠️ Importante

**Este é um sistema de autenticação para demonstração/uso local.**

- As senhas são armazenadas em texto plano no localStorage
- Não há criptografia
- Não há validação de backend
- **NÃO USE EM PRODUÇÃO SEM IMPLEMENTAR SEGURANÇA ADEQUADA**

### Para Produção

Se for usar este app em produção, você deve:

1. ✅ Implementar backend com API REST
2. ✅ Usar hashing de senha (bcrypt, argon2)
3. ✅ Implementar JWT ou sessões seguras
4. ✅ Adicionar HTTPS
5. ✅ Validar inputs no servidor
6. ✅ Implementar rate limiting
7. ✅ Adicionar 2FA (autenticação de dois fatores)

## Validações Implementadas

### Cadastro

- ✅ Nome obrigatório
- ✅ Email único (não pode duplicar)
- ✅ Senha mínimo 6 caracteres
- ✅ Confirmação de senha deve coincidir

### Login

- ✅ Email e senha obrigatórios
- ✅ Verificação de credenciais

## Interface do Usuário

### Tela de Login/Registro

- **Design moderno** com gradiente roxo
- **Responsiva** para mobile e desktop
- **Toggle** entre login e registro
- **Feedback de erros** claro
- **Loading states** durante operações

### Header (Após Login)

- **Desktop**: Mostra nome completo do usuário
- **Mobile**: Mostra apenas ícone de logout
- **Botão Sair**: Com confirmação antes de deslogar

## Exemplo de Uso em Código

### Usando o Hook de Autenticação

```typescript
import { useAuth } from './contexts/AuthContext';

function MeuComponente() {
  const { user, isAuthenticated, login, logout } = useAuth();

  if (!isAuthenticated) {
    return <Login />;
  }

  return (
    <div>
      <h1>Olá, {user.name}!</h1>
      <button onClick={logout}>Sair</button>
    </div>
  );
}
```

### Salvando Dados do Usuário

```typescript
import { saveTransactions } from './utils/storage';
import { useAuth } from './contexts/AuthContext';

function MeuComponente() {
  const { user } = useAuth();

  const salvar = () => {
    if (user) {
      saveTransactions(transactions, user.id);
    }
  };
}
```

## Testando

### Cenário 1: Criar Conta

1. Abra o app
2. Clique em "Criar conta"
3. Preencha:
   - Nome: João Silva
   - Email: joao@email.com
   - Senha: 123456
   - Confirmar: 123456
4. Clique em "Criar Conta"
5. Você será logado automaticamente

### Cenário 2: Múltiplos Usuários

1. Crie usuário "João" (joao@email.com)
2. Adicione algumas transações
3. Faça logout
4. Crie usuário "Maria" (maria@email.com)
5. Adicione transações diferentes
6. Faça logout
7. Entre com "João" novamente
8. ✅ Você verá apenas as transações do João

## Solução de Problemas

### Erro: "Este email já está cadastrado"

- O email já foi usado por outro usuário
- Use um email diferente

### Erro: "Email ou senha incorretos"

- Verifique se digitou corretamente
- Email não é case-sensitive
- Senha é case-sensitive

### Limpar Todos os Dados

Para resetar o sistema:

```javascript
// Abra o Console do navegador (F12) e execute:
localStorage.clear();
location.reload();
```

## Próximas Melhorias Possíveis

- [ ] Recuperação de senha
- [ ] Edição de perfil do usuário
- [ ] Avatar/foto do usuário
- [ ] Configurações de conta
- [ ] Exportar dados do usuário
- [ ] Tema claro/escuro por usuário
- [ ] Autenticação com Google/Facebook
- [ ] Verificação de email

## Suporte

Para dúvidas ou problemas, consulte a documentação do projeto ou abra uma issue no repositório.
