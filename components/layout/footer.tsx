'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Ellipsis } from 'lucide-react';

import { useUserVerification } from '@/hooks/user-verify';
import {
  isCurrentRoute,
  MOBILE_PRIMARY_NAV,
  MORE_NAV_ITEMS,
} from '@/lib/nav-config';

import { MoreMenuSheet } from './more-menu-sheet';

const itemClass =
  'flex min-h-[44px] min-w-[56px] flex-shrink-0 flex-col items-center justify-center gap-0.5 rounded-lg px-1 py-2 text-xs transition-colors active:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 sm:min-w-0 sm:gap-1 sm:px-2 sm:py-1 sm:hover:bg-muted';

const Footer = () => {
  const pathname = usePathname();
  const { isAdmin } = useUserVerification();
  const [moreOpen, setMoreOpen] = useState(false);

  const colorClass = (active: boolean) =>
    active ? 'text-primary' : 'text-muted-foreground';

  const isMoreActive = MORE_NAV_ITEMS.some(({ href }) =>
    isCurrentRoute(pathname, href)
  );

  return (
    <footer
      className="fixed inset-x-0 bottom-0 z-40 w-full border-t border-border bg-background/95 shadow-lg backdrop-blur md:hidden"
      style={{ paddingBottom: 'max(0.5rem, env(safe-area-inset-bottom))' }}
      role="contentinfo"
    >
      <nav
        className="container mx-auto flex justify-around gap-0 overflow-x-auto overflow-y-hidden px-1 py-2 sm:gap-2 sm:px-2"
        aria-label="Navegação rápida"
      >
        {MOBILE_PRIMARY_NAV.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            className={`${itemClass} ${colorClass(isCurrentRoute(pathname, href))}`}
            href={href}
            aria-current={isCurrentRoute(pathname, href) ? 'page' : undefined}
            data-testid={`link-${href}`}
            aria-label={label}
            title={label}
          >
            <Icon className="size-[18px] sm:size-5" aria-hidden />
            <span className="whitespace-nowrap text-center">{label}</span>
          </Link>
        ))}
        <button
          type="button"
          className={`${itemClass} ${colorClass(isMoreActive)}`}
          aria-label="Mais"
          aria-haspopup="dialog"
          aria-expanded={moreOpen}
          onClick={() => setMoreOpen(true)}
        >
          <Ellipsis className="size-[18px] sm:size-5" aria-hidden />
          <span className="whitespace-nowrap text-center">Mais</span>
        </button>
      </nav>
      <MoreMenuSheet
        open={moreOpen}
        onOpenChange={setMoreOpen}
        isAdmin={isAdmin}
      />
    </footer>
  );
};

export default Footer;
