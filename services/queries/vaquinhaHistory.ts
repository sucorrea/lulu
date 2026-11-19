import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  VaquinhaHistory,
  VaquinhaHistoryInput,
  fetchAllVaquinhaHistory,
  fetchVaquinhaHistoryByYear,
  fetchAvailableYears,
  addVaquinhaHistory,
  updateVaquinhaHistory,
  deleteVaquinhaHistory,
  batchAddVaquinhaHistory,
} from '../vaquinhaHistory';

export const useGetAllVaquinhaHistory = () => {
  return useQuery<VaquinhaHistory[]>({
    queryKey: ['vaquinha-history'],
    queryFn: fetchAllVaquinhaHistory,
    retry: 2,
  });
};

export const useGetVaquinhaHistoryByYear = (year: number | null) => {
  return useQuery<VaquinhaHistory[]>({
    queryKey: ['vaquinha-history', 'year', year],
    queryFn: () => fetchVaquinhaHistoryByYear(year!),
    enabled: year !== null,
    retry: 2,
  });
};

export const useGetAvailableYears = () => {
  return useQuery<number[]>({
    queryKey: ['vaquinha-history', 'years'],
    queryFn: fetchAvailableYears,
    retry: 2,
  });
};

export const useAddVaquinhaHistory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: VaquinhaHistoryInput) => addVaquinhaHistory(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vaquinha-history'] });
    },
  });
};

export const useUpdateVaquinhaHistory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: Partial<VaquinhaHistoryInput>;
    }) => updateVaquinhaHistory(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vaquinha-history'] });
    },
  });
};

export const useDeleteVaquinhaHistory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteVaquinhaHistory(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vaquinha-history'] });
    },
  });
};

export type CurrentYearAssignments = {
  byResponsible: Record<number, VaquinhaHistory>;
  byBirthday: Record<number, VaquinhaHistory>;
};

const buildAssignmentsFromHistory = (
  history: VaquinhaHistory[]
): CurrentYearAssignments => {
  const byResponsible: Record<number, VaquinhaHistory> = {};
  const byBirthday: Record<number, VaquinhaHistory> = {};
  history.forEach((record) => {
    byResponsible[record.responsibleId] = record;
    byBirthday[record.birthdayPersonId] = record;
  });
  return { byResponsible, byBirthday };
};

export const useGetCurrentYearAssignments = () => {
  const currentYear = new Date().getFullYear();

  return useQuery({
    queryKey: ['vaquinha-history', 'current-year', currentYear],
    queryFn: async () => {
      const history = await fetchVaquinhaHistoryByYear(currentYear);
      return buildAssignmentsFromHistory(history);
    },
    retry: 2,
    staleTime: 5 * 60 * 1000,
  });
};

export type OrganizerAssignmentResult = {
  assignment: VaquinhaHistory | null;
  isLoading: boolean;
  isError: boolean;
};

export const useGetOrganizerForParticipant = (
  participantId: number
): OrganizerAssignmentResult => {
  const { data, isLoading, isError } = useGetCurrentYearAssignments();
  const assignment = data?.byBirthday[participantId] ?? null;
  return { assignment, isLoading, isError };
};

export const useBatchAddVaquinhaHistory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (items: VaquinhaHistoryInput[]) =>
      batchAddVaquinhaHistory(items),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vaquinha-history'] });
    },
  });
};
