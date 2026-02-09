import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { getAuditLogs, getAllAuditLogs } from '@/services/audit';
import { ALL_PARTICIPANTS_VALUE } from './constants';
import { UseAuditDataReturn } from './types';

export const useAuditData = (
  participantId: string,
  limit: number,
  enabled: boolean = true
): UseAuditDataReturn => {
  const {
    data: auditLogs = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['audit-logs', participantId, limit],
    queryFn: async () => {
      if (participantId === ALL_PARTICIPANTS_VALUE) {
        const logs = await getAllAuditLogs(limit);
        return logs.map((log) => ({
          ...log,
          participantId: log.participantId ?? 0,
        }));
      } else {
        const participantIdNumber = Number(participantId);
        const logs = await getAuditLogs(participantIdNumber, limit);
        return logs.map((log) => ({
          ...log,
          participantId: participantIdNumber,
        }));
      }
    },
    enabled,
    retry: (failureCount, error) => {
      if (error instanceof Error && error.message.includes('not ready yet')) {
        return false;
      }
      return failureCount < 3;
    },
  });

  const isIndexBuilding = useMemo(() => {
    return error instanceof Error && error.message.includes('not ready yet');
  }, [error]);

  return {
    auditLogs,
    isLoading,
    error: error ?? null,
    isIndexBuilding,
    refetch: async () => {
      await refetch();
    },
  };
};
