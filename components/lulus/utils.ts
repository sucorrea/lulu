import { months } from './constants';
import { Person, PixTypes } from './types';

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

export const getGivesToPicture = (id: number, participants: Person[]): Person =>
  participants.find((p) => p.id === id) ?? ({} as Person);

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
  assignmentsMap?: AssignmentRecord
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
            new Date(a.date).getDate() -
            (Number.parseInt(b.month) * 100 + new Date(b.date).getDate())
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

export const getNextBirthday = (participants: Person[]): Person | null => {
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
};

export const birthdayStats = (participants: Person[]) =>
  months.map((month, index) => ({
    name: month,
    total: participants.filter((p) => new Date(p.date).getMonth() === index)
      .length,
  }));

export const signsStats = (participants: Person[]) => {
  const signsMap: Record<string, number> = {};

  for (const p of participants) {
    const d = new Date(p.date);
    if (isNaN(d.getTime())) {
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

export const formatDates = (date: Date): string => {
  return new Intl.DateTimeFormat('en-US', {
    day: 'numeric',
    month: 'long',
  }).format(date);
};

export const getInitials = (name: string): string => {
  return name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};
