'use client';
import { useCallback, useMemo, useState } from 'react';

import { CheckCircle2, Dices, Loader2, RefreshCw, Save } from 'lucide-react';
import { toast } from 'sonner';

import ErrorState from '@/components/error-state';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useDisclosure } from '@/hooks/use-disclosure';
import { useUserVerification } from '@/hooks/user-verify';
import { realizarSorteio, SorteioResult } from '@/lib/sorteio';
import { useGetAllParticipants } from '@/services/queries/fetchParticipants';
import {
  useBatchAddVaquinhaHistory,
  useGetVaquinhaHistoryByYear,
} from '@/services/queries/vaquinhaHistory';
import type {
  VaquinhaHistory,
  VaquinhaHistoryInput,
} from '@/services/vaquinhaHistory';

import { ParticipantSelection } from './participant-selection';
import { SorteioConfirmDialog } from './sorteio-confirm-dialog';
import { SorteioResultPreview } from './sorteio-result-preview';
import { YearSelector } from './year-selector';
import { Person } from '../lulus/types';
import Header from '../layout/header';
import PageLayout from '../layout/page-layout';

const LOADING_SKELETON_KEYS = [
  'loading-skeleton-1',
  'loading-skeleton-2',
  'loading-skeleton-3',
  'loading-skeleton-4',
  'loading-skeleton-5',
  'loading-skeleton-6',
] as const;

type SorteioStep = 'selection' | 'preview' | 'saved';

