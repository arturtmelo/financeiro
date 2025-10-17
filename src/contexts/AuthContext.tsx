import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { User } from '../types';
import {
  loginUser as authLoginUser,
  registerUser as authRegisterUser,
  logoutUser as authLogoutUser,
  firebaseUserToUser,
} from '../services/authService';
import { auth } from '../config/firebase';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; message: string }>;
  register: (
    name: string,
    email: string,
    password: string
  ) => Promise<{ success: boolean; message: string }>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Listener do Firebase Auth - detecta mudanças no estado de autenticação
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // Usuário logado - converter para nosso tipo User
        const userData = await firebaseUserToUser(firebaseUser);
        setUser(userData);
      } else {
        // Usuário deslogado
        setUser(null);
      }
      setIsLoading(false);
    });

    // Cleanup
    return () => unsubscribe();
  }, []);

  const login = async (
    email: string,
    password: string
  ): Promise<{ success: boolean; message: string }> => {
    const result = await authLoginUser(email, password);
    // O onAuthStateChanged vai atualizar o user automaticamente
    return { success: result.success, message: result.message };
  };

  const register = async (
    name: string,
    email: string,
    password: string
  ): Promise<{ success: boolean; message: string }> => {
    const result = await authRegisterUser(name, email, password);
    // O onAuthStateChanged vai atualizar o user automaticamente
    return { success: result.success, message: result.message };
  };

  const logout = async () => {
    await authLogoutUser();
    // O onAuthStateChanged vai limpar o user automaticamente
  };

  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
