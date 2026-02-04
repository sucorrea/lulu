import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('@/components/ui/dialog', () => ({
  Dialog: ({
    children,
    open,
    onOpenChange,
  }: {
    children: React.ReactNode;
    open: boolean;
    onOpenChange: (open: boolean) => void;
  }) => (
    <div data-testid="dialog-wrapper" data-open={open}>
      {children}
    </div>
  ),
  DialogContent: ({
    children,
    className,
    'aria-describedby': ariaDescribedby,
    'aria-description': ariaDescription,
  }: {
    children: React.ReactNode;
    className?: string;
    'aria-describedby'?: string;
    'aria-description'?: string;
  }) => (
    <div
      data-testid="dialog-content"
      className={className}
      aria-describedby={ariaDescribedby}
      aria-description={ariaDescription}
    >
      {children}
    </div>
  ),
  DialogHeader: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="dialog-header">{children}</div>
  ),
  DialogTitle: ({ children }: { children: React.ReactNode }) => (
    <h2 data-testid="dialog-title">{children}</h2>
  ),
  DialogDescription: ({ children }: { children: React.ReactNode }) => (
    <p data-testid="dialog-description">{children}</p>
  ),
  DialogFooter: ({
    children,
    className,
  }: {
    children: React.ReactNode;
    className?: string;
  }) => (
    <div data-testid="dialog-footer" className={className}>
      {children}
    </div>
  ),
}));

import { GenericDialog } from './dialog';

