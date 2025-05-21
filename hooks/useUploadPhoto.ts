import { useGetParticipantById } from '@/services/queries/fetchParticipants';
import { uploadPhoto } from '@/services/queries/uploadPhoto';
import { useMutation } from '@tanstack/react-query';

export function useUploadPhoto(participantId: string) {
  const { refetch: refetchParticipant } = useGetParticipantById(participantId);

  return useMutation({
    mutationFn: uploadPhoto,
    onSuccess: () => refetchParticipant(),
    onError: () => refetchParticipant(),
  });
}
