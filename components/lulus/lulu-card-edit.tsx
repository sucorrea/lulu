'use client';

import Image from 'next/image';

import { Icon } from '@iconify/react';
import { Calendar } from 'lucide-react';

import { Card, CardContent } from '@/components/ui/card';
import PixInfo from '../pix-info';
import PixQRCode from '../qrcode-pix';
import WhatsappInfo from '../whatsapp-info';
import { LINK_HOROSCOPO_DIARIO, LINK_INSTAGRAM } from './constants';
import LinkIconWithText from './link-with-icon';
import { Person } from './types';
import { formatDate, getSigno } from './utils';
import { useIsMobile } from '@/providers/device-provider';

interface LulusCardEditProps {
  participante: Person | null;
}

const LulusCardEdit = ({ participante }: LulusCardEditProps) => {
  const { isMobile } = useIsMobile();
  const participant = participante ?? ({} as Person);
  return (
    <Card className="bg-white/90 backdrop-blur hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer">
      <CardContent className="p-6">
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div>
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-rose-400 to-amber-500 flex items-center justify-center">
                  <Image
                    src={participant?.photoURL ?? ''}
                    alt={participant?.name}
                    className="w-16 h-16 rounded-full"
                    width={64}
                    height={64}
                  />
                </div>
              </div>
              <div>
                <h2 className="font-semibold text-xl text-rose-800">
                  {participant?.name}
                </h2>
                <div>
                  <div className="flex items-center text-gray-600 text-sm">
                    <Calendar className="w-4 h-4 mr-1" />
                    {formatDate(new Date(participant.date))}
                  </div>
                  <br />
                </div>
              </div>
              <div className="md:flex flex-row gap-3">
                <LinkIconWithText
                  showDescription
                  link={`${LINK_HOROSCOPO_DIARIO}${getSigno(new Date(participant.date)).value}/`}
                  text={getSigno(new Date(participant.date)).label ?? ''}
                >
                  <Icon icon={getSigno(new Date(participant.date)).icon} />
                </LinkIconWithText>
                {!!participant.instagram && (
                  <LinkIconWithText
                    showDescription={!isMobile}
                    link={`${LINK_INSTAGRAM}${participant.instagram}`}
                    text={`@${participant.instagram}`}
                  >
                    <Image
                      src="/instagram.svg"
                      alt="Instagram"
                      width={20}
                      height={20}
                    />
                  </LinkIconWithText>
                )}
              </div>
            </div>
          </div>
          <div className="flex items-center justify-between gap-2">
            {participant.phone && <WhatsappInfo participant={participant} />}
            {participant.pix_key && <PixInfo participant={participant} />}
          </div>
          {participant.pix_key && <PixQRCode participant={participant} />}
        </div>
      </CardContent>
    </Card>
  );
};

export default LulusCardEdit;
