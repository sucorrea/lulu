import { Person } from '@/components/lulus/types';
import { useMutation } from '@tanstack/react-query';
import { doc, updateDoc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { useGetParticipantById } from './fetchParticipants';
import { calculateDiff, createAuditLog, hasChanges } from '../audit';

export interface UpdateParticipantOptions {
  updatedData: Partial<Person>;
  userId?: string;
  userName?: string;
  userEmail?: string;
  auditMetadata?: {
    source?: string;
    ipAddress?: string;
    userAgent?: string;
  };
}

export const updateParticipantData = async (
  participantId: string,
  options: UpdateParticipantOptions
) => {
  const participantRef = doc(db, 'participants', participantId);
  const { updatedData, userId, userName, userEmail, auditMetadata } = options;

  let currentData: Partial<Person> | null = null;
  try {
    const docSnapshot = await getDoc(participantRef);
    if (docSnapshot.exists()) {
      currentData = docSnapshot.data() as Partial<Person>;
    }
  } catch (error) {
    console.warn(
      `Erro ao buscar dados atuais para diff. Prosseguindo sem auditoria: ${error}`
    );
  }

  await updateDoc(participantRef, updatedData);

  if (userId && userName && currentData) {
    try {
      const changes = calculateDiff(currentData, updatedData);

      if (hasChanges(changes)) {
        await createAuditLog(Number.parseInt(participantId, 10), {
          userId,
          userName,
          userEmail,
          changes,
          ...auditMetadata,
        });
      }
    } catch (auditError) {
      console.error('Erro ao criar audit log:', auditError);
    }
  }
};

export const useUpdateParticipantData = (participantId: string) => {
  const { refetch: refetchParticipant } = useGetParticipantById(participantId);

  return useMutation({
    mutationFn: (options: UpdateParticipantOptions) =>
      updateParticipantData(participantId, options),
    onSuccess: () => refetchParticipant(),
    onError: () => {
      console.log('Error updating participant data');
    },
  });
};
