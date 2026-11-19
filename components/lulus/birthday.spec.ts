import { describe, it, expect } from 'vitest';
import {
  formatDate,
  getNextBirthday,
  getDaysUntilBirthday,
  groupBirthdaysByMonthFrom,
  getTodayKey,
  todayFromKey,
} from './birthday';
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

describe('birthday', () => {
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

  describe('getDaysUntilBirthday', () => {
    const today = new Date(2026, 10, 18, 15, 30);

    it('conta dias até a data no ano corrente', () => {
      expect(getDaysUntilBirthday('1980-11-27', today)).toBe(9);
    });

    it('vira o ano quando a data já passou', () => {
      expect(getDaysUntilBirthday('1980-01-10', today)).toBe(53);
    });

    it('retorna 0 no dia do aniversário', () => {
      expect(getDaysUntilBirthday('1980-11-18', today)).toBe(0);
    });

    it('usa dia/mês UTC da data salva', () => {
      expect(getDaysUntilBirthday(new Date('1980-11-19'), today)).toBe(1);
    });

    it('29/02 em ano não bissexto conta até 01/03', () => {
      expect(getDaysUntilBirthday('1980-02-29', new Date(2027, 1, 27))).toBe(2);
    });
  });

  describe('groupBirthdaysByMonthFrom', () => {
    const make = (id: number, date: string): Person => ({
      id,
      name: `P${id}`,
      fullName: `P${id}`,
      date,
      month: date.slice(5, 7),
      city: 'C',
    });
    const people = [
      make(1, '1980-01-10'),
      make(2, '1990-11-25'),
      make(3, '1991-11-03'),
      make(4, '1992-12-01'),
    ];
    const today = new Date(2026, 10, 18);

    it('starts at the current month and marks it', () => {
      const groups = groupBirthdaysByMonthFrom(people, today);
      expect(groups[0].monthIndex).toBe(10);
      expect(groups[0].isCurrent).toBe(true);
      expect(groups[0].label).toBe('Novembro');
    });

    it('places January after December', () => {
      const groups = groupBirthdaysByMonthFrom(people, today);
      expect(groups.map((g) => g.monthIndex)).toEqual([10, 11, 0]);
    });

    it('omits empty months', () => {
      const groups = groupBirthdaysByMonthFrom(people, today);
      expect(groups.every((g) => g.people.length > 0)).toBe(true);
    });

    it('sorts people by day and reads UTC day', () => {
      const groups = groupBirthdaysByMonthFrom(people, today);
      expect(groups[0].people.map((p) => p.day)).toEqual([3, 25]);
      expect(groups[2].people[0].day).toBe(10);
    });
  });

  describe('getTodayKey', () => {
    it('returns the São Paulo date when UTC has already moved to the next day', () => {
      expect(getTodayKey(new Date('2026-11-19T01:30:00Z'))).toBe('2026-11-18');
    });

    it('returns the next day once midnight passes in São Paulo', () => {
      expect(getTodayKey(new Date('2026-11-19T03:30:00Z'))).toBe('2026-11-19');
    });

    it('accepts a custom time zone', () => {
      expect(getTodayKey(new Date('2026-11-19T01:30:00Z'), 'UTC')).toBe(
        '2026-11-19'
      );
    });
  });

  describe('todayFromKey', () => {
    it('builds a local date at midnight from the key', () => {
      const date = todayFromKey('2026-11-18');
      expect(date.getFullYear()).toBe(2026);
      expect(date.getMonth()).toBe(10);
      expect(date.getDate()).toBe(18);
      expect(date.getHours()).toBe(0);
    });

    it('round-trips with getDaysUntilBirthday', () => {
      expect(
        getDaysUntilBirthday(new Date('1990-11-19'), todayFromKey('2026-11-18'))
      ).toBe(1);
    });
  });
});
