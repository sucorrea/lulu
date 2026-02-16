import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('next/link', () => ({
  default: ({
    href,
    children,
    className,
    onClick,
  }: {
    href: string;
    children: React.ReactNode;
    className?: string;
    onClick?: () => void;
  }) => (
    <a
      href={href}
      className={className}
      onClick={(event) => {
        event.preventDefault();
        onClick?.();
      }}
      data-testid={`link-${href}`}
    >
      {children}
    </a>
  ),
}));

vi.mock('next/navigation', () => ({
  usePathname: vi.fn(() => '/login'),
}));

vi.mock('./mode-toggle', () => ({
  ThemeToggle: () => <div data-testid="theme-toggle" />,
}));

vi.mock('./navbar-brand', () => ({
  NavbarBrand: ({ currentYear }: { currentYear: number }) => (
    <div data-testid="navbar-brand" data-year={currentYear} />
  ),
}));

vi.mock('./navbar-user-section', () => ({
  NavbarUserSection: ({
    isAuthenticated,
    isLoading,
    isLoginPage,
    userFirstName,
  }: {
    isAuthenticated: boolean;
    isLoading: boolean;
    isLoginPage: boolean;
    userFirstName: string | null;
  }) => (
    <div
      data-testid="navbar-user-section"
      data-authenticated={isAuthenticated}
      data-loading={isLoading}
      data-login-page={isLoginPage}
      data-user-name={userFirstName}
    />
  ),
}));

vi.mock('./hooks/use-navbar', () => ({
  useNavbar: vi.fn(),
}));

import { Navbar } from './navbar';
import { useNavbar as mockUseNavbar } from './hooks/use-navbar';

describe('Navbar', () => {
  const mockUseNavbarFn = mockUseNavbar as ReturnType<typeof vi.fn>;

  const defaultNavbarData = {
    isAuthenticated: false,
    isLoadingUser: false,
    isLoginPage: false,
    userFirstName: null,
    currentYear: 2026,
    handleLogout: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockUseNavbarFn.mockReturnValue(defaultNavbarData);
  });

  it('should render core components', () => {
    render(<Navbar />);

    expect(screen.getByRole('banner')).toBeInTheDocument();
    expect(screen.getByTestId('navbar-brand')).toBeInTheDocument();
    expect(screen.getByTestId('navbar-user-section')).toBeInTheDocument();
    expect(screen.getByTestId('theme-toggle')).toBeInTheDocument();
  });

  it('should pass hook values to child components', () => {
    mockUseNavbarFn.mockReturnValue({
      ...defaultNavbarData,
      isAuthenticated: true,
      isLoadingUser: true,
      isLoginPage: true,
      userFirstName: 'João',
      currentYear: 2025,
    });

    render(<Navbar />);

    const brand = screen.getByTestId('navbar-brand');
    expect(brand).toHaveAttribute('data-year', '2025');

    const userSection = screen.getByTestId('navbar-user-section');
    expect(userSection).toHaveAttribute('data-authenticated', 'true');
    expect(userSection).toHaveAttribute('data-loading', 'true');
    expect(userSection).toHaveAttribute('data-login-page', 'true');
    expect(userSection).toHaveAttribute('data-user-name', 'João');
  });

  it('should render header with expected layout classes', () => {
    render(<Navbar />);

    const header = screen.getByRole('banner');
    expect(header).toHaveClass(
      'sticky',
      'top-0',
      'z-50',
      'w-full',
      'border-b',
      'border-border',
      'bg-background/95',
      'backdrop-blur',
      'md:px-2'
    );

    const container = header.querySelector('.container');
    expect(container).toHaveClass(
      'flex',
      'h-14',
      'items-center',
      'justify-between',
      'gap-2',
      'px-1.5'
    );
  });

  it('should render navigation links in header (desktop)', () => {
    mockUseNavbarFn.mockReturnValue({
      ...defaultNavbarData,
      isAuthenticated: true,
    });

    render(<Navbar />);

    expect(screen.getByTestId('link-/')).toBeInTheDocument();
    expect(screen.getByTestId('link-/dashboard')).toBeInTheDocument();
    expect(screen.getByTestId('link-/galeria')).toBeInTheDocument();
    expect(screen.getByTestId('link-/auditoria')).toBeInTheDocument();
    expect(screen.getByTestId('link-/historico')).toBeInTheDocument();
    expect(screen.getByTestId('link-/sobre')).toBeInTheDocument();
  });

  it('should use navbar hook to get data', () => {
    render(<Navbar />);

    expect(mockUseNavbarFn).toHaveBeenCalled();
  });
});
