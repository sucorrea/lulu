'use client';
import dynamic from 'next/dynamic';

import { Plus } from 'lucide-react';

import ErrorState from '@/components/error-state';
import { Button } from '@/components/ui/button';
import { LiveAnnounce } from '@/components/ui/live-announce';

import Header from '../layout/header';
import PageLayout from '../layout/page-layout';
import BirthdayPersonFilter from './birthday-person-filter';
import HistoricoSkeleton from './historico-skeleton';
import { useHistorico } from './hooks/use-historico';
import VaquinhaHistoryTimeline from './timeline';
import YearFilter from './year-filter';

const VaquinhaHistoryFormDialog = dynamic(() => import('./form-dialog'), {
  ssr: false,
});

export const HistoricoClient = () => {
  const {
    selectedYear,
    setSelectedYear,
    setSelectedBirthdayPerson,
    editingItem,
    isAdmin,
    isLoading,
    isError,
    history,
    availableYears,
    availableBirthdayPersons,
    effectiveBirthdayPerson,
    sortedParticipants,
    announcement,
    isDialogOpen,
    handleDialogOpenChange,
    isMutating,
    handleAddClick,
    handleEditClick,
    handleDeleteClick,
    handleSubmit,
    handleRetry,
  } = useHistorico();

  if (isLoading) {
    return <HistoricoSkeleton />;
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
                selectedPerson={effectiveBirthdayPerson}
                onPersonChange={setSelectedBirthdayPerson}
              />
            )}
          </div>
          {isAdmin && (
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

        <VaquinhaHistoryTimeline
          history={history || []}
          isAdmin={isAdmin}
          onEdit={handleEditClick}
          onDelete={handleDeleteClick}
        />
        <VaquinhaHistoryFormDialog
          open={isDialogOpen}
          onOpenChange={handleDialogOpenChange}
          onSubmit={handleSubmit}
          participants={sortedParticipants}
          editingItem={editingItem}
          isLoading={isMutating}
        />
      </PageLayout>
    </>
  );
};

export default HistoricoClient;
