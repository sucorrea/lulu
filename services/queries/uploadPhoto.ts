// uploadPhoto.ts
import { doc, getFirestore, setDoc } from 'firebase/firestore';
import { getDownloadURL, getStorage, ref, uploadBytes } from 'firebase/storage';
import app from '../firebase';

export async function uploadPhoto({
  file,
  participantId,
}: {
  file: File;
  participantId: string;
}) {
  const storage = getStorage(app);
  const storageRef = ref(storage, `images/${participantId}.jpg`);
  await uploadBytes(storageRef, file);

  const downloadURL = await getDownloadURL(storageRef);

  const db = getFirestore(app);
  const docRef = doc(db, 'participants', participantId);
  await setDoc(docRef, { photoURL: downloadURL }, { merge: true });

  return downloadURL;
}
