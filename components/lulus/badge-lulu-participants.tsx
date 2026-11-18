'use client';

import { useMemo } from 'react';

import { CURRENT_YEAR } from '@/lib/constants';
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
      text={`${totalParticipants ?? '—'} na vaquinha em ${CURRENT_YEAR}`}
    />
  );
};

export default BadgeLuluParticipants;
