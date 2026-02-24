'use client';

import { useMemo } from 'react';
import { GiftIcon } from 'lucide-react';

import { useGetCurrentYearAssignments } from '@/services/queries/vaquinhaHistory';
import BadgeLulu from './badge-lulu';

const BadgeLuluParticipants = () => {
  const {
    data: assignments,
    isLoading: assignmentsLoading,
    isError: assignmentsError,
  } = useGetCurrentYearAssignments();

  const totalParticipants = useMemo(() => {
    if (assignmentsLoading || assignmentsError) {
      return null;
    }
    return Object.keys(assignments?.byBirthday ?? {}).length;
  }, [assignments, assignmentsLoading, assignmentsError]);

  return (
    <BadgeLulu
      text={`${totalParticipants ?? '—'} Participantes da vaquinha`}
      icon={<GiftIcon className="mr-2 h-4 w-4 shrink-0" />}
    />
  );
};

export default BadgeLuluParticipants;
