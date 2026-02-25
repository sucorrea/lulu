import { getIdTokenResult } from 'firebase/auth';
import { auth } from '@/services/firebase';

export const assertAdmin = async (): Promise<void> => {
  const currentUser = auth.currentUser;

  if (!currentUser) {
    throw new Error('Usuário não autenticado');
  }

  const tokenResult = await getIdTokenResult(currentUser, true);

  if (!tokenResult.claims.admin) {
    throw new Error('Acesso restrito a administradores');
  }
};
