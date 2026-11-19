import { describe, it, expect } from 'vitest';
import { getSigno, ZODIAC_ICONS, signsStats } from './zodiac';
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

describe('zodiac', () => {
  describe('getSigno', () => {
    it('should read stored UTC dates on the right day at sign boundaries', () => {
      expect(getSigno(new Date('1980-03-21')).label).toBe('Áries');
      expect(getSigno(new Date('1980-03-20')).label).toBe('Peixes');
      expect(getSigno(new Date('1980-12-22')).label).toBe('Capricórnio');
      expect(getSigno(new Date('1980-11-22')).label).toBe('Sagitário');
    });

    it('should return Áries for March 21', () => {
      const result = getSigno(new Date(2000, 2, 21));
      expect(result.label).toBe('Áries');
      expect(result.value).toBe('aries');
      expect(result.icon).toBe('aries');
    });

    it('should return Touro for April 21', () => {
      const result = getSigno(new Date(2000, 3, 21));
      expect(result.label).toBe('Touro');
      expect(result.value).toBe('touro');
      expect(result.icon).toBe('taurus');
    });

    it('should return Gêmeos for May 21', () => {
      const result = getSigno(new Date(2000, 4, 21));
      expect(result.label).toBe('Gêmeos');
      expect(result.value).toBe('gemeos');
      expect(result.icon).toBe('gemini');
    });

    it('should return Câncer for June 21', () => {
      const result = getSigno(new Date(2000, 5, 21));
      expect(result.label).toBe('Câncer');
      expect(result.value).toBe('cancer');
      expect(result.icon).toBe('cancer');
    });

    it('should return Leão for July 23', () => {
      const result = getSigno(new Date(2000, 6, 23));
      expect(result.label).toBe('Leão');
      expect(result.value).toBe('leao');
      expect(result.icon).toBe('leo');
    });

    it('should return Virgem for August 23', () => {
      const result = getSigno(new Date(2000, 7, 23));
      expect(result.label).toBe('Virgem');
      expect(result.value).toBe('virgem');
      expect(result.icon).toBe('virgo');
    });

    it('should return Libra for September 23', () => {
      const result = getSigno(new Date(2000, 8, 23));
      expect(result.label).toBe('Libra');
      expect(result.value).toBe('libra');
      expect(result.icon).toBe('libra');
    });

    it('should return Escorpião for October 23', () => {
      const result = getSigno(new Date(2000, 9, 23));
      expect(result.label).toBe('Escorpião');
      expect(result.value).toBe('escorpiao');
      expect(result.icon).toBe('scorpio');
    });

    it('should return Sagitário for November 22', () => {
      const result = getSigno(new Date(2000, 10, 22));
      expect(result.label).toBe('Sagitário');
      expect(result.value).toBe('sagitario');
      expect(result.icon).toBe('sagittarius');
    });

    it('should return Capricórnio for December 22', () => {
      const result = getSigno(new Date(2000, 11, 22));
      expect(result.label).toBe('Capricórnio');
      expect(result.value).toBe('capricornio');
      expect(result.icon).toBe('capricorn');
    });

    it('should return Aquário for January 21', () => {
      const result = getSigno(new Date(2000, 0, 21));
      expect(result.label).toBe('Aquário');
      expect(result.value).toBe('aquario');
      expect(result.icon).toBe('aquarius');
    });

    it('should return Peixes for February 19', () => {
      const result = getSigno(new Date(2000, 1, 19));
      expect(result.label).toBe('Peixes');
      expect(result.value).toBe('peixes');
      expect(result.icon).toBe('pisces');
    });
  });

  describe('ZODIAC_ICONS', () => {
    it('should have all 12 zodiac signs', () => {
      expect(Object.keys(ZODIAC_ICONS)).toHaveLength(12);
    });

    it('should map label to correct SVG icon name', () => {
      expect(ZODIAC_ICONS['Áries']).toBe('aries');
      expect(ZODIAC_ICONS['Touro']).toBe('taurus');
      expect(ZODIAC_ICONS['Gêmeos']).toBe('gemini');
      expect(ZODIAC_ICONS['Câncer']).toBe('cancer');
      expect(ZODIAC_ICONS['Leão']).toBe('leo');
      expect(ZODIAC_ICONS['Virgem']).toBe('virgo');
      expect(ZODIAC_ICONS['Libra']).toBe('libra');
      expect(ZODIAC_ICONS['Escorpião']).toBe('scorpio');
      expect(ZODIAC_ICONS['Sagitário']).toBe('sagittarius');
      expect(ZODIAC_ICONS['Capricórnio']).toBe('capricorn');
      expect(ZODIAC_ICONS['Aquário']).toBe('aquarius');
      expect(ZODIAC_ICONS['Peixes']).toBe('pisces');
    });

    it('icon from ZODIAC_ICONS should match icon from getSigno', () => {
      const signo = getSigno(new Date(2000, 2, 21)); // Áries
      expect(ZODIAC_ICONS[signo.label]).toBe(signo.icon);
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

    it('should skip participants with invalid dates without throwing', () => {
      const participants: Person[] = [
        { ...mockPerson, id: 1, date: 'not-a-date' as unknown as Date },
        { ...mockPerson, id: 2, date: new Date(2000, 2, 21) },
      ];

      const result = signsStats(participants);
      const aries = result.find((s) => s.name === 'Áries');
      expect(aries?.total).toBe(1);
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
});
