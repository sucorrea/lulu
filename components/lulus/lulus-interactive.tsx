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
import {
  filteredAndSortedParticipantsV2,
  SORT_UPCOMING,
} from './participant-filters';
import {
  getDaysUntilBirthday,
  getNextBirthday,
  getTodayKey,
  todayFromKey,
} from './birthday';
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
  todayKey?: string;
}

const LulusInteractive = ({
  initialParticipants,
  todayKey,
}: LulusInteractiveProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<string>(SORT_UPCOMING);
  const [filterMonth, setFilterMonth] = useState('all');

  const { isAdmin } = useUserVerification();
  const { data: assignments } = useGetCurrentYearAssignments();

  const { data: participantsList = initialParticipants } = useQuery({
    queryKey: ['get-all-participants-with-tokens'],
    queryFn: getParticipantsWithEditTokens,
    initialData: initialParticipants,
    staleTime: 5 * 60 * 1000,
  });

  const today = useMemo(
    () => todayFromKey(todayKey ?? getTodayKey()),
    [todayKey]
  );

  const nextBirthday = useMemo(
    () => getNextBirthday(participantsList, today),
    [participantsList, today]
  );

  const filteredParticipants = useMemo(
    () =>
      filteredAndSortedParticipantsV2(
        participantsList,
        searchTerm,
        filterMonth,
        sortBy,
        assignments?.byResponsible,
        today
      ),
    [participantsList, searchTerm, filterMonth, sortBy, assignments, today]
  );

  const featured = useMemo(
    () =>
      nextBirthday && filteredParticipants.some((p) => p.id === nextBirthday.id)
        ? nextBirthday
        : null,
    [nextBirthday, filteredParticipants]
  );

  const listParticipants = useMemo(
    () =>
      featured
        ? filteredParticipants.filter((p) => p.id !== featured.id)
        : filteredParticipants,
    [featured, filteredParticipants]
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
      <div className="mb-5 flex flex-wrap items-center gap-y-2 divide-x divide-accent/60">
        <BadgeLulu value={participantsList.length} label="Lulus" />
        <BadgeLuluParticipants />
      </div>
      {isAdmin && (
        <div className="mb-4 flex justify-end">
          <Button asChild variant="outline" size="sm">
            <Link href="/sorteio">
              <Dices className="h-4 w-4 mr-2" />
              Sorteio
            </Link>
          </Button>
        </div>
      )}
      {featured && (
        <div className="mb-6">
          <LulusCardHome
            participant={featured}
            variant="featured"
            daysUntil={getDaysUntilBirthday(featured.date, today)}
            user={isAdmin}
            participants={participantsList}
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
        <div className="grid grid-cols-1 gap-3 overflow-auto md:grid-cols-2 lg:grid-cols-3">
          {listParticipants.map((participant, index) => (
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
                daysUntil={getDaysUntilBirthday(participant.date, today)}
                user={isAdmin}
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
