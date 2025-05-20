'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Person } from '../types';

interface ResponsableGiftProps {
  participant: Person;
}

const ResponsableGift = ({ participant }: ResponsableGiftProps) => {
  return (
    <div className="flex items-center justify-center  border-2 p-3 rounded-lg">
      <div className="flex  gap-3">
        <Avatar className="w-12 h-12">
          <AvatarImage
            src={participant.photoURL ?? ''}
            alt={participant.name}
            width={56}
            height={56}
          />
          <AvatarFallback>{participant.name.charAt(0)}</AvatarFallback>
        </Avatar>
        <div>
          <p className="font-medium text-primary text-sm">
            Responsável pela vaquinha
          </p>
          <p className="">{participant.gives_to}</p>
        </div>
      </div>
    </div>
  );
};

export default ResponsableGift;
