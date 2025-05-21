'use client';

import Image from 'next/image';
import Link from 'next/link';

import { Icon } from '@iconify/react';
import { CakeIcon, Edit2Icon, GiftIcon } from 'lucide-react';

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
    <Card className={styleCard}>
      <CardContent className="p-4 flex flex-col justify-between h-full">
        {user && (
          <Link
            href={`participants/${participant.id}`}
            title="Editar"
            className=" flex text-xs gap-1 items-end justify-end"
          >
            <Edit2Icon size="0.75rem" className="text-primary" />
          </Link>
        )}
        {isNextBirthday && (
          <div className="flex flex-row items-center justify-center pb-2">
            <GiftIcon size="1.5rem" className="text-primary" />
            <h3 className="font-semibold text-xl text-primary">
              Próxima aniversariante
            </h3>
          </div>
        )}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
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
          <MoreInforAccordion>
            <>
              <div className="flex items-center justify-between gap-2">
                <LinkIconWithText
                  showDescription
                  link={`${LINK_HOROSCOPO_DIARIO}${getSigno(new Date(participant.date)).value}/`}
                  text={getSigno(new Date(participant.date)).label ?? ''}
                  icon={
                    <Icon icon={getSigno(new Date(participant.date)).icon} />
                  }
                />
                {!!participant.instagram && (
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
