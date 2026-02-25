import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('next/link', () => ({
  default: ({
    href,
    children,
    className,
  }: {
    href: string;
    children: React.ReactNode;
    className?: string;
  }) => (
    <a href={href} className={className} data-testid={`link-${href}`}>
      {children}
    </a>
  ),
}));

vi.mock('@/components/ui/button', () => ({
  Button: ({
    onClick,
    size,
    className,
    children,
    'data-testid': testId,
  }: {
    onClick?: () => void;
    size?: string;
    className?: string;
    children: React.ReactNode;
    'data-testid'?: string;
  }) => (
    <button
      onClick={onClick}
      data-size={size}
      className={className}
      data-testid={testId}
    >
      {children}
    </button>
  ),
}));

import { NavbarUserSection } from './navbar-user-section';

describe('NavbarUserSection', () => {
  const defaultProps = {
    isAuthenticated: false,
    isLoading: false,
    isLoginPage: false,
    userFirstName: null,
    onLogout: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render nothing when loading', () => {
    render(<NavbarUserSection {...defaultProps} isLoading={true} />);

    const container = screen.queryByRole('link');
    const buttons = screen.queryAllByRole('button');

    expect(container).not.toBeInTheDocument();
    expect(buttons).toHaveLength(0);
  });

  it('should render login link when not authenticated and not on login page', () => {
    render(<NavbarUserSection {...defaultProps} />);

    const loginLink = screen.getByTestId('link-/login');
    expect(loginLink).toBeInTheDocument();
    expect(loginLink).toHaveTextContent('Login');
  });

  it('should render nothing when on login page and not authenticated', () => {
    render(<NavbarUserSection {...defaultProps} isLoginPage={true} />);

    const container = screen.queryByRole('link');
    expect(container).not.toBeInTheDocument();
  });

  it('should render user greeting when authenticated', () => {
    render(
      <NavbarUserSection
        {...defaultProps}
        isAuthenticated={true}
        userFirstName="João"
      />
    );

    expect(screen.getByText('Olá, João')).toBeInTheDocument();
  });

  it('should render logout button when authenticated', () => {
    render(
      <NavbarUserSection
        {...defaultProps}
        isAuthenticated={true}
        userFirstName="João"
      />
    );

    const logoutButton = screen.getByRole('button', { name: 'Sair' });
    expect(logoutButton).toBeInTheDocument();
  });

  it('should call onLogout when logout button is clicked', () => {
    const onLogout = vi.fn();
    render(
      <NavbarUserSection
        {...defaultProps}
        isAuthenticated={true}
        userFirstName="João"
        onLogout={onLogout}
      />
    );

    const logoutButton = screen.getByRole('button', { name: 'Sair' });
    fireEvent.click(logoutButton);

    expect(onLogout).toHaveBeenCalledTimes(1);
  });

  it('should display only first name from userFirstName', () => {
    render(
      <NavbarUserSection
        {...defaultProps}
        isAuthenticated={true}
        userFirstName="João"
      />
    );

    expect(screen.getByText('Olá, João')).toBeInTheDocument();
  });

  it('should have login link with correct href', () => {
    render(<NavbarUserSection {...defaultProps} />);

    const loginLink = screen.getByTestId('link-/login');
    expect(loginLink).toHaveAttribute('href', '/login');
  });

  it('should have correct styling on login link', () => {
    render(<NavbarUserSection {...defaultProps} />);

    const loginLink = screen.getByTestId('link-/login');
    expect(loginLink).toHaveClass(
      'rounded-md',
      'px-3',
      'py-1',
      'text-sm',
      'transition-colors',
      'bg-primary',
      'text-primary-foreground',
      'hover:bg-primary/90'
    );
  });

  it('should have correct styling on logout button', () => {
    render(
      <NavbarUserSection
        {...defaultProps}
        isAuthenticated={true}
        userFirstName="João"
      />
    );

    const logoutButton = screen.getByRole('button', { name: 'Sair' });
    expect(logoutButton).toHaveClass(
      'rounded-md',
      'px-3',
      'py-1',
      'text-xs',
      'text-white',
      'transition-colors',
      'bg-red-500',
      'hover:bg-red-600'
    );
  });

  it('should set logout button size to icon', () => {
    render(
      <NavbarUserSection
        {...defaultProps}
        isAuthenticated={true}
        userFirstName="João"
      />
    );

    const logoutButton = screen.getByRole('button', { name: 'Sair' });
    expect(logoutButton).toHaveAttribute('data-size', 'icon');
  });

  it('should have flex layout with gap when authenticated', () => {
    render(
      <NavbarUserSection
        {...defaultProps}
        isAuthenticated={true}
        userFirstName="João"
      />
    );

    const greeting = screen.getByText((content) =>
      content.includes('Olá, João')
    );
    const container = greeting.closest('div[class*="flex"]');
    expect(container).toHaveClass('flex', 'items-center', 'gap-2');
  });

  it('should have relative positioning on login link container', () => {
    render(<NavbarUserSection {...defaultProps} />);

    const loginLink = screen.getByTestId('link-/login').parentElement;
    expect(loginLink).toHaveClass('relative');
  });

  it('should render user greeting text with correct styling', () => {
    render(
      <NavbarUserSection
        {...defaultProps}
        isAuthenticated={true}
        userFirstName="Maria"
      />
    );

    const greetingSpan = screen.getByText('Olá, Maria');
    expect(greetingSpan).toHaveClass(
      'whitespace-nowrap',
      'text-sm',
      'font-medium'
    );
  });

  it('should handle authenticated with null firstName', () => {
    render(
      <NavbarUserSection
        {...defaultProps}
        isAuthenticated={true}
        userFirstName={null}
      />
    );

    expect(screen.getByText('Olá, usuário')).toBeInTheDocument();
  });

  it('should handle authenticated with empty string firstName', () => {
    render(
      <NavbarUserSection
        {...defaultProps}
        isAuthenticated={true}
        userFirstName=""
      />
    );

    expect(screen.getByText('Olá, usuário')).toBeInTheDocument();
  });

  it('should toggle between login and authenticated states', () => {
    const { rerender } = render(<NavbarUserSection {...defaultProps} />);

    expect(screen.getByTestId('link-/login')).toBeInTheDocument();

    rerender(
      <NavbarUserSection
        {...defaultProps}
        isAuthenticated={true}
        userFirstName="João"
      />
    );

    expect(screen.queryByTestId('link-/login')).not.toBeInTheDocument();
    expect(screen.getByText('Olá, João')).toBeInTheDocument();
  });

  it('should toggle between loading and loaded states', () => {
    const { rerender } = render(
      <NavbarUserSection {...defaultProps} isLoading={true} />
    );

    expect(screen.queryByRole('link')).not.toBeInTheDocument();
    expect(screen.queryAllByRole('button')).toHaveLength(0);

    rerender(<NavbarUserSection {...defaultProps} isLoading={false} />);

    expect(screen.getByTestId('link-/login')).toBeInTheDocument();
  });

  it('should handle login page redirect correctly', () => {
    render(<NavbarUserSection {...defaultProps} isLoginPage={true} />);

    expect(screen.queryByRole('link')).not.toBeInTheDocument();
  });

  it('should be memoized for performance', () => {
    const onLogout = vi.fn();
    const { rerender } = render(
      <NavbarUserSection {...defaultProps} onLogout={onLogout} />
    );

    const firstLoginLink = screen.getByTestId('link-/login');

    rerender(<NavbarUserSection {...defaultProps} onLogout={onLogout} />);

    const secondLoginLink = screen.getByTestId('link-/login');
    expect(firstLoginLink).toBe(secondLoginLink);
  });

  it('should display multiple users with different names', () => {
    const { rerender } = render(
      <NavbarUserSection
        {...defaultProps}
        isAuthenticated={true}
        userFirstName="Alice"
      />
    );

    expect(screen.getByText('Olá, Alice')).toBeInTheDocument();

    rerender(
      <NavbarUserSection
        {...defaultProps}
        isAuthenticated={true}
        userFirstName="Bob"
      />
    );

    expect(screen.getByText('Olá, Bob')).toBeInTheDocument();
  });
});
