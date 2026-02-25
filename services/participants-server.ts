import { cache } from 'react';

import { adminDb } from '@/lib/firebase-admin';
import { Person } from '@/components/lulus/types';

export const getParticipants = cache(async (): Promise<Person[]> => {
  const snapshot = await adminDb.collection('participants').get();
  return snapshot.docs.map((doc) => doc.data() as Person);
});

export const getParticipantById = cache(
  async (id: string): Promise<Person | null> => {
    const doc = await adminDb.collection('participants').doc(id).get();
    if (!doc.exists) {
      return null;
    }
    return doc.data() as Person;
  }
);
