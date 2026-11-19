import { db } from './firebase';
import { assertAdmin } from '@/lib/auth-guard';
import {
  collection,
  doc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  writeBatch,
} from 'firebase/firestore';

export type VaquinhaHistory = {
  id: string;
  year: number;
  responsibleId: number;
  responsibleName: string;
  birthdayPersonId: number;
  birthdayPersonName: string;
  birthdayDate?: string;
  createdAt: string;
  updatedAt?: string;
};

export type VaquinhaHistoryInput = Omit<
  VaquinhaHistory,
  'id' | 'createdAt' | 'updatedAt'
>;

export const addVaquinhaHistory = async (
  data: VaquinhaHistoryInput
): Promise<string> => {
  await assertAdmin();

  const historyRef = doc(collection(db, 'vaquinha-history'));
  const historyData: VaquinhaHistory = {
    ...data,
    id: historyRef.id,
    createdAt: new Date().toISOString(),
  };

  await setDoc(historyRef, historyData);
  return historyRef.id;
};

export const updateVaquinhaHistory = async (
  id: string,
  data: Partial<VaquinhaHistoryInput>
): Promise<void> => {
  await assertAdmin();

  const ref = doc(db, 'vaquinha-history', id);
  await updateDoc(ref, {
    ...data,
    updatedAt: new Date().toISOString(),
  });
};

export const deleteVaquinhaHistory = async (id: string): Promise<void> => {
  await assertAdmin();

  const ref = doc(db, 'vaquinha-history', id);
  await deleteDoc(ref);
};

export const fetchAllVaquinhaHistory = async (): Promise<VaquinhaHistory[]> => {
  const querySnapshot = await getDocs(
    query(collection(db, 'vaquinha-history'), orderBy('year', 'desc'))
  );
  const data: VaquinhaHistory[] = [];

  querySnapshot.forEach((doc) => {
    data.push(doc.data() as VaquinhaHistory);
  });

  return data;
};

export const fetchVaquinhaHistoryByYear = async (
  year: number
): Promise<VaquinhaHistory[]> => {
  const q = query(
    collection(db, 'vaquinha-history'),
    where('year', '==', year)
  );

  const querySnapshot = await getDocs(q);
  const data: VaquinhaHistory[] = [];

  querySnapshot.forEach((doc) => {
    data.push(doc.data() as VaquinhaHistory);
  });

  return data.sort((a, b) => {
    if (a.birthdayDate && b.birthdayDate) {
      return a.birthdayDate.localeCompare(b.birthdayDate);
    }
    return a.birthdayPersonName.localeCompare(b.birthdayPersonName);
  });
};

export const fetchAvailableYears = async (): Promise<number[]> => {
  const querySnapshot = await getDocs(collection(db, 'vaquinha-history'));
  const years = new Set<number>();

  querySnapshot.forEach((doc) => {
    const data = doc.data() as VaquinhaHistory;
    years.add(data.year);
  });

  return Array.from(years).sort((a, b) => b - a);
};

export const batchAddVaquinhaHistory = async (
  items: VaquinhaHistoryInput[]
): Promise<string[]> => {
  await assertAdmin();

  const batch = writeBatch(db);
  const ids: string[] = [];

  for (const item of items) {
    const historyRef = doc(collection(db, 'vaquinha-history'));
    const historyData: VaquinhaHistory = {
      ...item,
      id: historyRef.id,
      createdAt: new Date().toISOString(),
    };
    batch.set(historyRef, historyData);
    ids.push(historyRef.id);
  }

  await batch.commit();
  return ids;
};
