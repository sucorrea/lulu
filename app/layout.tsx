import { ReactNode } from 'react';

import type { Metadata } from 'next';
import { Roboto, Roboto_Mono } from 'next/font/google';

import Footer from '@/components/layout/footer';
import { Navbar } from '@/components/layout/navigation-bar/navbar';
import { DeviceProvider } from '@/providers/device-provider';
import { ReactQueryProvider } from '@/providers/react-query-provider';
import { ThemeProvider } from '@/providers/theme-provider';
import { Toaster } from '@/components/ui/sonner';
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
  description: 'O site das Lulus.',
  openGraph: {
    title: `Luluzinha ${ano}`,
    description: 'O site das Lulus.',
    type: 'website',
    locale: 'pt_BR',
  },
  twitter: {
    card: 'summary_large_image',
    title: `Luluzinha ${ano}`,
    description: 'O site das Lulus',
  },
};

const RootLayout = ({
  children,
}: Readonly<{
  children: ReactNode;
}>) => {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body
        className={`${robotoSans.variable} ${geistMono.variable} antialiased`}
      >
        <ReactQueryProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <DeviceProvider>
              <main className="pb-20">
                <Navbar />
                {children}
                <Footer />
              </main>
            </DeviceProvider>
            <Toaster />
          </ThemeProvider>
        </ReactQueryProvider>
      </body>
    </html>
  );
};

export default RootLayout;
