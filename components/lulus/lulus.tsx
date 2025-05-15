'use client';
import { useMemo, useState } from 'react';

import Image from 'next/image';
import Link from 'next/link';

import { Icon } from '@iconify/react';
import { formatToPhone } from 'brazilian-values';
import { ArrowRight, Calendar, Gift } from 'lucide-react';
import BounceLoader from 'react-spinners/BounceLoader';
import { twMerge } from 'tailwind-merge';

import { Card, CardContent } from '@/components/ui/card';
import { useUserVerification } from '@/hooks/user-verify';
import { useIsMobile } from '@/providers/device-provider';
import { LINK_HOROSCOPO_DIARIO, LINK_INSTAGRAM } from './constants';
import Filter from './filter/filter';
import LinkIconWithText from './link-with-icon';
import {
  filteredAndSortedParticipants,
  formatDate,
  getGivesToPicture,
  getNextBirthday,
  getSigno,
  NameKey,
} from './utils';
import PixQRCode from '../qrcode-pix';

const ano = new Date().getFullYear();

const Lulus = () => {
  const { isMobile } = useIsMobile();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('date');
  const [filterMonth, setFilterMonth] = useState('all');
  const { user, isLoading } = useUserVerification();

  const getfilteredAndSortedParticipants = useMemo(
    () => filteredAndSortedParticipants(searchTerm, filterMonth, sortBy),
    [searchTerm, filterMonth, sortBy]
  );

  if (isLoading)
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <BounceLoader color="#FF0000" />
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-100 via-amber-100 to-violet-100 p-8">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-center gap-2">
          <Image
            src="/luluzinha_no_background.png"
            alt="luluzinha"
            width={100}
            height={100}
            style={{ width: 'auto', height: 'auto' }}
            priority
          />
          <h1 className="text-4xl font-bold text-center mb-8 text-rose-600 animate-fade-in font-baloo">
            Luluzinha {ano}
          </h1>
        </div>
        <Filter
          filterMonth={filterMonth}
          setFilterMonth={setFilterMonth}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          sortBy={sortBy}
          setSortBy={setSortBy}
        />
        <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-1 gap-4 overflow-auto">
          {getfilteredAndSortedParticipants.map((participant, key) => {
            return (
              <Card
                className={twMerge(
                  'bg-white/90 backdrop-blur hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer',
                  participant.id ===
                    getNextBirthday(getfilteredAndSortedParticipants)?.id &&
                    'bg-white/40 border-rose-500 border-2 shadow-lg'
                )}
                key={`${participant.id}-${key}`}
              >
                <CardContent className="p-6">
                  {getNextBirthday(getfilteredAndSortedParticipants)?.id ===
                    participant.id && (
                    <div className="flex items-center justify-center">
                      <h3 className="font-semibold text-xl text-rose-800">
                        Próxima aniversariante
                      </h3>
                    </div>
                  )}
                  <div className="flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-rose-400 to-amber-500 flex items-center justify-center">
                          <Image
                            src={participant.picture ?? ''}
                            alt={participant.name}
                            className="w-16 h-16 rounded-full"
                            width={64}
                            height={64}
                          />
                        </div>
                        <div>
                          <h2 className="font-semibold text-xl text-rose-800">
                            {participant.name}
                          </h2>
                          <div>
                            <div className="flex items-center text-gray-600 text-sm">
                              <Calendar className="w-4 h-4 mr-1" />
                              {formatDate(participant.date)}
                            </div>
                            <br />
                          </div>
                        </div>
                        <div className="md:flex flex-row gap-3">
                          <LinkIconWithText
                            showDescription
                            link={`${LINK_HOROSCOPO_DIARIO}${getSigno(participant.date).value}/`}
                            text={getSigno(participant.date).label ?? ''}
                          >
                            <Icon icon={getSigno(participant.date).icon} />
                          </LinkIconWithText>
                          {!!participant.instagram && (
                            <LinkIconWithText
                              showDescription={!isMobile}
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
                      </div>
                    </div>
                    <div className="flex items-center justify-between gap-2">
                      {user && participant.phone && (
                        <div className="flex items-center text-gray-600 text-xs pb-2">
                          <Link
                            href={`https://api.whatsapp.com/send?phone=55${participant.phone}`}
                            target="_blank"
                          >
                            <Image
                              src="whatsapp.svg"
                              alt="Whatsapp"
                              width={15}
                              height={20}
                            />
                            <span className="ml-1 text-xs">
                              {formatToPhone(participant.phone)}
                            </span>
                          </Link>
                        </div>
                      )}
                      {user && participant.pix_key && (
                        <div className="flex-col items-center text-gray-600 text-xs">
                          <div className="flex gap-2">
                            <Image
                              src="pix.svg"
                              alt="Pix"
                              width={15}
                              height={20}
                            />
                            {NameKey[participant.pix_key_type ?? 'none']}
                          </div>
                          <span
                            className="ml-1 text-xs"
                            onClick={() =>
                              participant.pix_key &&
                              navigator.clipboard.writeText(participant.pix_key)
                            }
                          >
                            {participant.pix_key}
                          </span>
                        </div>
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
                              getGivesToPicture(participant.gives_to_id)
                                .picture ?? ''
                            }
                            alt={
                              getGivesToPicture(participant.gives_to_id).name
                            }
                            className="w-12 h-12 rounded-full"
                            width={56}
                            height={56}
                          />
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-rose-800">
                            Responsável
                          </p>
                          <p className="text-rose-600">
                            {participant.gives_to}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
        {getfilteredAndSortedParticipants.length === 0 && (
          <Card className="bg-white/90 backdrop-blur hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer">
            <CardContent className="p-6">
              <div className="flex flex-col items-center justify-center gap-4">
                <h2 className="text-2xl font-semibold text-rose-800">
                  nenhuma Lulu faz aniversário neste mês
                </h2>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Lulus;
