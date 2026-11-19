'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { GenericBottomSheet } from '@/components/dialog/bottom-sheet';
import { cn } from '@/lib/utils';
import {
  filterNavByRole,
  isCurrentRoute,
  MORE_NAV_ITEMS,
} from '@/lib/nav-config';

type MoreMenuSheetProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isAdmin: boolean;
};

export const MoreMenuSheet = ({
  open,
  onOpenChange,
  isAdmin,
}: Readonly<MoreMenuSheetProps>) => {
  const pathname = usePathname();

  return (
    <GenericBottomSheet open={open} onOpenChange={onOpenChange} title="Mais">
      <ul className="flex flex-col gap-1">
        {filterNavByRole(MORE_NAV_ITEMS, isAdmin).map(
          ({ href, label, icon: Icon }) => (
            <li key={href}>
              <Link
                href={href}
                onClick={() => onOpenChange(false)}
                aria-current={
                  isCurrentRoute(pathname, href) ? 'page' : undefined
                }
                className={cn(
                  'flex min-h-[44px] items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                  isCurrentRoute(pathname, href) && 'text-primary'
                )}
              >
                <Icon className="size-5 text-primary" aria-hidden />
                <span>{label}</span>
              </Link>
            </li>
          )
        )}
      </ul>
    </GenericBottomSheet>
  );
};
