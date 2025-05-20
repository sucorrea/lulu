import { months } from './constants';
import { participants } from './mockdata';
import { Person, PixTypes } from './types';
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

export function getSigno(dataNascimento: Date): SignoValues {
  const dia = dataNascimento.getDate();
  const mes = dataNascimento.getMonth() + 1;

  if ((dia >= 21 && mes === 3) || (dia <= 20 && mes === 4)) {
    return { value: 'aries', label: 'Áries', icon: 'noto-v1:aries' };
  } else if ((dia >= 21 && mes === 4) || (dia <= 20 && mes === 5)) {
    return { value: 'touro', label: 'Touro', icon: 'noto-v1:taurus' };
  } else if ((dia >= 21 && mes === 5) || (dia <= 20 && mes === 6)) {
    return { value: 'gemeos', label: 'Gêmeos', icon: 'noto-v1:gemini' };
  } else if ((dia >= 21 && mes === 6) || (dia <= 22 && mes === 7)) {
    return { value: 'cancer', label: 'Câncer', icon: 'noto-v1:cancer' };
  } else if ((dia >= 23 && mes === 7) || (dia <= 22 && mes === 8)) {
    return { value: 'leao', label: 'Leão', icon: 'noto-v1:leo' };
  } else if ((dia >= 23 && mes === 8) || (dia <= 22 && mes === 9)) {
    return { value: 'virgem', label: 'Virgem', icon: 'noto-v1:virgo' };
  } else if ((dia >= 23 && mes === 9) || (dia <= 22 && mes === 10)) {
    return { value: 'libra', label: 'Libra', icon: 'noto-v1:libra' };
  } else if ((dia >= 23 && mes === 10) || (dia <= 21 && mes === 11)) {
    return { value: 'escorpiao', label: 'Escorpião', icon: 'noto-v1:scorpio' };
  } else if ((dia >= 22 && mes === 11) || (dia <= 21 && mes === 12)) {
    return {
      value: 'sagitario',
      label: 'Sagitário',
      icon: 'noto-v1:sagittarius',
    };
  } else if ((dia >= 22 && mes === 12) || (dia <= 20 && mes === 1)) {
    return {
      value: 'capricornio',
      label: 'Capricórnio',
      icon: 'noto-v1:capricorn',
    };
  } else if ((dia >= 21 && mes === 1) || (dia <= 18 && mes === 2)) {
    return { value: 'aquario', label: 'Aquário', icon: 'noto-v1:aquarius' };
  } else if ((dia >= 19 && mes === 2) || (dia <= 20 && mes === 3)) {
    return { value: 'peixes', label: 'Peixes', icon: 'noto-v1:pisces' };
  } else {
    throw new Error('Data de nascimento inválida');
  }
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
            parseInt(a.month) * 100 +
            new Date(a.date).getDate() -
            (parseInt(b.month) * 100 + new Date(b.date).getDate())
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

      // Se o aniversário já passou este ano, calcula para o próximo ano
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

export const birthdayStats = months.map((month, index) => ({
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
const signsMap: Record<string, number> = {};

participants.forEach((p) => {
  const date = new Date(p.date);
  const sign = getSign(date.getDate(), date.getMonth() + 1);
  signsMap[sign] = (signsMap[sign] || 0) + 1;
});

export const signsStats = Object.entries(signsMap).map(([name, total]) => ({
  name,
  total,
}));

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
