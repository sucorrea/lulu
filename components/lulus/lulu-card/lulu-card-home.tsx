'use client';

import Image from 'next/image';
import Link from 'next/link';

import { Icon } from '@iconify/react';
import { CakeIcon, Edit2Icon, GiftIcon } from 'lucide-react';

import Tooltip from '@/components/tooltip';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import PixInfo from '../../pix-info';
import PixQRCode from '../../qrcode-pix';
import WhatsappInfo from '../../whatsapp-info';
import { LINK_HOROSCOPO_DIARIO, LINK_INSTAGRAM } from '../constants';
import LinkIconWithText from '../link-with-icon';
import { MoreInforAccordion } from '../more-info';
import { Person } from '../types';
import { formatDate, getSigno } from '../utils';
import ResponsableGift from './responsable-gift';

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
  const styleCard = isNextBirthday ? 'border-primary border-2 shadow-lg ' : '';

  return (
    <Card className={styleCard + ' w-full max-w-md mx-auto'}>
      <CardContent className="p-4 flex flex-col justify-between h-full gap-2 overflow-x-auto">
        {user && (
          <Tooltip content="Editar">
            <Link
              href={`participants/${participant.id}`}
              title="Editar"
              className="flex text-xs gap-1 items-end justify-end"
            >
              <Edit2Icon size="0.75rem" className="text-primary" />
            </Link>
          </Tooltip>
        )}
        {isNextBirthday && (
          <div className="flex flex-row items-center justify-center pb-2">
            <GiftIcon size="1.5rem" className="text-primary" />
            <h3 className="font-semibold text-xl text-primary">
              Próxima aniversariante
            </h3>
          </div>
        )}
        <div className="flex flex-row gap-4 items-center ">
          <Avatar className="h-16 w-16 border-2 border-primary shrink-0">
            <AvatarImage
              src={participant.photoURL ?? ''}
              alt={participant.name}
            />
            <AvatarFallback className="bg-primary text-primary-foreground">
              {participant.name ?? (participant.name as string).charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col min-w-0 w-full">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 w-full">
              <h2 className="font-semibold text-xl text-primary break-words max-w-full">
                {participant.name}
              </h2>
              <div className="flex items-center gap-1">
                <LinkIconWithText
                  showDescription
                  link={`${LINK_HOROSCOPO_DIARIO}${getSigno(new Date(participant.date)).value}/`}
                  text={getSigno(new Date(participant.date)).label ?? ''}
                  icon={
                    <Icon icon={getSigno(new Date(participant.date)).icon} />
                  }
                />
              </div>
            </div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 w-full">
              <div className="flex items-center text-sm gap-1">
                <CakeIcon size="1rem" className="text-primary" />
                <span className="truncate">
                  {formatDate(new Date(participant.date))}
                </span>
              </div>
              {participant.instagram && (
                <div className="flex items-center text-sm gap-1">
                  <LinkIconWithText
                    showDescription
                    link={`${LINK_INSTAGRAM}${participant.instagram}`}
                    text={`@${participant.instagram}`}
                    icon={
                      <Image
                        src="instagram.svg"
                        alt="Instagram"
                        width={20}
                        height={20}
                      />
                    }
                  />
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-2 w-full">
          <MoreInforAccordion>
            <>
              <div className="flex flex-col sm:flex-row  gap-2 w-full">
                {participant.phone && (
                  <WhatsappInfo participant={participant} />
                )}
                {participant.pix_key && <PixInfo participant={participant} />}
              </div>
              {participant.pix_key && <PixQRCode participant={participant} />}
            </>
          </MoreInforAccordion>
          <ResponsableGift
            participant={participant}
            participants={participants}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default LulusCardHome;
