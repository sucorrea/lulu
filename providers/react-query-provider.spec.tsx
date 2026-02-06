import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import type { ReactNode } from 'react';

type PersistOptions = {
  persister: unknown;
  maxAge: number;
};

type PersistProviderProps = {
  children: ReactNode;
  persistOptions: PersistOptions;
  client: unknown;
};

type QueryProviderProps = {
  children: ReactNode;
  client: unknown;
};

type AsyncStoragePersister = {
  persistClient: (client: unknown) => Promise<void> | void;
  restoreClient: () => Promise<unknown> | unknown;
  removeClient: () => Promise<void> | void;
};

const reactQueryMocks = vi.hoisted(() => ({
  queryClient: vi.fn(() => ({ id: 'query-client' })),
  queryClientProvider: vi.fn(({ children }: QueryProviderProps) => (
    <div data-testid="query-provider">{children}</div>
  )),
}));

const persistMocks = vi.hoisted(() => ({
  persistProvider: vi.fn(({ children }: PersistProviderProps) => (
    <div data-testid="persist-provider">{children}</div>
  )),
}));

const persisterMocks = vi.hoisted(() => ({
  createAsyncStoragePersister: vi.fn<() => AsyncStoragePersister | undefined>(
    () => undefined
  ),
}));

vi.mock('@tanstack/react-query', () => ({
  QueryClient: reactQueryMocks.queryClient,
  QueryClientProvider: reactQueryMocks.queryClientProvider,
}));

vi.mock('@tanstack/react-query-persist-client', () => ({
  PersistQueryClientProvider: persistMocks.persistProvider,
}));

vi.mock('@tanstack/query-async-storage-persister', () => ({
  createAsyncStoragePersister: persisterMocks.createAsyncStoragePersister,
}));

describe('ReactQueryProvider', () => {
  beforeEach(() => {
    vi.resetModules();
    vi.clearAllMocks();
  });

  it('renders QueryClientProvider when persister is undefined', async () => {
    persisterMocks.createAsyncStoragePersister.mockReturnValueOnce(undefined);

    const { ReactQueryProvider } = await import('./react-query-provider');

    render(
      <ReactQueryProvider>
        <div>Child</div>
      </ReactQueryProvider>
    );

    expect(screen.getByTestId('query-provider')).toBeInTheDocument();
    expect(screen.queryByTestId('persist-provider')).toBeNull();
    expect(screen.getByText('Child')).toBeInTheDocument();
    expect(reactQueryMocks.queryClient).toHaveBeenCalledWith({
      defaultOptions: {
        queries: {
          refetchOnWindowFocus: false,
          staleTime: Infinity,
        },
      },
    });
  });

  it('renders PersistQueryClientProvider when persister exists', async () => {
    const persister: AsyncStoragePersister = {
      persistClient: vi.fn(),
      restoreClient: vi.fn(),
      removeClient: vi.fn(),
    };
    persisterMocks.createAsyncStoragePersister.mockReturnValueOnce(persister);

    const { ReactQueryProvider } = await import('./react-query-provider');

    render(
      <ReactQueryProvider>
        <div>Content</div>
      </ReactQueryProvider>
    );

    expect(screen.getByTestId('persist-provider')).toBeInTheDocument();
    expect(screen.queryByTestId('query-provider')).toBeNull();
    const call = persistMocks.persistProvider.mock.calls[0]?.[0];
    expect(call?.persistOptions?.maxAge).toBe(1000 * 60 * 60 * 24);
    expect(call?.persistOptions?.persister).toBe(persister);
  });
});
