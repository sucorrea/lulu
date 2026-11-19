import { Person } from './types';

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

export const getInitials = (name: string): string =>
  name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
