'use client';

import { useState, useMemo, useCallback, Suspense, useEffect } from 'react';
import { Plus } from 'lucide-react';

import { useUserVerification } from '@/hooks/user-verify';
import { useGetAllParticipants } from '@/services/queries/fetchParticipants';
import {
  useGetAllVaquinhaHistory,
  useGetVaquinhaHistoryByYear,
  useGetAvailableYears,
  useAddVaquinhaHistory,
  useUpdateVaquinhaHistory,
  useDeleteVaquinhaHistory,
} from '@/services/queries/vaquinhaHistory';
import ErrorState from '@/components/error-state';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { LiveAnnounce } from '@/components/ui/live-announce';
import {
  VaquinhaHistoryTimeline,
  TimelineSkeleton,
  YearFilter,
  VaquinhaHistoryFormDialog,
} from '@/components/vaquinha-history';
import { VaquinhaHistory } from '@/services/vaquinhaHistory';
import { useDisclosure } from '@/hooks/use-disclosure';

export const HistoricoClient = () => {
  const { isLoading: isLoadingAuth } = useUserVerification();
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const {
    isOpen: isDialogOpen,
    onOpen: onOpenDialog,
    onClose: onCloseDialog,
  } = useDisclosure();
  const [editingItem, setEditingItem] = useState<VaquinhaHistory | null>(null);
  const [announcement, setAnnouncement] = useState<string>('');

  const { data: participants, isLoading: isLoadingParticipants } =
    useGetAllParticipants();

  const { data: availableYears, isLoading: isLoadingYears } =
    useGetAvailableYears();

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

  const history = useMemo(
    () => (selectedYear === null ? allHistory : filteredHistory),
    [selectedYear, allHistory, filteredHistory]
  );

  const sortedParticipants = useMemo(
    () =>
      participants ? [...participants].sort((a, b) => a.name.localeCompare(b.name)) : [],
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
      if (
        confirm(
          'Tem certeza que deseja excluir este registro? Esta ação não pode ser desfeita.'
        )
      ) {
        await deleteMutation.mutateAsync(id);
      }
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
          setAnnouncement('Registro atualizado com sucesso');
        } else {
          await addMutation.mutateAsync(cleanData);
          setAnnouncement('Registro adicionado com sucesso');
        }
        onCloseDialog();
        setEditingItem(null);
      } catch {
        setAnnouncement('Erro ao salvar registro. Tente novamente.');
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

  useEffect(() => {
    if (selectedYear === null) {
      setAnnouncement('Mostrando todos os registros');
    } else {
      setAnnouncement(`Filtrando histórico por ano ${selectedYear}`);
    }
  }, [selectedYear, setAnnouncement]);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-8">
          <Skeleton className="h-9 w-64 mb-2" />
          <Skeleton className="h-5 w-96" />
        </div>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <Skeleton className="h-10 w-40" />
          <Skeleton className="h-10 w-48" />
        </div>
        <TimelineSkeleton />
      </div>
    );
  }

  if (isError) {
    return (
      <ErrorState
        title="Erro ao carregar histórico"
        message="Não foi possível carregar o histórico de vaquinhas. Verifique sua conexão e tente novamente."
        onRetry={handleRetry}
      />
    );
  }

  return (
    <>
      <LiveAnnounce message={announcement} politeness="polite" />
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Histórico de Vaquinhas</h1>
          <p className="text-muted-foreground">
            Acompanhe quem foi responsável pelas vaquinhas ao longo dos anos
          </p>
        </div>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          {availableYears && availableYears.length > 0 && (
            <YearFilter
              years={availableYears}
              selectedYear={selectedYear}
              onYearChange={setSelectedYear}
            />
          )}
          <Button onClick={handleAddClick}>
            <Plus className="h-4 w-4 mr-2" aria-hidden="true" />
            Adicionar Registro
          </Button>
        </div>

        <Suspense fallback={<TimelineSkeleton />}>
          <VaquinhaHistoryTimeline
            history={history || []}
            onEdit={handleEditClick}
            onDelete={handleDeleteClick}
          />
        </Suspense>
        <VaquinhaHistoryFormDialog
          open={isDialogOpen}
          onOpenChange={(open) => {
            if (open) {
              onOpenDialog();
            } else {
              onCloseDialog();
              setEditingItem(null);
            }
          }}
          onSubmit={handleSubmit}
          participants={sortedParticipants}
          editingItem={editingItem}
          isLoading={addMutation.isPending || updateMutation.isPending}
        />
      </div>
    </>
  );
};
