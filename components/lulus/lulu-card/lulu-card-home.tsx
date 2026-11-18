'use client';

import Image from 'next/image';
import Link from 'next/link';
import dynamic from 'next/dynamic';

import { CakeIcon, Edit2Icon } from 'lucide-react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card } from '@/components/ui/card';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

import PixInfo from '../../pix-info';
import PixQRCode from '../../qrcode-pix';
import WhatsappInfo from '../../whatsapp-info';
import { LINK_HOROSCOPO_DIARIO, LINK_INSTAGRAM } from '../constants';
import LinkIconWithText from '../link-with-icon';
import MoreInforAccordion from '../more-info';
import { Person } from '../types';
import { formatDate, getParticipantPhotoUrl, getSigno } from '../utils';
import NextBirthdayBanner from './next-birthday-banner';
import ZodiacIcon from '../zodiac-icon';

const ResponsableGift = dynamic(() => import('./responsable-gift'), {
  ssr: false,
});

type LulusCardHomeVariant = 'default' | 'featured';

interface LulusCardHomeProps {
  participant: Person;
  participants: Person[];
  user: boolean;
  daysUntil: number;
  variant?: LulusCardHomeVariant;
}

const instagramIconStyle = {
  display: 'inline-block',
  width: '0.875rem',
  height: '0.875rem',
  flexShrink: 0,
  WebkitMaskImage: "url('/icons/instagram.svg')",
  WebkitMaskRepeat: 'no-repeat',
  WebkitMaskSize: 'contain',
  WebkitMaskPosition: 'center',
  maskImage: "url('/icons/instagram.svg')",
  maskRepeat: 'no-repeat',
  maskSize: 'contain',
  maskPosition: 'center',
  backgroundColor: 'currentColor',
} as const;

const getInitial = (name: string | undefined | null) =>
  (name ?? '').charAt(0).toUpperCase() || '?';

interface ParticipantMetaProps {
  participant: Person;
  featured: boolean;
}

const ParticipantMeta = ({ participant, featured }: ParticipantMetaProps) => {
  const birthDate = new Date(participant.date);
  const signo = getSigno(birthDate);
  const iconClass = featured ? 'text-current' : 'text-gold';

  return (
    <div
      className={cn(
        'mt-1.5 flex flex-wrap items-center gap-x-2.5 gap-y-1 text-sm',
        featured ? 'text-white' : 'text-muted-foreground'
      )}
    >
      <span className="inline-flex items-center gap-1">
        <CakeIcon size="0.875rem" className={cn('shrink-0', iconClass)} />
        <span>{formatDate(birthDate)}</span>
      </span>
      <LinkIconWithText
        showDescription
        link={`${LINK_HOROSCOPO_DIARIO}${signo.value}/`}
        text={signo.label}
        icon={<ZodiacIcon icon={signo.icon} className={iconClass} />}
      />
      {participant.instagram && (
        <LinkIconWithText
          showDescription
          link={`${LINK_INSTAGRAM}${participant.instagram}`}
          text={`@${participant.instagram}`}
          icon={
            <span
              aria-hidden="true"
              className={iconClass}
              style={instagramIconStyle}
            />
          }
        />
      )}
    </div>
  );
};

interface EditLinkProps {
  token: string;
  className?: string;
}

const EditLink = ({ token, className }: EditLinkProps) => (
  <TooltipProvider>
    <Tooltip>
      <TooltipTrigger asChild>
        <Link
          href={`participantes/${token}`}
          aria-label="Editar"
          className={cn(
            'flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
            className
          )}
        >
          <Edit2Icon size="0.875rem" />
        </Link>
      </TooltipTrigger>
      <TooltipContent>
        <p>Editar</p>
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>
);

interface DaysCounterProps {
  daysUntil: number;
}

