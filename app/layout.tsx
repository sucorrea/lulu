import type { Metadata } from 'next';
import { Roboto, Roboto_Mono } from 'next/font/google';
import { ReactNode } from 'react';
import './globals.css';

const ano = new Date().getFullYear();

const robotoSans = Roboto({
  variable: '--font-roboto-sans',
  subsets: ['latin'],
  weight: '400',
});

const geistMono = Roboto_Mono({
  variable: '--font-roboto-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: `Luluzinha ${ano}`,
  description: 'O blog da Luluzinha',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body
        className={`${robotoSans.variable} ${geistMono.variable} antialiased`}
      >
        <main>
          {/* <nav className="bg-gradient-to-bl from-rose-400 to-amber-500">
            <div className="flex w-full items-center  p-3 px-5 text-sm">
              <Link href="/" className="flex items-center gap-2">
                <Image
                  src="/luluzinha.jpg"
                  alt="luluzinha"
                  width={100}
                  height={100}
                />
              </Link>
              <p className="text-4xl font-bold text-center mb-8 text-rose-600 animate-fade-in">
                {`Lulus ${ano}`}
              </p>
            </div>
          </nav> */}
          {children}
          <footer className="mx-auto flex w-full items-center justify-center gap-4 border-t text-center text-xs">
            <p className="text-center text-xs">
              &copy; {ano} Luluzinha. All rights reserved.
            </p>
          </footer>
        </main>
      </body>
    </html>
  );
}
