'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { isCurrentRoute, NAV_ITEMS } from '@/lib/nav-config';

const Footer = () => {
  const pathname = usePathname();

  const isLinkActive = (href: string) =>
    isCurrentRoute(pathname, href) ? 'text-primary' : 'text-muted-foreground';

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
        {NAV_ITEMS.map(({ href, label, shortLabel, icon: Icon }) => (
          <Link
            key={href}
            className={`flex min-h-[44px] min-w-[56px] flex-shrink-0 flex-col items-center justify-center gap-0.5 rounded-lg px-1 py-2 text-[10px] transition-colors active:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 sm:min-w-0 sm:gap-1 sm:px-2 sm:py-1 sm:text-xs sm:hover:bg-muted ${isLinkActive(href)}`}
            href={href}
            data-testid={`link-${href}`}
            aria-label={label}
            title={label}
          >
            <Icon
              className="size-[18px] sm:size-5"
              aria-hidden
            />
            <span className="max-w-[52px] truncate text-center sm:max-w-none sm:whitespace-nowrap">
              {shortLabel ?? label}
            </span>
          </Link>
        ))}
      </nav>
    </footer>
  );
};

export default Footer;
