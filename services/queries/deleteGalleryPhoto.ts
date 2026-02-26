import { ref, deleteObject } from 'firebase/storage';

import { assertAdmin } from '@/lib/auth-guard';
import { storage } from '../firebase';

const INVALID_URL_ERROR = 'URL de foto inválida';

export const deleteGalleryPhoto = async (photoUrl: string) => {
  await assertAdmin();

  let url: URL;
  try {
    url = new URL(photoUrl);
  } catch {
    throw new Error(INVALID_URL_ERROR);
  }

  const pathSegment = url.pathname.split('/o/')[1];
  if (!pathSegment) {
    throw new Error(INVALID_URL_ERROR);
  }
  const storagePath = decodeURIComponent(pathSegment);
  const photoRef = ref(storage, storagePath);
  await deleteObject(photoRef);
};
