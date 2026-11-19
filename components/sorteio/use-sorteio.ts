import { useCallback, useMemo, useState } from 'react';

import { toast } from 'sonner';

import { useDisclosure } from '@/hooks/use-disclosure';
import { useUserVerification } from '@/hooks/user-verify';
import { realizarSorteio, SorteioPair, SorteioResult } from '@/lib/sorteio';
import { useGetAllParticipants } from '@/services/queries/fetchParticipants';
import {
  useBatchAddVaquinhaHistory,
  useGetVaquinhaHistoryByYear,
} from '@/services/queries/vaquinhaHistory';
import type {
  VaquinhaHistory,
  VaquinhaHistoryInput,
} from '@/services/vaquinhaHistory';

import { Person } from '../lulus/types';

export type SorteioStep = 'selection' | 'preview' | 'saved';

export const toSorteioPairs = (history: VaquinhaHistory[]): SorteioPair[] =>
  history.map((h) => ({
    responsibleId: h.responsibleId,
    responsibleName: h.responsibleName,
    birthdayPersonId: h.birthdayPersonId,
    birthdayPersonName: h.birthdayPersonName,
    birthdayDate: h.birthdayDate,
  }));

const toHistoryInputs = (
  result: SorteioResult,
  year: number,
  participants: Person[] | undefined
): VaquinhaHistoryInput[] =>
  result.pairs.map((pair) => {
    const birthdayPerson = participants?.find(
      (p) => p.id === pair.birthdayPersonId
    );
    return {
      year,
      responsibleId: pair.responsibleId,
      responsibleName: pair.responsibleName,
      birthdayPersonId: pair.birthdayPersonId,
      birthdayPersonName: pair.birthdayPersonName,
      birthdayDate: birthdayPerson ? String(birthdayPerson.date) : undefined,
    };
  });

export const useSorteio = () => {
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

  const { isAdmin, isLoading: isLoadingAuth } = useUserVerification();

  const {
    data: participants,
    isLoading: isLoadingParticipants,
    isError: isErrorParticipants,
    refetch: refetchParticipants,
  } = useGetAllParticipants();

  const { data: previousYearHistory, isLoading: isLoadingPreviousHistory } =
    useGetVaquinhaHistoryByYear(selectedYear - 1);

  const {
    data: currentYearHistory,
    isLoading: isLoadingCurrentHistory,
    refetch: refetchCurrentHistory,
  } = useGetVaquinhaHistoryByYear(selectedYear);

  const batchAddMutation = useBatchAddVaquinhaHistory();
  const confirmDialog = useDisclosure();
  const { onClose: closeConfirmDialog } = confirmDialog;

  const sortedParticipants = useMemo(
    () =>
      participants
        ? [...participants].sort((a, b) => a.name.localeCompare(b.name))
        : [],
    [participants]
  );

  const savedPairs = useMemo(
    () => (currentYearHistory ? toSorteioPairs(currentYearHistory) : null),
    [currentYearHistory]
  );

  const hasExistingDraw = (currentYearHistory?.length ?? 0) > 0;

  const isLoading =
    isLoadingAuth || isLoadingParticipants || isLoadingCurrentHistory;

  const toggleParticipant = useCallback((id: number) => {
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

  const selectAll = useCallback(() => {
    if (!participants) {
      return;
    }
    setSelectedParticipantIds(new Set(participants.map((p) => p.id)));
  }, [participants]);

  const clearSelection = useCallback(() => {
    setSelectedParticipantIds(new Set());
  }, []);

  const runSorteio = useCallback(() => {
    if (!participants) {
      return;
    }

    const selectedParticipants = participants.filter((p) =>
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

  const backToSelection = useCallback(() => {
    setSorteioResult(null);
    setStep('selection');
  }, []);

  const confirmSave = useCallback(async () => {
    if (!sorteioResult) {
      return;
    }

    if (hasExistingDraw) {
      toast.error(
        `O sorteio de ${selectedYear} já foi confirmado e não pode ser alterado.`
      );
      return;
    }

    const items = toHistoryInputs(sorteioResult, selectedYear, participants);

    try {
      await batchAddMutation.mutateAsync(items);
      toast.success(
        `Sorteio de ${selectedYear} salvo com ${items.length} atribuições!`
      );
      setStep('saved');
      closeConfirmDialog();
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
    closeConfirmDialog,
    refetchCurrentHistory,
  ]);

  return {
    isAdmin,
    isLoading,
    isErrorParticipants,
    refetchParticipants,
    isLoadingPreviousHistory,
    selectedYear,
    setSelectedYear,
    sortedParticipants,
    selectedParticipantIds,
    sorteioResult,
    step,
    hasExistingDraw,
    savedPairs,
    savedCount: currentYearHistory?.length ?? 0,
    isSaving: batchAddMutation.isPending,
    confirmDialog,
    toggleParticipant,
    selectAll,
    clearSelection,
    runSorteio,
    backToSelection,
    confirmSave,
  };
};
