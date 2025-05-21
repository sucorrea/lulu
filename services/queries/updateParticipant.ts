import { Person } from '@/components/lulus/types';
import { useMutation } from '@tanstack/react-query';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { useGetParticipantById } from './fetchParticipants';

export async function updateParticipantData(
  participantId: string,
  updatedData: Partial<Person>
) {
  const participantRef = doc(db, 'participants', participantId);

  await updateDoc(participantRef, updatedData);
}

export function useUpdateParticipantData(participantId: string) {
  const { refetch: refetchParticipant } = useGetParticipantById(participantId);

  return useMutation({
    mutationFn: ({ updatedData }: { updatedData: Partial<Person> }) =>
      updateParticipantData(participantId, updatedData),
    onSuccess: () => refetchParticipant(),
    onError: () => {
      console.log('Error updating participant data');
    },
  });
}
