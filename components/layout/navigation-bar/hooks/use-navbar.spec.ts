import { describe, expect, it, vi, beforeEach } from 'vitest';

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

    const result = useNavbar();

    expect(result).toBeDefined();
    expect(Object.keys(result).length).toBeGreaterThan(0);
  });

  it('should set isAuthenticated to true when user exists', () => {
    mockUsePathname.mockReturnValue('/');
    mockUseUserVerification.mockReturnValue({
      user: { displayName: 'João Silva' },
      isLoading: false,
      handleLogout: vi.fn(),
    });

    const result = useNavbar();

    expect(result.isAuthenticated).toBe(true);
  });

  it('should set isAuthenticated to false when user is null', () => {
    mockUsePathname.mockReturnValue('/');
    mockUseUserVerification.mockReturnValue({
      user: null,
      isLoading: false,
      handleLogout: vi.fn(),
    });

    const result = useNavbar();

    expect(result.isAuthenticated).toBe(false);
  });

  it('should set isLoadingUser from useUserVerification', () => {
    mockUsePathname.mockReturnValue('/');
    mockUseUserVerification.mockReturnValue({
      user: null,
      isLoading: true,
      handleLogout: vi.fn(),
    });

    const result = useNavbar();

    expect(result.isLoadingUser).toBe(true);
  });

  it('should set isLoadingUser to false when not loading', () => {
    mockUsePathname.mockReturnValue('/');
    mockUseUserVerification.mockReturnValue({
      user: null,
      isLoading: false,
      handleLogout: vi.fn(),
    });

    const result = useNavbar();

    expect(result.isLoadingUser).toBe(false);
  });

  it('should set isLoginPage to true when pathname is /login', () => {
    mockUsePathname.mockReturnValue('/login');
    mockUseUserVerification.mockReturnValue({
      user: null,
      isLoading: false,
      handleLogout: vi.fn(),
    });

    const result = useNavbar();

    expect(result.isLoginPage).toBe(true);
  });

  it('should set isLoginPage to false when pathname is not /login', () => {
    mockUsePathname.mockReturnValue('/dashboard');
    mockUseUserVerification.mockReturnValue({
      user: null,
      isLoading: false,
      handleLogout: vi.fn(),
    });

    const result = useNavbar();

    expect(result.isLoginPage).toBe(false);
  });

  it('should extract first name from displayName', () => {
    mockUsePathname.mockReturnValue('/');
    mockUseUserVerification.mockReturnValue({
      user: { displayName: 'João Silva' },
      isLoading: false,
      handleLogout: vi.fn(),
    });

    const result = useNavbar();

    expect(result.userFirstName).toBe('João');
  });

  it('should set userFirstName to null when user is null', () => {
    mockUsePathname.mockReturnValue('/');
    mockUseUserVerification.mockReturnValue({
      user: null,
      isLoading: false,
      handleLogout: vi.fn(),
    });

    const result = useNavbar();

    expect(result.userFirstName).toBeNull();
  });

  it('should handle displayName with single word', () => {
    mockUsePathname.mockReturnValue('/');
    mockUseUserVerification.mockReturnValue({
      user: { displayName: 'João' },
      isLoading: false,
      handleLogout: vi.fn(),
    });

    const result = useNavbar();

    expect(result.userFirstName).toBe('João');
  });

  it('should handle displayName with multiple words', () => {
    mockUsePathname.mockReturnValue('/');
    mockUseUserVerification.mockReturnValue({
      user: { displayName: 'João Silva Santos' },
      isLoading: false,
      handleLogout: vi.fn(),
    });

    const result = useNavbar();

    expect(result.userFirstName).toBe('João');
  });

  it('should return current year', () => {
    mockUsePathname.mockReturnValue('/');
    mockUseUserVerification.mockReturnValue({
      user: null,
      isLoading: false,
      handleLogout: vi.fn(),
    });

    const result = useNavbar();
    const currentYear = new Date().getFullYear();

    expect(result.currentYear).toBe(currentYear);
  });

  it('should return handleLogout function', () => {
    const handleLogout = vi.fn();
    mockUsePathname.mockReturnValue('/');
    mockUseUserVerification.mockReturnValue({
      user: null,
      isLoading: false,
      handleLogout,
    });

    const result = useNavbar();

    expect(result.handleLogout).toBe(handleLogout);
  });

  it('should handle empty displayName', () => {
    mockUsePathname.mockReturnValue('/');
    mockUseUserVerification.mockReturnValue({
      user: { displayName: '' },
      isLoading: false,
      handleLogout: vi.fn(),
    });

    const result = useNavbar();

    expect(result.userFirstName).toBeNull();
  });

  it('should handle user without displayName', () => {
    mockUsePathname.mockReturnValue('/');
    mockUseUserVerification.mockReturnValue({
      user: {},
      isLoading: false,
      handleLogout: vi.fn(),
    });

    const result = useNavbar();

    expect(result.userFirstName).toBeNull();
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
      const result = useNavbar();
      expect(result.isLoginPage).toBe(path === '/login');
    });
  });

  it('should return all properties with correct types', () => {
    mockUsePathname.mockReturnValue('/');
    mockUseUserVerification.mockReturnValue({
      user: { displayName: 'João' },
      isLoading: false,
      handleLogout: vi.fn(),
    });

    const result = useNavbar();

    expect(typeof result.isAuthenticated).toBe('boolean');
    expect(typeof result.isLoadingUser).toBe('boolean');
    expect(typeof result.isLoginPage).toBe('boolean');
    expect(typeof result.userFirstName).toBe('string');
    expect(typeof result.currentYear).toBe('number');
    expect(typeof result.handleLogout).toBe('function');
  });

  it('should update values when dependencies change', () => {
    mockUsePathname.mockReturnValue('/');
    mockUseUserVerification.mockReturnValue({
      user: null,
      isLoading: false,
      handleLogout: vi.fn(),
    });

    let result = useNavbar();
    expect(result.isLoginPage).toBe(false);

    mockUsePathname.mockReturnValue('/login');
    result = useNavbar();
    expect(result.isLoginPage).toBe(true);
  });

  it('should handle authentication state change', () => {
    mockUsePathname.mockReturnValue('/');
    mockUseUserVerification.mockReturnValue({
      user: null,
      isLoading: false,
      handleLogout: vi.fn(),
    });

    let result = useNavbar();
    expect(result.isAuthenticated).toBe(false);

    mockUseUserVerification.mockReturnValue({
      user: { displayName: 'Alice' },
      isLoading: false,
      handleLogout: vi.fn(),
    });

    result = useNavbar();
    expect(result.isAuthenticated).toBe(true);
    expect(result.userFirstName).toBe('Alice');
  });

  it('should handle loading state change', () => {
    mockUsePathname.mockReturnValue('/');
    mockUseUserVerification.mockReturnValue({
      user: null,
      isLoading: false,
      handleLogout: vi.fn(),
    });

    let result = useNavbar();
    expect(result.isLoadingUser).toBe(false);

    mockUseUserVerification.mockReturnValue({
      user: null,
      isLoading: true,
      handleLogout: vi.fn(),
    });

    result = useNavbar();
    expect(result.isLoadingUser).toBe(true);
  });

  it('should correctly identify first name with special characters', () => {
    mockUsePathname.mockReturnValue('/');
    mockUseUserVerification.mockReturnValue({
      user: { displayName: 'José Da Silva' },
      isLoading: false,
      handleLogout: vi.fn(),
    });

    const result = useNavbar();

    expect(result.userFirstName).toBe('José');
  });
});
