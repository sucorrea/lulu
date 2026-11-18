'use client';

import Link from 'next/link';

import { GenericBottomSheet } from '@/components/dialog/bottom-sheet';
import { filterNavByRole, MORE_NAV_ITEMS } from '@/lib/nav-config';

type MoreMenuSheetProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isAdmin: boolean;
};

export const MoreMenuSheet = ({
  open,
  onOpenChange,
  isAdmin,
}: Readonly<MoreMenuSheetProps>) => (
  <GenericBottomSheet open={open} onOpenChange={onOpenChange} title="Mais">
    <ul className="flex flex-col gap-1">
      {filterNavByRole(MORE_NAV_ITEMS, isAdmin).map(
        ({ href, label, icon: Icon }) => (
          <li key={href}>
            <Link
              href={href}
              onClick={() => onOpenChange(false)}
              className="flex min-h-[44px] items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
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