const DaysCounter = ({ daysUntil }: DaysCounterProps) => (
  <div
    data-testid="days-until"
    className="ml-auto shrink-0 self-start text-center text-xs font-bold uppercase tracking-wide text-gold"
  >
    {daysUntil === 0 ? (
      <span className="block font-serif text-2xl normal-case leading-none text-primary">
        Hoje!
      </span>
    ) : (
      <>
        <span className="block font-serif text-3xl leading-none text-primary">
          {daysUntil}
        </span>
        <span>{daysUntil === 1 ? 'dia' : 'dias'}</span>
      </>
    )}
  </div>
);

const LulusCardHome = ({
  participant,
  participants,
  user,
  daysUntil,
  variant = 'default',
}: LulusCardHomeProps) => {
  const featured = variant === 'featured';
  const token = participant.editToken ?? String(participant.id);
  const photoUrl = getParticipantPhotoUrl(participant);

  return (
    <Card
      className={cn(
        'lulu-card mx-auto w-full max-w-md rounded-3xl',
        featured
          ? 'overflow-hidden border-accent p-0 shadow-lulu-md md:p-0'
          : 'p-3.5 shadow-lulu-sm md:p-3.5'
      )}
    >
      {featured ? (
        <div
          data-testid="featured-photo"
          className="relative h-52 w-full bg-primary"
        >
          {photoUrl ? (
            <Image
              src={photoUrl}
              alt={participant.name}
              fill
              preload
              unoptimized
              sizes="(min-width: 768px) 448px, 100vw"
              className="object-cover"
            />
          ) : (
            <div
              aria-hidden="true"
              className="flex h-full items-center justify-center pb-16 font-serif text-7xl font-bold text-primary-foreground"
            >
              {getInitial(participant.name)}
            </div>
          )}
          {user && (
            <EditLink
              token={token}
              className="absolute right-2 top-2 bg-card/90"
            />
          )}
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[rgba(42,10,20,0.88)] via-[rgba(42,10,20,0.6)] to-transparent px-4 pb-3 pt-10 text-white">
            <NextBirthdayBanner daysUntil={daysUntil} />
            <h2 className="mt-1.5 break-words font-serif text-3xl font-bold leading-none text-white">
              {participant.name}
            </h2>
            <ParticipantMeta participant={participant} featured />
          </div>
        </div>
      ) : (
        <div className="flex items-center gap-3">
          <Avatar
            className="h-[62px] w-[62px] ring-2 ring-accent ring-offset-2 ring-offset-card"
            key={photoUrl}
          >
            <AvatarImage src={photoUrl} alt={participant.name} />
            <AvatarFallback className="bg-primary font-serif text-2xl font-bold text-primary-foreground">
              {getInitial(participant.name)}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1">
              <h2 className="break-words font-serif text-2xl font-bold leading-none text-primary">
                {participant.name}
              </h2>
              {user && <EditLink token={token} className="-my-3" />}
            </div>
            <ParticipantMeta participant={participant} featured={false} />
          </div>
          <DaysCounter daysUntil={daysUntil} />
        </div>
      )}
      <div className={cn('flex flex-col', featured && 'px-3.5 pb-3.5')}>
        <div className="mt-3">
          <ResponsableGift
            participant={participant}
            participants={participants}
          />
        </div>
        <div className="mt-3 border-t border-border pt-1">
          <MoreInforAccordion>
            <div className="grid grid-cols-2 gap-2 pt-2">
              {participant.phone && (
                <div className="flex min-h-11 items-center justify-center rounded-xl bg-surface-warm px-2">
                  <WhatsappInfo participant={participant} />
                </div>
              )}
              {participant.pix_key && (
                <div className="flex min-h-11 items-center justify-center rounded-xl bg-surface-warm px-2">
                  <PixInfo participant={participant} />
                </div>
              )}
            </div>
            {participant.pix_key && (
              <div className="mt-2 flex justify-center">
                <PixQRCode participant={participant} />
              </div>
            )}
          </MoreInforAccordion>
        </div>
      </div>
    </Card>
  );
};

export default LulusCardHome;
