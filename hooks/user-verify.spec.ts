import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useUserVerification } from './user-verify';
import type { User } from 'firebase/auth';

const mockSignOut = vi.fn();
const mockOnAuthStateChanged = vi.fn();
const mockGetAuth = vi.fn();
const mockGetIdTokenResult = vi.fn();

vi.mock('firebase/auth', () => ({
  getAuth: () => mockGetAuth(),
  onAuthStateChanged: (
    auth: unknown,
    callback: (user: User | null) => void
  ) => {
    mockOnAuthStateChanged(auth, callback);
    return vi.fn();
  },
  getIdTokenResult: (user: User) => mockGetIdTokenResult(user),
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
    mockGetIdTokenResult.mockResolvedValue({ claims: {} });
  });

  it('should initialize with loading state', () => {
    mockOnAuthStateChanged.mockImplementation(() => vi.fn());
    const { result } = renderHook(() => useUserVerification());
    expect(result.current.isLoading).toBe(true);
    expect(result.current.user).toBe(null);
    expect(result.current.isLogged).toBe(false);
    expect(result.current.isAdmin).toBe(false);
  });

  it('should set user when authenticated', async () => {
    const mockUser = { uid: '123', email: 'test@test.com' } as User;
    mockGetIdTokenResult.mockResolvedValue({ claims: {} });
    mockOnAuthStateChanged.mockImplementation((_, callback) => {
      callback(mockUser);
      return vi.fn();
    });

    const { result } = renderHook(() => useUserVerification());

    await waitFor(() => {
      expect(result.current.user).toEqual(mockUser);
      expect(result.current.isLogged).toBe(true);
      expect(result.current.isLoading).toBe(false);
      expect(result.current.isAdmin).toBe(false);
    });
  });

  it('should set isAdmin to true when user has admin claim', async () => {
    const mockUser = { uid: 'admin-123', email: 'admin@test.com' } as User;
    mockGetIdTokenResult.mockResolvedValue({ claims: { admin: true } });
    mockOnAuthStateChanged.mockImplementation((_, callback) => {
      callback(mockUser);
      return vi.fn();
    });

    const { result } = renderHook(() => useUserVerification());

    await waitFor(() => {
      expect(result.current.isAdmin).toBe(true);
      expect(result.current.isLogged).toBe(true);
      expect(result.current.isLoading).toBe(false);
    });
  });

  it('should set isAdmin to false when getIdTokenResult fails', async () => {
    const mockUser = { uid: '123', email: 'test@test.com' } as User;
    mockGetIdTokenResult.mockRejectedValue(new Error('Token error'));
    mockOnAuthStateChanged.mockImplementation((_, callback) => {
      callback(mockUser);
      return vi.fn();
    });

    const { result } = renderHook(() => useUserVerification());

    await waitFor(() => {
      expect(result.current.isAdmin).toBe(false);
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
      expect(result.current.isAdmin).toBe(false);
      expect(result.current.isLoading).toBe(false);
    });
  });

  it('should call signOut and reset isAdmin when handleLogout is called', async () => {
    const mockUser = { uid: '123' } as User;
    mockGetIdTokenResult.mockResolvedValue({ claims: { admin: true } });
    mockOnAuthStateChanged.mockImplementation((_, callback) => {
      callback(mockUser);
      return vi.fn();
    });
    mockSignOut.mockResolvedValue(undefined);

    const { result } = renderHook(() => useUserVerification());

    await waitFor(() => {
      expect(result.current.user).toEqual(mockUser);
      expect(result.current.isAdmin).toBe(true);
    });

    result.current.handleLogout();

    await waitFor(() => {
      expect(mockSignOut).toHaveBeenCalled();
      expect(result.current.isAdmin).toBe(false);
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
