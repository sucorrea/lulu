import { describe, expect, it, vi, beforeEach } from 'vitest';
import { renderHook } from '@testing-library/react';

vi.mock('next/navigation', () => ({
  usePathname: vi.fn(),
}));

vi.mock('@/hooks/user-verify', () => ({
  useUserVerification: vi.fn(),
}));

import { usePathname } from 'next/navigation';
import { useUserVerification } from '@/hooks/user-verify';
import { useNavbar } from './use-navbar';

describe('useNavbar', () => {
  const mockUsePathname = usePathname as ReturnType<typeof vi.fn>;
  const mockUseUserVerification = useUserVerification as ReturnType<
    typeof vi.fn
  >;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return navbar data', () => {
    mockUsePathname.mockReturnValue('/dashboard');
    mockUseUserVerification.mockReturnValue({
      user: { displayName: 'João Silva' },
      isLoading: false,
      handleLogout: vi.fn(),
    });

    const { result } = renderHook(() => useNavbar());

    expect(result.current).toBeDefined();
    expect(Object.keys(result.current).length).toBeGreaterThan(0);
  });

  it('should set isAuthenticated to true when user exists', () => {
    mockUsePathname.mockReturnValue('/');
    mockUseUserVerification.mockReturnValue({
      user: { displayName: 'João Silva' },
      isLoading: false,
      handleLogout: vi.fn(),
    });

    const { result } = renderHook(() => useNavbar());

    expect(result.current.isAuthenticated).toBe(true);
  });

  it('should set isAuthenticated to false when user is null', () => {
    mockUsePathname.mockReturnValue('/');
    mockUseUserVerification.mockReturnValue({
      user: null,
      isLoading: false,
      handleLogout: vi.fn(),
    });

    const { result } = renderHook(() => useNavbar());

    expect(result.current.isAuthenticated).toBe(false);
  });

  it('should set isLoadingUser from useUserVerification', () => {
    mockUsePathname.mockReturnValue('/');
    mockUseUserVerification.mockReturnValue({
      user: null,
      isLoading: true,
      handleLogout: vi.fn(),
    });

    const { result } = renderHook(() => useNavbar());

    expect(result.current.isLoadingUser).toBe(true);
  });

  it('should set isLoadingUser to false when not loading', () => {
    mockUsePathname.mockReturnValue('/');
    mockUseUserVerification.mockReturnValue({
      user: null,
      isLoading: false,
      handleLogout: vi.fn(),
    });

    const { result } = renderHook(() => useNavbar());

    expect(result.current.isLoadingUser).toBe(false);
  });

  it('should set isLoginPage to true when pathname is /login', () => {
    mockUsePathname.mockReturnValue('/login');
    mockUseUserVerification.mockReturnValue({
      user: null,
      isLoading: false,
      handleLogout: vi.fn(),
    });

    const { result } = renderHook(() => useNavbar());

    expect(result.current.isLoginPage).toBe(true);
  });

  it('should set isLoginPage to false when pathname is not /login', () => {
    mockUsePathname.mockReturnValue('/dashboard');
    mockUseUserVerification.mockReturnValue({
      user: null,
      isLoading: false,
      handleLogout: vi.fn(),
    });

    const { result } = renderHook(() => useNavbar());

    expect(result.current.isLoginPage).toBe(false);
  });

  it('should extract first name from displayName', () => {
    mockUsePathname.mockReturnValue('/');
    mockUseUserVerification.mockReturnValue({
      user: { displayName: 'João Silva' },
      isLoading: false,
      handleLogout: vi.fn(),
    });

    const { result } = renderHook(() => useNavbar());

    expect(result.current.userFirstName).toBe('João');
  });

  it('should set userFirstName to null when user is null', () => {
    mockUsePathname.mockReturnValue('/');
    mockUseUserVerification.mockReturnValue({
      user: null,
      isLoading: false,
      handleLogout: vi.fn(),
    });

    const { result } = renderHook(() => useNavbar());

    expect(result.current.userFirstName).toBeNull();
  });

  it('should handle displayName with single word', () => {
    mockUsePathname.mockReturnValue('/');
    mockUseUserVerification.mockReturnValue({
      user: { displayName: 'João' },
      isLoading: false,
      handleLogout: vi.fn(),
    });

    const { result } = renderHook(() => useNavbar());

    expect(result.current.userFirstName).toBe('João');
  });

  it('should handle displayName with multiple words', () => {
    mockUsePathname.mockReturnValue('/');
    mockUseUserVerification.mockReturnValue({
      user: { displayName: 'João Silva Santos' },
      isLoading: false,
      handleLogout: vi.fn(),
    });

    const { result } = renderHook(() => useNavbar());

    expect(result.current.userFirstName).toBe('João');
  });

  it('should return current year', () => {
    mockUsePathname.mockReturnValue('/');
    mockUseUserVerification.mockReturnValue({
      user: null,
      isLoading: false,
      handleLogout: vi.fn(),
    });

    const { result } = renderHook(() => useNavbar());

    expect(result.current.currentYear).toBe(new Date().getFullYear());
  });

  it('should return handleLogout function that invokes logout when called', () => {
    const handleLogout = vi.fn();
    mockUsePathname.mockReturnValue('/');
    mockUseUserVerification.mockReturnValue({
      user: null,
      isLoading: false,
      handleLogout,
    });

    const { result } = renderHook(() => useNavbar());

    expect(typeof result.current.handleLogout).toBe('function');
    result.current.handleLogout();
    expect(handleLogout).toHaveBeenCalled();
  });

  it('should handle empty displayName', () => {
    mockUsePathname.mockReturnValue('/');
    mockUseUserVerification.mockReturnValue({
      user: { displayName: '' },
      isLoading: false,
      handleLogout: vi.fn(),
    });

    const { result } = renderHook(() => useNavbar());

    expect(result.current.userFirstName).toBeNull();
  });

  it('should handle user without displayName', () => {
    mockUsePathname.mockReturnValue('/');
    mockUseUserVerification.mockReturnValue({
      user: {},
      isLoading: false,
      handleLogout: vi.fn(),
    });

    const { result } = renderHook(() => useNavbar());

    expect(result.current.userFirstName).toBeNull();
  });

  it('should handle different pathnames', () => {
    const testPaths = ['/', '/dashboard', '/galeria', '/admin', '/profile'];

    mockUseUserVerification.mockReturnValue({
      user: null,
      isLoading: false,
      handleLogout: vi.fn(),
    });

    testPaths.forEach((path) => {
      mockUsePathname.mockReturnValue(path);
      const { result } = renderHook(() => useNavbar());
      expect(result.current.isLoginPage).toBe(path === '/login');
    });
  });

  it('should return all properties with correct types', () => {
    mockUsePathname.mockReturnValue('/');
    mockUseUserVerification.mockReturnValue({
      user: { displayName: 'João' },
      isLoading: false,
      handleLogout: vi.fn(),
    });

    const { result } = renderHook(() => useNavbar());

    expect(typeof result.current.isAuthenticated).toBe('boolean');
    expect(typeof result.current.isLoadingUser).toBe('boolean');
    expect(typeof result.current.isLoginPage).toBe('boolean');
    expect(typeof result.current.userFirstName).toBe('string');
    expect(typeof result.current.currentYear).toBe('number');
    expect(typeof result.current.handleLogout).toBe('function');
  });

  it('should update values when dependencies change', () => {
    mockUsePathname.mockReturnValue('/');
    mockUseUserVerification.mockReturnValue({
      user: null,
      isLoading: false,
      handleLogout: vi.fn(),
    });

    const { result, rerender } = renderHook(() => useNavbar());
    expect(result.current.isLoginPage).toBe(false);

    mockUsePathname.mockReturnValue('/login');
    rerender();
    expect(result.current.isLoginPage).toBe(true);
  });

  it('should handle authentication state change', () => {
    mockUsePathname.mockReturnValue('/');
    mockUseUserVerification.mockReturnValue({
      user: null,
      isLoading: false,
      handleLogout: vi.fn(),
    });

    const { result, rerender } = renderHook(() => useNavbar());
    expect(result.current.isAuthenticated).toBe(false);

    mockUseUserVerification.mockReturnValue({
      user: { displayName: 'Alice' },
      isLoading: false,
      handleLogout: vi.fn(),
    });

    rerender();
    expect(result.current.isAuthenticated).toBe(true);
    expect(result.current.userFirstName).toBe('Alice');
  });

  it('should handle loading state change', () => {
    mockUsePathname.mockReturnValue('/');
    mockUseUserVerification.mockReturnValue({
      user: null,
      isLoading: false,
      handleLogout: vi.fn(),
    });

    const { result, rerender } = renderHook(() => useNavbar());
    expect(result.current.isLoadingUser).toBe(false);

    mockUseUserVerification.mockReturnValue({
      user: null,
      isLoading: true,
      handleLogout: vi.fn(),
    });

    rerender();
    expect(result.current.isLoadingUser).toBe(true);
  });

  it('should correctly identify first name with special characters', () => {
    mockUsePathname.mockReturnValue('/');
    mockUseUserVerification.mockReturnValue({
      user: { displayName: 'José Da Silva' },
      isLoading: false,
      handleLogout: vi.fn(),
    });

    const { result } = renderHook(() => useNavbar());

    expect(result.current.userFirstName).toBe('José');
  });
});
