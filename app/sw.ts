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

const sw = globalThis as unknown as ServiceWorkerGlobalScope;

sw.addEventListener('push', (event) => {
  if (!event.data) {
    return;
  }

  let payload: {
    notification?: { title?: string; body?: string; icon?: string };
    data?: Record<string, string>;
  };
  try {
    payload = event.data.json();
  } catch {
    return;
  }

  const title = payload.notification?.title ?? 'Luluzinha';
  const options: NotificationOptions = {
    body: payload.notification?.body ?? '',
    icon: payload.notification?.icon ?? '/icons/icon-192x192.png',
    badge: '/icons/icon-72x72.png',
    data: payload.data,
  };

  event.waitUntil(sw.registration.showNotification(title, options));
});

sw.addEventListener('notificationclick', (event) => {
  event.notification.close();

  const url = event.notification.data?.url ?? '/';

  event.waitUntil(
    sw.clients
      .matchAll({ type: 'window', includeUncontrolled: true })
      .then((clientList) => {
        for (const client of clientList) {
          if (client.url.includes(url) && 'focus' in client) {
            return client.focus();
          }
        }
        return sw.clients.openWindow(url);
      })
  );
});
