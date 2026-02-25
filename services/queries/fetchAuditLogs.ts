import { useQuery } from '@tanstack/react-query';
import { getAuditLogs, getAuditLogsByUser, AuditLog } from '@/services/audit';

export const useAuditLogs = (
  participantId: number,
  limitCount: number = 20
) => {
  return useQuery({
    queryKey: ['audit-logs', participantId, limitCount],
    queryFn: () => getAuditLogs(participantId, limitCount),
    enabled: participantId > 0,
    staleTime: 5 * 60 * 1000,
  });
};

export const useAuditLogsByUser = (
  participantId: number,
  userId: string,
  limitCount: number = 20
) => {
  return useQuery({
    queryKey: ['audit-logs', participantId, userId, limitCount],
    queryFn: () => getAuditLogsByUser(participantId, userId, limitCount),
    enabled: participantId > 0 && !!userId,
    staleTime: 5 * 60 * 1000,
  });
};

export const useAllAuditLogs = (
  participantIds: number[],
  limitCount: number = 20
) => {
  return useQuery({
    queryKey: ['audit-logs-all', participantIds, limitCount],
    staleTime: 5 * 60 * 1000,
    queryFn: async () => {
      const allLogs: Array<AuditLog & { participantId: number }> = [];

      for (const participantId of participantIds) {
        const logs = await getAuditLogs(participantId, limitCount);
        allLogs.push(...logs.map((log) => ({ ...log, participantId })));
      }

      return allLogs.sort(
        (a, b) =>
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      );
    },
    enabled: participantIds.length > 0,
  });
};
