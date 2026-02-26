import { useCallback, useEffect, useState } from 'react';
import { User, onAuthStateChanged, getIdTokenResult } from 'firebase/auth';
import { auth } from '@/services/firebase';

export const useUserVerification = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);

      if (currentUser) {
        try {
          const tokenResult = await getIdTokenResult(currentUser, true);
          setIsAdmin(!!tokenResult.claims.admin);
        } catch {
          setIsAdmin(false);
        }
      } else {
        setIsAdmin(false);
      }

      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = useCallback(async () => {
    await auth.signOut();
    setUser(null);
    setIsAdmin(false);
  }, []);

  return { user, isLogged: !!user, isAdmin, isLoading, handleLogout };
};
