import '@testing-library/jest-dom';
import { fireEvent, render, screen, within } from '@testing-library/react';
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

  it('should not render navigation links or menu button when unauthenticated', () => {
    render(<Navbar />);

    expect(
      screen.queryByRole('button', { name: 'Alternar menu' })
    ).not.toBeInTheDocument();
    expect(screen.queryByText('Participantes')).not.toBeInTheDocument();
    expect(screen.queryByText('Dashboard')).not.toBeInTheDocument();
    expect(screen.queryByText('Auditoria')).not.toBeInTheDocument();
  });

  it('should render navigation links and menu button when authenticated', () => {
    mockUseNavbarFn.mockReturnValue({
      ...defaultNavbarData,
      isAuthenticated: true,
    });

    render(<Navbar />);

    const menuButton = screen.getByRole('button', { name: 'Abrir menu' });
    expect(menuButton).toBeInTheDocument();
    expect(menuButton).toHaveAttribute('aria-expanded', 'false');

    expect(screen.getAllByTestId('link-/')).toHaveLength(2);
    expect(screen.getAllByTestId('link-/dashboard')).toHaveLength(2);
    expect(screen.getAllByTestId('link-/auditoria')).toHaveLength(2);
  });

  it('should toggle mobile menu visibility when menu button is clicked', () => {
    mockUseNavbarFn.mockReturnValue({
      ...defaultNavbarData,
      isAuthenticated: true,
    });

    render(<Navbar />);

    const header = screen.getByRole('banner');
    const menuButton = screen.getByRole('button', { name: 'Abrir menu' });
    const mobileMenuWrapper = header.querySelector(
      String.raw`div.md\:hidden`
    ) as HTMLElement;

    expect(mobileMenuWrapper).toHaveClass('hidden');

    fireEvent.click(menuButton);
    expect(menuButton).toHaveAttribute('aria-expanded', 'true');
    expect(mobileMenuWrapper).toHaveClass('block');

    fireEvent.click(menuButton);
    expect(menuButton).toHaveAttribute('aria-expanded', 'false');
    expect(mobileMenuWrapper).toHaveClass('hidden');
  });

  it('should close mobile menu when a mobile link is clicked', () => {
    mockUseNavbarFn.mockReturnValue({
      ...defaultNavbarData,
      isAuthenticated: true,
    });

    render(<Navbar />);

    const header = screen.getByRole('banner');
    const menuButton = screen.getByRole('button', { name: 'Abrir menu' });
    const mobileMenuWrapper = header.querySelector(
      String.raw`div.md\:hidden`
    ) as HTMLElement;

    fireEvent.click(menuButton);
    expect(mobileMenuWrapper).toHaveClass('block');

    const dashboardLink =
      within(mobileMenuWrapper).getByTestId('link-/dashboard');
    fireEvent.click(dashboardLink);

    expect(mobileMenuWrapper).toHaveClass('hidden');
  });

  it('should use navbar hook to get data', () => {
    render(<Navbar />);

    expect(mockUseNavbarFn).toHaveBeenCalled();
  });
});
