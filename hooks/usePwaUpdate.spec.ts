import { renderHook } from '@testing-library/react';
import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';
import { usePwaUpdate } from './usePwaUpdate';

vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
  },
}));

interface MockServiceWorker {
  state: ServiceWorkerState;
  postMessage: ReturnType<typeof vi.fn>;
  addEventListener: ReturnType<typeof vi.fn>;
}

interface MockRegistration {
  installing: MockServiceWorker | null;
  addEventListener: ReturnType<typeof vi.fn>;
  update: ReturnType<typeof vi.fn>;
}

describe('usePwaUpdate', () => {
  let mockRegistration: MockRegistration;
  let mockServiceWorker: MockServiceWorker;

  beforeEach(() => {
    mockServiceWorker = {
      state: 'installing',
      postMessage: vi.fn(),
      addEventListener: vi.fn(),
    };

    mockRegistration = {
      installing: mockServiceWorker,
      addEventListener: vi.fn(),
      update: vi.fn().mockResolvedValue(undefined),
    };

    Object.defineProperty(globalThis.navigator, 'serviceWorker', {
      value: {
        controller: null,
        ready: Promise.resolve(mockRegistration),
      },
      writable: true,
      configurable: true,
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should register updatefound listener when service worker is available', async () => {
    renderHook(() => usePwaUpdate());

    await vi.waitFor(() => {
      expect(mockRegistration.addEventListener).toHaveBeenCalledWith(
        'updatefound',
        expect.any(Function)
      );
    });
  });

  it('should not register listeners when service worker is not available', () => {
    Object.defineProperty(globalThis.navigator, 'serviceWorker', {
      value: undefined,
      writable: true,
      configurable: true,
    });

    renderHook(() => usePwaUpdate());

    expect(mockRegistration.addEventListener).not.toHaveBeenCalled();
  });

  it('should handle service worker ready promise rejection', async () => {
    Object.defineProperty(globalThis.navigator, 'serviceWorker', {
      value: {
        ready: Promise.reject(new Error('Service Worker error')),
      },
      writable: true,
      configurable: true,
    });

    expect(() => renderHook(() => usePwaUpdate())).not.toThrow();
  });

  it('should clear update interval on unmount', async () => {
    const clearIntervalSpy = vi.spyOn(globalThis, 'clearInterval');

    const { unmount } = renderHook(() => usePwaUpdate());

    await vi.waitFor(() => {
      expect(mockRegistration.addEventListener).toHaveBeenCalled();
    });

    unmount();

    await vi.waitFor(() => {
      expect(clearIntervalSpy).toHaveBeenCalled();
    });

    clearIntervalSpy.mockRestore();
  });
});
