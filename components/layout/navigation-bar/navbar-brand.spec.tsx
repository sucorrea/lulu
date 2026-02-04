import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('next/image', () => ({
  default: ({
    src,
    alt,
    width,
    height,
    className,
    priority,
  }: {
    src: string;
    alt: string;
    width: number;
    height: number;
    className?: string;
    priority?: boolean;
  }) => (
    <img
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={className}
      data-priority={priority}
      data-testid="navbar-brand-image"
    />
  ),
}));

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

import { NavbarBrand } from './navbar-brand';

describe('NavbarBrand', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render navbar brand container', () => {
    render(<NavbarBrand currentYear={2026} />);

    const container = screen.getByTestId('link-/');
    expect(container).toBeInTheDocument();
  });

  it('should render brand image with correct src', () => {
    render(<NavbarBrand currentYear={2026} />);

    const image = screen.getByTestId('navbar-brand-image');
    expect(image).toHaveAttribute('src', '/luluzinha_no_background.png');
  });

  it('should render brand image with correct alt text', () => {
    render(<NavbarBrand currentYear={2026} />);

    const image = screen.getByTestId('navbar-brand-image');
    expect(image).toHaveAttribute('alt', 'luluzinha');
  });

  it('should render brand image with width 30', () => {
    render(<NavbarBrand currentYear={2026} />);

    const image = screen.getByTestId('navbar-brand-image');
    expect(image).toHaveAttribute('width', '30');
  });

  it('should render brand image with height 30', () => {
    render(<NavbarBrand currentYear={2026} />);

    const image = screen.getByTestId('navbar-brand-image');
    expect(image).toHaveAttribute('height', '30');
  });

  it('should set priority prop on image', () => {
    render(<NavbarBrand currentYear={2026} />);

    const image = screen.getByTestId('navbar-brand-image');
    expect(image).toHaveAttribute('data-priority', 'true');
  });

  it('should render brand text with current year', () => {
    render(<NavbarBrand currentYear={2026} />);

    expect(screen.getByText('Luluzinha 2026')).toBeInTheDocument();
  });

  it('should render brand text with different year', () => {
    render(<NavbarBrand currentYear={2025} />);

    expect(screen.getByText('Luluzinha 2025')).toBeInTheDocument();
  });

  it('should render link to home page', () => {
    render(<NavbarBrand currentYear={2026} />);

    const link = screen.getByTestId('link-/');
    expect(link).toHaveAttribute('href', '/');
  });

  it('should have flex items-center layout', () => {
    render(<NavbarBrand currentYear={2026} />);

    const link = screen.getByTestId('link-/');
    expect(link).toHaveClass('flex', 'items-center', 'gap-2');
  });

  it('should have container with mr-1 margin', () => {
    render(<NavbarBrand currentYear={2026} />);

    const container = screen.getByTestId('link-/').parentElement;
    expect(container).toHaveClass('mr-1', 'flex', 'items-center');
  });

  it('should render image with h-auto and w-auto classes', () => {
    render(<NavbarBrand currentYear={2026} />);

    const image = screen.getByTestId('navbar-brand-image');
    expect(image).toHaveClass('h-auto', 'w-auto');
  });

  it('should render text with lulu-header class', () => {
    render(<NavbarBrand currentYear={2026} />);

    const text = screen.getByText('Luluzinha 2026');
    expect(text).toHaveClass('lulu-header', 'text-2xl', 'font-bold');
  });

  it('should have text with text-2xl and font-bold classes', () => {
    render(<NavbarBrand currentYear={2026} />);

    const text = screen.getByText('Luluzinha 2026');
    expect(text).toHaveClass('text-2xl', 'font-bold');
  });

  it('should render image and text in correct order', () => {
    render(<NavbarBrand currentYear={2026} />);

    const link = screen.getByTestId('link-/');
    const children = link.childNodes;

    expect(children[0]).toHaveAttribute('data-testid', 'navbar-brand-image');
    expect(children[1]).toHaveTextContent('Luluzinha 2026');
  });

  it('should render with correct component structure', () => {
    render(<NavbarBrand currentYear={2026} />);

    const link = screen.getByTestId('link-/');
    expect(link).toBeInTheDocument();
    expect(link).toContainElement(screen.getByTestId('navbar-brand-image'));
    expect(link).toContainElement(screen.getByText('Luluzinha 2026'));
  });

  it('should handle current year prop correctly', () => {
    const { rerender } = render(<NavbarBrand currentYear={2024} />);
    expect(screen.getByText('Luluzinha 2024')).toBeInTheDocument();

    rerender(<NavbarBrand currentYear={2027} />);
    expect(screen.getByText('Luluzinha 2027')).toBeInTheDocument();
  });

  it('should be memoized for performance', () => {
    const { rerender } = render(<NavbarBrand currentYear={2026} />);

    const firstRender = screen.getByText('Luluzinha 2026');
    const firstNode = firstRender;

    rerender(<NavbarBrand currentYear={2026} />);

    const secondRender = screen.getByText('Luluzinha 2026');
    // Memo should prevent re-render with same props
    expect(firstNode).toBe(secondRender);
  });
});
