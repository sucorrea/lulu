'use client';

import { useMemo, useState } from 'react';
import { Users } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useUserVerification } from '@/hooks/user-verify';
import { useQuery } from '@tanstack/react-query';

import { getParticipantsWithEditTokens } from '@/app/actions/participants';

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
    queryFn: getParticipantsWithEditTokens,
    initialData: initialParticipants,
    staleTime: 5 * 60 * 1000,
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

  const emptyStateMessage = useMemo(() => {
    if (searchTerm) {
      return `Não encontramos resultados para "${searchTerm}"`;
    }

    if (filterMonth === 'all') {
      return 'Tente ajustar os filtros de busca';
    }

    return 'Nenhuma participante encontrada neste mês';
  }, [searchTerm, filterMonth]);

  if (isLoading) {
    return (
      <div className="min-h-screen p-4 sm:p-6 md:p-8">
        <div className="mb-6">
          <div className="h-9 w-48 rounded-lg bg-muted animate-pulse" />
          <div className="h-4 w-64 mt-2 rounded bg-muted animate-pulse" />
        </div>

        <div className="space-y-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i} className="lulu-card mx-auto max-w-md">
              <CardContent className="p-4">
                <div className="flex gap-4 items-start">
                  <div className="h-20 w-20 rounded-full bg-muted animate-pulse shrink-0" />
                  <div className="flex-1 space-y-3 min-w-0">
                    <div className="h-6 w-32 rounded bg-muted animate-pulse" />
                    <div className="flex gap-2">
                      <div className="h-6 w-24 rounded-full bg-muted animate-pulse" />
                      <div className="h-6 w-20 rounded-full bg-muted animate-pulse" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 sm:p-6 md:p-8">
      <div className="flex md:justify-end xs:justify-center mb-2">
        <Badge
          variant="secondary"
          className="w-fit bg-primary px-3 py-2 text-sm shadow-lulu-sm"
        >
          <Users className="mr-2 h-4 w-4 shrink-0" />
          <span className="font-semibold">
            {totalParticipants} Participantes
          </span>
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

        <div className="grid grid-cols-1 gap-2 overflow-auto md:grid-cols-2 lg:grid-cols-3">
          {filteredParticipants.map((participant) => (
            <LulusCardHome
              key={participant.id}
              participant={participant}
              user={!!user}
              participants={participantsList}
            />
          ))}
        </div>

        {filteredParticipants.length === 0 && (
          <Card className="border-dashed border-2">
            <CardContent className="p-12 text-center">
              <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-muted">
                <Users className="h-10 w-10 text-muted-foreground" />
              </div>
              <h3 className="mb-2 text-xl font-semibold text-foreground">
                Nenhuma participante encontrada
              </h3>
              <p className="mb-6 text-sm text-muted-foreground">
                {emptyStateMessage}
              </p>
              {(searchTerm || filterMonth !== 'all') && (
                <Button
                  onClick={() => {
                    setSearchTerm('');
                    setFilterMonth('all');
                  }}
                  variant="outline"
                  className="gap-2"
                >
                  Limpar filtros
                </Button>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default LulusInteractive;
