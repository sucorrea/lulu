import { useCallback, useMemo, useState } from 'react';

import { TrashIcon } from 'lucide-react';
import { toast } from 'sonner';

import { useDisclosure } from '@/hooks/use-disclosure';
import { useUserVerification } from '@/hooks/user-verify';
import { useGetAllParticipants } from '@/services/queries/fetchParticipants';
import {
  useAddVaquinhaHistory,
  useDeleteVaquinhaHistory,
  useGetAllVaquinhaHistory,
  useGetAvailableYears,
  useGetVaquinhaHistoryByYear,
  useUpdateVaquinhaHistory,
} from '@/services/queries/vaquinhaHistory';
import { VaquinhaHistory } from '@/services/vaquinhaHistory';

export const useHistorico = () => {
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [selectedBirthdayPerson, setSelectedBirthdayPerson] = useState<
    string | null
  >(null);
  const [editingItem, setEditingItem] = useState<VaquinhaHistory | null>(null);

  const { isLoading: isLoadingAuth, isAdmin } = useUserVerification();

  const { data: participants, isLoading: isLoadingParticipants } =
    useGetAllParticipants();

  const { data: availableYears, isLoading: isLoadingYears } =
    useGetAvailableYears();

  const {
    isOpen: isDialogOpen,
    onOpen: onOpenDialog,
    onClose: onCloseDialog,
    setOpen: setDialogOpen,
  } = useDisclosure();

  const {
    data: allHistory,
    isLoading: isLoadingAllHistory,
    isError: isErrorAll,
    refetch: refetchAll,
  } = useGetAllVaquinhaHistory();

  const {
    data: filteredHistory,
    isLoading: isLoadingFilteredHistory,
    isError: isErrorFiltered,
    refetch: refetchFiltered,
  } = useGetVaquinhaHistoryByYear(selectedYear);

  const addMutation = useAddVaquinhaHistory();
  const updateMutation = useUpdateVaquinhaHistory();
  const deleteMutation = useDeleteVaquinhaHistory();

  const isLoading = useMemo(
    () =>
      isLoadingAuth ||
      isLoadingParticipants ||
      isLoadingYears ||
      (selectedYear === null ? isLoadingAllHistory : isLoadingFilteredHistory),
    [
      isLoadingAuth,
      isLoadingParticipants,
      isLoadingYears,
      selectedYear,
      isLoadingAllHistory,
      isLoadingFilteredHistory,
    ]
  );

  const isError = useMemo(
    () => (selectedYear === null ? isErrorAll : isErrorFiltered),
    [selectedYear, isErrorAll, isErrorFiltered]
  );

  const baseHistory = useMemo(
    () => (selectedYear === null ? allHistory : filteredHistory),
    [selectedYear, allHistory, filteredHistory]
  );

  const availableBirthdayPersons = useMemo(() => {
    if (!baseHistory) {
      return [];
    }
    const names = new Set(
      baseHistory.map((item) => item.birthdayPersonName).filter(Boolean)
    );
    return Array.from(names).sort((a, b) => a.localeCompare(b));
  }, [baseHistory]);

  const effectiveBirthdayPerson = useMemo(
    () =>
      selectedBirthdayPerson &&
      availableBirthdayPersons.includes(selectedBirthdayPerson)
        ? selectedBirthdayPerson
        : null,
    [selectedBirthdayPerson, availableBirthdayPersons]
  );

  const history = useMemo(() => {
    if (!baseHistory) {
      return [];
    }
    if (!effectiveBirthdayPerson) {
      return baseHistory;
    }
    return baseHistory.filter(
      (item) => item.birthdayPersonName === effectiveBirthdayPerson
    );
  }, [baseHistory, effectiveBirthdayPerson]);

  const announcement = useMemo(() => {
    const parts: string[] = [];
    if (selectedYear !== null) {
      parts.push(`ano ${selectedYear}`);
    }
    if (effectiveBirthdayPerson) {
      parts.push(`aniversariante ${effectiveBirthdayPerson}`);
    }
    return parts.length > 0
      ? `Filtrando histórico por ${parts.join(' e ')}`
      : 'Mostrando todos os registros';
  }, [selectedYear, effectiveBirthdayPerson]);

  const sortedParticipants = useMemo(
    () =>
      participants
        ? [...participants].sort((a, b) => a.name.localeCompare(b.name))
        : [],
    [participants]
  );

  const handleAddClick = useCallback(() => {
    setEditingItem(null);
    onOpenDialog();
  }, [onOpenDialog]);

  const handleEditClick = useCallback(
    (item: VaquinhaHistory) => {
      setEditingItem(item);
      onOpenDialog();
    },
    [onOpenDialog]
  );

  const handleDeleteClick = useCallback(
    async (id: string) => {
      toast.warning('Excluir registro', {
        position: 'top-right',
        description:
          'Tem certeza que deseja excluir este registro? Esta ação não pode ser desfeita.',
        cancel: {
          label: 'Cancelar',
          onClick: () => {
            toast.dismiss();
          },
        },
        action: {
          label: 'Excluir',
          onClick: () => {
            deleteMutation.mutate(id, {
              onSuccess: () => {
                toast.success('Registro excluído com sucesso');
              },
              onError: () => {
                toast.error('Erro ao excluir registro. Tente novamente.');
              },
            });
          },
        },
        icon: <TrashIcon className="h-4 w-4" />,
        duration: 10000,
      });
    },
    [deleteMutation]
  );

  const handleSubmit = useCallback(
    async (data: Parameters<typeof addMutation.mutateAsync>[0]) => {
      const cleanData = Object.fromEntries(
        Object.entries(data).filter(([_, value]) => value !== undefined)
      ) as Parameters<typeof addMutation.mutateAsync>[0];

      try {
        if (editingItem) {
          await updateMutation.mutateAsync({
            id: editingItem.id,
            data: cleanData,
          });
          toast.success('Registro atualizado com sucesso');
        } else {
          await addMutation.mutateAsync(cleanData);
          toast.success('Registro adicionado com sucesso');
        }
        onCloseDialog();
        setEditingItem(null);
      } catch {
        if (editingItem) {
          toast.error('Erro ao atualizar registro. Tente novamente.');
        } else {
          toast.error('Erro ao adicionar registro. Tente novamente.');
        }
      }
    },
    [editingItem, addMutation, updateMutation, onCloseDialog]
  );

  const handleRetry = useCallback(() => {
    if (selectedYear === null) {
      refetchAll();
    } else {
      refetchFiltered();
    }
  }, [selectedYear, refetchAll, refetchFiltered]);

  const handleDialogOpenChange = useCallback(
    (open: boolean) => {
      setDialogOpen(open);
      if (!open) {
        setEditingItem(null);
      }
    },
    [setDialogOpen]
  );

  return {
    // state
    selectedYear,
    setSelectedYear,
    selectedBirthdayPerson,
    setSelectedBirthdayPerson,
    editingItem,
    // auth
    isAdmin,
    // loading / error
    isLoading,
    isError,
    // data
    history,
    availableYears,
    availableBirthdayPersons,
    effectiveBirthdayPerson,
    sortedParticipants,
    announcement,
    // dialog
    isDialogOpen,
    handleDialogOpenChange,
    // mutations loading
    isMutating: addMutation.isPending || updateMutation.isPending,
    // handlers
    handleAddClick,
    handleEditClick,
    handleDeleteClick,
    handleSubmit,
    handleRetry,
  };
};
