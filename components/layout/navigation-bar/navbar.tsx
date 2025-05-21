'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import { useUserVerification } from '@/hooks/user-verify';
import { ThemeToggle } from './mode-toggle';
import { Button } from '../../ui/button';

export function Navbar() {
  const pathname = usePathname();
  const { user, handleLogout } = useUserVerification();
  const isLoginPage = pathname === '/login';

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur md:px-4">
      <div className="container flex h-14 items-center">
        <div className="mr-1 flex">
          <Link href="/" className="flex items-center">
            <Image
              src="/luluzinha_no_background.png"
              alt="luluzinha"
              width={30}
              height={30}
              style={{ width: 'auto', height: 'auto' }}
              priority
            />
            <span className="lulu-header text-2xl font-bold">Luluzinha</span>
          </Link>
        </div>
        <nav className="flex flex-1 items-center justify-between md:justify-end">
          <div className="flex items-center justify-between">
            {!!user ? (
              <div className="flex items-center space-x-4">
                <span className="text-sm font-medium whitespace-nowrap">
                  Olá, {user.displayName?.split(' ')[0]}
                </span>
                <Button
                  onClick={handleLogout}
                  size="icon"
                  className="px-3 py-1 text-xs rounded-md bg-red-500 hover:bg-red-600 text-white transition-colors"
                >
                  Sair
                </Button>
              </div>
            ) : (
              !isLoginPage && (
                <div className="relative">
                  <Link
                    href="/login"
                    className="px-3 py-1 text-sm rounded-md bg-primary hover:bg-primary/90 text-primary-foreground transition-colors"
                  >
                    Login
                  </Link>
                </div>
              )
            )}
            <ThemeToggle />
          </div>
        </nav>
      </div>
    </header>
  );
}
