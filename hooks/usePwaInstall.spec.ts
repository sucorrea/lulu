import { renderHook, act } from '@testing-library/react';
import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';
import { toast } from 'sonner';
import { usePwaInstall } from './usePwaInstall';

vi.mock('sonner', () => ({
  toast: vi.fn(),
}));

const STORAGE_KEY = 'pwa-install-dismissed';

const mockMatchMedia = (standalone: boolean) => {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation((query: string) => ({
      matches: query === '(display-mode: standalone)' ? standalone : false,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  });
};

const dispatchInstallPromptEvent = () => {
  const event = Object.assign(new Event('beforeinstallprompt'), {
    prompt: vi.fn().mockResolvedValue(undefined),
    userChoice: Promise.resolve({
      outcome: 'dismissed' as const,
      platform: '',
    }),
    platforms: ['web'],
  });
  act(() => {
    window.dispatchEvent(event);
  });
  return event;
};

describe('usePwaInstall', () => {
  beforeEach(() => {
    localStorage.clear();
    mockMatchMedia(false);
    Object.defineProperty(globalThis.navigator, 'userAgent', {
      get: () =>
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120',
      configurable: true,
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it('should not show toast when app is already installed (standalone mode)', () => {
    mockMatchMedia(true);

    renderHook(() => usePwaInstall());
    dispatchInstallPromptEvent();

    expect(toast).not.toHaveBeenCalled();
  });

  it('should not show toast when user already dismissed it', () => {
    localStorage.setItem(STORAGE_KEY, 'true');

    renderHook(() => usePwaInstall());
    dispatchInstallPromptEvent();

    expect(toast).not.toHaveBeenCalled();
  });

  it('should show install toast on beforeinstallprompt event (Android/Chrome)', () => {
    renderHook(() => usePwaInstall());
    dispatchInstallPromptEvent();

    expect(toast).toHaveBeenCalledWith(
      'Instale o app Luluzinha!',
      expect.objectContaining({
        description: 'Adicione ao seu dispositivo para acesso rápido.',
        duration: Infinity,
        action: expect.objectContaining({ label: 'Instalar' }),
      })
    );
  });

  it('should show iOS toast when on iOS Safari', () => {
    Object.defineProperty(globalThis.navigator, 'userAgent', {
      get: () =>
        'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1',
      configurable: true,
    });

    renderHook(() => usePwaInstall());

    expect(toast).toHaveBeenCalledWith(
      'Instale o app Luluzinha!',
      expect.objectContaining({
        description:
          'Toque em Compartilhar ↑ e depois "Adicionar à Tela Início".',
        duration: 12000,
      })
    );
  });

  it('should not show iOS toast when on iOS Chrome (CriOS)', () => {
    Object.defineProperty(globalThis.navigator, 'userAgent', {
      get: () =>
        'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/120.0.0.0 Mobile/15E148 Safari/604.1',
      configurable: true,
    });

    renderHook(() => usePwaInstall());
    dispatchInstallPromptEvent();

    expect(toast).not.toHaveBeenCalledWith(
      'Instale o app Luluzinha!',
      expect.objectContaining({ duration: 12000 })
    );
  });

  it('should call prompt() when Instalar button is clicked', () => {
    renderHook(() => usePwaInstall());

    const promptMock = vi.fn().mockResolvedValue(undefined);
    const event = Object.assign(new Event('beforeinstallprompt'), {
      prompt: promptMock,
      userChoice: Promise.resolve({
        outcome: 'dismissed' as const,
        platform: '',
      }),
      platforms: ['web'],
    });
    act(() => {
      window.dispatchEvent(event);
    });

    const toastCall = vi.mocked(toast).mock.calls[0];
    const options = toastCall[1] as unknown as {
      action: { onClick: () => void };
    };
    options.action.onClick();

    expect(promptMock).toHaveBeenCalled();
  });

  it('should mark dismissed in localStorage when user accepts installation', async () => {
    renderHook(() => usePwaInstall());

    const event = Object.assign(new Event('beforeinstallprompt'), {
      prompt: vi.fn().mockResolvedValue(undefined),
      userChoice: Promise.resolve({
        outcome: 'accepted' as const,
        platform: '',
      }),
      platforms: ['web'],
    });
    act(() => {
      window.dispatchEvent(event);
    });

    const toastCall = vi.mocked(toast).mock.calls[0];
    const options = toastCall[1] as unknown as {
      action: { onClick: () => void };
    };
    await act(async () => {
      options.action.onClick();
    });

    expect(localStorage.getItem(STORAGE_KEY)).toBe('true');
  });

  it('should mark dismissed when toast is dismissed via onDismiss', () => {
    renderHook(() => usePwaInstall());
    dispatchInstallPromptEvent();

    const toastCall = vi.mocked(toast).mock.calls[0];
    const options = toastCall[1] as { onDismiss: () => void };
    options.onDismiss();

    expect(localStorage.getItem(STORAGE_KEY)).toBe('true');
  });

  it('should remove beforeinstallprompt listener on unmount', () => {
    const removeEventListenerSpy = vi.spyOn(window, 'removeEventListener');

    const { unmount } = renderHook(() => usePwaInstall());
    unmount();

    expect(removeEventListenerSpy).toHaveBeenCalledWith(
      'beforeinstallprompt',
      expect.any(Function)
    );

    removeEventListenerSpy.mockRestore();
  });
});
