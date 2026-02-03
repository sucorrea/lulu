'use client';

import { memo } from 'react';
import Link from 'next/link';

import { ThemeToggle } from './mode-toggle';
import { NavbarBrand } from './navbar-brand';
import { NavbarUserSection } from './navbar-user-section';
import { useNavbar } from './hooks/use-navbar';

export const Navbar = memo(function Navbar() {
  const {
    isAuthenticated,
    isLoadingUser,
    isLoginPage,
    userFirstName,
    currentYear,
    handleLogout,
  } = useNavbar();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur md:px-4">
      <div className="container flex h-14 items-center justify-between gap-4">
        <NavbarBrand currentYear={currentYear} />
        <nav className="flex flex-1 items-center justify-end gap-4">
          <div className="flex items-center gap-2 md:gap-4">
            <NavbarUserSection
              isAuthenticated={isAuthenticated}
              isLoading={isLoadingUser}
              isLoginPage={isLoginPage}
              userFirstName={userFirstName}
              onLogout={handleLogout}
            />
            <ThemeToggle />
          </div>
        </nav>
      </div>
    </header>
  );
});
