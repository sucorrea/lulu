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

export const participants: Person[] = [
  {
    id: 1,
    name: 'Deborah',
    date: new Date('1980-01-10'),
    month: '01',
    gives_to: 'Stella',
    gives_to_id: 3,

    phone: '123456789',
    picture: '/fotos/Deborah.jpg',
    instagram: 'deborahcarvalho181',
  },
  {
    id: 2,
    name: 'Ana Paula',
    date: new Date('1980-01-18'),
    month: '01',
    gives_to: 'Aninha',
    gives_to_id: 8,
    picture: '/fotos/AnaPaulaMaita.jpg',
    instagram: 'anapaulamaita',
  },
  {
    id: 3,
    name: 'Stella',
    date: new Date('1980-04-04'),
    month: '04',
    gives_to: 'Sueli',
    gives_to_id: 4,
    picture: '/fotos/Stella.jpg',
    instagram: 'stellarbr',
  },
  {
    id: 4,
    name: 'Sueli',
    date: new Date('1980-04-09'),
    month: '04',
    gives_to: 'Camila',
    gives_to_id: 15,

    picture: '/fotos/Sueli.jpg',
    instagram: 'suelli_correaa',
  },
  {
    id: 5,
    name: 'Deia',
    date: new Date('1980-05-15'),
    month: '05',
    gives_to: 'Aline',
    gives_to_id: 17,
    picture: '/fotos/Deia.jpg',
    instagram: 'deia_morales',
  },
  {
    id: 6,
    name: 'Carol Maita',
    date: new Date('1980-05-28'),
    month: '05',
    gives_to: 'Nani',
    gives_to_id: 14,
    picture: '/fotos/CarolMaita.jpg',
    instagram: 'carolmaita',
  },
  {
    id: 7,
    name: 'Josy',
    date: new Date('1980-07-15'),
    month: '07',
    gives_to: 'Carol Maita',
    gives_to_id: 6,

    picture: '/fotos/Josy.jpg',
    instagram: '',
  },
  {
    id: 8,
    name: 'Aninha',
    date: new Date('1980-08-09'),
    month: '08',
    gives_to: 'Carol Mori',
    gives_to_id: 12,
    picture: '/fotos/Aninha.png',
    instagram: 'ac_munhozmori',
  },
  {
    id: 9,
    name: 'Letícia',
    date: new Date('1980-08-24'),
    month: '08',
    gives_to: 'Deborah',
    gives_to_id: 1,
    picture: '/fotos/Leticia.jpg',
    instagram: 'leticiagbatista',
  },
  {
    id: 10,
    name: 'Sylvia',
    date: new Date('1980-09-03'),
    month: '09',
    gives_to: 'Vládia',
    gives_to_id: 16,
    picture: '/fotos/Sylvia.jpg',
    instagram: 'yarasylvia',
  },
  {
    id: 11,
    name: 'Vanessa',
    date: new Date('1980-09-07'),
    month: '09',
    gives_to: 'Josy',
    gives_to_id: 7,
    picture: '/fotos/Vanessa.jpg',
    instagram: 'van_reboucas',
  },
  {
    id: 12,
    name: 'Carol Mori',
    date: new Date('1980-09-26'),
    month: '09',
    gives_to: 'Ana Paula',
    gives_to_id: 2,
    picture: '/fotos/CarolMori.jpg',
    instagram: 'moricarol',
  },
  {
    id: 13,
    name: 'Vivi',
    date: new Date('1980-09-30'),
    month: '09',
    gives_to: 'Cássia',
    gives_to_id: 18,
    picture: '/fotos/Vivi.jpg',
    instagram: 'vivisilvestrecortez',
  },
  {
    id: 14,
    name: 'Nani',
    date: new Date('1980-10-26'),
    month: '10',
    gives_to: 'Vanessa',
    gives_to_id: 11,
    picture: '/fotos/Nani.jpg',
    instagram: 'nacasadanani',
  },
  {
    id: 15,
    name: 'Camila',
    date: new Date('1980-11-15'),
    month: '11',
    gives_to: 'Deia',
    gives_to_id: 5,
    picture: '/fotos/Camila.jpg',
    instagram: 'camilapgatti',
  },
  {
    id: 16,
    name: 'Vládia',
    date: new Date('1980-11-16'),
    month: '11',
    gives_to: 'Sylvia',
    gives_to_id: 10,
    picture: '/fotos/Vladia.jpg',
    instagram: 'vladianutri',
  },
  {
    id: 17,
    name: 'Aline',
    date: new Date('1980-11-27'),
    month: '11',
    gives_to: 'Letícia',
    gives_to_id: 9,

    picture: '/fotos/Aline.jpg',
    instagram: 'alinneribeirosemijoias',
  },
  {
    id: 18,
    name: 'Cássia',
    date: new Date('1980-12-11'),
    month: '12',
    gives_to: 'Vivi',
    gives_to_id: 13,
    picture: '/fotos/Cassia.jpg',
    instagram: 'cassiavieiraandrade',
  },
];

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
