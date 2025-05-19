import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from 'firebase/storage';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { storage, db } from '../firebase'; // ajuste o caminho se necessário

export async function replaceParticipantPhoto(
  participantId: string,
  file: File
) {
  const participantRef = doc(db, 'participants', participantId);

  const snapshot = await getDoc(participantRef);

  const data = snapshot.data();

  console.log('dados snapshot', data);
  if (!data) throw new Error('Participante não encontrado');

  if (data.picture && data.picture.includes('firebasestorage.googleapis.com')) {
    try {
      const url = new URL(data.picture);
      const pathname = decodeURIComponent(url.pathname); // /v0/b/{bucket}/o/participants%2Fnome.jpg
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

  // 4. Atualizar o Firestore
  await updateDoc(participantRef, {
    picture: newDownloadURL,
  });

  return newDownloadURL;
}
