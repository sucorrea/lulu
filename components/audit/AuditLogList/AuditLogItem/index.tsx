'use client';

import { memo } from 'react';
import { User, FileText, Clock } from 'lucide-react';
import { AuditLog } from '@/services/audit';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatValue, formatDateTime } from '../formatters';
import { FIELD_LABELS } from '../constants';

interface AuditLogItemProps {
  log: AuditLog;
  showParticipantName?: boolean;
  participantName?: string;
}

const AuditLogItemComponent = ({
  log,
  showParticipantName,
  participantName,
}: Readonly<AuditLogItemProps>) => {
  return (
    <Card className="mb-4 hover:shadow-lulu-md transition-shadow gap-2">
      <CardHeader className="pb-3">
        <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <User className="w-4 h-4 flex-shrink-0" />
              <span className="truncate">{log.userName}</span>
            </CardTitle>
            {log.userEmail && (
              <p className="text-sm text-muted-foreground mt-1 truncate">
                {log.userEmail}
              </p>
            )}
          </div>

          <div className="flex flex-col items-start sm:items-end gap-2">
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <Clock className="w-3 h-3 flex-shrink-0" />
              <span className="whitespace-nowrap">
                {formatDateTime(log.timestamp)}
              </span>
            </div>
            {showParticipantName && participantName && (
              <Badge variant="outline" className="text-xs">
                {participantName}
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {log.changes.map((change, index) => {
            const oldFormatted = formatValue(change.oldValue, change.fieldType);
            const newFormatted = formatValue(change.newValue, change.fieldType);
            const shouldDisplay = !(
              oldFormatted === 'Não informado' &&
              newFormatted === 'Não informado'
            );

            return (
              shouldDisplay && (
                <div
                  key={`${change.field}-${index}`}
                  className="flex items-start gap-3 py-2 border-b last:border-b-0"
                >
                  <FileText className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <span className="font-medium text-sm block">
                      {FIELD_LABELS[change.field] || change.field}
                    </span>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 mt-1 text-sm">
                      <span className="text-muted-foreground line-through break-words">
                        {oldFormatted}
                      </span>
                      <span className="text-muted-foreground hidden sm:inline">
                        →
                      </span>
                      <span className="font-medium text-foreground break-words">
                        {newFormatted}
                      </span>
                    </div>
                  </div>
                </div>
              )
            );
          })}
        </div>
        {log.metadata && (
          <div className="mt-4 pt-4 border-t">
            <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
              {log.metadata.source && (
                <div className="flex items-center gap-1">
                  <span className="font-medium">Origem:</span>
                  <Badge variant="secondary" className="text-xs">
                    {log.metadata.source}
                  </Badge>
                </div>
              )}
              {log.metadata.ipAddress && (
                <div className="flex items-center gap-1">
                  <span className="font-medium">IP:</span>
                  <span className="font-mono">{log.metadata.ipAddress}</span>
                </div>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export const AuditLogItem = memo(AuditLogItemComponent);
AuditLogItem.displayName = 'AuditLogItem';
