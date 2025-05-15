'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { ArrowLeft, LogIn, LogOutIcon } from 'lucide-react';

import { useUserVerification } from '@/hooks/user-verify';

export default function NavigationBar() {
  const { user, handleLogout } = useUserVerification();
  const pathname = usePathname();
  const isLoginPage = pathname === '/login';

  return (
    <nav className="bg-gradient-to-bl from-rose-400 to-amber-500">
      <div className="ml-auto flex gap-4">
        {user ? (
          <div className="flex justify-between items-center ml-2">
            <Link href="/">
              <span className="text-white font-bold">
                {user.displayName
                  ? `Welcome, ${user.displayName}`
                  : 'Seja bem vindo!'}
              </span>
            </Link>
            <div>
              <button
                onClick={handleLogout}
                className="text-red-600 bold hover:text-gray-200 px-4 py-2 flex items-center rounded gap-2"
              >
                <LogOutIcon className="h-5 w-5" />
                Sair
              </button>
            </div>
          </div>
        ) : (
          <>
            {!isLoginPage ? (
              <Link
                href="/login"
                className="text-red-600 bold hover:text-gray-200 px-4 py-2 flex items-center rounded gap-2"
              >
                Entrar
                <LogIn className="h-5 w-5" />
              </Link>
            ) : (
              <Link
                href="../"
                className="text-red-600 bold hover:text-gray-200 px-4 py-2 flex items-center rounded gap-2"
              >
                <ArrowLeft className="h-5 w-5" />
                Voltar
              </Link>
            )}
          </>
        )}
      </div>
    </nav>
  );
}
