import { useEffect, useState } from 'react';
import { getAuth, User, onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/services/firebase';

export function useUserVerification() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = () => {
    auth.signOut().then(() => {
      setUser(null);
    });
  };

  return { user, isLogged: !!user, isLoading, handleLogout };
}
