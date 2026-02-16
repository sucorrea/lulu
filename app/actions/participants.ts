'use server';

import { encryptId } from '@/lib/crypto';
import { getParticipants } from '@/services/participants-server';

export const getParticipantsWithEditTokens = async () => {
  const participants = await getParticipants();
  return participants.map((p) => ({
    ...p,
    editToken: encryptId(String(p.id)),
  }));
};
