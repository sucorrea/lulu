'use client';

import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { getIdTokenResult, onAuthStateChanged, type User } from 'firebase/auth';

import { auth } from '@/services/firebase';

export interface AuthState {
  user: User | null;
  isLogged: boolean;
  isAdmin: boolean;
  isLoading: boolean;
  handleLogout: () => Promise<void>;
}

export const AuthContext = createContext<AuthState | null>(null);

const readAdminClaim = async (user: User): Promise<boolean> => {
  try {
    const tokenResult = await getIdTokenResult(user);
    return !!tokenResult.claims.admin;
  } catch {
    return false;
  }
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let latestEvent = 0;

    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      const event = ++latestEvent;
      setUser(currentUser);
      const admin = currentUser ? await readAdminClaim(currentUser) : false;
      if (event !== latestEvent) {
        return;
      }
      setIsAdmin(admin);
      setIsLoading(false);
    });

    return () => {
      latestEvent++;
      unsubscribe();
    };
  }, []);

  const handleLogout = useCallback(async () => {
    await auth.signOut();
    setUser(null);
    setIsAdmin(false);
  }, []);

  const value = useMemo<AuthState>(
    () => ({ user, isLogged: !!user, isAdmin, isLoading, handleLogout }),
    [user, isAdmin, isLoading, handleLogout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
