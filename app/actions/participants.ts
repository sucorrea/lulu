'use server';

import { unstable_cache } from 'next/cache';

import { encryptId } from '@/lib/crypto';
import { getParticipants } from '@/services/participants-server';

const getCachedParticipants = unstable_cache(
  async () => {
    const participants = await getParticipants();
    return participants.map((p) => ({
      ...p,
      editToken: encryptId(String(p.id)),
    }));
  },
  ['participants'],
  { tags: ['participants'], revalidate: 3600 }
);

export const getParticipantsWithEditTokens = async () => {
  return getCachedParticipants();
};
