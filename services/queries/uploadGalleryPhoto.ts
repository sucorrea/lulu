import { getStorage, ref, uploadBytes } from 'firebase/storage';
import { assertAdmin } from '@/lib/auth-guard';
import app from '../firebase';

export const uploadGalleryPhoto = async ({
  file,
  photoId,
}: {
  file: File;
  photoId: string;
}) => {
  await assertAdmin();

  const storage = getStorage(app);
  const storageRef = ref(storage, `gallery/${photoId}`);
  await uploadBytes(storageRef, file);
};
