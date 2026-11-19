import { HOME_TIME_ZONE } from '@/lib/constants';

import { Person, PixTypes } from './types';

export const SORT_UPCOMING = 'upcoming';

const MS_PER_DAY = 86400000;

export const getParticipantPhotoUrl = (person: Person): string => {
  const base = person.photoURL ?? person.picture ?? '';
  if (!base) {
    return '';
  }
  const sep = base.includes('?') ? '&' : '?';
  return person.photoUpdatedAt
    ? `${base}${sep}v=${person.photoUpdatedAt}`
    : base;
};

export const canOptimizeImage = (src: string): boolean =>
  (src.startsWith('/') && !src.startsWith('//')) ||
  src.startsWith('https://res.cloudinary.com/');

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

export type Signos =
  | 'aries'
  | 'touro'
  | 'gemeos'
  | 'cancer'
  | 'leao'
  | 'virgem'
  | 'libra'
  | 'escorpiao'
  | 'sagitario'
  | 'capricornio'
  | 'aquario'
  | 'peixes';

type SignoValues = {
  value: Signos;
  label: string;
  icon: string;
};

const ZODIAC_SIGNS: SignoValues[] = [
  { value: 'aries', label: 'Áries', icon: 'aries' },
  { value: 'touro', label: 'Touro', icon: 'taurus' },
  { value: 'gemeos', label: 'Gêmeos', icon: 'gemini' },
  { value: 'cancer', label: 'Câncer', icon: 'cancer' },
  { value: 'leao', label: 'Leão', icon: 'leo' },
  { value: 'virgem', label: 'Virgem', icon: 'virgo' },
  { value: 'libra', label: 'Libra', icon: 'libra' },
  { value: 'escorpiao', label: 'Escorpião', icon: 'scorpio' },
  { value: 'sagitario', label: 'Sagitário', icon: 'sagittarius' },
  { value: 'capricornio', label: 'Capricórnio', icon: 'capricorn' },
  { value: 'aquario', label: 'Aquário', icon: 'aquarius' },
  { value: 'peixes', label: 'Peixes', icon: 'pisces' },
];

const ZODIAC_DATES: Array<{
  sign: number;
  startDay: number;
  startMonth: number;
  endDay: number;
  endMonth: number;
}> = [
  { sign: 0, startDay: 21, startMonth: 3, endDay: 20, endMonth: 4 },
  { sign: 1, startDay: 21, startMonth: 4, endDay: 20, endMonth: 5 },
  { sign: 2, startDay: 21, startMonth: 5, endDay: 20, endMonth: 6 },
  { sign: 3, startDay: 21, startMonth: 6, endDay: 22, endMonth: 7 },
  { sign: 4, startDay: 23, startMonth: 7, endDay: 22, endMonth: 8 },
  { sign: 5, startDay: 23, startMonth: 8, endDay: 22, endMonth: 9 },
  { sign: 6, startDay: 23, startMonth: 9, endDay: 22, endMonth: 10 },
  { sign: 7, startDay: 23, startMonth: 10, endDay: 21, endMonth: 11 },
  { sign: 8, startDay: 22, startMonth: 11, endDay: 21, endMonth: 12 },
  { sign: 9, startDay: 22, startMonth: 12, endDay: 20, endMonth: 1 },
  { sign: 10, startDay: 21, startMonth: 1, endDay: 18, endMonth: 2 },
  { sign: 11, startDay: 19, startMonth: 2, endDay: 20, endMonth: 3 },
];

const isDateInRange = (
  day: number,
  month: number,
  startDay: number,
  startMonth: number,
  endDay: number,
  endMonth: number
): boolean => {
  if (startMonth === endMonth) {
    return month === startMonth && day >= startDay && day <= endDay;
  }
  return (
    (month === startMonth && day >= startDay) ||
    (month === endMonth && day <= endDay)
  );
};

