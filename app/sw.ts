/// <reference lib="webworker" />
import { defaultCache } from '@serwist/next/worker';
import type { PrecacheEntry, SerwistGlobalConfig } from 'serwist';
import { ExpirationPlugin, Serwist, StaleWhileRevalidate } from 'serwist';

declare global {
  interface WorkerGlobalScope extends SerwistGlobalConfig {
    __SW_MANIFEST: (PrecacheEntry | string)[] | undefined;
  }
}

declare const self: ServiceWorkerGlobalScope;

const SEVEN_DAYS_IN_SECONDS = 7 * 24 * 60 * 60;

const cloudinaryImagesCache = {
  matcher: /^https:\/\/res\.cloudinary\.com\/.*/i,
  handler: new StaleWhileRevalidate({
    cacheName: 'cloudinary-images',
    plugins: [
      new ExpirationPlugin({
        maxEntries: 64,
        maxAgeSeconds: SEVEN_DAYS_IN_SECONDS,
        maxAgeFrom: 'last-used',
      }),
    ],
  }),
};

const serwist = new Serwist({
  precacheEntries: self.__SW_MANIFEST,
  skipWaiting: true,
  clientsClaim: true,
  navigationPreload: true,
  runtimeCaching: [cloudinaryImagesCache, ...defaultCache],
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
