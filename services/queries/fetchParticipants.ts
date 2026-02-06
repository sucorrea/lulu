import { useQuery } from '@tanstack/react-query';
import { collection, doc, getDoc, getDocs } from 'firebase/firestore';

import { Person } from '@/components/lulus/types';
import { db, storage } from '../firebase';
import { getDownloadURL, ref } from 'firebase/storage';

export const fetchParticipants = async (): Promise<Person[]> => {
  const querySnapshot = await getDocs(collection(db, 'participants'));
  const data: Person[] = [];

  querySnapshot.forEach((doc) => {
    data.push(doc.data() as Person);
  });

  return data;
};

export const useGetAllParticipants = () => {
  return useQuery<Person[]>({
    queryKey: ['get-all-participants'],
    queryFn: fetchParticipants,
    retry: 2,
  });
};

export const fetchParticipantById = async (
  id: string
): Promise<Person | null> => {
  try {
    const docRef = doc(db, 'participants', id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return docSnap.data() as Person;
    } else {
      console.warn(`No participant found with id: ${id}`);
      return null;
    }
  } catch (error) {
    console.error('Error fetching participant:', error);
    return null;
  }
};

export const useGetParticipantById = (id: string) => {
  return useQuery<Person | null>({
    queryKey: ['get-participant-by-id', id],
    queryFn: () => fetchParticipantById(id),
  });
};

export const fetchGalleryImages = async () => {
  const listAll = (await import('firebase/storage')).listAll;

  const galleryRef = ref(storage, 'gallery');
  const result = await listAll(galleryRef);
  const urls = await Promise.all(
    result.items.map((itemRef) => getDownloadURL(itemRef))
  );

  return urls;
};

export const useGetGalleryImages = () => {
  return useQuery<string[]>({
    queryKey: ['get-gallery-images'],
    queryFn: fetchGalleryImages,
    retry: 2,
  });
};