export const getSigno = (dataNascimento: Date): SignoValues => {
  const dia = dataNascimento.getDate();
  const mes = dataNascimento.getMonth() + 1;

  const zodiacEntry = ZODIAC_DATES.find((zodiac) =>
    isDateInRange(
      dia,
      mes,
      zodiac.startDay,
      zodiac.startMonth,
      zodiac.endDay,
      zodiac.endMonth
    )
  );

  if (!zodiacEntry) {
    throw new Error('Data de nascimento inválida');
  }

  return ZODIAC_SIGNS[zodiacEntry.sign];
};

export const ZODIAC_ICONS: Record<string, string> = Object.fromEntries(
  ZODIAC_SIGNS.map(({ label, icon }) => [label, icon])
);

export const monthDashboard = [
  'Jan',
  'Fev',
  'Mar',
  'Abr',
  'Mai',
  'Jun',
  'Jul',
  'Ago',
  'Set',
  'Out',
  'Nov',
  'Dez',
];

export const meses = [
  { value: '01', label: 'Janeiro' },
  { value: '02', label: 'Fevereiro' },
  { value: '03', label: 'Março' },
  { value: '04', label: 'Abril' },
  { value: '05', label: 'Maio' },
  { value: '06', label: 'Junho' },
  { value: '07', label: 'Julho' },
  { value: '08', label: 'Agosto' },
  { value: '09', label: 'Setembro' },
  { value: '10', label: 'Outubro' },
  { value: '11', label: 'Novembro' },
  { value: '12', label: 'Dezembro' },
];

export const NameKey: Record<PixTypes, string> = {
  cpf: 'CPF',
  email: 'Email',
  phone: 'Celular',
  random: 'Aleatório',
  none: 'Nenhum',
};

type AssignmentRecord = Record<
  number,
  { birthdayPersonId: number; birthdayPersonName: string }
>;

const getAssignment = (
  map: AssignmentRecord | undefined,
  participantId: number
) => map?.[participantId];

const getGivesToNameFromMap = (
  participantId: number,
  participants: Person[],
  assignmentsMap?: AssignmentRecord
): string => {
  if (!assignmentsMap) {
    return '';
  }
  const assignment = getAssignment(assignmentsMap, participantId);
  if (!assignment) {
    return '';
  }
  const birthdayPerson = participants.find(
    (p) => p.id === assignment.birthdayPersonId
  );
  return (birthdayPerson?.name ?? '').toLowerCase();
};

export const filteredAndSortedParticipantsV2 = (
  participants: Person[],
  searchTerm: string,
  filterMonth: string,
  sortBy: string,
  assignmentsMap?: AssignmentRecord,
  today?: Date
) =>
  participants
    .filter((p) => {
      const givesToName = getGivesToNameFromMap(
        p.id,
        participants,
        assignmentsMap
      );
      const matchesSearch =
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        givesToName.includes(searchTerm.toLowerCase());
      const matchesMonth = filterMonth === 'all' || p.month === filterMonth;
      return matchesSearch && matchesMonth;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'date':
          return (
            Number.parseInt(a.month) * 100 +
            new Date(a.date).getUTCDate() -
            (Number.parseInt(b.month) * 100 + new Date(b.date).getUTCDate())
          );
        case SORT_UPCOMING:
          return (
            getDaysUntilBirthday(a.date, today) -
            getDaysUntilBirthday(b.date, today)
          );
        default:
          return 0;
      }
    });

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

export const signsStats = (participants: Person[]) => {
  const signsMap: Record<string, number> = {};

  for (const p of participants) {
    const d = new Date(p.date);
    if (Number.isNaN(d.getTime())) {
      continue;
    }
    const { label } = getSigno(d);
    signsMap[label] = (signsMap[label] || 0) + 1;
  }

  return Object.entries(signsMap).map(([name, total]) => ({
    name,
    total,
  }));
};

export const getInitials = (name: string): string => {
  return name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
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
