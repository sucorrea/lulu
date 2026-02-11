import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useUserVerification } from './user-verify';
import type { User } from 'firebase/auth';

const mockSignOut = vi.fn();
const mockOnAuthStateChanged = vi.fn();
const mockGetAuth = vi.fn();

vi.mock('firebase/auth', () => ({
  getAuth: () => mockGetAuth(),
  onAuthStateChanged: (
    auth: unknown,
    callback: (user: User | null) => void
  ) => {
    mockOnAuthStateChanged(auth, callback);
    return vi.fn();
  },
}));

vi.mock('@/services/firebase', () => ({
  auth: {
    signOut: () => mockSignOut(),
  },
}));

describe('useUserVerification', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockGetAuth.mockReturnValue({});
  });

  it('should initialize with loading state', () => {
    mockOnAuthStateChanged.mockImplementation(() => vi.fn());
    const { result } = renderHook(() => useUserVerification());
    expect(result.current.isLoading).toBe(true);
    expect(result.current.user).toBe(null);
    expect(result.current.isLogged).toBe(false);
  });

  it('should set user when authenticated', async () => {
    const mockUser = { uid: '123', email: 'test@test.com' } as User;
    mockOnAuthStateChanged.mockImplementation((_, callback) => {
      callback(mockUser);
      return vi.fn();
    });

    const { result } = renderHook(() => useUserVerification());

    await waitFor(() => {
      expect(result.current.user).toEqual(mockUser);
      expect(result.current.isLogged).toBe(true);
      expect(result.current.isLoading).toBe(false);
    });
  });

  it('should set user to null when not authenticated', async () => {
    mockOnAuthStateChanged.mockImplementation((_, callback) => {
      callback(null);
      return vi.fn();
    });

    const { result } = renderHook(() => useUserVerification());

    await waitFor(() => {
      expect(result.current.user).toBe(null);
      expect(result.current.isLogged).toBe(false);
      expect(result.current.isLoading).toBe(false);
    });
  });

  it('should call signOut when handleLogout is called', async () => {
    const mockUser = { uid: '123' } as User;
    mockOnAuthStateChanged.mockImplementation((_, callback) => {
      callback(mockUser);
      return vi.fn();
    });
    mockSignOut.mockResolvedValue(undefined);

    const { result } = renderHook(() => useUserVerification());

    await waitFor(() => {
      expect(result.current.user).toEqual(mockUser);
    });

    result.current.handleLogout();

    await waitFor(() => {
      expect(mockSignOut).toHaveBeenCalled();
    });
  });

  it('should unsubscribe on unmount', () => {
    const unsubscribe = vi.fn();
    mockOnAuthStateChanged.mockReturnValue(unsubscribe);

    const { unmount } = renderHook(() => useUserVerification());

    unmount();

    expect(mockOnAuthStateChanged).toHaveBeenCalled();
  });
});
