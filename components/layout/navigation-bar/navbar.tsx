'use client';

import { memo } from 'react';
import Link from 'next/link';
import { FileText, LayoutDashboard, Users } from 'lucide-react';

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
          {isAuthenticated && (
            <div className="hidden md:flex items-center gap-1">
              <Link
                href="/"
                className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors rounded-md hover:bg-muted"
              >
                <Users className="w-4 h-4" />
                Participantes
              </Link>
              <Link
                href="/dashboard"
                className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors rounded-md hover:bg-muted"
              >
                <LayoutDashboard className="w-4 h-4" />
                Dashboard
              </Link>
              <Link
                href="/audit"
                className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors rounded-md hover:bg-muted"
              >
                <FileText className="w-4 h-4" />
                Auditoria
              </Link>
            </div>
          )}
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
