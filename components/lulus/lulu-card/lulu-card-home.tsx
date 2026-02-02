'use client';
import { useCallback } from 'react';

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
import MoreInforAccordion from '../more-info';
import { Person } from '../types';
import { formatDate, getNextBirthday, getSigno } from '../utils';
import ResponsableGift from './responsable-gift';
import Animation from '@/components/animation';
import { encryptId } from '@/lib/crypto';

interface LulusCardHomeProps {
  participant: Person;
  isNextBirthday: boolean;
  user: boolean;
  participants: Person[];
  showDetails?: boolean;
}

const LulusCardHome = ({
  participant,
  isNextBirthday,
  user,
  participants,
  showDetails = true,
}: LulusCardHomeProps) => {
  const styleCard = isNextBirthday ? 'border-primary border-2 shadow-lg ' : '';

  const calculateDaysUntilBirthday = useCallback((birthdayDate: Date) => {
    const today = new Date();
    const currentYear = today.getFullYear();
    const nextBirthday = new Date(
      currentYear,
      birthdayDate.getMonth(),
      birthdayDate.getDate()
    );

    if (today > nextBirthday) {
      nextBirthday.setFullYear(currentYear + 1);
    }

    const diffTime = Math.abs(nextBirthday.getTime() - today.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  }, []);
  const dataNextBirthday = new Date(getNextBirthday(participants)?.date || '');
  const daysForBirthday = calculateDaysUntilBirthday(dataNextBirthday);
  const token = encryptId(String(participant.id));

  return (
    <Card className={styleCard + ' w-full max-w-md mx-auto'}>
      <CardContent className="p-4 flex flex-col justify-between h-full gap-2 overflow-x-auto">
        {user && showDetails && (
          <Tooltip content="Editar">
            <Link
              href={`participants/${token}`}
              title="Editar"
              className="flex text-xs gap-1 items-end justify-end"
            >
              <Edit2Icon size="0.75rem" className="text-primary" />
            </Link>
          </Tooltip>
        )}
        {isNextBirthday && (
          <div>
            <div className="flex flex-row items-center justify-center pb-2">
              <GiftIcon size="1.5rem" className="text-primary" />
              <h3 className="font-semibold text-xl text-primary">
                Próxima aniversariante
              </h3>
              <Animation className="w-10 h-10 animate-bounce" />
            </div>
            <p className="text-sm text-center text-primary">
              {daysForBirthday === 1
                ? `Falta ${daysForBirthday} dia para o aniversário!`
                : `Faltam ${daysForBirthday} dias para o aniversário!`}
            </p>
          </div>
        )}
        <div className="flex flex-row gap-4 items-center ">
          <Avatar className="h-16 w-16 border-2 border-primary shrink-0">
            <AvatarImage
              src={participant.photoURL ?? ''}
              alt={participant.name}
            />
            <AvatarFallback className="bg-primary text-primary-foreground">
              {(participant.name ?? '').charAt(0).toUpperCase() || '?'}
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
        {showDetails && (
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
        )}
      </CardContent>
    </Card>
  );
};

export default LulusCardHome;
