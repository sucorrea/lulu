'use client';

import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchParticipants } from '@/services/queries/fetchParticipants';
import { Person } from '@/components/lulus/types';
import { AuditLogList } from '@/components/audit/audit-log-list';
import { FIELD_LABELS } from '@/components/audit/constants';
import ErrorState from '@/components/error-state';
import Header from '@/components/layout/header';
import PageLayout from '@/components/layout/page-layout';
import { AuditFilters } from './audit-filters';
import { useAuditFilters } from './use-audit-filters';
import { useAuditData } from './use-audit-data';
import { ALL_PARTICIPANTS_VALUE } from './constants';

const AuditPageContent = () => {
  const { filters, setParticipantId, setLimit, setSearch } = useAuditFilters();

  const { data: participants = [], isLoading: isLoadingParticipants } =
    useQuery({
      queryKey: ['participants'],
      queryFn: fetchParticipants,
    });

  const {
    auditLogs,
    isLoading: isLoadingAudit,
    error,
    isIndexBuilding,
    refetch,
  } = useAuditData(
    filters.participantId,
    filters.limit,
    participants.length > 0
  );

  const filteredLogs = useMemo(() => {
    if (!filters.search) {
      return auditLogs;
    }

    const searchLower = filters.search.toLowerCase();
    return auditLogs.filter((log) => {
      return (
        log.userName.toLowerCase().includes(searchLower) ||
        log.userEmail?.toLowerCase().includes(searchLower) ||
        log.changes.some((change) =>
          (FIELD_LABELS[change.field] || change.field)
            .toLowerCase()
            .includes(searchLower)
        )
      );
    });
  }, [auditLogs, filters.search]);

  const getParticipantName = (participantId: number): string => {
    const participant = participants.find(
      (p: Person) => p.id === participantId
    );
    return participant?.fullName || participant?.name || 'Participante';
  };

  return (
    <PageLayout>
      <Header
        title="Histórico de Auditoria"
        description="Visualize todas as alterações realizadas nos dados dos participantes"
      />
      <AuditFilters
        selectedParticipant={filters.participantId}
        limitCount={filters.limit}
        searchTerm={filters.search}
        participants={participants}
        onParticipantChange={setParticipantId}
        onLimitChange={setLimit}
        onSearchChange={setSearch}
        isLoadingParticipants={isLoadingParticipants}
      />

      {(() => {
        if (isIndexBuilding) {
          return (
            <ErrorState
              title="Índice do banco de dados em construção"
              message="O índice necessário para consultas de auditoria está sendo criado no Firebase. Isso pode levar alguns minutos. Por favor, aguarde e tente novamente em breve."
              onRetry={() => refetch()}
            />
          );
        }

        if (error) {
          const errorMessage =
            error.message ||
            'Não foi possível carregar os logs. Por favor, tente novamente.';
          return (
            <ErrorState
              title="Erro ao carregar logs de auditoria"
              message={errorMessage}
              onRetry={() => refetch()}
            />
          );
        }

        return (
          <AuditLogList
            logs={filteredLogs}
            isLoading={isLoadingParticipants || isLoadingAudit}
            showParticipantName={
              filters.participantId === ALL_PARTICIPANTS_VALUE
            }
            getParticipantName={getParticipantName}
          />
        );
      })()}
    </PageLayout>
  );
};

export default AuditPageContent;
