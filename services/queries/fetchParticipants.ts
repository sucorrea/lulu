import { useQuery } from '@tanstack/react-query';
import { collection, doc, getDoc, getDocs } from 'firebase/firestore';
import { z } from 'zod';

import { Person } from '@/components/lulus/types';
import { db } from '../firebase';
import { cloudinaryListGallery } from '../cloudinary';

const PixTypesSchema = z.enum(['cpf', 'email', 'phone', 'random', 'none']);
const RoleSchema = z.enum(['admin', 'lulu', 'visitante']);
const ShirtSizeSchema = z.enum(['PP', 'P', 'M', 'G', 'GG', 'XG']);

const WishListItemSchema = z.object({
  item: z.string(),
  url: z.string().optional(),
  preco: z.number().optional(),
  comprado: z.boolean().optional(),
  compradorNome: z.string().optional(),
});

const AddressSchema = z.object({
  cep: z.string().optional(),
  rua: z.string().optional(),
  numero: z.string().optional(),
  complemento: z.string().optional(),
  bairro: z.string().optional(),
  cidade: z.string().optional(),
  estado: z.string().optional(),
});

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
  uid: z.string().optional(),
  authEmail: z.string().optional(),
  role: RoleSchema.optional(),
  fcmTokens: z.array(z.string()).optional(),
  wishList: z.array(WishListItemSchema).optional(),
  shirtSize: ShirtSizeSchema.optional(),
  shoeSize: z.string().optional(),
  favoriteColor: z.string().optional(),
  allergies: z.string().optional(),
  address: AddressSchema.optional(),
  hobbies: z.string().optional(),
  favoriteStore: z.string().optional(),
  giftNotes: z.string().optional(),
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
    enabled: !!id,
  });
};

export const fetchGalleryImages = async () => {
  return cloudinaryListGallery();
};

export const useGetGalleryImages = () => {
  return useQuery<string[]>({
    queryKey: ['get-gallery-images'],
    queryFn: fetchGalleryImages,
    retry: 2,
  });
};
