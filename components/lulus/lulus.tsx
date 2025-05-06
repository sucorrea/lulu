'use client';
import { Fragment, useState } from 'react';

import Image from 'next/image';

import { Icon } from '@iconify/react';
import { ArrowRight, Calendar, Filter, Gift } from 'lucide-react';

import { Card, CardContent } from '@/components/ui/card';
import { LINK_HOROSCOPO_DIARIO, LINK_INSTAGRAM } from './constants';
import FilterBar from './filter-component';
import LinkIconWithText from './link-with-icon';
import {
  filteredAndSortedParticipants,
  formatDate,
  getGivesToPicture,
  getSigno,
  meses,
} from './utils';
import { useIsMobile } from '@/providers/device-provider';

const Lulus = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('date');
  const [filterMonth, setFilterMonth] = useState('all');
  const [showFilter, setShowFilter] = useState(false);
  const { isMobile } = useIsMobile();

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-100 via-amber-100 to-violet-100 p-8">
      <div className="max-w-6xl mx-auto">
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
            Luluzinha 2025
          </h1>
        </div>
        <div className="mb-4">
          <button
            onClick={() => setShowFilter((prev) => !prev)}
            className="flex items-center gap-2 px-4 py-2 bg-rose-600 text-white rounded hover:bg-rose-700 transition"
          >
            <Filter className="w-5 h-5" />
          </button>
        </div>
        {showFilter && (
          <FilterBar
            filterMonth={filterMonth}
            months={meses}
            searchTerm={searchTerm}
            setFilterMonth={setFilterMonth}
            setSearchTerm={setSearchTerm}
            setSortBy={setSortBy}
            sortBy={sortBy}
          />
        )}
        <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-1 gap-4 overflow-auto">
          {filteredAndSortedParticipants(searchTerm, filterMonth, sortBy).map(
            (participant, key) => (
              <Fragment key={`${participant.id}-${key}`}>
                <Card className="bg-white/90 backdrop-blur hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer">
                  <CardContent className="p-6">
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
                            <div className="flex items-center text-gray-600 text-sm">
                              <Calendar className="w-4 h-4 mr-1" />
                              {formatDate(participant.date)}
                            </div>
                          </div>
                          <div className="md:flex flex-row gap-3">
                            <div>
                              <LinkIconWithText
                                showDescription
                                link={`${LINK_HOROSCOPO_DIARIO}${getSigno(participant.date).value}/`}
                                text={getSigno(participant.date).label ?? ''}
                              >
                                <Icon icon={getSigno(participant.date).icon} />
                              </LinkIconWithText>
                            </div>
                            {!!participant.instagram && (
                              <div>
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
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between bg-amber-50 p-3 rounded-lg">
                        <Gift className="w-5 h-5 text-amber-600" />
                        <ArrowRight className="w-5 h-5 text-amber-600" />
                        <div className="flex  gap-3">
                          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-violet-400 to-rose-500 flex items-center justify-center">
                            <Image
                              src={
                                getGivesToPicture(participant.gives_to_id)
                                  .picture ?? ''
                              }
                              alt={
                                getGivesToPicture(participant.gives_to_id).name
                              }
                              className="w-16 h-16 rounded-full"
                              width={64}
                              height={64}
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
              </Fragment>
            )
          )}
        </div>

        {filteredAndSortedParticipants(searchTerm, filterMonth, sortBy)
          .length === 0 && (
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
