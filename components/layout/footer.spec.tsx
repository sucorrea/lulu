import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('next/link', () => ({
  default: ({
    href,
    children,
    className,
    onClick,
    ...rest
  }: {
    href: string;
    children: React.ReactNode;
    className?: string;
    onClick?: () => void;
    'aria-label'?: string;
    title?: string;
  }) => (
    <a
      href={href}
      className={className}
      onClick={(event) => {
        event.preventDefault();
        onClick?.();
      }}
      data-testid={`link-${href}`}
      {...rest}
    >
      {children}
    </a>
  ),
}));

vi.mock('next/navigation', () => ({
  usePathname: vi.fn(),
}));

vi.mock('@/hooks/user-verify', () => ({
  useUserVerification: vi.fn(),
}));

vi.mock('vaul', () => ({
  Drawer: {
    Root: ({ children, open }: { children: React.ReactNode; open: boolean }) =>
      open ? <div data-testid="drawer-root">{children}</div> : null,
    Portal: ({ children }: { children: React.ReactNode }) => (
      <div>{children}</div>
    ),
    Overlay: () => <div />,
    Content: ({ children }: { children: React.ReactNode }) => (
      <div>{children}</div>
    ),
    Handle: () => <div />,
    Title: ({ children }: { children: React.ReactNode }) => <h2>{children}</h2>,
    Description: ({ children }: { children: React.ReactNode }) => (
      <p>{children}</p>
    ),
  },
}));

import { usePathname } from 'next/navigation';
import { useUserVerification } from '@/hooks/user-verify';
import Footer from './footer';

describe('Footer', () => {
  const mockUsePathname = usePathname as ReturnType<typeof vi.fn>;
  const mockUseUser = useUserVerification as ReturnType<typeof vi.fn>;

  beforeEach(() => {
    vi.clearAllMocks();
    mockUsePathname.mockReturnValue('/');
    mockUseUser.mockReturnValue({ isAdmin: false });
  });

  it('should render footer element', () => {
    render(<Footer />);
    expect(screen.getByRole('contentinfo')).toBeInTheDocument();
  });

  it('should render four links and a Mais button', () => {
    render(<Footer />);
    expect(screen.getAllByRole('link')).toHaveLength(4);
    expect(screen.getByRole('button', { name: 'Mais' })).toBeInTheDocument();
  });

  it('should render primary labels', () => {
    render(<Footer />);
    ['Lulus', 'Agenda', 'Galeria', 'Histórico'].forEach((label) => {
      expect(screen.getByText(label)).toBeInTheDocument();
    });
  });

  it('should open the sheet with Auditoria and Sobre', () => {
    render(<Footer />);
    fireEvent.click(screen.getByRole('button', { name: 'Mais' }));

    expect(screen.getByRole('heading', { name: 'Mais' })).toBeInTheDocument();
    expect(screen.getByText('Auditoria')).toBeInTheDocument();
    expect(screen.getByText('Sobre')).toBeInTheDocument();
    expect(screen.queryByText('Sorteio')).not.toBeInTheDocument();
  });

  it('should show Sorteio for admin', () => {
    mockUseUser.mockReturnValue({ isAdmin: true });
    render(<Footer />);
    fireEvent.click(screen.getByRole('button', { name: 'Mais' }));

    expect(screen.getByText('Sorteio')).toBeInTheDocument();
  });

  it('should close the sheet when a link is clicked', () => {
    render(<Footer />);
    fireEvent.click(screen.getByRole('button', { name: 'Mais' }));
    fireEvent.click(screen.getByText('Sobre'));

    expect(screen.queryByTestId('drawer-root')).not.toBeInTheDocument();
  });

  it.each(['/sobre', '/auditoria', '/sorteio'])(
    'should mark Mais as active on %s',
    (path) => {
      mockUsePathname.mockReturnValue(path);
      render(<Footer />);
      expect(screen.getByRole('button', { name: 'Mais' })).toHaveClass(
        'text-primary'
      );
    }
  );

  it('should keep Mais inactive on primary routes', () => {
    render(<Footer />);
    expect(screen.getByRole('button', { name: 'Mais' })).toHaveClass(
      'text-muted-foreground'
    );
  });

  it('should apply text-primary to the active link', () => {
    mockUsePathname.mockReturnValue('/dashboard');
    render(<Footer />);
    expect(screen.getByTestId('link-/dashboard')).toHaveClass('text-primary');
    expect(screen.getByTestId('link-/')).toHaveClass('text-muted-foreground');
  });

  it('should mark nested route as active', () => {
    mockUsePathname.mockReturnValue('/dashboard/users');
    render(<Footer />);
    expect(screen.getByTestId('link-/dashboard')).toHaveClass('text-primary');
  });

  it('should have fixed footer styling', () => {
    render(<Footer />);
    const footer = screen.getByRole('contentinfo');
    expect(footer).toHaveClass('fixed', 'bottom-0', 'w-full', 'md:hidden');
  });

  it('should have touch target size on links and button', () => {
    render(<Footer />);
    [
      ...screen.getAllByRole('link'),
      screen.getByRole('button', { name: 'Mais' }),
    ].forEach((el) => {
      expect(el).toHaveClass('min-h-[44px]');
    });
  });
});
