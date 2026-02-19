import { describe, expect, it } from 'vitest';

import type { Person } from '@/components/lulus/types';
import type { VaquinhaHistory } from '@/services/vaquinhaHistory';

import { realizarSorteio } from './sorteio';

const makePerson = (id: number, name: string): Person => ({
  id,
  name,
  fullName: name,
  date: '2000-01-01',
  month: 'Janeiro',
  city: 'São Paulo',
});

const makeHistory = (
  responsibleId: number,
  birthdayPersonId: number
): VaquinhaHistory => ({
  id: `h-${responsibleId}-${birthdayPersonId}`,
  year: 2026,
  responsibleId,
  responsibleName: `Person ${responsibleId}`,
  birthdayPersonId,
  birthdayPersonName: `Person ${birthdayPersonId}`,
  createdAt: new Date().toISOString(),
});

describe('realizarSorteio', () => {
  it('should throw when less than 2 participants', () => {
    const participants = [makePerson(1, 'Alice')];
    expect(() => realizarSorteio(participants)).toThrow(
      'É necessário pelo menos 2 participantes'
    );
  });

  it('should return pairs for all participants', () => {
    const participants = [
      makePerson(1, 'Alice'),
      makePerson(2, 'Bob'),
      makePerson(3, 'Carol'),
    ];

    const result = realizarSorteio(participants);

    expect(result.pairs).toHaveLength(3);
    expect(result.relaxed).toBe(false);
  });

  it('should never assign a person to themselves', () => {
    const participants = Array.from({ length: 10 }, (_, i) =>
      makePerson(i + 1, `Person ${i + 1}`)
    );

    for (let run = 0; run < 50; run++) {
      const result = realizarSorteio(participants);
      for (const pair of result.pairs) {
        expect(pair.responsibleId).not.toBe(pair.birthdayPersonId);
      }
    }
  });

  it('should assign each person exactly once as giver and receiver', () => {
    const participants = Array.from({ length: 8 }, (_, i) =>
      makePerson(i + 1, `Person ${i + 1}`)
    );

    const result = realizarSorteio(participants);

    const giverIds = result.pairs.map((p) => p.responsibleId);
    const receiverIds = result.pairs.map((p) => p.birthdayPersonId);

    expect(new Set(giverIds).size).toBe(8);
    expect(new Set(receiverIds).size).toBe(8);
  });

  it('should avoid previous year assignments when possible', () => {
    const participants = Array.from({ length: 10 }, (_, i) =>
      makePerson(i + 1, `Person ${i + 1}`)
    );

    const previousHistory = [
      makeHistory(1, 2),
      makeHistory(2, 3),
      makeHistory(3, 4),
      makeHistory(4, 5),
      makeHistory(5, 6),
      makeHistory(6, 7),
      makeHistory(7, 8),
      makeHistory(8, 9),
      makeHistory(9, 10),
      makeHistory(10, 1),
    ];

    for (let run = 0; run < 20; run++) {
      const result = realizarSorteio(participants, previousHistory);

      if (!result.relaxed) {
        for (const pair of result.pairs) {
          const prev = previousHistory.find(
            (h) => h.responsibleId === pair.responsibleId
          );
          if (prev) {
            expect(pair.birthdayPersonId).not.toBe(prev.birthdayPersonId);
          }
        }
      }
    }
  });

  it('should relax restrictions and set relaxed flag when needed', () => {
    const participants = [makePerson(1, 'Alice'), makePerson(2, 'Bob')];

    const previousHistory = [makeHistory(1, 2), makeHistory(2, 1)];

    const result = realizarSorteio(participants, previousHistory);

    expect(result.pairs).toHaveLength(2);
    expect(result.relaxed).toBe(true);

    for (const pair of result.pairs) {
      expect(pair.responsibleId).not.toBe(pair.birthdayPersonId);
    }
  });

  it('should work with 2 participants', () => {
    const participants = [makePerson(1, 'Alice'), makePerson(2, 'Bob')];

    const result = realizarSorteio(participants);

    expect(result.pairs).toHaveLength(2);
    expect(result.pairs[0].responsibleId).not.toBe(
      result.pairs[0].birthdayPersonId
    );
    expect(result.pairs[1].responsibleId).not.toBe(
      result.pairs[1].birthdayPersonId
    );
  });

  it('should work with no previous history', () => {
    const participants = Array.from({ length: 5 }, (_, i) =>
      makePerson(i + 1, `Person ${i + 1}`)
    );

    const result = realizarSorteio(participants, []);

    expect(result.pairs).toHaveLength(5);
    expect(result.relaxed).toBe(false);
  });

  it('should use fullName in pairs when available', () => {
    const participants = [
      { ...makePerson(1, 'Ali'), fullName: 'Alice Wonderland' },
      { ...makePerson(2, 'Bob'), fullName: 'Bob Builder' },
      { ...makePerson(3, 'Car'), fullName: 'Carol Danvers' },
    ];

    const result = realizarSorteio(participants);

    for (const pair of result.pairs) {
      expect(pair.responsibleName).toMatch(/Alice|Bob|Carol/);
      expect(pair.birthdayPersonName).toMatch(/Alice|Bob|Carol/);
    }
  });

  it('should produce a valid derangement for large groups', () => {
    const participants = Array.from({ length: 30 }, (_, i) =>
      makePerson(i + 1, `Person ${i + 1}`)
    );

    const result = realizarSorteio(participants);

    expect(result.pairs).toHaveLength(30);
    for (const pair of result.pairs) {
      expect(pair.responsibleId).not.toBe(pair.birthdayPersonId);
    }
  });
});
