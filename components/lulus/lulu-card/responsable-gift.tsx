'use client';
import { useMemo } from 'react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
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
  const assignment = useGetOrganizerForParticipant(participant.id);

  const organizer = useMemo(() => {
    if (!assignment) {
      return null;
    }
    return participants.find((p) => p.id === assignment.responsibleId);
  }, [assignment, participants]);

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
