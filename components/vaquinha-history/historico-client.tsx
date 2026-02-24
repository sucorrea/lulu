'use client';
import dynamic from 'next/dynamic';
import { Suspense, useCallback, useEffect, useMemo, useState } from 'react';

import { Plus, TrashIcon } from 'lucide-react';
import { toast } from 'sonner';

import ErrorState from '@/components/error-state';
import { Button } from '@/components/ui/button';
import { LiveAnnounce } from '@/components/ui/live-announce';
import { Skeleton } from '@/components/ui/skeleton';

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
import Header from '../layout/header';
import PageLayout from '../layout/page-layout';
import BirthdayPersonFilter from './birthday-person-filter';
import VaquinhaHistoryTimeline from './timeline';
import TimelineSkeleton from './timeline-skeleton';
import YearFilter from './year-filter';

const VaquinhaHistoryFormDialog = dynamic(() => import('./form-dialog'), {
  ssr: false,
});

export const HistoricoClient = () => {
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [selectedBirthdayPerson, setSelectedBirthdayPerson] = useState<
    string | null
  >(null);
  const [announcement, setAnnouncement] = useState<string>('');
  const [editingItem, setEditingItem] = useState<VaquinhaHistory | null>(null);

  const { isLoading: isLoadingAuth, user: isAuthenticated } =
    useUserVerification();

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

  const history = useMemo(() => {
    if (!baseHistory) {
      return [];
    }
    if (!selectedBirthdayPerson) {
      return baseHistory;
    }
    return baseHistory.filter(
      (item) => item.birthdayPersonName === selectedBirthdayPerson
    );
  }, [baseHistory, selectedBirthdayPerson]);

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

  useEffect(() => {
    if (!isDialogOpen) {
      setEditingItem(null);
    }
  }, [isDialogOpen]);

  useEffect(() => {
    if (
      selectedBirthdayPerson &&
      !availableBirthdayPersons.includes(selectedBirthdayPerson)
    ) {
      setSelectedBirthdayPerson(null);
    }
  }, [availableBirthdayPersons, selectedBirthdayPerson]);

  useEffect(() => {
    const parts: string[] = [];
    if (selectedYear !== null) {
      parts.push(`ano ${selectedYear}`);
    }
    if (selectedBirthdayPerson) {
      parts.push(`aniversariante ${selectedBirthdayPerson}`);
    }
    setAnnouncement(
      parts.length > 0
        ? `Filtrando histórico por ${parts.join(' e ')}`
        : 'Mostrando todos os registros'
    );
  }, [selectedYear, selectedBirthdayPerson]);

  if (isLoading) {
    return (
      <PageLayout>
        <div className="space-y-2">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-5 w-96" />
        </div>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <Skeleton className="h-10 w-40" />
          <Skeleton className="h-10 w-48" />
        </div>
        <TimelineSkeleton />
      </PageLayout>
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
      <PageLayout>
        <Header
          title="Histórico de Vaquinhas"
          description="Acompanhe quem foi responsável pelas vaquinhas ao longo dos anos"
        />
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex flex-col sm:flex-row gap-4 flex-wrap">
            {availableYears && availableYears.length > 0 && (
              <YearFilter
                years={availableYears}
                selectedYear={selectedYear}
                onYearChange={setSelectedYear}
              />
            )}
            {availableBirthdayPersons.length > 0 && (
              <BirthdayPersonFilter
                persons={availableBirthdayPersons}
                selectedPerson={selectedBirthdayPerson}
                onPersonChange={setSelectedBirthdayPerson}
              />
            )}
          </div>
          {isAuthenticated && (
            <Button
              onClick={(e) => {
                (e.currentTarget as HTMLElement)?.blur();
                handleAddClick();
              }}
            >
              <Plus className="h-4 w-4 mr-2" aria-hidden="true" />
              Adicionar Registro
            </Button>
          )}
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
          onOpenChange={setDialogOpen}
          onSubmit={handleSubmit}
          participants={sortedParticipants}
          editingItem={editingItem}
          isLoading={addMutation.isPending || updateMutation.isPending}
        />
      </PageLayout>
    </>
  );
};

export default HistoricoClient;
