'use client';
import { useState } from 'react';

import Image from 'next/image';

import { ArrowRight, Calendar, Gift } from 'lucide-react';

import { Card, CardContent } from '@/components/ui/card';
import {
  filteredAndSortedParticipants,
  getGivesToPicture,
  getSigno,
  meses,
} from './utils';
import FilterBar from './filter-component';
import { LINK_HOROSCOPO_DIARIO, LINK_INSTAGRAM } from './constants';
import LinkIconWithText from './link-with-icon';
import { Icon } from '@iconify/react';

const Lulus = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('date');
  const [filterMonth, setFilterMonth] = useState('all');

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-100 via-amber-100 to-violet-100 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-center gap-2">
          <Image
            src="/luluzinha_no_background.png"
            alt="luluzinha"
            width={100}
            height={100}
          />
          <h1 className="text-4xl font-bold text-center mb-8 text-rose-600 animate-fade-in font-baloo">
            Luluzinha 2025
          </h1>
        </div>
        <FilterBar
          filterMonth={filterMonth}
          months={meses}
          searchTerm={searchTerm}
          setFilterMonth={setFilterMonth}
          setSearchTerm={setSearchTerm}
          setSortBy={setSortBy}
          sortBy={sortBy}
        />
        <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-1 gap-4 overflow-auto">
          {filteredAndSortedParticipants(searchTerm, filterMonth, sortBy).map(
            (participant) => (
              // <Dialog key={participant.id}>
              //   <DialogTrigger asChild>
              <>
                <Card
                  className="bg-white/90 backdrop-blur hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer"
                  key={participant.id}
                >
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
                              {new Date(
                                participant.date.getTime() +
                                  participant.date.getTimezoneOffset() * 60000
                              ).toLocaleDateString('pt-BR', {
                                day: '2-digit',
                                month: '2-digit',
                              })}
                            </div>
                          </div>
                          <div className="md:flex flex-row gap-3">
                            <div>
                              <LinkIconWithText
                                link={`${LINK_HOROSCOPO_DIARIO}${getSigno(participant.date).value}/`}
                                text={getSigno(participant.date).label ?? ''}
                              >
                                <Icon icon={getSigno(participant.date).icon} />
                              </LinkIconWithText>
                            </div>
                            {!!participant.instagram && (
                              <div>
                                <LinkIconWithText
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
                        {/* <div className=" py-3">
                            <p className="text-sm text-gray-600">
                              <span className="font-medium">
                                Favorite Color:
                              </span>{' '}
                              {participant.favorite_color}
                            </p>
                            <p className="text-sm text-gray-600 mt-1">
                              <span className="font-medium">Hobbies:</span>{' '}
                              {participant.hobbies}
                            </p>
                          </div> */}
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
              </>
              //   </DialogTrigger>
              //   <DialogContent className="max-w-2xl">
              //     <DialogHeader>
              //       {/* <DialogTitle>Participant Details</DialogTitle> */}
              //     </DialogHeader>
              //     <PersonDetails person={participant} />
              //   </DialogContent>
              // </Dialog>
            )
          )}
        </div>

        {filteredAndSortedParticipants.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No participants found matching your search criteria.
          </div>
        )}
      </div>
    </div>
  );
};

export default Lulus;
