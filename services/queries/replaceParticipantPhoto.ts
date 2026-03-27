import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { cloudinaryUpload, cloudinaryDelete } from '../cloudinary';
import { db } from '../firebase';

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
      const pathParts = url.pathname.split('/upload/');
      if (pathParts[1]) {
        const publicIdWithExt = pathParts[1].replace(/^v\d+\//, '');
        const publicId = publicIdWithExt.replace(/\.[^.]+$/, '');
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
