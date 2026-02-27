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

          if (currentUser.email) {
            const participantsRef = collection(db, 'participants');
            const q = query(
              participantsRef,
              where('authEmail', '==', currentUser.email)
            );
            const snapshot = await getDocs(q);

            if (!snapshot.empty) {
              const participantDoc = snapshot.docs[0];
              setParticipantId(participantDoc.id);
              const data = participantDoc.data();
              if (!adminClaim && data.role) {
                setRole(data.role as Role);
              }
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
