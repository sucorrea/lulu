'use client';

import { CheckCircle2, Dices, Loader2, RefreshCw, Save } from 'lucide-react';

import ErrorState from '@/components/error-state';
import { Button } from '@/components/ui/button';

import { ParticipantSelection } from './participant-selection';
import { SorteioConfirmDialog } from './sorteio-confirm-dialog';
import { SorteioResultPreview } from './sorteio-result-preview';
import { SorteioSkeleton } from './sorteio-skeleton';
import { useSorteio } from './use-sorteio';
import { YearSelector } from './year-selector';
import Header from '../layout/header';
import PageLayout from '../layout/page-layout';

export const SorteioClient = () => {
  const {
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
    savedCount,
    isSaving,
    confirmDialog,
    toggleParticipant,
    selectAll,
    clearSelection,
    runSorteio,
    backToSelection,
    confirmSave,
  } = useSorteio();

  if (isLoading) {
    return <SorteioSkeleton />;
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

  const isSelecting = step === 'selection';

  return (
    <PageLayout>
      <Header
        title="Sorteio da Vaquinha"
        description="Selecione quem confirmou participação e realize o sorteio"
      />
      <div className="max-w-4xl px-4">
        <YearSelector selectedYear={selectedYear} onChange={setSelectedYear} />
      </div>

      {hasExistingDraw && isSelecting && (
        <div className="mb-6 rounded-lg border border-accent bg-surface-warm p-4">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="h-5 w-5 text-gold" />
            <div className="flex-1">
              <p className="font-medium text-gold">
                Sorteio de {selectedYear} já realizado
              </p>
              <p className="text-sm text-gold">
                {savedCount} atribuições encontradas.
              </p>
            </div>
          </div>
        </div>
      )}

      {hasExistingDraw && isSelecting && savedPairs && (
        <SorteioResultPreview pairs={savedPairs} relaxed={false} isSaved />
      )}

      {!hasExistingDraw && isSelecting && (
        <>
          <ParticipantSelection
            participants={sortedParticipants}
            selectedIds={selectedParticipantIds}
            onToggle={toggleParticipant}
            onSelectAll={selectAll}
            onClearSelection={clearSelection}
          />

          {isAdmin && (
            <div className="mt-6 flex">
              <Button
                size="sm"
                disabled={
                  selectedParticipantIds.size < 2 || isLoadingPreviousHistory
                }
                onClick={runSorteio}
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

          {isAdmin && (
            <div className="mt-6 flex flex-col gap-3">
              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  variant="secondary"
                  onClick={runSorteio}
                  className="w-full sm:w-auto"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Sortear Novamente
                </Button>
                <Button
                  onClick={confirmDialog.onOpen}
                  className="w-full sm:w-auto"
                >
                  <Save className="h-4 w-4 mr-2" />
                  Confirmar e Salvar
                </Button>
              </div>
              <Button
                variant="outline"
                onClick={backToSelection}
                className="w-full sm:w-auto sm:self-start"
              >
                Voltar à Seleção
              </Button>
            </div>
          )}
        </>
      )}

      {step === 'saved' && savedPairs && (
        <div className="space-y-4">
          <div className="rounded-lg border border-green-300 bg-green-50 p-4 dark:border-green-700 dark:bg-green-950">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
              <p className="font-medium text-green-800 dark:text-green-200">
                Sorteio de {selectedYear} salvo com sucesso!
              </p>
            </div>
          </div>
          <SorteioResultPreview pairs={savedPairs} relaxed={false} isSaved />
        </div>
      )}

      <SorteioConfirmDialog
        open={confirmDialog.isOpen}
        onOpenChange={confirmDialog.setOpen}
        onClose={confirmDialog.onClose}
        onConfirm={confirmSave}
        selectedYear={selectedYear}
        pairCount={sorteioResult?.pairs.length ?? 0}
        hasRelaxed={sorteioResult?.relaxed ?? false}
        isPending={isSaving}
      />
    </PageLayout>
  );
};

export default SorteioClient;
