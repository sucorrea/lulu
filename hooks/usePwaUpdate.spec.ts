import { renderHook } from '@testing-library/react';
import { describe, expect, it, vi, beforeEach, afterEach, Mock } from 'vitest';
import { toast } from 'sonner';
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
  removeEventListener: ReturnType<typeof vi.fn>;
}

interface MockRegistration {
  installing: MockServiceWorker | null;
  addEventListener: ReturnType<typeof vi.fn>;
  removeEventListener: ReturnType<typeof vi.fn>;
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
      removeEventListener: vi.fn(),
    };

    mockRegistration = {
      installing: mockServiceWorker,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
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
    vi.useRealTimers();
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

  it('should call registration.update periodically to check for new versions', async () => {
    vi.useFakeTimers();

    renderHook(() => usePwaUpdate());

    await Promise.resolve();

    vi.advanceTimersByTime(60 * 60 * 1000);

    expect(mockRegistration.update).toHaveBeenCalled();
  });

  it('should show update toast and allow skipping waiting when a new version is installed', async () => {
    Object.defineProperty(globalThis.navigator, 'serviceWorker', {
      value: {
        controller: {} as ServiceWorker,
        ready: Promise.resolve(mockRegistration),
      },
      writable: true,
      configurable: true,
    });

    const originalLocation = globalThis.location;
    const reloadMock = vi.fn();

    delete (globalThis as { location?: Location }).location;
    globalThis.location = {
      ...originalLocation,
      reload: reloadMock,
    } as Location;

    renderHook(() => usePwaUpdate());

    await vi.waitFor(() => {
      expect(mockRegistration.addEventListener).toHaveBeenCalledWith(
        'updatefound',
        expect.any(Function)
      );
    });

    const updateFoundHandler = mockRegistration.addEventListener.mock
      .calls[0][1] as () => void;
    updateFoundHandler();

    await vi.waitFor(() => {
      expect(mockServiceWorker.addEventListener).toHaveBeenCalledWith(
        'statechange',
        expect.any(Function)
      );
    });

    const stateChangeHandler = mockServiceWorker.addEventListener.mock
      .calls[0][1] as () => void;

    mockServiceWorker.state = 'installed';
    stateChangeHandler();

    await vi.waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith(
        'Nova versão disponível!',
        expect.objectContaining({
          description: 'Recarregue a página para atualizar.',
          action: expect.objectContaining({
            label: 'Atualizar',
            onClick: expect.any(Function),
          }),
        })
      );
    });

    const toastArgs = (toast.success as unknown as Mock).mock.calls[0][1];

    toastArgs.action.onClick();

    expect(mockServiceWorker.postMessage).toHaveBeenCalledWith({
      type: 'SKIP_WAITING',
    });
    expect(reloadMock).toHaveBeenCalled();

    globalThis.location = originalLocation;
  });
});
