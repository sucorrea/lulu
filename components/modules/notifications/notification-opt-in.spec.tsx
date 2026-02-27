import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { NotificationOptIn } from './notification-opt-in';

const mockRequestNotificationPermission = vi.fn();
const mockHasNotificationPermission = vi.fn();
const mockGetStoredFcmToken = vi.fn();

vi.mock('@/services/fcm', () => ({
  requestNotificationPermission: (...args: unknown[]) =>
    mockRequestNotificationPermission(...args),
  hasNotificationPermission: () => mockHasNotificationPermission(),
  getStoredFcmToken: (...args: unknown[]) => mockGetStoredFcmToken(...args),
}));

vi.mock('@/hooks/user-verify', () => ({
  useUserVerification: vi.fn(() => ({
    participantId: 'p1',
    user: { uid: '123' },
    isLogged: true,
    isAdmin: false,
    isLulu: true,
    role: 'lulu',
    isLoading: false,
    handleLogout: vi.fn(),
  })),
}));

import { useUserVerification } from '@/hooks/user-verify';

const defaultMockReturn = {
  participantId: 'p1',
  user: { uid: '123' },
  isLogged: true,
  isAdmin: false,
  isLulu: true,
  role: 'lulu' as const,
  isLoading: false,
  handleLogout: vi.fn(),
};

describe('NotificationOptIn', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockHasNotificationPermission.mockReturnValue(false);
    mockGetStoredFcmToken.mockResolvedValue([]);
    vi.mocked(useUserVerification).mockReturnValue(
      defaultMockReturn as unknown as ReturnType<typeof useUserVerification>
    );
  });

  it('should render null when no participantId', () => {
    vi.mocked(useUserVerification).mockReturnValue({
      participantId: undefined,
      user: null,
      isLogged: false,
      isAdmin: false,
      isLulu: false,
      role: 'visitante',
      isLoading: false,
      handleLogout: vi.fn(),
    });

    const { container } = render(<NotificationOptIn />);
    expect(container.innerHTML).toBe('');
  });

  it('should show enable button when notifications are not active', () => {
    render(<NotificationOptIn />);

    expect(
      screen.getByText('Ativar notificações de aniversário')
    ).toBeInTheDocument();
    expect(screen.getByText('Ativar')).toBeInTheDocument();
  });

  it('should show enabled state when permission is granted and tokens exist', async () => {
    mockHasNotificationPermission.mockReturnValue(true);
    mockGetStoredFcmToken.mockResolvedValue(['token1']);

    render(<NotificationOptIn />);

    await waitFor(() => {
      expect(screen.getByText('Notificações ativadas')).toBeInTheDocument();
    });
  });

  it('should call requestNotificationPermission on click', async () => {
    mockRequestNotificationPermission.mockResolvedValue('new-token');

    render(<NotificationOptIn />);

    fireEvent.click(screen.getByText('Ativar'));

    await waitFor(() => {
      expect(mockRequestNotificationPermission).toHaveBeenCalledWith('p1');
    });
  });

  it('should show loading state when activating', async () => {
    let resolvePermission: (value: string | null) => void;
    mockRequestNotificationPermission.mockImplementation(
      () =>
        new Promise((resolve) => {
          resolvePermission = resolve;
        })
    );

    render(<NotificationOptIn />);

    fireEvent.click(screen.getByText('Ativar'));

    await waitFor(() => {
      expect(screen.getByText('Ativando...')).toBeInTheDocument();
    });

    resolvePermission!('token');

    await waitFor(() => {
      expect(screen.getByText('Notificações ativadas')).toBeInTheDocument();
    });
  });

  it('should remain disabled when permission returns null', async () => {
    mockRequestNotificationPermission.mockResolvedValue(null);

    render(<NotificationOptIn />);

    fireEvent.click(screen.getByText('Ativar'));

    await waitFor(() => {
      expect(mockRequestNotificationPermission).toHaveBeenCalled();
    });

    expect(
      screen.getByText('Ativar notificações de aniversário')
    ).toBeInTheDocument();
  });
});