export const SorteioClient = () => {
  const [selectedYear, setSelectedYear] = useState<number>(
    new Date().getFullYear() + 1
  );
  const [selectedParticipantIds, setSelectedParticipantIds] = useState<
    Set<number>
  >(new Set());
  const [sorteioResult, setSorteioResult] = useState<SorteioResult | null>(
    null
  );
  const [step, setStep] = useState<SorteioStep>('selection');

  const { user: isAuthenticated, isLoading: isLoadingAuth } =
    useUserVerification();

  const {
    data: participants,
    isLoading: isLoadingParticipants,
    isError: isErrorParticipants,
    refetch: refetchParticipants,
  } = useGetAllParticipants();

  const previousYear = selectedYear - 1;
  const { data: previousYearHistory, isLoading: isLoadingPreviousHistory } =
    useGetVaquinhaHistoryByYear(previousYear);

  const {
    data: currentYearHistory,
    isLoading: isLoadingCurrentHistory,
    refetch: refetchCurrentHistory,
  } = useGetVaquinhaHistoryByYear(selectedYear);

  const batchAddMutation = useBatchAddVaquinhaHistory();

  const {
    isOpen: isConfirmDialogOpen,
    onOpen: onOpenConfirmDialog,
    onClose: onCloseConfirmDialog,
    setOpen: setConfirmDialogOpen,
  } = useDisclosure();

  const sortedParticipants = useMemo(
    () =>
      participants
        ? [...participants].sort((a, b) => a.name.localeCompare(b.name))
        : [],
    [participants]
  );

  const hasExistingDraw = useMemo(
    () => (currentYearHistory?.length ?? 0) > 0,
    [currentYearHistory]
  );

  const isLoading =
    isLoadingAuth || isLoadingParticipants || isLoadingCurrentHistory;

  const handleToggleParticipant = useCallback((id: number) => {
    setSelectedParticipantIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }, []);

  const handleSelectAll = useCallback(() => {
    if (!participants) {
      return;
    }
    setSelectedParticipantIds(new Set(participants.map((p) => p.id)));
  }, [participants]);

  const handleClearSelection = useCallback(() => {
    setSelectedParticipantIds(new Set());
  }, []);

  const handleRunSorteio = useCallback(() => {
    if (!participants) {
      return;
    }

    const selectedParticipants = participants.filter((p: Person) =>
      selectedParticipantIds.has(p.id)
    );

    try {
      const result = realizarSorteio(
        selectedParticipants,
        previousYearHistory ?? []
      );

      setSorteioResult(result);
      setStep('preview');

      if (result.relaxed) {
        toast.warning(
          'Não foi possível evitar repetições do ano anterior. O sorteio foi gerado apenas com a regra de não pegar a si mesma.',
          { duration: 8000 }
        );
      } else {
        toast.success('Sorteio realizado com sucesso!');
      }
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'Erro ao realizar o sorteio'
      );
    }
  }, [participants, selectedParticipantIds, previousYearHistory]);

  const handleReSorteio = useCallback(() => {
    handleRunSorteio();
  }, [handleRunSorteio]);

  const handleBackToSelection = useCallback(() => {
    setSorteioResult(null);
    setStep('selection');
  }, []);

  const handleConfirmSave = useCallback(async () => {
    if (!sorteioResult) {
      return;
    }

    if (hasExistingDraw) {
      toast.error(
        `O sorteio de ${selectedYear} já foi confirmado e não pode ser alterado.`
      );
      return;
    }

    const items: VaquinhaHistoryInput[] = sorteioResult.pairs.map((pair) => {
      const birthdayPerson = participants?.find(
        (p) => p.id === pair.birthdayPersonId
      );
      return {
        year: selectedYear,
        responsibleId: pair.responsibleId,
        responsibleName: pair.responsibleName,
        birthdayPersonId: pair.birthdayPersonId,
        birthdayPersonName: pair.birthdayPersonName,
        birthdayDate: birthdayPerson ? String(birthdayPerson.date) : undefined,
      };
    });

    try {
      await batchAddMutation.mutateAsync(items);
      toast.success(
        `Sorteio de ${selectedYear} salvo com ${items.length} atribuições!`
      );
      setStep('saved');
      onCloseConfirmDialog();
      refetchCurrentHistory();
    } catch {
      toast.error('Erro ao salvar o sorteio. Tente novamente.');
    }
  }, [
    sorteioResult,
    selectedYear,
    hasExistingDraw,
    participants,
    batchAddMutation,
    onCloseConfirmDialog,
    refetchCurrentHistory,
  ]);

  if (isLoading) {
    return (
      <PageLayout>
        <div className="space-y-2">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-5 w-96" />
        </div>
        <Skeleton className="h-10 w-40" />
        <div className="space-y-3">
          {LOADING_SKELETON_KEYS.map((key) => (
            <Skeleton key={key} className="h-12 w-full" />
          ))}
        </div>
      </PageLayout>
    );
  }

  if (isErrorParticipants) {
    return (
      <ErrorState
        title="Erro ao carregar participantes"
        message="Não foi possível carregar a lista de participantes. Verifique sua conexão e tente novamente."
        onRetry={() => refetchParticipants()}
      />
    );
  }

  return (
    <PageLayout>
      <Header
        title="Sorteio da Vaquinha"
        description="Selecione quem confirmou participação e realize o sorteio"
      />
      <div className="max-w-4xl px-4">
        <YearSelector selectedYear={selectedYear} onChange={setSelectedYear} />
      </div>

      {hasExistingDraw && step === 'selection' && (
        <div className="mb-6 rounded-lg border border-amber-300 bg-amber-50 p-4 dark:border-amber-700 dark:bg-amber-950">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="h-5 w-5 text-amber-600 dark:text-amber-400" />
            <div className="flex-1">
              <p className="font-medium text-amber-800 dark:text-amber-200">
                Sorteio de {selectedYear} já realizado
              </p>
              <p className="text-sm text-amber-600 dark:text-amber-400">
                {currentYearHistory?.length} atribuições encontradas.
              </p>
            </div>
          </div>
        </div>
      )}

      {hasExistingDraw && step === 'selection' && currentYearHistory && (
        <SorteioResultPreview
          pairs={currentYearHistory.map((h: VaquinhaHistory) => ({
            responsibleId: h.responsibleId,
            responsibleName: h.responsibleName,
            birthdayPersonId: h.birthdayPersonId,
            birthdayPersonName: h.birthdayPersonName,
            birthdayDate: h.birthdayDate,
          }))}
          relaxed={false}
          isSaved
        />
      )}

      {!hasExistingDraw && step === 'selection' && (
        <>
          <ParticipantSelection
            participants={sortedParticipants}
            selectedIds={selectedParticipantIds}
            onToggle={handleToggleParticipant}
            onSelectAll={handleSelectAll}
            onClearSelection={handleClearSelection}
          />

          {isAuthenticated && (
            <div className="mt-6 flex">
              <Button
                size="sm"
                disabled={
                  selectedParticipantIds.size < 2 || isLoadingPreviousHistory
                }
                onClick={handleRunSorteio}
              >
                {isLoadingPreviousHistory ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Dices className="h-4 w-4 mr-2" />
                )}
                Realizar Sorteio ({selectedParticipantIds.size} participantes)
              </Button>
            </div>
          )}
        </>
      )}

      {step === 'preview' && sorteioResult && (
        <>
          <SorteioResultPreview
            pairs={sorteioResult.pairs}
            relaxed={sorteioResult.relaxed}
          />

          {isAuthenticated && (
            <div className="mt-6 flex flex-col gap-3">
              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  variant="secondary"
                  onClick={handleReSorteio}
                  className="w-full sm:w-auto"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Sortear Novamente
                </Button>
                <Button
                  onClick={onOpenConfirmDialog}
                  className="w-full sm:w-auto"
                >
                  <Save className="h-4 w-4 mr-2" />
                  Confirmar e Salvar
                </Button>
              </div>
              <Button
                variant="outline"
                onClick={handleBackToSelection}
                className="w-full sm:w-auto sm:self-start"
              >
                Voltar à Seleção
              </Button>
            </div>
          )}
        </>
      )}

      {step === 'saved' && currentYearHistory && (
        <div className="space-y-4">
          <div className="rounded-lg border border-green-300 bg-green-50 p-4 dark:border-green-700 dark:bg-green-950">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
              <p className="font-medium text-green-800 dark:text-green-200">
                Sorteio de {selectedYear} salvo com sucesso!
              </p>
            </div>
          </div>
          <SorteioResultPreview
            pairs={currentYearHistory.map((h) => ({
              responsibleId: h.responsibleId,
              responsibleName: h.responsibleName,
              birthdayPersonId: h.birthdayPersonId,
              birthdayPersonName: h.birthdayPersonName,
              birthdayDate: h.birthdayDate,
            }))}
            relaxed={false}
            isSaved
          />
        </div>
      )}

      <SorteioConfirmDialog
        open={isConfirmDialogOpen}
        onOpenChange={setConfirmDialogOpen}
        onClose={onCloseConfirmDialog}
        onConfirm={handleConfirmSave}
        selectedYear={selectedYear}
        pairCount={sorteioResult?.pairs.length ?? 0}
        hasRelaxed={sorteioResult?.relaxed ?? false}
        isPending={batchAddMutation.isPending}
      />
    </PageLayout>
  );
};

export default SorteioClient;
