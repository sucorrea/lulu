import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { NotificationHomeBanner } from './notification-home-banner';

const mockRequestNotificationPermission = vi.fn();
const mockHasNotificationPermission = vi.fn();
const mockGetStoredFcmToken = vi.fn();

vi.mock('@/services/fcm', () => ({
  requestNotificationPermission: (...args: unknown[]) =>
    mockRequestNotificationPermission(...args),
  hasNotificationPermission: () => mockHasNotificationPermission(),
  getStoredFcmToken: (...args: unknown[]) => mockGetStoredFcmToken(...args),
}));

const localStorageStore: Record<string, string> = {};

const localStorageMock = {
  getItem: vi.fn((key: string) => localStorageStore[key] ?? null),
  setItem: vi.fn((key: string, value: string) => {
    localStorageStore[key] = value;
  }),
};

Object.defineProperty(window, 'localStorage', { value: localStorageMock });

describe('NotificationHomeBanner', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    Object.keys(localStorageStore).forEach(
      (key) => delete localStorageStore[key]
    );
    localStorageMock.getItem.mockImplementation(
      (key: string) => localStorageStore[key] ?? null
    );
    localStorageMock.setItem.mockImplementation(
      (key: string, value: string) => {
        localStorageStore[key] = value;
      }
    );
    mockHasNotificationPermission.mockReturnValue(false);
    mockGetStoredFcmToken.mockResolvedValue([]);
  });

  it('should render null when no participantId', () => {
    const { container } = render(<NotificationHomeBanner />);
    expect(container.innerHTML).toBe('');
  });

  it('should show banner for logged-in user without notifications', async () => {
    render(<NotificationHomeBanner participantId="p1" />);

    await waitFor(() => {
      expect(
        screen.getByTestId('notification-home-banner')
      ).toBeInTheDocument();
    });

    expect(
      screen.getByText('Ativar notificações de aniversário')
    ).toBeInTheDocument();
    expect(screen.getByText('Ativar')).toBeInTheDocument();
  });

  it('should not show banner when already dismissed via localStorage', () => {
    localStorageStore['lulu-notification-banner-dismissed'] = 'true';

    render(<NotificationHomeBanner participantId="p1" />);

    expect(
      screen.queryByTestId('notification-home-banner')
    ).not.toBeInTheDocument();
  });

  it('should not show banner when notifications already enabled', async () => {
    mockHasNotificationPermission.mockReturnValue(true);
    mockGetStoredFcmToken.mockResolvedValue(['existing-token']);

    const { container } = render(
      <NotificationHomeBanner participantId="p1" />
    );

    await waitFor(() => {
      expect(mockGetStoredFcmToken).toHaveBeenCalledWith('p1');
    });

    expect(container.querySelector('[data-testid="notification-home-banner"]')).not.toBeInTheDocument();
  });

  it('should dismiss banner and set localStorage on close button click', async () => {
    render(<NotificationHomeBanner participantId="p1" />);

    await waitFor(() => {
      expect(
        screen.getByTestId('notification-home-banner')
      ).toBeInTheDocument();
    });

    fireEvent.click(
      screen.getByLabelText('Fechar banner de notificações')
    );

    expect(
      screen.queryByTestId('notification-home-banner')
    ).not.toBeInTheDocument();
    expect(localStorageMock.setItem).toHaveBeenCalledWith(
      'lulu-notification-banner-dismissed',
      'true'
    );
  });

  it('should enable notifications and dismiss on Ativar click', async () => {
    mockRequestNotificationPermission.mockResolvedValue('new-token');

    render(<NotificationHomeBanner participantId="p1" />);

    await waitFor(() => {
      expect(screen.getByText('Ativar')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('Ativar'));

    await waitFor(() => {
      expect(mockRequestNotificationPermission).toHaveBeenCalledWith('p1');
    });

    await waitFor(() => {
      expect(
        screen.queryByTestId('notification-home-banner')
      ).not.toBeInTheDocument();
    });

    expect(localStorageMock.setItem).toHaveBeenCalledWith(
      'lulu-notification-banner-dismissed',
      'true'
    );
  });

  it('should show loading state while activating', async () => {
    let resolvePermission: (value: string | null) => void;
    mockRequestNotificationPermission.mockImplementation(
      () =>
        new Promise((resolve) => {
          resolvePermission = resolve;
        })
    );

    render(<NotificationHomeBanner participantId="p1" />);

    await waitFor(() => {
      expect(screen.getByText('Ativar')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('Ativar'));

    await waitFor(() => {
      expect(screen.getByText('Ativando...')).toBeInTheDocument();
    });

    resolvePermission!('token');

    await waitFor(() => {
      expect(
        screen.queryByTestId('notification-home-banner')
      ).not.toBeInTheDocument();
    });
  });

  it('should keep banner visible when permission returns null', async () => {
    mockRequestNotificationPermission.mockResolvedValue(null);

    render(<NotificationHomeBanner participantId="p1" />);

    await waitFor(() => {
      expect(screen.getByText('Ativar')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('Ativar'));

    await waitFor(() => {
      expect(mockRequestNotificationPermission).toHaveBeenCalled();
    });

    expect(
      screen.getByTestId('notification-home-banner')
    ).toBeInTheDocument();
  });
});
