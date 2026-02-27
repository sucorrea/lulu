'use client';

import { toast } from 'sonner';

import { SelectWithOptions } from '@/components/ui/select-with-options';
import {
  useGetAllParticipantsAdmin,
  useUpdateParticipantRole,
  useDeleteParticipant,
} from '@/services/queries/adminParticipants';
import { useUserVerification } from '@/hooks/user-verify';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import type { Role } from '@/components/lulus/types';

const ROLE_OPTIONS: { value: Role; label: string }[] = [
  { value: 'admin', label: 'Admin' },
  { value: 'lulu', label: 'Lulu' },
  { value: 'visitante', label: 'Visitante' },
];

export const RoleManager = () => {
  const { user } = useUserVerification();
  const { data: participants, isLoading } = useGetAllParticipantsAdmin();
  const { mutate: updateRole } = useUpdateParticipantRole();
  const { mutate: removeParticipant } = useDeleteParticipant();

  const handleRoleChange = async (
    participantId: string,
    newRole: Role,
    authEmail?: string
  ) => {
    updateRole(
      { participantId, role: newRole },
      {
        onSuccess: async () => {
          if (newRole === 'admin' && authEmail) {
            try {
              const token = await user?.getIdToken();
              await fetch('/api/admin/set-claim', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                  targetUid: authEmail,
                  admin: true,
                }),
              });
            } catch {
              console.warn('Erro ao setar claim admin');
            }
          }
          toast.success('Role atualizada');
        },
        onError: () => {
          toast.error('Erro ao atualizar role');
        },
      }
    );
  };

  const handleDelete = (participantId: string, name: string) => {
    if (!confirm(`Remover ${name}?`)) {
      return;
    }

    removeParticipant(participantId, {
      onSuccess: () => {
        toast.success(`${name} removida`);
      },
      onError: () => {
        toast.error('Erro ao remover');
      },
    });
  };

  if (isLoading) {
    return <p className="text-muted-foreground">Carregando participantes...</p>;
  }

  if (!participants?.length) {
    return (
      <p className="text-muted-foreground">Nenhuma participante encontrada.</p>
    );
  }

  return (
    <div className="space-y-3">
      {participants.map((p) => (
        <div
          key={p.docId}
          className="flex items-center gap-3 p-3 border rounded-md"
        >
          <div className="flex-1 min-w-0">
            <p className="font-medium truncate">{p.fullName || p.name}</p>
            <p className="text-sm text-muted-foreground truncate">
              {p.authEmail ?? 'Sem e-mail vinculado'}
            </p>
          </div>
          <SelectWithOptions
            value={p.role ?? 'lulu'}
            onValueChange={(value) =>
              handleRoleChange(p.docId, value as Role, p.authEmail)
            }
            options={ROLE_OPTIONS.map((r) => ({
              value: r.value,
              label: r.label,
            }))}
            placeholder="Role"
            triggerClassName="w-32"
          />
          <Button
            variant="ghost"
            size="icon"
            onClick={() => handleDelete(p.docId, p.name)}
            aria-label={`Remover ${p.name}`}
          >
            <Trash2 className="h-4 w-4 text-destructive" />
          </Button>
        </div>
      ))}
    </div>
  );
};
