import {
  collection,
  doc,
  setDoc,
  deleteDoc,
  updateDoc,
  getDocs,
  query,
  orderBy,
} from 'firebase/firestore';
import { db } from './firebase';
import { assertAdmin } from '@/lib/auth-guard';
import type { Person, Role } from '@/components/lulus/types';

export const createParticipant = async (
  data: Omit<Person, 'id' | 'editToken' | 'photoURL' | 'photoUpdatedAt'>
): Promise<string> => {
  await assertAdmin();

  const participantsRef = collection(db, 'participants');
  const snapshot = await getDocs(participantsRef);
  const maxId = snapshot.docs.reduce((max, d) => {
    const docData = d.data();
    return docData.id > max ? docData.id : max;
  }, 0);
  const newId = maxId + 1;

  const docRef = doc(db, 'participants', String(newId));
  await setDoc(docRef, {
    ...data,
    id: newId,
    role: data.role ?? 'lulu',
  });

  return String(newId);
};

export const deleteParticipant = async (
  participantId: string
): Promise<void> => {
  await assertAdmin();
  await deleteDoc(doc(db, 'participants', participantId));
};

export const updateParticipantRole = async (
  participantId: string,
  role: Role
): Promise<void> => {
  await assertAdmin();
  await updateDoc(doc(db, 'participants', participantId), { role });
};

export const fetchAllParticipantsAdmin = async (): Promise<
  (Person & { docId: string })[]
> => {
  await assertAdmin();

  const participantsRef = collection(db, 'participants');
  const q = query(participantsRef, orderBy('name'));
  const snapshot = await getDocs(q);

  return snapshot.docs.map((d) => ({
    ...(d.data() as Person),
    docId: d.id,
  }));
};
