import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { useCallback, useMemo } from 'react';
import { DEFAULT_LIMIT, ALL_PARTICIPANTS_VALUE } from './constants';
import { AuditFilters } from './types';

export const useAuditFilters = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const filters = useMemo<AuditFilters>(() => {
    const participantId =
      searchParams.get('participant') ?? ALL_PARTICIPANTS_VALUE;
    const limit = Number(searchParams.get('limit')) || DEFAULT_LIMIT;
    const search = searchParams.get('search') ?? '';

    return {
      participantId,
      limit,
      search,
    };
  }, [searchParams]);

  const updateParam = useCallback(
    (key: string, value: string | null) => {
      const params = new URLSearchParams(searchParams.toString());

      if (value === null || value === '') {
        params.delete(key);
      } else {
        params.set(key, value);
      }

      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [pathname, router, searchParams]
  );

  const setParticipantId = useCallback(
    (participantId: string) => {
      updateParam(
        'participant',
        participantId === ALL_PARTICIPANTS_VALUE ? null : participantId
      );
    },
    [updateParam]
  );

  const setLimit = useCallback(
    (limit: number) => {
      updateParam('limit', limit === DEFAULT_LIMIT ? null : String(limit));
    },
    [updateParam]
  );

  const setSearch = useCallback(
    (search: string) => {
      updateParam('search', search || null);
    },
    [updateParam]
  );

  return {
    filters,
    setParticipantId,
    setLimit,
    setSearch,
  };
};
