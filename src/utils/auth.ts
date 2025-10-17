import { User } from '../types';

const USERS_KEY = 'financeiro_users';
const CURRENT_USER_KEY = 'financeiro_current_user';

// Carregar todos os usuários
export const loadUsers = (): User[] => {
  try {
    const data = localStorage.getItem(USERS_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Erro ao carregar usuários:', error);
    return [];
  }
};

// Salvar todos os usuários
export const saveUsers = (users: User[]): void => {
  try {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  } catch (error) {
    console.error('Erro ao salvar usuários:', error);
  }
};

// Registrar novo usuário
export const registerUser = (
  name: string,
  email: string,
  password: string
): { success: boolean; message: string; user?: User } => {
  const users = loadUsers();

  // Verificar se o email já existe
  if (users.some((u) => u.email.toLowerCase() === email.toLowerCase())) {
    return { success: false, message: 'Este email já está cadastrado.' };
  }

  // Criar novo usuário
  const newUser: User = {
    id: Date.now().toString(),
    name,
    email: email.toLowerCase(),
    password, // Em produção, isso deveria ser hasheado!
    createdAt: new Date().toISOString(),
  };

  users.push(newUser);
  saveUsers(users);

  return { success: true, message: 'Cadastro realizado com sucesso!', user: newUser };
};

// Fazer login
export const loginUser = (
  email: string,
  password: string
): { success: boolean; message: string; user?: User } => {
  const users = loadUsers();

  const user = users.find(
    (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
  );

  if (!user) {
    return { success: false, message: 'Email ou senha incorretos.' };
  }

  return { success: true, message: 'Login realizado com sucesso!', user };
};

// Salvar usuário atual na sessão
export const saveCurrentUser = (user: User | null): void => {
  try {
    if (user) {
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(CURRENT_USER_KEY);
    }
  } catch (error) {
    console.error('Erro ao salvar usuário atual:', error);
  }
};

// Carregar usuário atual da sessão
export const loadCurrentUser = (): User | null => {
  try {
    const data = localStorage.getItem(CURRENT_USER_KEY);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Erro ao carregar usuário atual:', error);
    return null;
  }
};

// Fazer logout
export const logoutUser = (): void => {
  saveCurrentUser(null);
};
