import dynamic from 'next/dynamic';
import { Inter } from 'next/font/google';
import { ReactNode } from 'react';

import type { Metadata, Viewport } from 'next';

import { Navbar } from '@/components/layout/navigation-bar/navbar';
import { Toaster } from '@/components/ui/sonner';
import { DeviceProvider } from '@/providers/device-provider';
import { ReactQueryProvider } from '@/providers/react-query-provider';
import { ThemeProvider } from '@/providers/theme-provider';
import { CURRENT_YEAR } from '@/lib/constants';
import { VaulPatch } from '@/components/layout/vaul-patch';
import './globals.css';

const Footer = dynamic(() => import('@/components/layout/footer'));

const VisitCounter = dynamic(() =>
  import('@/components/layout/visit-counter').then((m) => ({
    default: m.VisitCounter,
  }))
);

const PwaUpdateManager = dynamic(() =>
  import('@/components/layout/pwa-update-manager').then((m) => ({
    default: m.PwaUpdateManager,
  }))
);

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
  preload: true,
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_BASE_URL || 'https://luluzinha.web.app'
  ),
  title: `Luluzinha ${CURRENT_YEAR}`,
  description:
    'PWA para organizar vaquinhas de aniversário entre amigas. Galeria social, dashboard, histórico e auditoria em tempo real.',
  manifest: '/manifest.webmanifest',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Luluzinha',
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    title: `Luluzinha ${CURRENT_YEAR}`,
    description:
      'PWA para organizar vaquinhas de aniversário entre amigas. Galeria social, dashboard e auditoria em tempo real.',
    type: 'website',
    locale: 'pt_BR',
  },
  twitter: {
    card: 'summary_large_image',
    title: `Luluzinha ${CURRENT_YEAR}`,
    description:
      'PWA para organizar vaquinhas de aniversário entre amigas. Galeria social, dashboard e auditoria em tempo real.',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0a0a0a' },
  ],
};

const RootLayout = ({
  children,
}: Readonly<{
  children: ReactNode;
}>) => {
  return (
    <html lang="pt-BR" className={inter.variable} suppressHydrationWarning>
      <head>
        <link rel="apple-touch-icon" href="/icons/apple-icon-180.png" />
      </head>
      <body className="antialiased">
        <ReactQueryProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <DeviceProvider>
              <a
                href="#main-content"
                className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:rounded-md focus:shadow-lg"
              >
                Pular para conteúdo principal
              </a>
              <Navbar />
              <main id="main-content" className="pb-20 md:pb-0">
                {children}
              </main>
              <Footer />
              <div className="fixed bottom-20 right-3 z-30 md:bottom-3">
                <VisitCounter />
              </div>
            </DeviceProvider>
            <PwaUpdateManager />
            <Toaster />
            <VaulPatch />
          </ThemeProvider>
        </ReactQueryProvider>
      </body>
    </html>
  );
};

export default RootLayout;
