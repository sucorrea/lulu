'use client';

import { useEffect, useRef } from 'react';
import { User } from 'firebase/auth';
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  updateDoc,
} from 'firebase/firestore';
import { db } from '@/services/firebase';

export const useAutoLinkAccount = (user: User | null) => {
  const linkedRef = useRef(false);

  useEffect(() => {
    if (!user?.email || linkedRef.current) {
      return;
    }

    const linkAccount = async () => {
      try {
        const participantsRef = collection(db, 'participants');

        // Try authEmail first, then fallback to email (legacy participants)
        let snapshot = await getDocs(
          query(participantsRef, where('authEmail', '==', user.email))
        );

        if (snapshot.empty) {
          snapshot = await getDocs(
            query(participantsRef, where('email', '==', user.email))
          );
        }

        if (snapshot.empty) {
          return;
        }

        const participantDoc = snapshot.docs[0];
        const data = participantDoc.data();

        if (data.uid === user.uid) {
          linkedRef.current = true;
          return;
        }

        if (!data.uid) {
          await updateDoc(doc(db, 'participants', participantDoc.id), {
            uid: user.uid,
          });
          linkedRef.current = true;
        }
      } catch (error) {
        console.error('Erro ao vincular conta:', error);
      }
    };

    linkAccount();
  }, [user]);
};
