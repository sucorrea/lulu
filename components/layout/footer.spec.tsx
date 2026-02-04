import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
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

vi.mock('next/navigation', () => ({
  usePathname: vi.fn(),
}));

vi.mock('lucide-react', () => ({
  CameraIcon: ({ size }: { size: number }) => (
    <svg data-testid="camera-icon" data-size={size} />
  ),
  Gift: ({ size }: { size: number }) => (
    <svg data-testid="gift-icon" data-size={size} />
  ),
  LayoutDashboardIcon: ({ size }: { size: number }) => (
    <svg data-testid="dashboard-icon" data-size={size} />
  ),
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

  it('should render three navigation links', () => {
    mockUsePathname.mockReturnValue('/');
    render(<Footer />);

    const links = screen.getAllByRole('link');
    expect(links).toHaveLength(3);
  });

  it('should render home link with Gift icon', () => {
    mockUsePathname.mockReturnValue('/');
    render(<Footer />);

    const homeLink = screen.getByTestId('link-/');
    expect(homeLink).toBeInTheDocument();
    expect(screen.getByTestId('gift-icon')).toBeInTheDocument();
    expect(screen.getByText('Home')).toBeInTheDocument();
  });

  it('should render dashboard link with Dashboard icon', () => {
    mockUsePathname.mockReturnValue('/');
    render(<Footer />);

    const dashboardLink = screen.getByTestId('link-/dashboard');
    expect(dashboardLink).toBeInTheDocument();
    expect(screen.getByTestId('dashboard-icon')).toBeInTheDocument();
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
  });

  it('should render gallery link with Camera icon', () => {
    mockUsePathname.mockReturnValue('/');
    render(<Footer />);

    const galeriaLink = screen.getByTestId('link-/galeria');
    expect(galeriaLink).toBeInTheDocument();
    expect(screen.getByTestId('camera-icon')).toBeInTheDocument();
    expect(screen.getByText('Galeria')).toBeInTheDocument();
  });

  it('should apply text-primary class to active link (home)', () => {
    mockUsePathname.mockReturnValue('/');
    render(<Footer />);

    const homeLink = screen.getByTestId('link-/');
    expect(homeLink).toHaveClass('text-primary');
  });

  it('should apply text-muted-foreground class to inactive links (home page)', () => {
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

    const homeLink = screen.getByTestId('link-/');
    const galeriaLink = screen.getByTestId('link-/galeria');

    expect(homeLink).toHaveClass('text-muted-foreground');
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

    const homeLink = screen.getByTestId('link-/');
    const dashboardLink = screen.getByTestId('link-/dashboard');

    expect(homeLink).toHaveClass('text-muted-foreground');
    expect(dashboardLink).toHaveClass('text-muted-foreground');
  });

  it('should render icons with size 20', () => {
    mockUsePathname.mockReturnValue('/');
    render(<Footer />);

    const giftIcon = screen.getByTestId('gift-icon');
    const dashboardIcon = screen.getByTestId('dashboard-icon');
    const cameraIcon = screen.getByTestId('camera-icon');

    expect(giftIcon).toHaveAttribute('data-size', '20');
    expect(dashboardIcon).toHaveAttribute('data-size', '20');
    expect(cameraIcon).toHaveAttribute('data-size', '20');
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
    expect(container).toHaveClass('flex', 'justify-around', 'gap-4');
  });

  it('should have each link with flex column layout and center alignment', () => {
    mockUsePathname.mockReturnValue('/');
    render(<Footer />);

    const links = screen.getAllByRole('link');
    links.forEach((link) => {
      expect(link).toHaveClass('flex', 'flex-col', 'items-center');
    });
  });

  it('should have each link with hover:bg-muted class', () => {
    mockUsePathname.mockReturnValue('/');
    render(<Footer />);

    const links = screen.getAllByRole('link');
    links.forEach((link) => {
      expect(link).toHaveClass('hover:bg-muted');
    });
  });

  it('should render all text labels correctly', () => {
    mockUsePathname.mockReturnValue('/');
    render(<Footer />);

    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Galeria')).toBeInTheDocument();
  });

  it('should have consistent padding and border styling', () => {
    mockUsePathname.mockReturnValue('/');
    render(<Footer />);

    const footer = screen.getByRole('contentinfo');
    expect(footer).toHaveClass('border-t', 'border-border', 'p-2');
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
    const homeLink = screen.getByTestId('link-/');

    expect(homeLink).toHaveClass('text-muted-foreground');
    expect(dashboardLink).toHaveClass('text-muted-foreground');
  });

  it('should have all links with transition-colors class', () => {
    mockUsePathname.mockReturnValue('/');
    render(<Footer />);

    const links = screen.getAllByRole('link');
    links.forEach((link) => {
      expect(link).toHaveClass('transition-colors');
    });
  });

  it('should render link text with xs font size', () => {
    mockUsePathname.mockReturnValue('/');
    render(<Footer />);

    const links = screen.getAllByRole('link');
    links.forEach((link) => {
      expect(link).toHaveClass('text-xs');
    });
  });

  it('should have proper spacing between links', () => {
    mockUsePathname.mockReturnValue('/');
    render(<Footer />);

    const footer = screen.getByRole('contentinfo');
    const container = footer.querySelector('.container');
    expect(container).toHaveClass('gap-4');
  });
});
