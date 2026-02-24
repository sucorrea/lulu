import { useQuery } from '@tanstack/react-query';
import { collection, doc, getDoc, getDocs } from 'firebase/firestore';
import { z } from 'zod';

import { Person } from '@/components/lulus/types';
import { db, storage } from '../firebase';
import { getDownloadURL, ref } from 'firebase/storage';

const PixTypesSchema = z.enum(['cpf', 'email', 'phone', 'random', 'none']);

export const PersonSchema = z.object({
  id: z.number(),
  editToken: z.string().optional(),
  name: z.string(),
  date: z.union([z.date(), z.string()]),
  month: z.string(),
  email: z.string().optional(),
  phone: z.string().optional(),
  picture: z.string().optional(),
  instagram: z.string().optional(),
  pix_key: z.string().optional(),
  pix_key_type: PixTypesSchema.optional(),
  fullName: z.string().default(''),
  city: z.string().default(''),
  photoURL: z.string().optional(),
  photoUpdatedAt: z.number().optional(),
});

const parseParticipant = (raw: unknown): Person => {
  const result = PersonSchema.safeParse(raw);
  if (!result.success) {
    console.warn(
      'Invalid participant data from Firestore:',
      result.error.flatten()
    );
    return raw as Person;
  }
  return result.data;
};

export const fetchParticipants = async (): Promise<Person[]> => {
  const querySnapshot = await getDocs(collection(db, 'participants'));
  const data: Person[] = [];

  querySnapshot.forEach((doc) => {
    data.push(parseParticipant(doc.data()));
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
      return parseParticipant(docSnap.data());
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
