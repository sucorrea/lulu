import { cache } from 'react';

import { adminDb } from '@/lib/firebase-admin';
import { Person } from '@/components/lulus/types';

export const getParticipants = cache(async (): Promise<Person[]> => {
  try {
    const snapshot = await adminDb.collection('participants').get();
    return snapshot.docs.map((doc) => doc.data() as Person);
  } catch (error) {
    console.error('Erro ao buscar participantes:', error);
    throw error;
  }
});

export const getParticipantById = cache(
  async (id: string): Promise<Person | null> => {
    try {
      const doc = await adminDb.collection('participants').doc(id).get();
      if (!doc.exists) {
        return null;
      }
      return doc.data() as Person;
    } catch (error) {
      console.error(`Erro ao buscar participante ${id}:`, error);
      return null;
    }
  }
);
