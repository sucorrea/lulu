import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  VaquinhaHistory,
  VaquinhaHistoryInput,
  fetchAllVaquinhaHistory,
  fetchVaquinhaHistoryById,
  fetchVaquinhaHistoryByYear,
  fetchVaquinhaHistoryByResponsible,
  fetchVaquinhaHistoryByBirthdayPerson,
  fetchAvailableYears,
  addVaquinhaHistory,
  updateVaquinhaHistory,
  deleteVaquinhaHistory,
} from '../vaquinhaHistory';

export const useGetAllVaquinhaHistory = () => {
  return useQuery<VaquinhaHistory[]>({
    queryKey: ['vaquinha-history'],
    queryFn: fetchAllVaquinhaHistory,
    retry: 2,
  });
};

export const useGetVaquinhaHistoryById = (id: string) => {
  return useQuery<VaquinhaHistory | null>({
    queryKey: ['vaquinha-history', id],
    queryFn: () => fetchVaquinhaHistoryById(id),
    enabled: !!id,
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

export const useGetVaquinhaHistoryByResponsible = (responsibleId: number) => {
  return useQuery<VaquinhaHistory[]>({
    queryKey: ['vaquinha-history', 'responsible', responsibleId],
    queryFn: () => fetchVaquinhaHistoryByResponsible(responsibleId),
    enabled: !!responsibleId,
    retry: 2,
  });
};

export const useGetVaquinhaHistoryByBirthdayPerson = (
  birthdayPersonId: number
) => {
  return useQuery<VaquinhaHistory[]>({
    queryKey: ['vaquinha-history', 'birthday-person', birthdayPersonId],
    queryFn: () => fetchVaquinhaHistoryByBirthdayPerson(birthdayPersonId),
    enabled: !!birthdayPersonId,
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
