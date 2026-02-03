'use client';
import { useMemo } from 'react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Person } from '../types';
import { getGivesToPicture, getParticipantPhotoUrl } from '../utils';

interface ResponsableGiftProps {
  participant: Person;
  participants: Person[];
}

const ResponsableGift = ({
  participant,
  participants,
}: ResponsableGiftProps) => {
  const responsable = useMemo(
    () => getGivesToPicture(participant.gives_to_id, participants),
    [participant.gives_to_id, participants]
  );

  return (
    <div className="bg-muted flex items-center justify-center  border-2 p-2 rounded-lg ">
      <div className="flex  gap-3">
        {participant.gives_to_id === 0 ? (
          <div>
            <p className="text-primary text-sm">
              Lulu não participa da vaquinha esse ano
            </p>
          </div>
        ) : (
          <>
            <Avatar
              className="w-12 h-12"
              key={getParticipantPhotoUrl(responsable)}
            >
              <AvatarImage
                src={getParticipantPhotoUrl(responsable)}
                alt={responsable.name}
                width={56}
                height={56}
              />
              <AvatarFallback>
                {(responsable.name ?? '').charAt(0).toUpperCase() || '?'}
              </AvatarFallback>
            </Avatar>

            <div>
              <p className="text-primary text-sm">Responsável pela vaquinha</p>
              <p className="">{responsable.name}</p>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ResponsableGift;
