'use client';
import { CameraIcon, Gift, LayoutDashboardIcon } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const Footer = () => {
  const pathname = usePathname();

  const isLinkActive = (path: string) =>
    pathname === path ? 'text-primary' : '';

  return (
    <footer className="fixed bottom-0 w-full shadow-lg p-3 bg-background">
      <div className="container mx-auto flex justify-around">
        <Link
          className={`flex flex-col items-center ${isLinkActive('/')}`}
          href={'/'}
        >
          <Gift size={20} />
          <span className="text-xs mt-1">Home</span>
        </Link>
        <Link
          className={`flex flex-col items-center ${isLinkActive('/dashboard')}`}
          href={'/dashboard'}
        >
          <LayoutDashboardIcon size={20} />
          <span className="text-xs mt-1">Dashboard</span>
        </Link>
        <Link
          className={`flex flex-col items-center ${isLinkActive('/galeria')}`}
          href={'/galeria'}
        >
          <CameraIcon size={20} />
          <span className="text-xs mt-1">Galeria</span>
        </Link>
      </div>
    </footer>
  );
};

export default Footer;
