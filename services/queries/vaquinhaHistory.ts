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

/**
 * Hook para buscar todos os registros de histórico
 */
export const useGetAllVaquinhaHistory = () => {
  return useQuery<VaquinhaHistory[]>({
    queryKey: ['vaquinha-history'],
    queryFn: fetchAllVaquinhaHistory,
    retry: 2,
  });
};

/**
 * Hook para buscar um registro específico por ID
 */
export const useGetVaquinhaHistoryById = (id: string) => {
  return useQuery<VaquinhaHistory | null>({
    queryKey: ['vaquinha-history', id],
    queryFn: () => fetchVaquinhaHistoryById(id),
    enabled: !!id,
  });
};

/**
 * Hook para buscar histórico filtrado por ano
 */
export const useGetVaquinhaHistoryByYear = (year: number | null) => {
  return useQuery<VaquinhaHistory[]>({
    queryKey: ['vaquinha-history', 'year', year],
    queryFn: () => fetchVaquinhaHistoryByYear(year!),
    enabled: year !== null,
    retry: 2,
  });
};

/**
 * Hook para buscar histórico filtrado por responsável
 */
export const useGetVaquinhaHistoryByResponsible = (responsibleId: number) => {
  return useQuery<VaquinhaHistory[]>({
    queryKey: ['vaquinha-history', 'responsible', responsibleId],
    queryFn: () => fetchVaquinhaHistoryByResponsible(responsibleId),
    enabled: !!responsibleId,
    retry: 2,
  });
};

/**
 * Hook para buscar histórico filtrado por aniversariante
 */
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

/**
 * Hook para buscar anos disponíveis
 */
export const useGetAvailableYears = () => {
  return useQuery<number[]>({
    queryKey: ['vaquinha-history', 'years'],
    queryFn: fetchAvailableYears,
    retry: 2,
  });
};

/**
 * Hook para adicionar um novo registro de histórico
 */
export const useAddVaquinhaHistory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: VaquinhaHistoryInput) => addVaquinhaHistory(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vaquinha-history'] });
    },
  });
};

/**
 * Hook para atualizar um registro de histórico
 */
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

/**
 * Hook para deletar um registro de histórico
 */
export const useDeleteVaquinhaHistory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteVaquinhaHistory(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vaquinha-history'] });
    },
  });
};
