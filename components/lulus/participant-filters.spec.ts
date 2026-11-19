import { describe, it, expect } from 'vitest';
import {
  filteredAndSortedParticipantsV2,
  SORT_UPCOMING,
} from './participant-filters';
import { getNextBirthday } from './birthday';
import { Person } from './types';

const mockPerson: Person = {
  id: 1,
  name: 'Test Person',
  fullName: 'Test Person Full',
  date: new Date('1990-05-15'),
  month: '05',
  city: 'Test City',
  photoURL: 'https://example.com/photo.jpg',
  photoUpdatedAt: 12345,
};

describe('participant-filters', () => {
  describe('filteredAndSortedParticipantsV2', () => {
    const participants: Person[] = [
      { ...mockPerson, id: 1, name: 'Alice', month: '01' },
      { ...mockPerson, id: 2, name: 'Bob', month: '02' },
      { ...mockPerson, id: 3, name: 'Charlie', month: '03' },
      { ...mockPerson, id: 4, name: 'David', month: '04' },
    ];

    it('should filter by search term', () => {
      const result = filteredAndSortedParticipantsV2(
        participants,
        'alice',
        'all',
        'name'
      );
      expect(result).toHaveLength(1);
      expect(result.map((p) => p.name)).toContain('Alice');
    });

    it('should filter by month', () => {
      const result = filteredAndSortedParticipantsV2(
        participants,
        '',
        '01',
        'name'
      );
      expect(result).toHaveLength(1);
      expect(result[0].month).toBe('01');
    });

    it('should sort by name', () => {
      const result = filteredAndSortedParticipantsV2(
        participants,
        '',
        'all',
        'name'
      );
      expect(result[0].name).toBe('Alice');
      expect(result[1].name).toBe('Bob');
      expect(result[2].name).toBe('Charlie');
    });

    it('should sort by date', () => {
      const participantsWithDates: Person[] = [
        {
          ...mockPerson,
          id: 1,
          name: 'Alice',
          month: '03',
          date: new Date('2000-03-15'),
        },
        {
          ...mockPerson,
          id: 2,
          name: 'Bob',
          month: '01',
          date: new Date('2000-01-10'),
        },
        {
          ...mockPerson,
          id: 3,
          name: 'Charlie',
          month: '02',
          date: new Date('2000-02-20'),
        },
      ];
      const result = filteredAndSortedParticipantsV2(
        participantsWithDates,
        '',
        'all',
        'date'
      );
      expect(result[0].name).toBe('Bob');
      expect(result[1].name).toBe('Charlie');
      expect(result[2].name).toBe('Alice');
    });

    it('should read the stored UTC day when sorting by date in a negative offset timezone', () => {
      const originalTz = process.env.TZ;
      process.env.TZ = 'America/Sao_Paulo';
      try {
        const sameMonth: Person[] = [
          {
            ...mockPerson,
            id: 1,
            name: 'Quinze',
            month: '03',
            date: new Date('1980-03-15'),
          },
          {
            ...mockPerson,
            id: 2,
            name: 'Primeiro',
            month: '03',
            date: new Date('1980-03-01'),
          },
        ];
        const result = filteredAndSortedParticipantsV2(
          sameMonth,
          '',
          'all',
          'date'
        );
        expect(result.map((p) => p.name)).toEqual(['Primeiro', 'Quinze']);
      } finally {
        if (originalTz === undefined) {
          delete process.env.TZ;
        } else {
          process.env.TZ = originalTz;
        }
      }
    });

    it('should filter by gives_to search term', () => {
      const result = filteredAndSortedParticipantsV2(
        participants,
        'bob',
        'all',
        'name'
      );
      expect(result).toHaveLength(1);
    });

    it('should handle default sort', () => {
      const result = filteredAndSortedParticipantsV2(
        participants,
        '',
        'all',
        'unknown'
      );
      expect(result).toHaveLength(4);
    });
  });

  describe('ordenação por próximas', () => {
    const fixedToday = new Date(2026, 10, 18);
    const people: Person[] = [
      { ...mockPerson, id: 1, name: 'A', date: '1980-01-10', month: '01' },
      { ...mockPerson, id: 2, name: 'B', date: '1980-11-27', month: '11' },
      { ...mockPerson, id: 3, name: 'C', date: '1980-11-18', month: '11' },
      { ...mockPerson, id: 4, name: 'D', date: '1980-06-05', month: '06' },
    ];

    it('ordena por próximas a partir de hoje com sortBy "upcoming"', () => {
      const result = filteredAndSortedParticipantsV2(
        people,
        '',
        'all',
        SORT_UPCOMING,
        undefined,
        fixedToday
      );
      expect(result.map((p) => p.id)).toEqual([3, 2, 1, 4]);
    });

    it('getNextBirthday devolve quem faz aniversário hoje', () => {
      const result = getNextBirthday(
        [
          { ...mockPerson, id: 1, name: 'A', date: '1980-11-18' },
          { ...mockPerson, id: 2, name: 'B', date: '1980-11-20' },
        ],
        new Date(2026, 10, 18, 20)
      );
      expect(result?.id).toBe(1);
    });

    it('getNextBirthday desempata pelo nome', () => {
      const result = getNextBirthday(
        [
          { ...mockPerson, id: 1, name: 'Zoe', date: '1980-11-20' },
          { ...mockPerson, id: 2, name: 'Ana', date: '1980-11-20' },
        ],
        fixedToday
      );
      expect(result?.id).toBe(2);
    });
  });
});
