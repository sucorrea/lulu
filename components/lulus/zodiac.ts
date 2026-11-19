import { Person } from './types';

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
  const dia = dataNascimento.getUTCDate();
  const mes = dataNascimento.getUTCMonth() + 1;

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
