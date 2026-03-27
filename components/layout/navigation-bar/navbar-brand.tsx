'use client';

import { memo } from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface NavbarBrandProps {
  currentYear: number;
}

export const NavbarBrand = memo(function NavbarBrand({
  currentYear,
}: NavbarBrandProps) {
  return (
    <div className="flex shrink-0 items-center">
      <Link href="/" className="flex items-center gap-1">
        <Image
          src="/luluzinha_no_background.png"
          alt="luluzinha"
          width={30}
          height={30}
          className="h-auto w-auto"
          priority
        />
        <span className="lulu-header text-wrap sm:text-xs md:text-2xl md:text-nowrap font-bold">{`Luluzinha ${currentYear}`}</span>
      </Link>
    </div>
  );
});
