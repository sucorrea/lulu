import { describe, it, expect } from 'vitest';
import {
  getParticipantPhotoUrl,
  getSigno,
  getGivesToPicture,
  filteredAndSortedParticipantsV2,
  formatDate,
  getNextBirthday,
  birthdayStats,
  signsStats,
  formatDates,
  getInitials,
  NameKey,
  meses,
} from './utils';
import { Person } from './types';
import { cn } from '@/lib/utils';

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

describe('utils', () => {
  describe('getParticipantPhotoUrl', () => {
    it('should return empty string when no photo available', () => {
      const person = { ...mockPerson, photoURL: undefined, picture: undefined };
      expect(getParticipantPhotoUrl(person)).toBe('');
    });

    it('should return photoURL with version parameter', () => {
      const result = getParticipantPhotoUrl(mockPerson);
      expect(result).toBe('https://example.com/photo.jpg?v=12345');
    });

    it('should return photoURL without version when photoUpdatedAt is not present', () => {
      const person = { ...mockPerson, photoUpdatedAt: undefined };
      const result = getParticipantPhotoUrl(person);
      expect(result).toBe('https://example.com/photo.jpg');
    });

    it('should use picture as fallback', () => {
      const person = {
        ...mockPerson,
        photoURL: undefined,
        picture: 'https://example.com/picture.jpg',
        photoUpdatedAt: 12345,
      };
      const result = getParticipantPhotoUrl(person);
      expect(result).toBe('https://example.com/picture.jpg?v=12345');
    });

    it('should use & separator when URL already has query params', () => {
      const person = {
        ...mockPerson,
        photoURL: 'https://example.com/photo.jpg?existing=param',
      };
      const result = getParticipantPhotoUrl(person);
      expect(result).toBe(
        'https://example.com/photo.jpg?existing=param&v=12345'
      );
    });
  });

  describe('getSigno', () => {
    it('should return Áries for March 21', () => {
      const result = getSigno(new Date(2000, 2, 21));
      expect(result.label).toBe('Áries');
      expect(result.value).toBe('aries');
    });

    it('should return Touro for April 21', () => {
      const result = getSigno(new Date(2000, 3, 21));
      expect(result.label).toBe('Touro');
      expect(result.value).toBe('touro');
    });

    it('should return Gêmeos for May 21', () => {
      const result = getSigno(new Date(2000, 4, 21));
      expect(result.label).toBe('Gêmeos');
      expect(result.value).toBe('gemeos');
    });

    it('should return Câncer for June 21', () => {
      const result = getSigno(new Date(2000, 5, 21));
      expect(result.label).toBe('Câncer');
      expect(result.value).toBe('cancer');
    });

    it('should return Leão for July 23', () => {
      const result = getSigno(new Date(2000, 6, 23));
      expect(result.label).toBe('Leão');
      expect(result.value).toBe('leao');
    });

    it('should return Virgem for August 23', () => {
      const result = getSigno(new Date(2000, 7, 23));
      expect(result.label).toBe('Virgem');
      expect(result.value).toBe('virgem');
    });

    it('should return Libra for September 23', () => {
      const result = getSigno(new Date(2000, 8, 23));
      expect(result.label).toBe('Libra');
      expect(result.value).toBe('libra');
    });

    it('should return Escorpião for October 23', () => {
      const result = getSigno(new Date(2000, 9, 23));
      expect(result.label).toBe('Escorpião');
      expect(result.value).toBe('escorpiao');
    });

    it('should return Sagitário for November 22', () => {
      const result = getSigno(new Date(2000, 10, 22));
      expect(result.label).toBe('Sagitário');
      expect(result.value).toBe('sagitario');
    });

    it('should return Capricórnio for December 22', () => {
      const result = getSigno(new Date(2000, 11, 22));
      expect(result.label).toBe('Capricórnio');
      expect(result.value).toBe('capricornio');
    });

    it('should return Aquário for January 21', () => {
      const result = getSigno(new Date(2000, 0, 21));
      expect(result.label).toBe('Aquário');
      expect(result.value).toBe('aquario');
    });

    it('should return Peixes for February 19', () => {
      const result = getSigno(new Date(2000, 1, 19));
      expect(result.label).toBe('Peixes');
      expect(result.value).toBe('peixes');
    });
  });

  describe('getGivesToPicture', () => {
    const participants: Person[] = [
      { ...mockPerson, id: 1, name: 'Person 1' },
      { ...mockPerson, id: 2, name: 'Person 2' },
      { ...mockPerson, id: 3, name: 'Person 3' },
    ];

    it('should return the correct person by id', () => {
      const result = getGivesToPicture(2, participants);
      expect(result.name).toBe('Person 2');
    });

    it('should return empty object when person not found', () => {
      const result = getGivesToPicture(999, participants);
      expect(result).toEqual({});
    });

    it('should handle empty participants array', () => {
      const result = getGivesToPicture(1, []);
      expect(result).toEqual({});
    });
  });

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

  describe('formatDate', () => {
    it('should format date correctly', () => {
      const date = new Date('2000-05-15');
      const result = formatDate(date);
      expect(result).toMatch(/15\/05/);
    });

    it('should handle timezone offset', () => {
      const date = new Date('2000-12-31');
      const result = formatDate(date);
      expect(result).toMatch(/31\/12/);
    });
  });

  describe('getNextBirthday', () => {
    it('should return the next birthday person', () => {
      const today = new Date();
      const nextMonth = new Date(today);
      nextMonth.setMonth(today.getMonth() + 1);

      const participants: Person[] = [
        { ...mockPerson, id: 1, name: 'Alice', date: nextMonth },
        {
          ...mockPerson,
          id: 2,
          name: 'Bob',
          date: new Date(today.getFullYear() - 1, 0, 1),
        },
      ];

      const result = getNextBirthday(participants);
      expect(result).not.toBeNull();
    });

    it('should return null for empty array', () => {
      const result = getNextBirthday([]);
      expect(result).toBeNull();
    });

    it('should handle birthday today', () => {
      const today = new Date();
      const participants: Person[] = [
        { ...mockPerson, id: 1, name: 'Alice', date: today },
      ];
      const result = getNextBirthday(participants);
      expect(result).not.toBeNull();
    });

    it('should handle birthday in next year', () => {
      const today = new Date();
      const lastMonth = new Date(today);
      lastMonth.setMonth(today.getMonth() - 1);

      const participants: Person[] = [
        { ...mockPerson, id: 1, name: 'Alice', date: lastMonth },
      ];

      const result = getNextBirthday(participants);
      expect(result).not.toBeNull();
      expect(result?.name).toBe('Alice');
    });
  });

  describe('birthdayStats', () => {
    it('should return stats for all months', () => {
      const participants: Person[] = [
        { ...mockPerson, id: 1, date: new Date('2000-01-15') },
        { ...mockPerson, id: 2, date: new Date('2000-01-20') },
        { ...mockPerson, id: 3, date: new Date('2000-02-15') },
      ];

      const result = birthdayStats(participants);
      expect(result).toHaveLength(12);
      expect(result[0].total).toBe(2);
      expect(result[1].total).toBe(1);
      expect(result[2].total).toBe(0);
    });

    it('should handle empty participants', () => {
      const result = birthdayStats([]);
      expect(result).toHaveLength(12);
      expect(result.every((stat) => stat.total === 0)).toBe(true);
    });
  });

  describe('signsStats', () => {
    it('should return stats for zodiac signs', () => {
      const participants: Person[] = [
        { ...mockPerson, id: 1, date: new Date(2000, 2, 21) },
        { ...mockPerson, id: 2, date: new Date(2000, 2, 25) },
        { ...mockPerson, id: 3, date: new Date(2000, 3, 25) },
      ];

      const result = signsStats(participants);
      expect(result.length).toBeGreaterThan(0);
      const aries = result.find((s) => s.name === 'Áries');
      expect(aries?.total).toBe(2);
    });

    it('should handle empty participants', () => {
      const result = signsStats([]);
      expect(result).toEqual([]);
    });

    it('should handle various zodiac signs', () => {
      const participants: Person[] = [
        { ...mockPerson, id: 1, date: new Date('2000-01-15') },
        { ...mockPerson, id: 2, date: new Date('2000-05-15') },
        { ...mockPerson, id: 3, date: new Date('2000-09-15') },
      ];

      const result = signsStats(participants);
      expect(result.length).toBeGreaterThan(0);
    });
  });

  describe('cn', () => {
    it('should merge class names', () => {
      const result = cn('text-red-500', 'bg-blue-500');
      expect(result).toContain('text-red-500');
      expect(result).toContain('bg-blue-500');
    });

    it('should handle undefined and null', () => {
      const result = cn('base-class', undefined, null);
      expect(result).toContain('base-class');
    });
  });

  describe('formatDates', () => {
    it('should format date in English format', () => {
      const date = new Date(2024, 4, 15);
      const result = formatDates(date);
      expect(result).toContain('May');
      expect(result).toContain('15');
    });

    it('should handle different months', () => {
      const date = new Date(2024, 11, 25);
      const result = formatDates(date);
      expect(result).toContain('December');
      expect(result).toContain('25');
    });
  });

  describe('getInitials', () => {
    it('should return initials from full name', () => {
      const result = getInitials('John Doe');
      expect(result).toBe('JD');
    });

    it('should return first two letters for single name', () => {
      const result = getInitials('John');
      expect(result).toBe('J');
    });

    it('should handle three names', () => {
      const result = getInitials('John Middle Doe');
      expect(result).toBe('JM');
    });

    it('should convert to uppercase', () => {
      const result = getInitials('john doe');
      expect(result).toBe('JD');
    });

    it('should handle empty string', () => {
      const result = getInitials('');
      expect(result).toBe('');
    });
  });

  describe('NameKey', () => {
    it('should have correct mappings', () => {
      expect(NameKey.cpf).toBe('CPF');
      expect(NameKey.email).toBe('Email');
      expect(NameKey.phone).toBe('Celular');
      expect(NameKey.random).toBe('Aleatório');
      expect(NameKey.none).toBe('Nenhum');
    });
  });

  describe('meses', () => {
    it('should have 12 months', () => {
      expect(meses).toHaveLength(12);
    });

    it('should have correct structure', () => {
      expect(meses[0]).toHaveProperty('value');
      expect(meses[0]).toHaveProperty('label');
      expect(meses[0].value).toBe('01');
      expect(meses[0].label).toBe('Janeiro');
    });

    it('should have all months in order', () => {
      expect(meses[11].label).toBe('Dezembro');
      expect(meses[11].value).toBe('12');
    });
  });
});
