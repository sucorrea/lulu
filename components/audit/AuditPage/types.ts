import { AuditLog } from '@/services/audit';

export interface AuditFilters {
  participantId: string;
  limit: number;
  search: string;
}

export interface AuditFiltersProps {
  selectedParticipant: string;
  limitCount: number;
  searchTerm: string;
  onParticipantChange: (value: string) => void;
  onLimitChange: (value: number) => void;
  onSearchChange: (value: string) => void;
  isLoadingParticipants: boolean;
}

export interface UseAuditDataReturn {
  auditLogs: AuditLog[];
  isLoading: boolean;
  error: Error | null;

  isIndexBuilding: boolean;
  refetch: () => Promise<void>;
}
