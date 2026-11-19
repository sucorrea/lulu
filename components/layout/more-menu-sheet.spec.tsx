import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('next/link', () => ({
  default: ({
    href,
    children,
    className,
    onClick,
    'aria-current': ariaCurrent,
  }: {
    href: string;
    children: React.ReactNode;
    className?: string;
    onClick?: () => void;
    'aria-current'?: 'page';
  }) => (
    <a
      href={href}
      className={className}
      aria-current={ariaCurrent}
      onClick={(event) => {
        event.preventDefault();
        onClick?.();
      }}
    >
      {children}
    </a>
  ),
}));

vi.mock('next/navigation', () => ({
  usePathname: vi.fn(() => '/sobre'),
}));

vi.mock('vaul', () => ({
  Drawer: {
    Root: ({ children, open }: { children: React.ReactNode; open: boolean }) =>
      open ? <div>{children}</div> : null,
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

import { MoreMenuSheet } from './more-menu-sheet';

describe('MoreMenuSheet', () => {
  const onOpenChange = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render nothing when closed', () => {
    render(<MoreMenuSheet open={false} onOpenChange={onOpenChange} isAdmin />);
    expect(screen.queryByText('Mais')).not.toBeInTheDocument();
  });

  it('should list Auditoria and Sobre for non admin', () => {
    render(<MoreMenuSheet open onOpenChange={onOpenChange} isAdmin={false} />);
    expect(screen.getByRole('link', { name: /Auditoria/ })).toHaveAttribute(
      'href',
      '/auditoria'
    );
    expect(screen.getByRole('link', { name: /Sobre/ })).toHaveAttribute(
      'href',
      '/sobre'
    );
    expect(screen.queryByRole('link', { name: /Sorteio/ })).toBeNull();
  });

  it('should list Sorteio for admin', () => {
    render(<MoreMenuSheet open onOpenChange={onOpenChange} isAdmin />);
    expect(screen.getByRole('link', { name: /Sorteio/ })).toHaveAttribute(
      'href',
      '/sorteio'
    );
  });

  it('should close when a link is clicked', () => {
    render(<MoreMenuSheet open onOpenChange={onOpenChange} isAdmin />);
    fireEvent.click(screen.getByRole('link', { name: /Sobre/ }));
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it('should have 44px touch targets', () => {
    render(<MoreMenuSheet open onOpenChange={onOpenChange} isAdmin />);
    screen.getAllByRole('link').forEach((link) => {
      expect(link).toHaveClass('min-h-[44px]');
    });
  });

  it('should mark the current route with aria-current and text-primary', () => {
    render(<MoreMenuSheet open onOpenChange={onOpenChange} isAdmin />);
    const sobre = screen.getByRole('link', { name: /Sobre/ });
    expect(sobre).toHaveAttribute('aria-current', 'page');
    expect(sobre).toHaveClass('text-primary');
    expect(screen.getByRole('link', { name: /Auditoria/ })).not.toHaveAttribute(
      'aria-current'
    );
  });
});
