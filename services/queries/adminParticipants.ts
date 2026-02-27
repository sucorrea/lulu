import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  createParticipant,
  deleteParticipant,
  updateParticipantRole,
  fetchAllParticipantsAdmin,
} from '../participants-admin';
import type { Person, Role } from '@/components/lulus/types';

export const useGetAllParticipantsAdmin = () => {
  return useQuery({
    queryKey: ['admin-participants'],
    queryFn: fetchAllParticipantsAdmin,
    retry: 1,
  });
};

export const useCreateParticipant = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (
      data: Omit<Person, 'id' | 'editToken' | 'photoURL' | 'photoUpdatedAt'>
    ) => createParticipant(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-participants'] });
      queryClient.invalidateQueries({ queryKey: ['get-all-participants'] });
    },
  });
};

export const useDeleteParticipant = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (participantId: string) => deleteParticipant(participantId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-participants'] });
      queryClient.invalidateQueries({ queryKey: ['get-all-participants'] });
    },
  });
};

export const useUpdateParticipantRole = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      participantId,
      role,
    }: {
      participantId: string;
      role: Role;
    }) => updateParticipantRole(participantId, role),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-participants'] });
    },
  });
};
