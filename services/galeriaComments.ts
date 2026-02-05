import { db } from './firebase';
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  arrayUnion,
  onSnapshot,
} from 'firebase/firestore';
import { v4 as uuidv4 } from 'uuid';

export type GaleriaComment = {
  id: string;
  userId: string;
  displayName: string;
  comment: string;
  createdAt?: string;
  editedAt?: string;
};

export async function addCommentToPhoto(
  photoId: string,
  comment: Omit<GaleriaComment, 'id'>
) {
  const ref = doc(db, 'galeria-comments', photoId);
  const snap = await getDoc(ref);
  const commentWithId = {
    ...comment,
    id: uuidv4(),
    createdAt: new Date().toISOString(),
  };
  if (snap.exists()) {
    await updateDoc(ref, {
      comments: arrayUnion(commentWithId),
    });
  } else {
    await setDoc(ref, { comments: [commentWithId] });
  }
}

export async function deleteCommentFromPhoto(
  photoId: string,
  commentId: string
) {
  const ref = doc(db, 'galeria-comments', photoId);
  const snap = await getDoc(ref);
  if (!snap.exists()) {
    return;
  }
  const comments = snap.data().comments || [];
  const updated = comments.filter((c: GaleriaComment) => c.id !== commentId);
  await updateDoc(ref, { comments: updated });
}

export async function editCommentOnPhoto(
  photoId: string,
  commentId: string,
  newText: string
) {
  const ref = doc(db, 'galeria-comments', photoId);
  const snap = await getDoc(ref);
  if (!snap.exists()) {
    return;
  }
  const comments = snap.data().comments || [];
  const updated = comments.map((c: GaleriaComment) =>
    c.id === commentId ? { ...c, comment: newText } : c
  );
  await updateDoc(ref, { comments: updated });
}

export function listenPhotoComments(
  photoId: string,
  callback: (comments: GaleriaComment[]) => void
) {
  const ref = doc(db, 'galeria-comments', photoId);
  return onSnapshot(ref, (snap) => {
    callback(snap.exists() ? snap.data().comments || [] : []);
  });
}
