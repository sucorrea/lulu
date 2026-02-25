import { doc, getFirestore, setDoc } from 'firebase/firestore';
import { getDownloadURL, getStorage, ref, uploadBytes } from 'firebase/storage';
import { assertAdmin } from '@/lib/auth-guard';
import app from '../firebase';

export const uploadPhoto = async ({
  file,
  participantId,
}: {
  file: File;
  participantId: string;
}) => {
  await assertAdmin();

  const storage = getStorage(app);
  const storageRef = ref(storage, `images/${participantId}.jpg`);
  await uploadBytes(storageRef, file);

  const downloadURL = await getDownloadURL(storageRef);

  const db = getFirestore(app);
  const docRef = doc(db, 'participants', participantId);
  await setDoc(
    docRef,
    { photoURL: downloadURL, photoUpdatedAt: Date.now() },
    { merge: true }
  );

  return downloadURL;
};
