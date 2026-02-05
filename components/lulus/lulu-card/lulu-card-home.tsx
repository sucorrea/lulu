'use client';
import { useCallback } from 'react';

import Image from 'next/image';
import Link from 'next/link';

import { Icon } from '@iconify/react';
import { CakeIcon, Edit2Icon } from 'lucide-react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { encryptId } from '@/lib/crypto';
import { cn } from '@/lib/utils';

import PixInfo from '../../pix-info';
import PixQRCode from '../../qrcode-pix';
import WhatsappInfo from '../../whatsapp-info';
import { LINK_HOROSCOPO_DIARIO, LINK_INSTAGRAM } from '../constants';
import LinkIconWithText from '../link-with-icon';
import MoreInforAccordion from '../more-info';
import { Person } from '../types';
import {
  formatDate,
  getNextBirthday,
  getParticipantPhotoUrl,
  getSigno,
} from '../utils';
import NextBirthdayBanner from './next-birthday-banner';
import ResponsableGift from './responsable-gift';

interface LulusCardHomeProps {
  participant: Person;
  isNextBirthday?: boolean;
  user: boolean;
  participants: Person[];
  showDetails?: boolean;
}

const LulusCardHome = ({
  participant,
  isNextBirthday = false,
  user,
  participants,
  showDetails = true,
}: LulusCardHomeProps) => {
  const styleCard = isNextBirthday
    ? 'border-primary border-2 shadow-lulu-lg'
    : 'shadow-lulu-sm';

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
    <Card className={cn('lulu-card mx-auto w-full max-w-md p-2', styleCard)}>
      <CardContent className="flex h-full flex-col justify-between gap-2 overflow-x-auto p-4">
        {user && showDetails && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link
                  href={`participants/${token}`}
                  className="flex text-xs gap-1 items-end justify-end"
                >
                  <Edit2Icon size="0.75rem" className="text-primary" />
                </Link>
              </TooltipTrigger>
              <TooltipContent>
                <p>Editar</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
        {isNextBirthday && (
          <NextBirthdayBanner daysForBirthday={daysForBirthday} />
        )}
        <div className="flex flex-row gap-4 items-start">
          <Avatar
            className="h-20 w-20 border-4 border-primary/20 ring-2 ring-primary shrink-0"
            key={getParticipantPhotoUrl(participant)}
          >
            <AvatarImage
              src={getParticipantPhotoUrl(participant)}
              alt={participant.name}
            />
            <AvatarFallback className="bg-primary text-primary-foreground text-lg font-bold">
              {(participant.name ?? '').charAt(0).toUpperCase() || '?'}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col min-w-0 flex-1">
            <div className="flex items-start justify-between gap-2 mb-2">
              <h2 className="font-bold text-xl text-primary break-words">
                {participant.name}
              </h2>
            </div>
            <div className="flex flex-wrap gap-2">
              <div className="inline-flex items-center gap-1 rounded-full bg-secondary/10 px-2 py-1 text-xs">
                <CakeIcon size="0.875rem" className="text-primary shrink-0" />
                <span className="font-medium">
                  {formatDate(new Date(participant.date))}
                </span>
              </div>
              <div className="inline-flex items-center gap-1">
                <LinkIconWithText
                  showDescription
                  link={`${LINK_HOROSCOPO_DIARIO}${getSigno(new Date(participant.date)).value}/`}
                  text={getSigno(new Date(participant.date)).label ?? ''}
                  icon={
                    <Icon icon={getSigno(new Date(participant.date)).icon} />
                  }
                />
              </div>
              {participant.instagram && (
                <div className="inline-flex items-center gap-1 rounded-full bg-secondary/10 px-2 py-1 text-xs">
                  <Image
                    src="instagram.svg"
                    alt="Instagram"
                    width={14}
                    height={14}
                    className="shrink-0"
                  />
                  <LinkIconWithText
                    showDescription
                    link={`${LINK_INSTAGRAM}${participant.instagram}`}
                    text={`@${participant.instagram}`}
                    icon={null}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
        {showDetails && <div className="h-px bg-border" />}
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
