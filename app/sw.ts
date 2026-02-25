/// <reference lib="webworker" />
import { defaultCache } from '@serwist/next/worker';
import type { PrecacheEntry, SerwistGlobalConfig } from 'serwist';
import { ExpirationPlugin, Serwist, StaleWhileRevalidate } from 'serwist';

declare global {
  interface WorkerGlobalScope extends SerwistGlobalConfig {
    __SW_MANIFEST: (PrecacheEntry | string)[] | undefined;
  }
}

const swSelf = globalThis as unknown as WorkerGlobalScope & SerwistGlobalConfig;

// Regra específica para Firebase Storage: limita cache de imagens externas
// (defaultCache usa cross-origin com maxEntries:32; fotos ~5MB cada = ~160MB)
const firebaseStorageCache = {
  matcher: /^https:\/\/firebasestorage\.googleapis\.com\/.*/i,
  handler: new StaleWhileRevalidate({
    cacheName: 'firebase-storage-images',
    plugins: [
      new ExpirationPlugin({
        maxEntries: 16,
        maxAgeSeconds: 7 * 24 * 60 * 60, // 7 dias
        maxAgeFrom: 'last-used',
      }),
    ],
  }),
};

const serwist = new Serwist({
  precacheEntries: swSelf.__SW_MANIFEST,
  skipWaiting: true,
  clientsClaim: true,
  navigationPreload: true,
  runtimeCaching: [firebaseStorageCache, ...defaultCache],
  fallbacks: {
    entries: [
      {
        url: '/offline',
        matcher({ request }) {
          return request.destination === 'document';
        },
      },
    ],
  },
});

serwist.addEventListeners();
