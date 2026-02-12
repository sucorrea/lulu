'use client';

import { useMemo, useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchParticipants } from '@/services/queries/fetchParticipants';
import { Person } from '@/components/lulus/types';
import { AuditLogList } from '@/components/audit/AuditLogList';
import { FIELD_LABELS } from '@/components/audit/AuditLogList/constants';
import ErrorState from '@/components/error-state';
import { AuditFilters } from './AuditFilters';
import { useAuditFilters } from './useAuditFilters';
import { useAuditData } from './useAuditData';
import { ALL_PARTICIPANTS_VALUE } from './constants';

export const AuditPage = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const { filters, setParticipantId, setLimit, setSearch } = useAuditFilters();

  const { data: participants = [], isLoading: isLoadingParticipants } =
    useQuery({
      queryKey: ['participants'],
      queryFn: fetchParticipants,
      enabled: isMounted,
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
    isMounted && participants.length > 0
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
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="lulu-header text-2xl md:text-3xl">
          Histórico de Auditoria
        </h1>
        <p className="text-muted-foreground">
          Visualize todas as alterações realizadas nos dados dos participantes
        </p>
      </div>

      <AuditFilters
        selectedParticipant={filters.participantId}
        limitCount={filters.limit}
        searchTerm={filters.search}
        onParticipantChange={setParticipantId}
        onLimitChange={setLimit}
        onSearchChange={setSearch}
        isLoadingParticipants={!isMounted || isLoadingParticipants}
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
    </div>
  );
};
