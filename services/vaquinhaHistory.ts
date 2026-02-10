import { db } from './firebase';
import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  onSnapshot,
  Query,
} from 'firebase/firestore';

export type VaquinhaHistory = {
  id: string;
  year: number;
  responsibleId: number;
  responsibleName: string;
  birthdayPersonId: number;
  birthdayPersonName: string;
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
  const ref = doc(db, 'vaquinha-history', id);
  await updateDoc(ref, {
    ...data,
    updatedAt: new Date().toISOString(),
  });
};

export const deleteVaquinhaHistory = async (id: string): Promise<void> => {
  const ref = doc(db, 'vaquinha-history', id);
  await deleteDoc(ref);
};

export const fetchVaquinhaHistoryById = async (
  id: string
): Promise<VaquinhaHistory | null> => {
  try {
    const docRef = doc(db, 'vaquinha-history', id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return docSnap.data() as VaquinhaHistory;
    } else {
      console.warn(`No history found with id: ${id}`);
      return null;
    }
  } catch (error) {
    console.error('Error fetching vaquinha history:', error);
    return null;
  }
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
    where('year', '==', year),
    orderBy('birthdayPersonName', 'asc')
  );

  const querySnapshot = await getDocs(q);
  const data: VaquinhaHistory[] = [];

  querySnapshot.forEach((doc) => {
    data.push(doc.data() as VaquinhaHistory);
  });

  return data;
};

export const fetchVaquinhaHistoryByResponsible = async (
  responsibleId: number
): Promise<VaquinhaHistory[]> => {
  const q = query(
    collection(db, 'vaquinha-history'),
    where('responsibleId', '==', responsibleId),
    orderBy('year', 'desc')
  );

  const querySnapshot = await getDocs(q);
  const data: VaquinhaHistory[] = [];

  querySnapshot.forEach((doc) => {
    data.push(doc.data() as VaquinhaHistory);
  });

  return data;
};

export const fetchVaquinhaHistoryByBirthdayPerson = async (
  birthdayPersonId: number
): Promise<VaquinhaHistory[]> => {
  const q = query(
    collection(db, 'vaquinha-history'),
    where('birthdayPersonId', '==', birthdayPersonId),
    orderBy('year', 'desc')
  );

  const querySnapshot = await getDocs(q);
  const data: VaquinhaHistory[] = [];

  querySnapshot.forEach((doc) => {
    data.push(doc.data() as VaquinhaHistory);
  });

  return data;
};

export const listenVaquinhaHistory = (
  callback: (history: VaquinhaHistory[]) => void,
  year?: number
) => {
  let q: Query = query(
    collection(db, 'vaquinha-history'),
    orderBy('year', 'desc')
  );

  if (year) {
    q = query(
      collection(db, 'vaquinha-history'),
      where('year', '==', year),
      orderBy('birthdayPersonName', 'asc')
    );
  }

  return onSnapshot(q, (snapshot) => {
    const data: VaquinhaHistory[] = [];
    snapshot.forEach((doc) => {
      data.push(doc.data() as VaquinhaHistory);
    });
    callback(data);
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
