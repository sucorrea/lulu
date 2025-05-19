'use client';
import { useCallback, useMemo, useState } from 'react';

import Image from 'next/image';

import BounceLoader from 'react-spinners/BounceLoader';

import { Card, CardContent } from '@/components/ui/card';
import { useUserVerification } from '@/hooks/user-verify';
import Filter from './filter/filter';
import LulusCardHome from './lulu-card-home';
import { filteredAndSortedParticipants, getNextBirthday } from './utils';
import { useGettAllParticipants } from '@/services/queries/fetchParticipants';

const ano = new Date().getFullYear();

const Lulus = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('date');
  const [filterMonth, setFilterMonth] = useState('all');
  const { user, isLoading } = useUserVerification();
  const { data: luluData, isLoading: isLoadingParticipants } =
    useGettAllParticipants();
  const getfilteredAndSortedParticipants = useMemo(
    () =>
      filteredAndSortedParticipants(
        luluData ?? [],
        searchTerm,
        filterMonth,
        sortBy
      ),
    [searchTerm, filterMonth, sortBy, luluData]
  );

  const isNextBirthday = useCallback(
    (id: number) => {
      return getNextBirthday(getfilteredAndSortedParticipants)?.id === id;
    },
    [getfilteredAndSortedParticipants]
  );

  if (isLoading || isLoadingParticipants)
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <BounceLoader color="#FF0000" />
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-100 via-amber-100 to-violet-100 p-8">
      <div className=" mx-auto">
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
        <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-4 gap-4 overflow-auto">
          {getfilteredAndSortedParticipants.map((participant, key) => (
            <LulusCardHome
              key={key}
              participant={participant}
              isNextBirthday={isNextBirthday(participant.id)}
              user={!!user}
              participants={luluData ?? []}
            />
          ))}
        </div>
        {!isLoadingParticipants &&
          getfilteredAndSortedParticipants.length === 0 && (
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
