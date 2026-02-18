'use client';
import { useMemo } from 'react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { Person } from '../types';
import { getParticipantPhotoUrl } from '../utils';
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
      <div className="bg-muted flex items-center justify-center border-2 p-2 rounded-lg">
        <div className="flex gap-3">
          <Skeleton className="h-12 w-12 shrink-0 rounded-full" />
          <div className="flex flex-col gap-1">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-32" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-muted flex items-center justify-center  border-2 p-2 rounded-lg ">
      <div className="flex  gap-3">
        {!assignment || !organizer ? (
          <div>
            <p className="text-primary text-sm">
              Lulu não participa da vaquinha esse ano
            </p>
          </div>
        ) : (
          <>
            <Avatar
              className="w-12 h-12"
              key={getParticipantPhotoUrl(organizer)}
            >
              <AvatarImage
                src={getParticipantPhotoUrl(organizer)}
                alt={organizer.name}
                width={56}
                height={56}
              />
              <AvatarFallback>
                {(organizer.name ?? '').charAt(0).toUpperCase() || '?'}
              </AvatarFallback>
            </Avatar>

            <div>
              <p className="text-primary text-sm">Responsável pela vaquinha</p>
              <p className="">{organizer.name}</p>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ResponsableGift;
