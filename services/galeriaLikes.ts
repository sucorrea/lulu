import { db } from './firebase';
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  arrayUnion,
  arrayRemove,
  onSnapshot,
} from 'firebase/firestore';

export async function likePhoto(photoId: string, userId: string) {
  const ref = doc(db, 'galeria-likes', photoId);
  const snap = await getDoc(ref);
  if (snap.exists()) {
    await updateDoc(ref, {
      users: arrayUnion(userId),
    });
  } else {
    await setDoc(ref, { users: [userId] });
  }
}

export async function unlikePhoto(photoId: string, userId: string) {
  const ref = doc(db, 'galeria-likes', photoId);
  await updateDoc(ref, {
    users: arrayRemove(userId),
  });
}

export function listenPhotoLikes(
  photoId: string,
  callback: (users: string[]) => void
) {
  const ref = doc(db, 'galeria-likes', photoId);
  return onSnapshot(ref, (snap) => {
    callback(snap.exists() ? snap.data().users || [] : []);
  });
}
