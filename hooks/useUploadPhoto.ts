import { revalidateParticipantsCache } from '@/app/actions/participants';
import { useGetParticipantById } from '@/services/queries/fetchParticipants';
import { uploadPhoto } from '@/services/queries/uploadPhoto';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export const useUploadPhoto = (participantId: string) => {
  const queryClient = useQueryClient();
  const { refetch: refetchParticipant } = useGetParticipantById(participantId);

  return useMutation({
    mutationFn: uploadPhoto,
    onSuccess: () => {
      refetchParticipant();
      queryClient.invalidateQueries({ queryKey: ['get-all-participants'] });
      revalidateParticipantsCache();
    },
    onError: () => refetchParticipant(),
  });
};
