import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('next/link', () => ({
  default: ({
    href,
    children,
    className,
    ...rest
  }: {
    href: string;
    children: React.ReactNode;
    className?: string;
    'aria-label'?: string;
    title?: string;
  }) => (
    <a href={href} className={className} data-testid={`link-${href}`} {...rest}>
      {children}
    </a>
  ),
}));

vi.mock('next/navigation', () => ({
  usePathname: vi.fn(),
}));

import { usePathname } from 'next/navigation';
import Footer from './footer';

describe('Footer', () => {
  const mockUsePathname = usePathname as ReturnType<typeof vi.fn>;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render footer element', () => {
    mockUsePathname.mockReturnValue('/');
    render(<Footer />);

    const footer = screen.getByRole('contentinfo');
    expect(footer).toBeInTheDocument();
  });

  it('should render six navigation links', () => {
    mockUsePathname.mockReturnValue('/');
    render(<Footer />);

    const links = screen.getAllByRole('link');
    expect(links).toHaveLength(6);
  });

  it('should render participantes link', () => {
    mockUsePathname.mockReturnValue('/');
    render(<Footer />);

    const participantesLink = screen.getByTestId('link-/');
    expect(participantesLink).toBeInTheDocument();
    expect(participantesLink).toHaveAttribute('aria-label', 'Participantes');
    expect(screen.getByText('Particip.')).toBeInTheDocument();
  });

  it('should render dashboard link', () => {
    mockUsePathname.mockReturnValue('/');
    render(<Footer />);

    const dashboardLink = screen.getByTestId('link-/dashboard');
    expect(dashboardLink).toBeInTheDocument();
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
  });

  it('should render galeria link', () => {
    mockUsePathname.mockReturnValue('/');
    render(<Footer />);

    const galeriaLink = screen.getByTestId('link-/galeria');
    expect(galeriaLink).toBeInTheDocument();
    expect(screen.getByText('Galeria')).toBeInTheDocument();
  });

  it('should render auditoria link', () => {
    mockUsePathname.mockReturnValue('/');
    render(<Footer />);

    const auditoriaLink = screen.getByTestId('link-/auditoria');
    expect(auditoriaLink).toBeInTheDocument();
    expect(screen.getByText('Auditoria')).toBeInTheDocument();
  });

  it('should render historico link', () => {
    mockUsePathname.mockReturnValue('/');
    render(<Footer />);

    const historicoLink = screen.getByTestId('link-/historico');
    expect(historicoLink).toBeInTheDocument();
    expect(screen.getByText('Histórico')).toBeInTheDocument();
  });

  it('should apply text-primary class to active link (participantes)', () => {
    mockUsePathname.mockReturnValue('/');
    render(<Footer />);

    const participantesLink = screen.getByTestId('link-/');
    expect(participantesLink).toHaveClass('text-primary');
  });

  it('should apply text-muted-foreground class to inactive links (participantes page)', () => {
    mockUsePathname.mockReturnValue('/');
    render(<Footer />);

    const dashboardLink = screen.getByTestId('link-/dashboard');
    const galeriaLink = screen.getByTestId('link-/galeria');

    expect(dashboardLink).toHaveClass('text-muted-foreground');
    expect(galeriaLink).toHaveClass('text-muted-foreground');
  });

  it('should apply text-primary class to active link (dashboard)', () => {
    mockUsePathname.mockReturnValue('/dashboard');
    render(<Footer />);

    const dashboardLink = screen.getByTestId('link-/dashboard');
    expect(dashboardLink).toHaveClass('text-primary');
  });

  it('should apply text-muted-foreground class to inactive links (dashboard page)', () => {
    mockUsePathname.mockReturnValue('/dashboard');
    render(<Footer />);

    const participantesLink = screen.getByTestId('link-/');
    const galeriaLink = screen.getByTestId('link-/galeria');

    expect(participantesLink).toHaveClass('text-muted-foreground');
    expect(galeriaLink).toHaveClass('text-muted-foreground');
  });

  it('should apply text-primary class to active link (galeria)', () => {
    mockUsePathname.mockReturnValue('/galeria');
    render(<Footer />);

    const galeriaLink = screen.getByTestId('link-/galeria');
    expect(galeriaLink).toHaveClass('text-primary');
  });

  it('should apply text-muted-foreground class to inactive links (galeria page)', () => {
    mockUsePathname.mockReturnValue('/galeria');
    render(<Footer />);

    const participantesLink = screen.getByTestId('link-/');
    const dashboardLink = screen.getByTestId('link-/dashboard');

    expect(participantesLink).toHaveClass('text-muted-foreground');
    expect(dashboardLink).toHaveClass('text-muted-foreground');
  });

  it('should have footer fixed at bottom with proper styling', () => {
    mockUsePathname.mockReturnValue('/');
    render(<Footer />);

    const footer = screen.getByRole('contentinfo');
    expect(footer).toHaveClass('fixed', 'bottom-0', 'w-full');
  });

  it('should have container with flex layout', () => {
    mockUsePathname.mockReturnValue('/');
    render(<Footer />);

    const footer = screen.getByRole('contentinfo');
    const container = footer.querySelector('.container');
    expect(container).toHaveClass(
      'flex',
      'justify-around',
      'gap-0',
      'sm:gap-2'
    );
  });

  it('should have each link with flex column layout and center alignment', () => {
    mockUsePathname.mockReturnValue('/');
    render(<Footer />);

    const links = screen.getAllByRole('link');
    links.forEach((link) => {
      expect(link).toHaveClass('flex', 'flex-col', 'items-center');
    });
  });

  it('should have each link with touch/desktop feedback classes', () => {
    mockUsePathname.mockReturnValue('/');
    render(<Footer />);

    const links = screen.getAllByRole('link');
    links.forEach((link) => {
      expect(link).toHaveClass('active:bg-muted', 'sm:hover:bg-muted');
    });
  });

  it('should render all text labels correctly', () => {
    mockUsePathname.mockReturnValue('/');
    render(<Footer />);

    expect(screen.getByText('Particip.')).toBeInTheDocument();
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Galeria')).toBeInTheDocument();
    expect(screen.getByText('Auditoria')).toBeInTheDocument();
    expect(screen.getByText('Histórico')).toBeInTheDocument();
    expect(screen.getByText('Sobre')).toBeInTheDocument();
  });

  it('should have consistent padding and border styling', () => {
    mockUsePathname.mockReturnValue('/');
    render(<Footer />);

    const footer = screen.getByRole('contentinfo');
    expect(footer).toHaveClass('border-t', 'border-border');
  });

  it('should have backdrop blur and background styling', () => {
    mockUsePathname.mockReturnValue('/');
    render(<Footer />);

    const footer = screen.getByRole('contentinfo');
    expect(footer).toHaveClass('bg-background/95', 'backdrop-blur');
  });

  it('should have shadow styling', () => {
    mockUsePathname.mockReturnValue('/');
    render(<Footer />);

    const footer = screen.getByRole('contentinfo');
    expect(footer).toHaveClass('shadow-lg');
  });

  it('should correctly identify active link when pathname is nested', () => {
    mockUsePathname.mockReturnValue('/dashboard/users');
    render(<Footer />);

    const dashboardLink = screen.getByTestId('link-/dashboard');
    const participantesLink = screen.getByTestId('link-/');

    expect(participantesLink).toHaveClass('text-muted-foreground');
    expect(dashboardLink).toHaveClass('text-primary');
  });

  it('should have all links with transition-colors class', () => {
    mockUsePathname.mockReturnValue('/');
    render(<Footer />);

    const links = screen.getAllByRole('link');
    links.forEach((link) => {
      expect(link).toHaveClass('transition-colors');
    });
  });

  it('should render link text with mobile-first font size', () => {
    mockUsePathname.mockReturnValue('/');
    render(<Footer />);

    const links = screen.getAllByRole('link');
    links.forEach((link) => {
      expect(link).toHaveClass('text-[10px]', 'sm:text-xs');
    });
  });

  it('should have proper spacing between links', () => {
    mockUsePathname.mockReturnValue('/');
    render(<Footer />);

    const footer = screen.getByRole('contentinfo');
    const container = footer.querySelector('.container');
    expect(container).toHaveClass('gap-0', 'sm:gap-2');
  });

  it('should have min touch target size for mobile accessibility', () => {
    mockUsePathname.mockReturnValue('/');
    render(<Footer />);

    const links = screen.getAllByRole('link');
    links.forEach((link) => {
      expect(link).toHaveClass('min-h-[44px]', 'min-w-[56px]');
    });
  });
});
