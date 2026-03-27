'use client';

import { memo, ComponentType } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { NAV_ITEMS, isCurrentRoute } from '@/lib/nav-config';

import { ThemeToggle } from './mode-toggle';
import { NavbarBrand } from './navbar-brand';
import { NavbarUserSection } from './navbar-user-section';
import { useNavbar } from './hooks/use-navbar';

const linkBaseClass =
  'flex items-center gap-2 px-3 py-2 text-sm font-medium transition-colors rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2';

const NavLink = memo(function NavLink({
  href,
  icon: Icon,
  label,
  shortLabel,
  onClick,
  isActive,
}: {
  href: string;
  icon: ComponentType<{ className?: string }>;
  label: string;
  shortLabel?: string;
  onClick?: () => void;
  isActive?: boolean;
}) {
  const displayLabel = shortLabel ?? label;
  const content = (
    <>
      <Icon className="w-4 h-4 shrink-0" aria-hidden="true" />
      <span className="hidden xl:inline">{label}</span>
      <span className="inline xl:hidden">{displayLabel}</span>
    </>
  );

  if (isActive) {
    return (
      <Link
        href={href}
        aria-current="page"
        className={`${linkBaseClass} bg-muted text-foreground cursor-default pointer-events-none opacity-80`}
      >
        {content}
      </Link>
    );
  }

  return (
    <Link
      href={href}
      className={`${linkBaseClass} text-muted-foreground hover:text-foreground hover:bg-muted`}
      onClick={onClick}
    >
      {content}
    </Link>
  );
});

export const Navbar = memo(function Navbar() {
  const pathname = usePathname();
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
        <NavbarBrand currentYear={currentYear} />
        <nav
          className="flex min-w-0 flex-1 items-center justify-end gap-2 overflow-hidden md:gap-4"
          aria-label="Navegação principal"
        >
          <div className="hidden md:flex items-center gap-1">
            {NAV_ITEMS.map(({ href, label, shortLabel, icon }) => (
              <NavLink
                key={href}
                href={href}
                icon={icon}
                label={label}
                shortLabel={shortLabel}
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
    </header>
  );
});
