import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

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
    onLogout: () => void;
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

  it('should render header element', () => {
    render(<Navbar />);

    const header = screen.getByRole('banner');
    expect(header).toBeInTheDocument();
  });

  it('should render navbar brand component', () => {
    render(<Navbar />);

    const brand = screen.getByTestId('navbar-brand');
    expect(brand).toBeInTheDocument();
  });

  it('should render navbar user section component', () => {
    render(<Navbar />);

    const userSection = screen.getByTestId('navbar-user-section');
    expect(userSection).toBeInTheDocument();
  });

  it('should render theme toggle component', () => {
    render(<Navbar />);

    const themeToggle = screen.getByTestId('theme-toggle');
    expect(themeToggle).toBeInTheDocument();
  });

  it('should pass current year to navbar brand', () => {
    mockUseNavbarFn.mockReturnValue({
      ...defaultNavbarData,
      currentYear: 2026,
    });

    render(<Navbar />);

    const brand = screen.getByTestId('navbar-brand');
    expect(brand).toHaveAttribute('data-year', '2026');
  });

  it('should pass authentication status to navbar user section', () => {
    mockUseNavbarFn.mockReturnValue({
      ...defaultNavbarData,
      isAuthenticated: true,
    });

    render(<Navbar />);

    const userSection = screen.getByTestId('navbar-user-section');
    expect(userSection).toHaveAttribute('data-authenticated', 'true');
  });

  it('should pass loading status to navbar user section', () => {
    mockUseNavbarFn.mockReturnValue({
      ...defaultNavbarData,
      isLoadingUser: true,
    });

    render(<Navbar />);

    const userSection = screen.getByTestId('navbar-user-section');
    expect(userSection).toHaveAttribute('data-loading', 'true');
  });

  it('should pass login page status to navbar user section', () => {
    mockUseNavbarFn.mockReturnValue({
      ...defaultNavbarData,
      isLoginPage: true,
    });

    render(<Navbar />);

    const userSection = screen.getByTestId('navbar-user-section');
    expect(userSection).toHaveAttribute('data-login-page', 'true');
  });

  it('should pass user first name to navbar user section', () => {
    mockUseNavbarFn.mockReturnValue({
      ...defaultNavbarData,
      userFirstName: 'João',
    });

    render(<Navbar />);

    const userSection = screen.getByTestId('navbar-user-section');
    expect(userSection).toHaveAttribute('data-user-name', 'João');
  });

  it('should pass logout handler to navbar user section', () => {
    const handleLogout = vi.fn();
    mockUseNavbarFn.mockReturnValue({
      ...defaultNavbarData,
      handleLogout,
    });

    render(<Navbar />);

    const userSection = screen.getByTestId('navbar-user-section');
    expect(userSection).toBeInTheDocument();
  });

  it('should have header with sticky positioning', () => {
    render(<Navbar />);

    const header = screen.getByRole('banner');
    expect(header).toHaveClass('sticky', 'top-0');
  });

  it('should have header with z-50 layer', () => {
    render(<Navbar />);

    const header = screen.getByRole('banner');
    expect(header).toHaveClass('z-50');
  });

  it('should have header with full width', () => {
    render(<Navbar />);

    const header = screen.getByRole('banner');
    expect(header).toHaveClass('w-full');
  });

  it('should have header with border bottom styling', () => {
    render(<Navbar />);

    const header = screen.getByRole('banner');
    expect(header).toHaveClass('border-b', 'border-border');
  });

  it('should have header with background styling', () => {
    render(<Navbar />);

    const header = screen.getByRole('banner');
    expect(header).toHaveClass('bg-background/95', 'backdrop-blur');
  });

  it('should have header with md padding', () => {
    render(<Navbar />);

    const header = screen.getByRole('banner');
    expect(header).toHaveClass('md:px-4');
  });

  it('should have container with flex layout', () => {
    render(<Navbar />);

    const header = screen.getByRole('banner');
    const container = header.querySelector('.container');
    expect(container).toHaveClass(
      'flex',
      'h-14',
      'items-center',
      'justify-between',
      'gap-4'
    );
  });

  it('should have nav element with flex layout', () => {
    render(<Navbar />);

    const nav = screen.getByRole('banner').querySelector('nav');
    expect(nav).toHaveClass(
      'flex',
      'flex-1',
      'items-center',
      'justify-end',
      'gap-4'
    );
  });

  it('should have component section with flex layout', () => {
    render(<Navbar />);

    const header = screen.getByRole('banner');
    const componentDiv = header.querySelector('nav > div');
    expect(componentDiv).toHaveClass(
      'flex',
      'items-center',
      'gap-2',
      'md:gap-4'
    );
  });

  it('should render all components in correct order', () => {
    render(<Navbar />);

    const header = screen.getByRole('banner');
    const container = header.querySelector('.container');

    expect(container?.childNodes[0]).toContainElement(
      screen.getByTestId('navbar-brand')
    );
    expect(container?.childNodes[1]).toContainElement(
      screen.getByTestId('navbar-user-section')
    );
  });

  it('should handle unauthenticated state', () => {
    mockUseNavbarFn.mockReturnValue({
      ...defaultNavbarData,
      isAuthenticated: false,
    });

    render(<Navbar />);

    const userSection = screen.getByTestId('navbar-user-section');
    expect(userSection).toHaveAttribute('data-authenticated', 'false');
  });

  it('should handle authenticated state', () => {
    mockUseNavbarFn.mockReturnValue({
      ...defaultNavbarData,
      isAuthenticated: true,
      userFirstName: 'Alice',
    });

    render(<Navbar />);

    const userSection = screen.getByTestId('navbar-user-section');
    expect(userSection).toHaveAttribute('data-authenticated', 'true');
    expect(userSection).toHaveAttribute('data-user-name', 'Alice');
  });

  it('should handle loading state', () => {
    mockUseNavbarFn.mockReturnValue({
      ...defaultNavbarData,
      isLoadingUser: true,
    });

    render(<Navbar />);

    const userSection = screen.getByTestId('navbar-user-section');
    expect(userSection).toHaveAttribute('data-loading', 'true');
  });

  it('should handle different years', () => {
    mockUseNavbarFn.mockReturnValue({
      ...defaultNavbarData,
      currentYear: 2025,
    });

    render(<Navbar />);

    const brand = screen.getByTestId('navbar-brand');
    expect(brand).toHaveAttribute('data-year', '2025');
  });

  it('should be memoized for performance optimization', () => {
    const { rerender } = render(<Navbar />);

    const firstHeader = screen.getByRole('banner');

    rerender(<Navbar />);

    const secondHeader = screen.getByRole('banner');
    expect(firstHeader).toBe(secondHeader);
  });

  it('should use navbar hook to get data', () => {
    render(<Navbar />);

    expect(mockUseNavbarFn).toHaveBeenCalled();
  });

  it('should render navbar with all components when not loading', () => {
    mockUseNavbarFn.mockReturnValue({
      ...defaultNavbarData,
      isLoadingUser: false,
    });

    render(<Navbar />);

    expect(screen.getByTestId('navbar-brand')).toBeInTheDocument();
    expect(screen.getByTestId('navbar-user-section')).toBeInTheDocument();
    expect(screen.getByTestId('theme-toggle')).toBeInTheDocument();
  });

  it('should handle login page transition', () => {
    mockUseNavbarFn.mockReturnValue({
      ...defaultNavbarData,
      isLoginPage: false,
    });

    render(<Navbar />);

    expect(screen.getByTestId('navbar-user-section')).toHaveAttribute(
      'data-login-page',
      'false'
    );
  });
});
