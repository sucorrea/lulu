'use client';
import { useMemo } from 'react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { Person } from '../types';
import { getParticipantPhotoUrl } from '../participant-photo';
import { useGetOrganizerForParticipant } from '@/services/queries/vaquinhaHistory';

interface ResponsableGiftProps {
  participant: Person;
  participants: Person[];
}

const ResponsableGift = ({
  participant,
  participants,
}: ResponsableGiftProps) => {
  const { assignment, isLoading } = useGetOrganizerForParticipant(
    participant.id
  );

  const organizer = useMemo(() => {
    if (!assignment) {
      return null;
    }
    return participants.find((p) => p.id === assignment.responsibleId);
  }, [assignment, participants]);

  if (isLoading) {
    return (
      <div className="flex items-center gap-2.5 rounded-2xl bg-surface-warm p-2.5">
        <Skeleton className="h-10 w-10 shrink-0 rounded-full" />
        <div className="flex flex-col gap-1">
          <Skeleton className="h-3 w-32" />
          <Skeleton className="h-4 w-20" />
        </div>
      </div>
    );
  }

  if (!assignment || !organizer) {
    return (
      <div className="flex items-center justify-center rounded-2xl bg-surface-warm p-2.5">
        <p className="text-sm italic text-muted-foreground">
          Não participa da vaquinha este ano
        </p>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2.5 rounded-2xl bg-surface-warm p-2.5">
      <Avatar
        className="h-10 w-10 ring-2 ring-accent ring-offset-2 ring-offset-surface-warm"
        key={getParticipantPhotoUrl(organizer)}
      >
        <AvatarImage
          src={getParticipantPhotoUrl(organizer)}
          alt={organizer.name}
          width={40}
          height={40}
        />
        <AvatarFallback className="bg-primary text-sm font-bold text-primary-foreground">
          {(organizer.name ?? '').charAt(0).toUpperCase() || '?'}
        </AvatarFallback>
      </Avatar>
      <div className="min-w-0">
        <p className="text-xs font-bold tracking-widest text-gold">
          responsável pela vaquinha
        </p>
        <p className="break-words font-serif text-xl font-bold leading-tight text-primary">
          {organizer.name}
        </p>
      </div>
    </div>
  );
};

export default ResponsableGift;
