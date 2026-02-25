'use client';

import { memo } from 'react';
import Link from 'next/link';
import clsx from 'clsx';

import { Button } from '../../ui/button';

interface NavbarUserSectionProps {
  isAuthenticated: boolean;
  isLoading: boolean;
  isLoginPage: boolean;
  userFirstName: string | null;
  onLogout: () => void;
}

export const NavbarUserSection = memo(function NavbarUserSection({
  isAuthenticated,
  isLoading,
  isLoginPage,
  userFirstName,
  onLogout,
}: NavbarUserSectionProps) {
  if (isLoading) {
    return null;
  }

  if (isAuthenticated) {
    return (
      <div className="flex items-center gap-2 md:gap-4">
        <span className="whitespace-nowrap text-sm font-medium">
          {userFirstName ? `Olá, ${userFirstName}` : 'Olá, usuário'}
        </span>
        <Button
          onClick={onLogout}
          size="icon"
          className={clsx(
            'rounded-md px-3 py-1 text-xs text-white transition-colors',
            'bg-red-500 hover:bg-red-600'
          )}
        >
          Sair
        </Button>
      </div>
    );
  }

  if (isLoginPage) {
    return null;
  }

  return (
    <div className="relative">
      <Link
        href="/login"
        className={clsx(
          'rounded-md px-3 py-1 text-sm transition-colors',
          'bg-primary text-primary-foreground hover:bg-primary/90'
        )}
      >
        Login
      </Link>
    </div>
  );
});
