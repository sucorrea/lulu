'use client';

import { memo, ComponentType } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';

import { NAV_ITEMS, isCurrentRoute } from '@/lib/nav-config';

import { ThemeToggle } from './mode-toggle';
import { NavbarBrand } from './navbar-brand';
import { NavbarUserSection } from './navbar-user-section';
import { useNavbar } from './hooks/use-navbar';
import { useDisclosure } from '@/hooks/use-disclosure';

const linkBaseClass =
  'flex items-center gap-2 px-3 py-2 text-sm font-medium transition-colors rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2';

const NavLink = memo(function NavLink({
  href,
  icon: Icon,
  label,
  onClick,
  isActive,
}: {
  href: string;
  icon: ComponentType<{ className?: string }>;
  label: string;
  onClick?: () => void;
  isActive?: boolean;
}) {
  if (isActive) {
    return (
      <span
        className={`${linkBaseClass} bg-muted text-foreground cursor-default`}
        aria-current="page"
        aria-disabled="true"
      >
        <Icon className="w-4 h-4" aria-hidden="true" />
        <span>{label}</span>
      </span>
    );
  }

  return (
    <Link
      href={href}
      className={`${linkBaseClass} text-muted-foreground hover:text-foreground hover:bg-muted`}
      onClick={onClick}
    >
      <Icon className="w-4 h-4" aria-hidden="true" />
      <span>{label}</span>
    </Link>
  );
});

export const Navbar = memo(function Navbar() {
  const pathname = usePathname();
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
        <NavbarBrand currentYear={currentYear} />
        <nav
          className="flex flex-1 items-center justify-end gap-4"
          aria-label="Navegação principal"
        >
          <div className="hidden md:flex items-center gap-1">
            {NAV_ITEMS.map(({ href, label, icon }) => (
              <NavLink
                key={href}
                href={href}
                icon={icon}
                label={label}
                isActive={isCurrentRoute(pathname, href)}
              />
            ))}
          </div>
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

      <div
        id="mobile-menu"
        className={`md:hidden ${isMobileMenuOpen ? 'block' : 'hidden'}`}
      >
        <nav
          className="border-t border-border bg-background/95 backdrop-blur"
          aria-label="Menu mobile"
        >
          <div className="container flex flex-col gap-1 py-2">
            {NAV_ITEMS.map(({ href, label, icon }) => (
              <NavLink
                key={href}
                href={href}
                icon={icon}
                label={label}
                isActive={isCurrentRoute(pathname, href)}
                onClick={onCloseMobileMenu}
              />
            ))}
          </div>
        </nav>
      </div>
    </header>
  );
});
