'use client';

import Image from 'next/image';
import Link from 'next/link';

import { Icon } from '@iconify/react';
import { ArrowRight, Calendar, Edit2Icon, Gift } from 'lucide-react';
import { twMerge } from 'tailwind-merge';

import { Card, CardContent } from '@/components/ui/card';
import PixInfo from '../pix-info';
import PixQRCode from '../qrcode-pix';
import WhatsappInfo from '../whatsapp-info';
import { LINK_HOROSCOPO_DIARIO, LINK_INSTAGRAM } from './constants';
import LinkIconWithText from './link-with-icon';
import { Person } from './types';
import { formatDate, getGivesToPicture, getSigno } from './utils';

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
        'bg-white/90 backdrop-blur hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer ',
        isNextBirthday && 'bg-white/40 border-rose-500 border-2 shadow-lg'
      )}
    >
      <CardContent className="p-4 border-2 border-red-500 sm:border-blue-500 md:border-green-500 lg:border-yellow-500">
        {isNextBirthday && (
          <div className="flex items-center justify-center pb-2">
            <h3 className="font-semibold text-xl text-rose-800">
              Próxima aniversariante
            </h3>
          </div>
        )}
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div>
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-rose-400 to-amber-500 flex items-center justify-center">
                  <Image
                    src={participant.photoURL ?? ''}
                    alt={participant.name}
                    className="w-16 h-16 rounded-full"
                    width={64}
                    height={64}
                  />
                </div>
                {/* <div className="flex-row  gap-2"> */}
                <Link
                  href={`lulu/${participant.id}`}
                  className="flex items-center  justify-center gap-1 text-xs"
                >
                  Editar
                  <Edit2Icon className="w-3 h-3 text-rose-600" />
                </Link>
                {/* </div> */}
              </div>
              <div>
                <h2 className="font-semibold text-xl text-rose-800">
                  {participant.name}
                </h2>
                <div>
                  <div className="flex items-center text-gray-600 text-sm">
                    <Calendar className="w-4 h-4 mr-1" />
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
          <div className="flex items-center justify-between bg-amber-50 p-3 rounded-lg">
            <Gift className="w-5 h-5 text-amber-600" />
            <ArrowRight className="w-5 h-5 text-amber-600" />
            <div className="flex  gap-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-violet-400 to-rose-500 flex items-center justify-center">
                <Image
                  src={
                    getGivesToPicture(participant.gives_to_id, participants)
                      .photoURL ??
                    getGivesToPicture(participant.gives_to_id, participants)
                      .picture ??
                    ''
                  }
                  alt={
                    getGivesToPicture(participant.gives_to_id, participants)
                      .name
                  }
                  className="w-12 h-12 rounded-full"
                  width={56}
                  height={56}
                />
              </div>
              <div className="text-right">
                <p className="font-medium text-rose-800">Responsável</p>
                <p className="text-rose-600">{participant.gives_to}</p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default LulusCardHome;
