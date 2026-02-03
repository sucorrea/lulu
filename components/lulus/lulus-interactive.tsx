'use client';

import { useMemo, useState } from 'react';
import BounceLoader from 'react-spinners/BounceLoader';
import { Users } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { useUserVerification } from '@/hooks/user-verify';

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

  const totalParticipants = useMemo(
    () => initialParticipants.filter((p) => p.gives_to_id !== 0).length,
    [initialParticipants]
  );

  const nextBirthday = useMemo(
    () => getNextBirthday(initialParticipants),
    [initialParticipants]
  );

  const filteredParticipants = useMemo(
    () =>
      filteredAndSortedParticipants(
        initialParticipants,
        searchTerm,
        filterMonth,
        sortBy
      ),
    [initialParticipants, searchTerm, filterMonth, sortBy]
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
            participants={initialParticipants}
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
              participants={initialParticipants}
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
