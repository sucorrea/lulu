'use client';

import { memo } from 'react';
import Link from 'next/link';
import {
  FileText,
  LayoutDashboard,
  Menu,
  Users,
  X,
  History,
} from 'lucide-react';

import { ThemeToggle } from './mode-toggle';
import { NavbarBrand } from './navbar-brand';
import { NavbarUserSection } from './navbar-user-section';
import { useNavbar } from './hooks/use-navbar';
import { useDisclosure } from '@/hooks/use-disclosure';

const NavLink = memo(function NavLink({
  href,
  icon: Icon,
  label,
  onClick,
}: {
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  onClick?: () => void;
}) {
  return (
    <Link
      href={href}
      className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors rounded-md hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
      onClick={onClick}
    >
      <Icon className="w-4 h-4" aria-hidden="true" />
      <span>{label}</span>
    </Link>
  );
});

export const Navbar = memo(function Navbar() {
  const {
    isOpen: isMobileMenuOpen,
    onClose: onCloseMobileMenu,
    onToggle: onToggleMobileMenu,
  } = useDisclosure();

  const {
    isAuthenticated,
    isLoadingUser,
    isLoginPage,
    userFirstName,
    currentYear,
    handleLogout,
  } = useNavbar();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur md:px-2">
      <div className="container flex h-14 items-center justify-between gap-2 px-1.5">
        {isAuthenticated && (
          <button
            type="button"
            className="inline-flex items-center justify-center rounded-md p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground md:hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            aria-label={isMobileMenuOpen ? 'Fechar menu' : 'Abrir menu'}
            aria-expanded={isMobileMenuOpen}
            aria-controls="mobile-menu"
            onClick={onToggleMobileMenu}
          >
            {isMobileMenuOpen ? (
              <X className="h-5 w-5" aria-hidden="true" />
            ) : (
              <Menu className="h-5 w-5" aria-hidden="true" />
            )}
          </button>
        )}
        <NavbarBrand currentYear={currentYear} />
        <nav
          className="flex flex-1 items-center justify-end gap-4"
          aria-label="Navegação principal"
        >
          {isAuthenticated && (
            <div className="hidden md:flex items-center gap-1">
              <NavLink href="/" icon={Users} label="Participantes" />
              <NavLink
                href="/dashboard"
                icon={LayoutDashboard}
                label="Dashboard"
              />
              <NavLink href="/audit" icon={FileText} label="Auditoria" />
              <NavLink href="/historico" icon={History} label="Histórico" />
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
      {isAuthenticated && (
        <div
          id="mobile-menu"
          className={`md:hidden ${isMobileMenuOpen ? 'block' : 'hidden'}`}
        >
          <nav
            className="border-t border-border bg-background/95 backdrop-blur"
            aria-label="Menu mobile"
          >
            <div className="container flex flex-col gap-1 py-2">
              <NavLink
                href="/"
                icon={Users}
                label="Participantes"
                onClick={onCloseMobileMenu}
              />
              <NavLink
                href="/dashboard"
                icon={LayoutDashboard}
                label="Dashboard"
                onClick={onCloseMobileMenu}
              />
              <NavLink
                href="/audit"
                icon={FileText}
                label="Auditoria"
                onClick={onCloseMobileMenu}
              />
              <NavLink
                href="/historico"
                icon={History}
                label="Histórico"
                onClick={onCloseMobileMenu}
              />
            </div>
          </nav>
        </div>
      )}
    </header>
  );
});
