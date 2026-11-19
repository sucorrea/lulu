import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import type { ReactNode } from 'react';
import type { User } from 'firebase/auth';

import { useUserVerification } from '@/hooks/user-verify';
import { AuthProvider } from './auth-provider';

const mockSignOut = vi.fn();
const mockOnAuthStateChanged = vi.fn();
const mockGetIdTokenResult = vi.fn();

vi.mock('firebase/auth', () => ({
  onAuthStateChanged: (auth: unknown, callback: (user: User | null) => void) =>
    mockOnAuthStateChanged(auth, callback),
  getIdTokenResult: (user: User, forceRefresh?: boolean) =>
    mockGetIdTokenResult(user, forceRefresh),
}));

vi.mock('@/services/firebase', () => ({
  auth: {
    signOut: () => mockSignOut(),
  },
}));

const wrapper = ({ children }: { children: ReactNode }) => (
  <AuthProvider>{children}</AuthProvider>
);

const renderAuth = () => renderHook(() => useUserVerification(), { wrapper });

const emitUser = (user: User | null) => {
  mockOnAuthStateChanged.mockImplementation(
    (_: unknown, callback: (u: User | null) => void) => {
      callback(user);
      return vi.fn();
    }
  );
};

describe('AuthProvider', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockGetIdTokenResult.mockResolvedValue({ claims: {} });
    mockOnAuthStateChanged.mockReturnValue(vi.fn());
  });

  it('should start in loading state', () => {
    const { result } = renderAuth();

    expect(result.current.isLoading).toBe(true);
    expect(result.current.user).toBe(null);
    expect(result.current.isLogged).toBe(false);
    expect(result.current.isAdmin).toBe(false);
  });

  it('should set user when authenticated', async () => {
    const mockUser = { uid: '123', email: 'test@test.com' } as User;
    emitUser(mockUser);

    const { result } = renderAuth();

    await waitFor(() => {
      expect(result.current.user).toEqual(mockUser);
      expect(result.current.isLogged).toBe(true);
      expect(result.current.isLoading).toBe(false);
      expect(result.current.isAdmin).toBe(false);
    });
  });

  it('should set isAdmin when the token has the admin claim', async () => {
    emitUser({ uid: 'admin-123' } as User);
    mockGetIdTokenResult.mockResolvedValue({ claims: { admin: true } });

    const { result } = renderAuth();

    await waitFor(() => {
      expect(result.current.isAdmin).toBe(true);
      expect(result.current.isLoading).toBe(false);
    });
  });

  it('should read the cached token instead of forcing a refresh', async () => {
    emitUser({ uid: '123' } as User);

    renderAuth();

    await waitFor(() => {
      expect(mockGetIdTokenResult).toHaveBeenCalledTimes(1);
    });
    expect(mockGetIdTokenResult.mock.calls[0][1]).toBeUndefined();
  });

  it('should set isAdmin to false when reading the token fails', async () => {
    emitUser({ uid: '123' } as User);
    mockGetIdTokenResult.mockRejectedValue(new Error('Token error'));

    const { result } = renderAuth();

    await waitFor(() => {
      expect(result.current.isAdmin).toBe(false);
      expect(result.current.isLoading).toBe(false);
    });
  });

  it('should set user to null when not authenticated', async () => {
    emitUser(null);

    const { result } = renderAuth();

    await waitFor(() => {
      expect(result.current.user).toBe(null);
      expect(result.current.isLogged).toBe(false);
      expect(result.current.isLoading).toBe(false);
    });
    expect(mockGetIdTokenResult).not.toHaveBeenCalled();
  });

  it('should share one auth listener between many consumers', () => {
    renderHook(
      () => [
        useUserVerification(),
        useUserVerification(),
        useUserVerification(),
      ],
      { wrapper }
    );

    expect(mockOnAuthStateChanged).toHaveBeenCalledTimes(1);
  });

  it('should sign out and reset state on logout', async () => {
    emitUser({ uid: '123' } as User);
    mockGetIdTokenResult.mockResolvedValue({ claims: { admin: true } });
    mockSignOut.mockResolvedValue(undefined);

    const { result } = renderAuth();

    await waitFor(() => expect(result.current.isAdmin).toBe(true));

    await result.current.handleLogout();

    await waitFor(() => {
      expect(mockSignOut).toHaveBeenCalled();
      expect(result.current.isAdmin).toBe(false);
      expect(result.current.user).toBe(null);
    });
  });

  it('should unsubscribe on unmount', () => {
    const unsubscribe = vi.fn();
    mockOnAuthStateChanged.mockReturnValue(unsubscribe);

    const { unmount } = renderAuth();
    unmount();

    expect(unsubscribe).toHaveBeenCalled();
  });
});

describe('useUserVerification without provider', () => {
  it('should return a signed-out, non-loading state', () => {
    const { result } = renderHook(() => useUserVerification());

    expect(result.current).toMatchObject({
      user: null,
      isLogged: false,
      isAdmin: false,
      isLoading: false,
    });
  });
});
