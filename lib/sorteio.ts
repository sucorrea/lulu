import type { Person } from '@/components/lulus/types';
import type { VaquinhaHistory } from '@/services/vaquinhaHistory';

export type SorteioPair = {
  responsibleId: number;
  responsibleName: string;
  birthdayPersonId: number;
  birthdayPersonName: string;
  birthdayDate?: string;
};

export type SorteioResult = {
  pairs: SorteioPair[];
  relaxed: boolean;
};

const secureRandomInt = (maxInclusive: number): number => {
  const buffer = new Uint32Array(1);
  const range = maxInclusive + 1;
  const maxSafe = 0xffffffff - (0xffffffff % range);
  let value: number;
  do {
    globalThis.crypto.getRandomValues(buffer);
    value = buffer[0];
  } while (value >= maxSafe);
  return value % range;
};

const shuffle = <T>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = secureRandomInt(i);
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

const buildRestrictions = (
  participants: Person[],
  previousYearHistory: VaquinhaHistory[]
): Map<number, Set<number>> => {
  const restrictions = new Map<number, Set<number>>();

  for (const p of participants) {
    const restricted = new Set<number>();
    restricted.add(p.id);

    const previousAssignment = previousYearHistory.find(
      (h) => h.responsibleId === p.id
    );
    if (previousAssignment) {
      restricted.add(previousAssignment.birthdayPersonId);
    }

    restrictions.set(p.id, restricted);
  }

  return restrictions;
};

const tryGenerateDerangement = (
  participants: Person[],
  restrictions: Map<number, Set<number>>,
  maxAttempts: number
): SorteioPair[] | null => {
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const givers = [...participants];
    const receivers = shuffle([...participants]);

    let valid = true;
    for (let i = 0; i < givers.length; i++) {
      const giverId = givers[i].id;
      const receiverId = receivers[i].id;
      const restricted = restrictions.get(giverId);

      if (restricted?.has(receiverId)) {
        valid = false;
        break;
      }
    }

    if (valid) {
      return givers.map((giver, i) => ({
        responsibleId: giver.id,
        responsibleName: giver.fullName || giver.name,
        birthdayPersonId: receivers[i].id,
        birthdayPersonName: receivers[i].fullName || receivers[i].name,
        birthdayDate: String(receivers[i].date),
      }));
    }
  }

  return null;
};

const buildSelfOnlyRestrictions = (
  participants: Person[]
): Map<number, Set<number>> => {
  const restrictions = new Map<number, Set<number>>();
  for (const p of participants) {
    restrictions.set(p.id, new Set([p.id]));
  }
  return restrictions;
};

export const realizarSorteio = (
  participants: Person[],
  previousYearHistory: VaquinhaHistory[] = [],
  maxAttempts = 1000
): SorteioResult => {
  if (participants.length < 2) {
    throw new Error('É necessário pelo menos 2 participantes para o sorteio');
  }

  const fullRestrictions = buildRestrictions(participants, previousYearHistory);
  const result = tryGenerateDerangement(
    participants,
    fullRestrictions,
    maxAttempts
  );

  if (result) {
    return { pairs: result, relaxed: false };
  }

  const selfOnlyRestrictions = buildSelfOnlyRestrictions(participants);
  const fallbackResult = tryGenerateDerangement(
    participants,
    selfOnlyRestrictions,
    maxAttempts
  );

  if (fallbackResult) {
    return { pairs: fallbackResult, relaxed: true };
  }

  throw new Error('Não foi possível gerar um sorteio válido. Tente novamente.');
};
