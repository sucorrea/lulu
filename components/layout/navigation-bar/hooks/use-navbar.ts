'use client';

import { useMemo } from 'react';
import { usePathname } from 'next/navigation';

import { CURRENT_YEAR } from '@/lib/constants';
import { useUserVerification } from '@/hooks/user-verify';

interface UseNavbarResult {
  isAuthenticated: boolean;
  isLoadingUser: boolean;
  isLoginPage: boolean;
  userFirstName: string | null;
  currentYear: number;
  handleLogout: () => void;
}

export const useNavbar = (): UseNavbarResult => {
  const pathname = usePathname();
  const { user, isLoading, handleLogout } = useUserVerification();

  const isLoginPage = useMemo(() => pathname === '/login', [pathname]);
  const isAuthenticated = useMemo(() => !!user, [user]);
  const userFirstName = useMemo(
    () => (user?.displayName ? user.displayName.split(' ')[0] : null),
    [user]
  );
  const currentYear = CURRENT_YEAR;

  return {
    isAuthenticated,
    isLoadingUser: isLoading,
    isLoginPage,
    userFirstName,
    currentYear,
    handleLogout: () => void handleLogout(),
  };
};
