'use client';

import { useCallback, useMemo, useState } from 'react';
import { Dices, GiftIcon, Users } from 'lucide-react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useUserVerification } from '@/hooks/user-verify';
import { useQuery } from '@tanstack/react-query';

import { getParticipantsWithEditTokens } from '@/app/actions/participants';
import { useGetCurrentYearAssignments } from '@/services/queries/vaquinhaHistory';

import Filter from './filter/filter';
import LulusCardHome from './lulu-card/lulu-card-home';
import { Person } from './types';
import { filteredAndSortedParticipantsV2, getNextBirthday } from './utils';
import SkeletonLulusInteractive from './skeleton-lulus-interactive';
import BadgeLulu from './badge-lulu';

interface LulusInteractiveProps {
  initialParticipants: Person[];
}

const LulusInteractive = ({ initialParticipants }: LulusInteractiveProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('date');
  const [filterMonth, setFilterMonth] = useState('all');

  const { user, isLoading } = useUserVerification();
  const {
    data: assignments,
    isLoading: assignmentsLoading,
    isError: assignmentsError,
  } = useGetCurrentYearAssignments();

  const { data: participants = initialParticipants } = useQuery({
    queryKey: ['get-all-participants-with-tokens'],
    queryFn: getParticipantsWithEditTokens,
    initialData: initialParticipants,
    staleTime: 5 * 60 * 1000,
  });
  const participantsList = participants;

  const totalParticipants = useMemo(() => {
    if (assignmentsLoading || assignmentsError) {
      return null;
    }
    return Object.keys(assignments?.byBirthday ?? {}).length;
  }, [assignments, assignmentsLoading, assignmentsError]);

  const nextBirthday = useMemo(
    () => getNextBirthday(participantsList),
    [participantsList]
  );

  const filteredParticipants = useMemo(
    () =>
      filteredAndSortedParticipantsV2(
        participantsList,
        searchTerm,
        filterMonth,
        sortBy,
        assignments?.byResponsible
      ),
    [participantsList, searchTerm, filterMonth, sortBy, assignments]
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

  const clearFilters = useCallback(() => {
    setSearchTerm('');
    setFilterMonth('all');
  }, []);

  if (isLoading) {
    return <SkeletonLulusInteractive />;
  }

  return (
    <div className="min-h-screen p-4 sm:p-6 md:p-8">
      <BadgeLulu text={`Somos ${participantsList.length} Lulus`} />
      <BadgeLulu
        text={`${totalParticipants ?? '—'} Participantes da vaquinha`}
        icon={<GiftIcon className="mr-2 h-4 w-4 shrink-0" />}
      />
      {!!user && (
        <div className="mb-4 flex justify-end">
          <Button asChild variant="outline" size="sm">
            <Link href="/sorteio">
              <Dices className="h-4 w-4 mr-2" />
              Sorteio
            </Link>
          </Button>
        </div>
      )}
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
                  onClick={clearFilters}
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
