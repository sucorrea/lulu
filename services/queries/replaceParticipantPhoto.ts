import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from 'firebase/storage';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { storage, db } from '../firebase';

export const replaceParticipantPhoto = async (
  participantId: string,
  file: File
) => {
  const participantRef = doc(db, 'participants', participantId);

  const snapshot = await getDoc(participantRef);

  const data = snapshot.data();

  if (!data) {
    throw new Error('Participante não encontrado');
  }

  if (data.picture?.includes('firebasestorage.googleapis.com')) {
    try {
      const url = new URL(data.picture);
      const pathname = decodeURIComponent(url.pathname);
      const filePath = pathname
        .split('/o/')[1]
        .split('?')[0]
        .replace('%2F', '/');

      const oldImageRef = ref(storage, filePath);
      await deleteObject(oldImageRef);
    } catch (err) {
      console.warn('Erro ao deletar imagem antiga:', err);
    }
  }

  const newFilePath = `images/${file.name}`;
  const newImageRef = ref(storage, newFilePath);
  await uploadBytes(newImageRef, file);
  const newDownloadURL = await getDownloadURL(newImageRef);

  await updateDoc(participantRef, {
    picture: newDownloadURL,
    photoURL: newDownloadURL,
    photoUpdatedAt: Date.now(),
  });

  return newDownloadURL;
};
