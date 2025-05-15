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

export const formatPixKey = (key: PixTypes) => {
  switch (key) {
    case 'cpf':
      return key.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    case 'email':
      return key;
    case 'phone':
      return key.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    case 'random':
      return key;
    case 'none':
      return 'Nenhum';
    default:
      return key;
  }
};

export const getGivesToPicture = (id: number): Person =>
  participants.find((p) => p.id === id) ?? ({} as Person);

export const filteredAndSortedParticipants = (
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
            a.date.getDate() -
            (parseInt(b.month) * 100 + b.date.getDate())
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
