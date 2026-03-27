import { db } from './firebase';
import { doc, onSnapshot } from 'firebase/firestore';

export const listenSiteVisits = (callback: (count: number) => void) => {
  const ref = doc(db, 'stats', 'site_visits');
  return onSnapshot(ref, (snap) => {
    callback(snap.exists() ? (snap.data().count ?? 0) : 0);
  });
};
