import { months } from './constants';
import { Person, PixTypes } from './types';

export function getParticipantPhotoUrl(person: Person): string {
  const base = person.photoURL ?? person.picture ?? '';
  if (!base) return '';
  const sep = base.includes('?') ? '&' : '?';
  return person.photoUpdatedAt
    ? `${base}${sep}v=${person.photoUpdatedAt}`
    : base;
}
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
  { value: 'aries', label: 'Áries', icon: 'noto-v1:aries' },
  { value: 'touro', label: 'Touro', icon: 'noto-v1:taurus' },
  { value: 'gemeos', label: 'Gêmeos', icon: 'noto-v1:gemini' },
  { value: 'cancer', label: 'Câncer', icon: 'noto-v1:cancer' },
  { value: 'leao', label: 'Leão', icon: 'noto-v1:leo' },
  { value: 'virgem', label: 'Virgem', icon: 'noto-v1:virgo' },
  { value: 'libra', label: 'Libra', icon: 'noto-v1:libra' },
  { value: 'escorpiao', label: 'Escorpião', icon: 'noto-v1:scorpio' },
  { value: 'sagitario', label: 'Sagitário', icon: 'noto-v1:sagittarius' },
  { value: 'capricornio', label: 'Capricórnio', icon: 'noto-v1:capricorn' },
  { value: 'aquario', label: 'Aquário', icon: 'noto-v1:aquarius' },
  { value: 'peixes', label: 'Peixes', icon: 'noto-v1:pisces' },
];

const ZODIAC_DATES: Array<{
  sign: number;
  startDay: number;
  startMonth: number;
  endDay: number;
  endMonth: number;
}> = [
  { sign: 0, startDay: 21, startMonth: 3, endDay: 20, endMonth: 4 }, // Áries
  { sign: 1, startDay: 21, startMonth: 4, endDay: 20, endMonth: 5 }, // Touro
  { sign: 2, startDay: 21, startMonth: 5, endDay: 20, endMonth: 6 }, // Gêmeos
  { sign: 3, startDay: 21, startMonth: 6, endDay: 22, endMonth: 7 }, // Câncer
  { sign: 4, startDay: 23, startMonth: 7, endDay: 22, endMonth: 8 }, // Leão
  { sign: 5, startDay: 23, startMonth: 8, endDay: 22, endMonth: 9 }, // Virgem
  { sign: 6, startDay: 23, startMonth: 9, endDay: 22, endMonth: 10 }, // Libra
  { sign: 7, startDay: 23, startMonth: 10, endDay: 21, endMonth: 11 }, // Escorpião
  { sign: 8, startDay: 22, startMonth: 11, endDay: 21, endMonth: 12 }, // Sagitário
  { sign: 9, startDay: 22, startMonth: 12, endDay: 20, endMonth: 1 }, // Capricórnio
  { sign: 10, startDay: 21, startMonth: 1, endDay: 18, endMonth: 2 }, // Aquário
  { sign: 11, startDay: 19, startMonth: 2, endDay: 20, endMonth: 3 }, // Peixes
];

function isDateInRange(
  day: number,
  month: number,
  startDay: number,
  startMonth: number,
  endDay: number,
  endMonth: number
): boolean {
  if (startMonth === endMonth) {
    return month === startMonth && day >= startDay && day <= endDay;
  }
  return (
    (month === startMonth && day >= startDay) ||
    (month === endMonth && day <= endDay)
  );
}

export function getSigno(dataNascimento: Date): SignoValues {
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
}

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

export const getGivesToPicture = (id: number, participants: Person[]): Person =>
  participants.find((p) => p.id === id) ?? ({} as Person);

export const filteredAndSortedParticipants = (
  participants: Person[],
  searchTerm: string,
  filterMonth: string,
  sortBy: string
) =>
  participants
    .filter((p) => {
      const matchesSearch =
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.gives_to.toLowerCase().includes(searchTerm.toLowerCase());
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
            new Date(a.date).getDate() -
            (Number.parseInt(b.month) * 100 + new Date(b.date).getDate())
          );
        case 'gives_to':
          return a.gives_to.localeCompare(b.gives_to);
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

export function getNextBirthday(participants: Person[]): Person | null {
  const today = new Date();
  const currentYear = today.getFullYear();

  const upcomingBirthdays = participants
    .map((person) => {
      const birthDate = new Date(person.date);
      const birthdayThisYear = new Date(
        currentYear,
        birthDate.getMonth(),
        birthDate.getDate()
      );

      if (birthdayThisYear < today) {
        birthdayThisYear.setFullYear(currentYear + 1);
      }

      return {
        person,
        nextBirthday: birthdayThisYear,
        timeUntil: birthdayThisYear.getTime() - today.getTime(),
      };
    })
    .sort((a, b) => a.timeUntil - b.timeUntil);

  return upcomingBirthdays.length > 0 ? upcomingBirthdays[0].person : null;
}

export const birthdayStats = (participants: Person[]) =>
  months.map((month, index) => ({
    name: month,
    total: participants.filter((p) => new Date(p.date).getMonth() === index)
      .length,
  }));

function getSign(day: number, month: number): string {
  const signs = [
    { name: 'Capricórnio', start: [12, 22], end: [1, 19] },
    { name: 'Aquário', start: [1, 20], end: [2, 18] },
    { name: 'Peixes', start: [2, 19], end: [3, 20] },
    { name: 'Áries', start: [3, 21], end: [4, 19] },
    { name: 'Touro', start: [4, 20], end: [5, 20] },
    { name: 'Gêmeos', start: [5, 21], end: [6, 20] },
    { name: 'Câncer', start: [6, 21], end: [7, 22] },
    { name: 'Leão', start: [7, 23], end: [8, 22] },
    { name: 'Virgem', start: [8, 23], end: [9, 22] },
    { name: 'Libra', start: [9, 23], end: [10, 22] },
    { name: 'Escorpião', start: [10, 23], end: [11, 21] },
    { name: 'Sagitário', start: [11, 22], end: [12, 21] },
  ];

  for (const sign of signs) {
    const [startMonth, startDay] = sign.start;
    const [endMonth, endDay] = sign.end;

    if (
      (month === startMonth && day >= startDay) ||
      (month === endMonth && day <= endDay)
    ) {
      return sign.name;
    }
  }

  return 'Desconhecido';
}

export const signsStats = (participants: Person[]) => {
  const signsMap: Record<string, number> = {};

  participants.forEach((p) => {
    const date = new Date(p.date);
    const sign = getSign(date.getDate(), date.getMonth() + 1);
    signsMap[sign] = (signsMap[sign] || 0) + 1;
  });

  return Object.entries(signsMap).map(([name, total]) => ({
    name,
    total,
  }));
};

import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDates(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    day: 'numeric',
    month: 'long',
  }).format(date);
}

export function getInitials(name: string): string {
  return name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}
