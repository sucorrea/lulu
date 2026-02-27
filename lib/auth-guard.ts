import { getIdTokenResult } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth } from '@/services/firebase';
import { db } from '@/services/firebase';

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

export const assertOwnerOrAdmin = async (
  participantId: string
): Promise<void> => {
  const currentUser = auth.currentUser;

  if (!currentUser) {
    throw new Error('Usuário não autenticado');
  }

  const tokenResult = await getIdTokenResult(currentUser, true);

  if (tokenResult.claims.admin) {
    return;
  }

  const participantRef = doc(db, 'participants', participantId);
  const participantSnap = await getDoc(participantRef);

  if (!participantSnap.exists()) {
    throw new Error('Participante não encontrado');
  }

  const data = participantSnap.data();

  if (data.uid !== currentUser.uid) {
    throw new Error('Você só pode editar seu próprio perfil');
  }
};
