import { describe, it, expect, vi } from 'vitest';

import type { VaquinhaHistory } from '@/services/vaquinhaHistory';

vi.mock('@/services/queries/fetchParticipants', () => ({
  useGetAllParticipants: vi.fn(),
}));
vi.mock('@/services/queries/vaquinhaHistory', () => ({
  useBatchAddVaquinhaHistory: vi.fn(),
  useGetVaquinhaHistoryByYear: vi.fn(),
}));

import { toSorteioPairs } from './use-sorteio';

describe('toSorteioPairs', () => {
  it('should map saved history to preview pairs', () => {
    const history = [
      {
        id: 'h1',
        year: 2026,
        responsibleId: 1,
        responsibleName: 'Ana',
        birthdayPersonId: 2,
        birthdayPersonName: 'Bia',
        birthdayDate: '1980-06-15',
      },
    ] as VaquinhaHistory[];

    expect(toSorteioPairs(history)).toEqual([
      {
        responsibleId: 1,
        responsibleName: 'Ana',
        birthdayPersonId: 2,
        birthdayPersonName: 'Bia',
        birthdayDate: '1980-06-15',
      },
    ]);
  });

  it('should return an empty list for empty history', () => {
    expect(toSorteioPairs([])).toEqual([]);
  });
});
