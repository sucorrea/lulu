'use client';

import { useCallback, useMemo, useState } from 'react';
import { Dices, Users } from 'lucide-react';
import Link from 'next/link';
import dynamic from 'next/dynamic';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useUserVerification } from '@/hooks/user-verify';
import { useQuery } from '@tanstack/react-query';

import { getParticipantsWithEditTokens } from '@/app/actions/participants';
import { useGetCurrentYearAssignments } from '@/services/queries/vaquinhaHistory';

import LulusCardHome from './lulu-card/lulu-card-home';
import { Person } from './types';
import { filteredAndSortedParticipantsV2, getNextBirthday } from './utils';
import BadgeLulu from './badge-lulu';

const Filter = dynamic(() => import('./filter/filter'), {
  ssr: false,
  loading: () => (
    <div className="mb-6 h-10 animate-pulse rounded-lg bg-muted" aria-hidden />
  ),
});

const BadgeLuluParticipants = dynamic(
  () => import('./badge-lulu-participants'),
  { ssr: false }
);

interface LulusInteractiveProps {
  initialParticipants: Person[];
}

const LulusInteractive = ({ initialParticipants }: LulusInteractiveProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('date');
  const [filterMonth, setFilterMonth] = useState('all');

  const { user } = useUserVerification();
  const { data: assignments } = useGetCurrentYearAssignments();

  const { data: participantsList = initialParticipants } = useQuery({
    queryKey: ['get-all-participants-with-tokens'],
    queryFn: getParticipantsWithEditTokens,
    initialData: initialParticipants,
    staleTime: 5 * 60 * 1000,
  });

  const nextBirthday = useMemo(
    () => getNextBirthday(participantsList),
    [participantsList]
  );

  const daysForBirthday = useMemo(() => {
    if (!nextBirthday) {
      return 0;
    }
    const today = new Date();
    const currentYear = today.getFullYear();
    const bd = new Date(nextBirthday.date);
    const next = new Date(currentYear, bd.getMonth(), bd.getDate());
    if (today > next) {
      next.setFullYear(currentYear + 1);
    }
    return Math.ceil(
      Math.abs(next.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
    );
  }, [nextBirthday]);

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

  return (
    <div className="min-h-screen">
      <BadgeLulu text={`Somos ${participantsList.length} Lulus`} />
      <BadgeLuluParticipants />
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
            daysForBirthday={daysForBirthday}
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
          {filteredParticipants.map((participant, index) => (
            <div
              key={participant.id}
              className={
                index > 1
                  ? '[content-visibility:auto] [contain-intrinsic-size:auto_320px]'
                  : undefined
              }
            >
              <LulusCardHome
                participant={participant}
                user={!!user}
                participants={participantsList}
              />
            </div>
          ))}
        </div>
        {filteredParticipants.length === 0 && (
          <Card className="border-dashed border-2">
            <CardContent className="p-12 text-center">
              <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-muted">
                <Users className="h-10 w-10 text-muted-foreground" />
              </div>
              <h2 className="mb-2 text-xl font-semibold text-foreground">
                Nenhuma participante encontrada
              </h2>
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
