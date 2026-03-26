import { useCallback, useEffect, useState } from 'react';
import { User, onAuthStateChanged, getIdTokenResult } from 'firebase/auth';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { auth } from '@/services/firebase';
import { db } from '@/services/firebase';
import type { Role } from '@/components/lulus/types';

export const useUserVerification = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [role, setRole] = useState<Role>('visitante');
  const [participantId, setParticipantId] = useState<string | undefined>();
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);

      if (currentUser) {
        try {
          const tokenResult = await getIdTokenResult(currentUser, true);
          const adminClaim = !!tokenResult.claims.admin;
          setIsAdmin(adminClaim);

          if (adminClaim) {
            setRole('admin');
          }

          // Try to find participant: by uid first, then authEmail, then email (legacy)
          const participantsRef = collection(db, 'participants');
          let participantDoc = null;

          // 1. By uid (already linked)
          const uidQuery = query(
            participantsRef,
            where('uid', '==', currentUser.uid)
          );
          const uidSnap = await getDocs(uidQuery);
          if (!uidSnap.empty) {
            participantDoc = uidSnap.docs[0];
          }

          // 2. By authEmail (admin-set linkage)
          if (!participantDoc && currentUser.email) {
            const authEmailQuery = query(
              participantsRef,
              where('authEmail', '==', currentUser.email)
            );
            const authEmailSnap = await getDocs(authEmailQuery);
            if (!authEmailSnap.empty) {
              participantDoc = authEmailSnap.docs[0];
            }
          }

          // 3. By email field (legacy participants)
          if (!participantDoc && currentUser.email) {
            const emailQuery = query(
              participantsRef,
              where('email', '==', currentUser.email)
            );
            const emailSnap = await getDocs(emailQuery);
            if (!emailSnap.empty) {
              participantDoc = emailSnap.docs[0];
            }
          }

          if (participantDoc) {
            setParticipantId(participantDoc.id);
            const data = participantDoc.data();
            if (!adminClaim && data.role) {
              setRole(data.role as Role);
            }
          }
        } catch {
          setIsAdmin(false);
          setRole('visitante');
        }
      } else {
        setIsAdmin(false);
        setRole('visitante');
        setParticipantId(undefined);
      }

      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = useCallback(async () => {
    await auth.signOut();
    setUser(null);
    setIsAdmin(false);
    setRole('visitante');
    setParticipantId(undefined);
  }, []);

  return {
    user,
    isLogged: !!user,
    isAdmin,
    isLulu: role === 'lulu',
    role,
    participantId,
    isLoading,
    handleLogout,
  };
};
