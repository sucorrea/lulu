import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { GenericBottomSheet } from './bottom-sheet';

vi.mock('vaul', () => ({
  Drawer: {
    Root: ({ children, open }: { children: React.ReactNode; open: boolean }) =>
      open ? <div data-testid="drawer-root">{children}</div> : null,
    Portal: ({ children }: { children: React.ReactNode }) => (
      <div data-testid="drawer-portal">{children}</div>
    ),
    Overlay: ({ className }: { className?: string }) => (
      <div data-testid="drawer-overlay" className={className} />
    ),
    Content: ({
      children,
      className,
    }: {
      children: React.ReactNode;
      className?: string;
    }) => (
      <div data-testid="drawer-content" className={className}>
        {children}
      </div>
    ),
    Handle: ({ className }: { className?: string }) => (
      <div data-testid="drawer-handle" className={className} />
    ),
    Title: ({ children }: { children: React.ReactNode }) => (
      <h2 data-testid="drawer-title">{children}</h2>
    ),
    Description: ({ children }: { children: React.ReactNode }) => (
      <p data-testid="drawer-description">{children}</p>
    ),
  },
}));

describe('GenericBottomSheet', () => {
  const defaultProps = {
    open: true,
    onOpenChange: vi.fn(),
    title: 'Test Title',
  };

  it('should render when open is true', () => {
    render(<GenericBottomSheet {...defaultProps}>Content</GenericBottomSheet>);

    expect(screen.getByTestId('drawer-root')).toBeInTheDocument();
    expect(screen.getByTestId('drawer-portal')).toBeInTheDocument();
    expect(screen.getByTestId('drawer-overlay')).toBeInTheDocument();
    expect(screen.getByTestId('drawer-content')).toBeInTheDocument();
  });

  it('should not render when open is false', () => {
    render(
      <GenericBottomSheet {...defaultProps} open={false}>
        Content
      </GenericBottomSheet>
    );

    expect(screen.queryByTestId('drawer-root')).not.toBeInTheDocument();
  });

  it('should display the title', () => {
    render(<GenericBottomSheet {...defaultProps}>Content</GenericBottomSheet>);

    const title = screen.getByTestId('drawer-title');
    expect(title).toBeInTheDocument();
    expect(title).toHaveTextContent('Test Title');
  });

  it('should display description when provided', () => {
    render(
      <GenericBottomSheet {...defaultProps} description="Test Description">
        Content
      </GenericBottomSheet>
    );

    const description = screen.getByTestId('drawer-description');
    expect(description).toBeInTheDocument();
    expect(description).toHaveTextContent('Test Description');
  });

  it('should not display description when not provided', () => {
    render(<GenericBottomSheet {...defaultProps}>Content</GenericBottomSheet>);

    expect(screen.queryByTestId('drawer-description')).not.toBeInTheDocument();
  });

  it('should render children content', () => {
    render(
      <GenericBottomSheet {...defaultProps}>
        <div data-testid="custom-content">Custom Content</div>
      </GenericBottomSheet>
    );

    const content = screen.getByTestId('custom-content');
    expect(content).toBeInTheDocument();
    expect(content).toHaveTextContent('Custom Content');
  });

  it('should display footer when provided', () => {
    const footer = <button data-testid="footer-button">Close</button>;

    render(
      <GenericBottomSheet {...defaultProps} footer={footer}>
        Content
      </GenericBottomSheet>
    );

    const footerButton = screen.getByTestId('footer-button');
    expect(footerButton).toBeInTheDocument();
    expect(footerButton).toHaveTextContent('Close');
  });

  it('should not display footer when not provided', () => {
    render(<GenericBottomSheet {...defaultProps}>Content</GenericBottomSheet>);

    expect(screen.queryByTestId('footer-button')).not.toBeInTheDocument();
  });

  it('should apply custom className to drawer content', () => {
    render(
      <GenericBottomSheet {...defaultProps} className="custom-class">
        Content
      </GenericBottomSheet>
    );

    const drawerContent = screen.getByTestId('drawer-content');
    expect(drawerContent).toHaveClass('custom-class');
  });

  it('should render drawer handle', () => {
    render(<GenericBottomSheet {...defaultProps}>Content</GenericBottomSheet>);

    const handle = screen.getByTestId('drawer-handle');
    expect(handle).toBeInTheDocument();
  });

  it('should apply correct base classes to overlay', () => {
    render(<GenericBottomSheet {...defaultProps}>Content</GenericBottomSheet>);

    const overlay = screen.getByTestId('drawer-overlay');
    expect(overlay).toHaveClass('fixed', 'inset-0', 'z-50', 'bg-black/80');
  });

  it('should apply correct base classes to content', () => {
    render(<GenericBottomSheet {...defaultProps}>Content</GenericBottomSheet>);

    const content = screen.getByTestId('drawer-content');
    expect(content).toHaveClass(
      'fixed',
      'inset-x-0',
      'bottom-0',
      'z-50',
      'mt-24',
      'flex',
      'h-auto',
      'flex-col',
      'rounded-t-[10px]',
      'border',
      'border-border',
      'bg-background'
    );
  });

  it('should apply correct classes to handle', () => {
    render(<GenericBottomSheet {...defaultProps}>Content</GenericBottomSheet>);

    const handle = screen.getByTestId('drawer-handle');
    expect(handle).toHaveClass(
      'mx-auto',
      'mt-4',
      'h-1.5',
      'w-12',
      'shrink-0',
      'rounded-full',
      'bg-muted'
    );
  });

  it('should merge custom className with base classes', () => {
    render(
      <GenericBottomSheet
        {...defaultProps}
        className="extra-class another-class"
      >
        Content
      </GenericBottomSheet>
    );

    const content = screen.getByTestId('drawer-content');
    expect(content).toHaveClass('fixed', 'extra-class', 'another-class');
  });
});
