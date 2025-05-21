'use client';
import { useCallback, useMemo, useState } from 'react';
import BounceLoader from 'react-spinners/BounceLoader';

import { Card, CardContent } from '@/components/ui/card';
import { useUserVerification } from '@/hooks/user-verify';
import { useGettAllParticipants } from '@/services/queries/fetchParticipants';
import Filter from './filter/filter';
import LulusCardHome from './lulu-card/lulu-card-home';
import { participants as particiantesMock } from './mockdata';
import { Person } from './types';
import { filteredAndSortedParticipants, getNextBirthday } from './utils';

interface LulusProps {
  participants: Person[];
}

const Lulus = ({ participants }: LulusProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('date');
  const [filterMonth, setFilterMonth] = useState('all');
  const { user, isLoading } = useUserVerification();
  const { data: participantsData, isLoading: isLoadingParticipants } =
    useGettAllParticipants();

  const getfilteredAndSortedParticipants = useMemo(
    () =>
      filteredAndSortedParticipants(
        participants ?? participantsData ?? [] ?? particiantesMock,
        searchTerm,
        filterMonth,
        sortBy
      ),
    [searchTerm, filterMonth, sortBy, participantsData, participants]
  );

  const isNextBirthday = useCallback((id: number) => {
    return getNextBirthday(particiantesMock)?.id === id;
  }, []);

  if (isLoading || isLoadingParticipants)
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <BounceLoader color="#F43F5E" />{' '}
      </div>
    );

  return (
    <div className="min-h-screen p-8">
      <div className=" mx-auto">
        <Filter
          filterMonth={filterMonth}
          setFilterMonth={setFilterMonth}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          sortBy={sortBy}
          setSortBy={setSortBy}
        />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2 overflow-auto">
          {getfilteredAndSortedParticipants.map((participant, key) => (
            <LulusCardHome
              key={key}
              participant={participant}
              isNextBirthday={isNextBirthday(participant.id)}
              user={!!user}
              participants={
                participants ?? participantsData ?? [] ?? particiantesMock
              }
            />
          ))}
        </div>
        {!isLoadingParticipants &&
          getfilteredAndSortedParticipants.length === 0 && (
            <Card className="bg-card/90 backdrop-blur hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 cursor-pointer">
              <CardContent className="p-6">
                <div className="flex flex-col items-center justify-center gap-2">
                  <h2 className="text-2xl font-semibold text-primary animate-fade-in font-sans">
                    Nenhuma Lulu faz aniversário neste mês
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
