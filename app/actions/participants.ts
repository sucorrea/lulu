'use server';

import { encryptId } from '@/lib/crypto';
import { getParticipants } from '@/services/participants-server';

export async function getParticipantsWithEditTokens() {
  const participants = await getParticipants();
  return participants.map((p) => ({
    ...p,
    editToken: encryptId(String(p.id)),
  }));
}
