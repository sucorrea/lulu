'use client';
import { useState, type ReactNode } from 'react';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';
import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister';

const createQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
        staleTime: Infinity,
        gcTime: 1000 * 60 * 60 * 24 * 7,
        retry: 2,
        retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
        networkMode: 'offlineFirst',
      },
      mutations: {
        networkMode: 'offlineFirst',
      },
    },
  });

export const ReactQueryProvider = ({ children }: { children: ReactNode }) => {
  const [queryClient] = useState(createQueryClient);

  const [persister] = useState(() => {
    const storage =
      typeof globalThis !== 'undefined' && 'localStorage' in globalThis
        ? globalThis.localStorage
        : undefined;
    return storage ? createAsyncStoragePersister({ storage }) : undefined;
  });

  if (!persister) {
    return (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );
  }

  return (
    <PersistQueryClientProvider
      client={queryClient}
      persistOptions={{
        persister,
        maxAge: 1000 * 60 * 60 * 24 * 7,
      }}
    >
      {children}
    </PersistQueryClientProvider>
  );
};
