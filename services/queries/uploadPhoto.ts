import { doc, setDoc } from 'firebase/firestore';
import { cloudinaryUpload } from '../cloudinary';
import { db } from '../firebase';

export const uploadPhoto = async ({
  file,
  participantId,
}: {
  file: File;
  participantId: string;
}) => {
  const { url: downloadURL } = await cloudinaryUpload({
    file,
    folder: 'images',
    publicId: participantId,
  });

  const docRef = doc(db, 'participants', participantId);
  await setDoc(
    docRef,
    { photoURL: downloadURL, photoUpdatedAt: Date.now() },
    { merge: true }
  );

  return downloadURL;
};
