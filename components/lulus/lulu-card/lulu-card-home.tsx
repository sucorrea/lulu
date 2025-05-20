'use client';

import Image from 'next/image';
import Link from 'next/link';

import { Icon } from '@iconify/react';
import { CakeIcon, Edit2Icon } from 'lucide-react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import PixInfo from '../../pix-info';
import PixQRCode from '../../qrcode-pix';
import WhatsappInfo from '../../whatsapp-info';
import { LINK_HOROSCOPO_DIARIO, LINK_INSTAGRAM } from '../constants';
import LinkIconWithText from '../link-with-icon';
import { Person } from '../types';
import { formatDate, getGivesToPicture, getSigno } from '../utils';
import ResponsableGift from './responsable-gift';
import { twMerge } from 'tailwind-merge';

interface LulusCardHomeProps {
  participant: Person;
  isNextBirthday: boolean;
  user: boolean;
  participants: Person[];
}

const LulusCardHome = ({
  participant,
  isNextBirthday,
  user,
  participants,
}: LulusCardHomeProps) => {
  return (
    <Card
      className={twMerge(
        '',
        isNextBirthday &&
          'border-primary border-2 shadow-lg bg-primary-foreground'
      )}
    >
      <CardContent className="p-4 flex flex-col justify-between h-full">
        <Link
          href={`participants/${participant.id}`}
          title="Editar"
          className=" flex text-xs gap-1 items-end justify-end"
        >
          <Edit2Icon size="0.75rem" className="text-primary" />
        </Link>
        {isNextBirthday && (
          <div className="flex items-center justify-center pb-2">
            <h3 className="font-semibold text-xl text-primary">
              Próxima aniversariante
            </h3>
          </div>
        )}
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div>
                <Avatar className="h-16 w-16 border-2 border-primary">
                  <AvatarImage
                    src={participant.photoURL ?? ''}
                    alt={participant.name}
                  />
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    {participant.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
              </div>

              <div>
                <h2 className="font-semibold text-xl text-primary">
                  {participant.name}
                </h2>
                <div>
                  <div className="flex items-center text-sm gap-1">
                    <CakeIcon size="1rem" className="text-primary" />
                    {formatDate(new Date(participant.date))}
                  </div>
                  <br />
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between gap-2">
            <LinkIconWithText
              showDescription
              link={`${LINK_HOROSCOPO_DIARIO}${getSigno(new Date(participant.date)).value}/`}
              text={getSigno(new Date(participant.date)).label ?? ''}
            >
              <Icon icon={getSigno(new Date(participant.date)).icon} />
            </LinkIconWithText>
            {!!participant.instagram && (
              <LinkIconWithText
                showDescription
                link={`${LINK_INSTAGRAM}${participant.instagram}`}
                text={`@${participant.instagram}`}
              >
                <Image
                  src="instagram.svg"
                  alt="Instagram"
                  width={20}
                  height={20}
                />
              </LinkIconWithText>
            )}
          </div>
          <div className="flex items-center justify-between gap-2">
            {user && participant.phone && (
              <WhatsappInfo participant={participant} />
            )}
            {user && participant.pix_key && (
              <PixInfo participant={participant} />
            )}
          </div>
          {user && participant.pix_key && (
            <PixQRCode participant={participant} />
          )}
          <ResponsableGift
            participant={getGivesToPicture(
              participant.gives_to_id,
              participants
            )}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default LulusCardHome;
