import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { User } from '../types';
import {
  loginUser as authLoginUser,
  registerUser as authRegisterUser,
  logoutUser as authLogoutUser,
  resetPassword as authResetPassword,
  firebaseUserToUser,
} from '../services/authService';
import { auth } from '../config/firebase';
import { DEMO_USER } from '../services/demoDataService';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isDemo: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; message: string }>;
  register: (
    name: string,
    email: string,
    password: string
  ) => Promise<{ success: boolean; message: string }>;
  resetPassword: (email: string) => Promise<{ success: boolean; message: string }>;
  loginAsDemo: () => void;
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
  const [firebaseUser, setFirebaseUser] = useState<User | null>(null);
  const [demoUser, setDemoUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Listener do Firebase Auth - detecta mudanças no estado de autenticação
    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      if (fbUser) {
        // Usuário logado - converter para nosso tipo User
        const userData = await firebaseUserToUser(fbUser);
        setFirebaseUser(userData);
      } else {
        // Usuário deslogado
        setFirebaseUser(null);
      }
      setIsLoading(false);
    });

    // Cleanup
    return () => unsubscribe();
  }, []);

  const user = demoUser ?? firebaseUser;
  const isDemo = !!demoUser;

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

  const resetPassword = async (
    email: string
  ): Promise<{ success: boolean; message: string }> => {
    return authResetPassword(email);
  };

  const loginAsDemo = () => {
    setDemoUser(DEMO_USER);
  };

  const logout = async () => {
    if (demoUser) {
      // Modo demo é apenas local - não há sessão do Firebase para encerrar
      setDemoUser(null);
      return;
    }
    await authLogoutUser();
    // O onAuthStateChanged vai limpar o user automaticamente
  };

  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    isDemo,
    login,
    register,
    resetPassword,
    loginAsDemo,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
