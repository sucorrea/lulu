import { AlertCircle } from 'lucide-react';
import { AuditLog } from '@/services/audit';
import { Card, CardContent } from '@/components/ui/card';
import { AuditLogItem } from './audit-log-item';
import { AuditLogSkeleton } from './audit-log-skeleton';

interface AuditLogListProps {
  logs: AuditLog[];
  isLoading?: boolean;
  showParticipantName?: boolean;
  getParticipantName?: (participantId: number) => string;
}

export const AuditLogList = ({
  logs,
  isLoading,
  showParticipantName,
  getParticipantName,
}: Readonly<AuditLogListProps>) => {
  if (isLoading) {
    return <AuditLogSkeleton />;
  }

  if (logs.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-lg font-medium mb-2">Nenhum registro encontrado</p>
          <p className="text-muted-foreground">
            Não há alterações registradas ainda
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-0 gap-2">
      {logs.map((log) => (
        <AuditLogItem
          key={log.id}
          log={log}
          showParticipantName={showParticipantName}
          participantName={
            showParticipantName && log.participantId && getParticipantName
              ? getParticipantName(log.participantId)
              : undefined
          }
        />
      ))}
    </div>
  );
};

export default AuditLogList;
