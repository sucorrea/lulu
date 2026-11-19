import { HOME_TIME_ZONE } from '@/lib/constants';

import { meses } from './months';
import { Person } from './types';

const MS_PER_DAY = 86400000;

export const getTodayKey = (
  now: Date = new Date(),
  timeZone: string = HOME_TIME_ZONE
): string =>
  new Intl.DateTimeFormat('en-CA', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(now);

export const todayFromKey = (key: string): Date => {
  const [year, month, day] = key.split('-').map(Number);
  return new Date(year, month - 1, day);
};

export const formatDate = (date: Date): string =>
  new Date(
    date.getTime() + date.getTimezoneOffset() * 60000
  ).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
  });

export const getDaysUntilBirthday = (
  date: Date | string,
  today: Date = new Date()
): number => {
  const birth = new Date(date);
  const month = birth.getUTCMonth();
  const day = birth.getUTCDate();
  const startOfToday = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate()
  );
  let next = new Date(today.getFullYear(), month, day);
  if (next < startOfToday) {
    next = new Date(today.getFullYear() + 1, month, day);
  }
  const startUtc = Date.UTC(
    startOfToday.getFullYear(),
    startOfToday.getMonth(),
    startOfToday.getDate()
  );
  const nextUtc = Date.UTC(next.getFullYear(), next.getMonth(), next.getDate());
  return Math.round((nextUtc - startUtc) / MS_PER_DAY);
};

export const getNextBirthday = (
  participants: Person[],
  today: Date = new Date()
): Person | null => {
  const sorted = participants
    .map((person) => ({
      person,
      days: getDaysUntilBirthday(person.date, today),
    }))
    .sort(
      (a, b) => a.days - b.days || a.person.name.localeCompare(b.person.name)
    );

  return sorted.length > 0 ? sorted[0].person : null;
};

export type MonthBirthdayGroup = {
  monthIndex: number;
  label: string;
  isCurrent: boolean;
  people: Array<{ person: Person; day: number }>;
};

export const groupBirthdaysByMonthFrom = (
  participants: Person[],
  today: Date = new Date()
): MonthBirthdayGroup[] => {
  const entries = participants.map((person) => {
    const birth = new Date(person.date);
    return {
      person,
      day: birth.getUTCDate(),
      monthIndex: birth.getUTCMonth(),
    };
  });
  const currentMonth = today.getMonth();
  return Array.from({ length: 12 }, (_, offset) => {
    const monthIndex = (currentMonth + offset) % 12;
    return {
      monthIndex,
      label: meses[monthIndex].label,
      isCurrent: monthIndex === currentMonth,
      people: entries
        .filter((entry) => entry.monthIndex === monthIndex)
        .sort((a, b) => a.day - b.day)
        .map(({ person, day }) => ({ person, day })),
    };
  }).filter((group) => group.people.length > 0);
};
