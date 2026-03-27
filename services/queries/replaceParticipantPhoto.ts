import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { cloudinaryUpload, cloudinaryDelete } from '../cloudinary';
import { db } from '../firebase';
import { extractCloudinaryPublicId } from './extractCloudinaryPublicId';

const CLOUDINARY_DOMAIN = 'res.cloudinary.com';

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

  if (data.picture?.includes(CLOUDINARY_DOMAIN)) {
    try {
      const url = new URL(data.picture);
      const publicId = extractCloudinaryPublicId(url.pathname);
      if (publicId) {
        await cloudinaryDelete(publicId);
      }
    } catch (err) {
      console.warn('Erro ao deletar imagem antiga:', err);
    }
  }

  const { url: newDownloadURL } = await cloudinaryUpload({
    file,
    folder: 'images',
    publicId: file.name.replace(/\.[^.]+$/, ''),
  });

  await updateDoc(participantRef, {
    picture: newDownloadURL,
    photoURL: newDownloadURL,
    photoUpdatedAt: Date.now(),
  });

  return newDownloadURL;
};
