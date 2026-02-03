'use client';

import { useMemo, useState } from 'react';
import BounceLoader from 'react-spinners/BounceLoader';
import { Users } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { useUserVerification } from '@/hooks/user-verify';
import { useQuery } from '@tanstack/react-query';
import { fetchParticipants } from '@/services/queries/fetchParticipants';

import Filter from './filter/filter';
import LulusCardHome from './lulu-card/lulu-card-home';
import { Person } from './types';
import { filteredAndSortedParticipants, getNextBirthday } from './utils';

interface LulusInteractiveProps {
  initialParticipants: Person[];
}

const LulusInteractive = ({ initialParticipants }: LulusInteractiveProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('date');
  const [filterMonth, setFilterMonth] = useState('all');

  const { user, isLoading } = useUserVerification();

  const { data: participants = initialParticipants } = useQuery({
    queryKey: ['get-all-participants'],
    queryFn: fetchParticipants,
    initialData: initialParticipants,
    refetchOnMount: true,
    staleTime: 0,
  });
  const participantsList = participants;

  const totalParticipants = useMemo(
    () => participantsList.filter((p) => p.gives_to_id !== 0).length,
    [participantsList]
  );

  const nextBirthday = useMemo(
    () => getNextBirthday(participantsList),
    [participantsList]
  );

  const filteredParticipants = useMemo(
    () =>
      filteredAndSortedParticipants(
        participantsList,
        searchTerm,
        filterMonth,
        sortBy
      ),
    [participantsList, searchTerm, filterMonth, sortBy]
  );

  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center">
        <BounceLoader color="#F43F5E" />
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8">
      <div className="flex justify-end">
        <Badge variant="secondary" className="mb-4 bg-primary">
          <Users className="mr-2 h-4 w-4" />
          {totalParticipants} Participantes na vaquinha
        </Badge>
      </div>

      {nextBirthday && (
        <div className="mb-8">
          <LulusCardHome
            participant={nextBirthday}
            isNextBirthday
            user={!!user}
            participants={participantsList}
            showDetails={false}
          />
        </div>
      )}

      <div>
        <Filter
          filterMonth={filterMonth}
          setFilterMonth={setFilterMonth}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          sortBy={sortBy}
          setSortBy={setSortBy}
        />

        <div className="grid grid-cols-1 gap-2 overflow-auto md:grid-cols-2 lg:grid-cols-4">
          {filteredParticipants.map((participant) => (
            <LulusCardHome
              key={participant.id}
              participant={participant}
              isNextBirthday={nextBirthday?.id === participant.id}
              user={!!user}
              participants={participantsList}
            />
          ))}
        </div>

        {filteredParticipants.length === 0 && (
          <Card className="cursor-pointer transform bg-card/90 backdrop-blur transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
            <CardContent className="p-6">
              <div className="flex flex-col items-center justify-center gap-2">
                <h2 className="font-sans text-2xl font-semibold text-primary animate-fade-in">
                  Nenhuma participante encontrada
                </h2>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default LulusInteractive;
