import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  User as FirebaseUser,
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '../config/firebase';
import { User } from '../types';

/**
 * Registrar novo usuário
 */
export const registerUser = async (
  name: string,
  email: string,
  password: string
): Promise<{ success: boolean; message: string; user?: User }> => {
  try {
    // Criar usuário no Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const firebaseUser = userCredential.user;

    // Atualizar nome no perfil
    await updateProfile(firebaseUser, {
      displayName: name,
    });

    // Criar documento do usuário no Firestore
    const user: User = {
      id: firebaseUser.uid,
      name,
      email: firebaseUser.email || email,
      password: '', // Não armazenamos senha no Firestore (Firebase cuida disso)
      createdAt: new Date().toISOString(),
    };

    await setDoc(doc(db, 'users', firebaseUser.uid), {
      name,
      email: user.email,
      createdAt: user.createdAt,
    });

    return {
      success: true,
      message: 'Cadastro realizado com sucesso!',
      user,
    };
  } catch (error: any) {
    console.error('Erro ao registrar usuário:', error);

    let message = 'Erro ao criar conta. Tente novamente.';

    if (error.code === 'auth/email-already-in-use') {
      message = 'Este email já está cadastrado.';
    } else if (error.code === 'auth/weak-password') {
      message = 'A senha deve ter pelo menos 6 caracteres.';
    } else if (error.code === 'auth/invalid-email') {
      message = 'Email inválido.';
    }

    return { success: false, message };
  }
};

/**
 * Fazer login
 */
export const loginUser = async (
  email: string,
  password: string
): Promise<{ success: boolean; message: string; user?: User }> => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const firebaseUser = userCredential.user;

    // Buscar dados do usuário no Firestore
    const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
    const userData = userDoc.data();

    const user: User = {
      id: firebaseUser.uid,
      name: firebaseUser.displayName || userData?.name || 'Usuário',
      email: firebaseUser.email || email,
      password: '',
      createdAt: userData?.createdAt || new Date().toISOString(),
    };

    return {
      success: true,
      message: 'Login realizado com sucesso!',
      user,
    };
  } catch (error: any) {
    console.error('Erro ao fazer login:', error);

    let message = 'Email ou senha incorretos.';

    if (error.code === 'auth/user-not-found') {
      message = 'Usuário não encontrado.';
    } else if (error.code === 'auth/wrong-password') {
      message = 'Senha incorreta.';
    } else if (error.code === 'auth/invalid-email') {
      message = 'Email inválido.';
    } else if (error.code === 'auth/too-many-requests') {
      message = 'Muitas tentativas. Tente novamente mais tarde.';
    }

    return { success: false, message };
  }
};

/**
 * Fazer logout
 */
export const logoutUser = async (): Promise<void> => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error('Erro ao fazer logout:', error);
  }
};

/**
 * Converter FirebaseUser em User
 */
export const firebaseUserToUser = async (firebaseUser: FirebaseUser): Promise<User> => {
  const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
  const userData = userDoc.data();

  return {
    id: firebaseUser.uid,
    name: firebaseUser.displayName || userData?.name || 'Usuário',
    email: firebaseUser.email || '',
    password: '',
    createdAt: userData?.createdAt || new Date().toISOString(),
  };
};
