'use client';

import { usePathname } from 'next/navigation';

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

  const isLoginPage = pathname === '/login';

  return {
    isAuthenticated: !!user,
    isLoadingUser: isLoading,
    isLoginPage,
    userFirstName: user?.displayName ? user.displayName.split(' ')[0] : null,
    currentYear: new Date().getFullYear(),
    handleLogout,
  };
};