describe('GenericDialog', () => {
  const defaultProps = {
    open: true,
    onOpenChange: vi.fn(),
    title: 'Test Dialog',
    children: <div data-testid="dialog-children">Dialog Content</div>,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render dialog when open is true', () => {
    render(<GenericDialog {...defaultProps} />);

    const wrapper = screen.getByTestId('dialog-wrapper');
    expect(wrapper).toBeInTheDocument();
    expect(wrapper).toHaveAttribute('data-open', 'true');
  });

  it('should not render dialog content when open is false', () => {
    render(<GenericDialog {...defaultProps} open={false} />);

    const wrapper = screen.getByTestId('dialog-wrapper');
    expect(wrapper).toHaveAttribute('data-open', 'false');
  });

  it('should render dialog title', () => {
    render(<GenericDialog {...defaultProps} title="My Title" />);

    const title = screen.getByTestId('dialog-title');
    expect(title).toBeInTheDocument();
    expect(title).toHaveTextContent('My Title');
  });

  it('should render dialog description when provided', () => {
    const description = 'Test Description';
    render(<GenericDialog {...defaultProps} description={description} />);

    const desc = screen.getByTestId('dialog-description');
    expect(desc).toBeInTheDocument();
    expect(desc).toHaveTextContent(description);
  });

  it('should not render dialog description when not provided', () => {
    render(<GenericDialog {...defaultProps} description={undefined} />);

    const desc = screen.queryByTestId('dialog-description');
    expect(desc).not.toBeInTheDocument();
  });

  it('should render children content', () => {
    render(<GenericDialog {...defaultProps} />);

    const children = screen.getByTestId('dialog-children');
    expect(children).toBeInTheDocument();
    expect(children).toHaveTextContent('Dialog Content');
  });

  it('should render footer when provided', () => {
    const footer = <button data-testid="footer-button">Close</button>;
    render(<GenericDialog {...defaultProps} footer={footer} />);

    const footerElement = screen.getByTestId('dialog-footer');
    expect(footerElement).toBeInTheDocument();
    expect(screen.getByTestId('footer-button')).toBeInTheDocument();
  });

  it('should not render footer when not provided', () => {
    render(<GenericDialog {...defaultProps} footer={undefined} />);

    const footerElement = screen.queryByTestId('dialog-footer');
    expect(footerElement).not.toBeInTheDocument();
  });

  it('should apply custom className to dialog content', () => {
    const customClass = 'custom-class-name';
    render(<GenericDialog {...defaultProps} className={customClass} />);

    const content = screen.getByTestId('dialog-content');
    expect(content).toHaveClass(customClass);
  });

  it('should apply default className when not provided', () => {
    render(<GenericDialog {...defaultProps} />);

    const content = screen.getByTestId('dialog-content');
    expect(content).toHaveAttribute('class', '');
  });

  it('should set aria-describedby to title', () => {
    const title = 'Dialog Title';
    render(<GenericDialog {...defaultProps} title={title} />);

    const content = screen.getByTestId('dialog-content');
    expect(content).toHaveAttribute('aria-describedby', title);
  });

  it('should set aria-description to provided description', () => {
    const description = 'Dialog Description';
    render(<GenericDialog {...defaultProps} description={description} />);

    const content = screen.getByTestId('dialog-content');
    expect(content).toHaveAttribute('aria-description', description);
  });

  it('should call onOpenChange when dialog state changes', () => {
    const onOpenChange = vi.fn();
    render(<GenericDialog {...defaultProps} onOpenChange={onOpenChange} />);

    expect(typeof onOpenChange).toBe('function');
  });

  it('should render dialog header with title and description', () => {
    render(<GenericDialog {...defaultProps} description="Test Description" />);

    const header = screen.getByTestId('dialog-header');
    expect(header).toBeInTheDocument();
    expect(header).toContainElement(screen.getByTestId('dialog-title'));
    expect(header).toContainElement(screen.getByTestId('dialog-description'));
  });

  it('should render dialog header with only title when description not provided', () => {
    render(<GenericDialog {...defaultProps} description={undefined} />);

    const header = screen.getByTestId('dialog-header');
    expect(header).toBeInTheDocument();
    expect(header).toContainElement(screen.getByTestId('dialog-title'));
    expect(screen.queryByTestId('dialog-description')).not.toBeInTheDocument();
  });

  it('should render complex children content', () => {
    const complexChildren = (
      <div data-testid="complex-content">
        <h3>Subtitle</h3>
        <p>Some text</p>
        <button>Action</button>
      </div>
    );

    render(<GenericDialog {...defaultProps}>{complexChildren}</GenericDialog>);

    const content = screen.getByTestId('complex-content');
    expect(content).toBeInTheDocument();
    expect(screen.getByText('Subtitle')).toBeInTheDocument();
    expect(screen.getByText('Some text')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Action' })).toBeInTheDocument();
  });

  it('should render multiple footer elements', () => {
    const footer = (
      <>
        <button data-testid="cancel-button">Cancel</button>
        <button data-testid="confirm-button">Confirm</button>
      </>
    );

    render(<GenericDialog {...defaultProps} footer={footer} />);

    const footerElement = screen.getByTestId('dialog-footer');
    expect(footerElement).toBeInTheDocument();
    expect(screen.getByTestId('cancel-button')).toBeInTheDocument();
    expect(screen.getByTestId('confirm-button')).toBeInTheDocument();
  });

  it('should apply gap-2 class to footer', () => {
    const footer = <button>Test</button>;
    render(<GenericDialog {...defaultProps} footer={footer} />);

    const footerElement = screen.getByTestId('dialog-footer');
    expect(footerElement).toHaveClass('gap-2');
  });

  it('should render children inside a div with py-2 class', () => {
    render(<GenericDialog {...defaultProps} />);

    const childrenContainer =
      screen.getByTestId('dialog-children').parentElement;
    expect(childrenContainer).toHaveClass('py-2');
  });

  it('should handle empty description string', () => {
    render(<GenericDialog {...defaultProps} description="" />);

    const desc = screen.queryByTestId('dialog-description');
    expect(desc).not.toBeInTheDocument();
  });

  it('should handle special characters in title', () => {
    const specialTitle = 'Title with <special> & "characters"';
    render(<GenericDialog {...defaultProps} title={specialTitle} />);

    const title = screen.getByTestId('dialog-title');
    expect(title).toHaveTextContent(specialTitle);
  });

  it('should handle special characters in description', () => {
    const specialDesc = 'Description with <special> & "characters"';
    render(<GenericDialog {...defaultProps} description={specialDesc} />);

    const desc = screen.getByTestId('dialog-description');
    expect(desc).toHaveTextContent(specialDesc);
  });

  it('should maintain accessibility attributes in dialog content', () => {
    const title = 'Accessible Dialog';
    const description = 'This is an accessible dialog';

    render(
      <GenericDialog
        {...defaultProps}
        title={title}
        description={description}
      />
    );

    const content = screen.getByTestId('dialog-content');
    expect(content).toHaveAttribute('aria-describedby', title);
    expect(content).toHaveAttribute('aria-description', description);
  });

  it('should render with custom className and maintain functionality', () => {
    const customClass = 'max-w-md rounded-lg';
    render(
      <GenericDialog
        {...defaultProps}
        className={customClass}
        description="Test"
        footer={<button>Close</button>}
      />
    );

    const content = screen.getByTestId('dialog-content');
    expect(content).toHaveClass(customClass);
    expect(screen.getByTestId('dialog-description')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Close' })).toBeInTheDocument();
  });
});
