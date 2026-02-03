'use client';
import { CameraIcon, Gift, LayoutDashboardIcon } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const Footer = () => {
  const pathname = usePathname();

  const isLinkActive = (path: string) =>
    pathname === path ? 'text-primary' : 'text-muted-foreground';

  return (
    <footer className="fixed bottom-0 w-full border-t border-border bg-background/95 p-2 shadow-lg backdrop-blur">
      <div className="container mx-auto flex justify-around gap-4">
        <Link
          className={`flex flex-col items-center rounded-full px-3 py-1 text-xs transition-colors hover:bg-muted ${isLinkActive(
            '/'
          )}`}
          href={'/'}
        >
          <Gift size={20} />
          <span className="mt-1 text-xs">Home</span>
        </Link>
        <Link
          className={`flex flex-col items-center rounded-full px-3 py-1 text-xs transition-colors hover:bg-muted ${isLinkActive(
            '/dashboard'
          )}`}
          href={'/dashboard'}
        >
          <LayoutDashboardIcon size={20} />
          <span className="mt-1 text-xs">Dashboard</span>
        </Link>
        <Link
          className={`flex flex-col items-center rounded-full px-3 py-1 text-xs transition-colors hover:bg-muted ${isLinkActive(
            '/galeria'
          )}`}
          href={'/galeria'}
        >
          <CameraIcon size={20} />
          <span className="mt-1 text-xs">Galeria</span>
        </Link>
      </div>
    </footer>
  );
};

export default Footer;
