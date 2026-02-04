import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('@/components/ui/button', () => ({
  Button: ({
    onClick,
    variant,
    size,
    children,
  }: {
    onClick: () => void;
    variant: string;
    size: string;
    children: React.ReactNode;
  }) => (
    <button onClick={onClick} data-variant={variant} data-size={size}>
      {children}
    </button>
  ),
}));

vi.mock('lucide-react', () => ({
  Moon: ({ className }: { className?: string }) => (
    <svg data-testid="moon-icon" className={className} />
  ),
  Sun: ({ className }: { className?: string }) => (
    <svg data-testid="sun-icon" className={className} />
  ),
}));

vi.mock('next-themes', () => ({
  useTheme: vi.fn(),
}));

import { useTheme } from 'next-themes';
import { ThemeToggle } from './index';

describe('ThemeToggle', () => {
  const mockUseTheme = useTheme as ReturnType<typeof vi.fn>;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render button element', () => {
    mockUseTheme.mockReturnValue({
      theme: 'light',
      setTheme: vi.fn(),
    });

    render(<ThemeToggle />);

    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
  });

  it('should render sun icon', () => {
    mockUseTheme.mockReturnValue({
      theme: 'light',
      setTheme: vi.fn(),
    });

    render(<ThemeToggle />);

    const sunIcon = screen.getByTestId('sun-icon');
    expect(sunIcon).toBeInTheDocument();
  });

  it('should render moon icon', () => {
    mockUseTheme.mockReturnValue({
      theme: 'light',
      setTheme: vi.fn(),
    });

    render(<ThemeToggle />);

    const moonIcon = screen.getByTestId('moon-icon');
    expect(moonIcon).toBeInTheDocument();
  });

  it('should have button with ghost variant', () => {
    mockUseTheme.mockReturnValue({
      theme: 'light',
      setTheme: vi.fn(),
    });

    render(<ThemeToggle />);

    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('data-variant', 'ghost');
  });

  it('should have button with icon size', () => {
    mockUseTheme.mockReturnValue({
      theme: 'light',
      setTheme: vi.fn(),
    });

    render(<ThemeToggle />);

    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('data-size', 'icon');
  });

  it('should have sr-only text for accessibility', () => {
    mockUseTheme.mockReturnValue({
      theme: 'light',
      setTheme: vi.fn(),
    });

    render(<ThemeToggle />);

    const srOnlyText = screen.getByText('Toggle theme');
    expect(srOnlyText).toHaveClass('sr-only');
  });

  it('should call setTheme with dark when current theme is light', () => {
    const setTheme = vi.fn();
    mockUseTheme.mockReturnValue({
      theme: 'light',
      setTheme,
    });

    render(<ThemeToggle />);

    const button = screen.getByRole('button');
    fireEvent.click(button);

    expect(setTheme).toHaveBeenCalledWith('dark');
  });

  it('should call setTheme with light when current theme is dark', () => {
    const setTheme = vi.fn();
    mockUseTheme.mockReturnValue({
      theme: 'dark',
      setTheme,
    });

    render(<ThemeToggle />);

    const button = screen.getByRole('button');
    fireEvent.click(button);

    expect(setTheme).toHaveBeenCalledWith('light');
  });

  it('should toggle theme on button click', () => {
    const setTheme = vi.fn();
    mockUseTheme.mockReturnValue({
      theme: 'light',
      setTheme,
    });

    render(<ThemeToggle />);

    const button = screen.getByRole('button');
    fireEvent.click(button);

    expect(setTheme).toHaveBeenCalledTimes(1);
  });

  it('should have sun icon with light mode transforms', () => {
    mockUseTheme.mockReturnValue({
      theme: 'light',
      setTheme: vi.fn(),
    });

    render(<ThemeToggle />);

    const sunIcon = screen.getByTestId('sun-icon');
    expect(sunIcon).toHaveClass(
      'h-[1.2rem]',
      'w-[1.2rem]',
      'rotate-0',
      'scale-100',
      'transition-all',
      'dark:-rotate-90',
      'dark:scale-0'
    );
  });

  it('should have moon icon with dark mode transforms', () => {
    mockUseTheme.mockReturnValue({
      theme: 'dark',
      setTheme: vi.fn(),
    });

    render(<ThemeToggle />);

    const moonIcon = screen.getByTestId('moon-icon');
    expect(moonIcon).toHaveClass(
      'absolute',
      'h-[1.2rem]',
      'w-[1.2rem]',
      'rotate-90',
      'scale-0',
      'transition-all',
      'dark:rotate-0',
      'dark:scale-100'
    );
  });

  it('should handle multiple clicks', () => {
    const setTheme = vi.fn();
    mockUseTheme.mockReturnValue({
      theme: 'light',
      setTheme,
    });

    render(<ThemeToggle />);

    const button = screen.getByRole('button');

    fireEvent.click(button);
    expect(setTheme).toHaveBeenNthCalledWith(1, 'dark');

    fireEvent.click(button);
    expect(setTheme).toHaveBeenNthCalledWith(2, 'dark');
  });

  it('should have button with correct styling for transitions', () => {
    mockUseTheme.mockReturnValue({
      theme: 'light',
      setTheme: vi.fn(),
    });

    render(<ThemeToggle />);

    const sunIcon = screen.getByTestId('sun-icon');
    expect(sunIcon).toHaveClass('transition-all');
  });

  it('should render with correct component structure', () => {
    mockUseTheme.mockReturnValue({
      theme: 'light',
      setTheme: vi.fn(),
    });

    render(<ThemeToggle />);

    const button = screen.getByRole('button');
    expect(button).toContainElement(screen.getByTestId('sun-icon'));
    expect(button).toContainElement(screen.getByTestId('moon-icon'));
  });

  it('should use useTheme hook', () => {
    mockUseTheme.mockReturnValue({
      theme: 'light',
      setTheme: vi.fn(),
    });

    render(<ThemeToggle />);

    expect(mockUseTheme).toHaveBeenCalled();
  });

  it('should handle theme as undefined', () => {
    const setTheme = vi.fn();
    mockUseTheme.mockReturnValue({
      theme: undefined,
      setTheme,
    });

    render(<ThemeToggle />);

    const button = screen.getByRole('button');
    fireEvent.click(button);

    // Should default to dark
    expect(setTheme).toHaveBeenCalled();
  });

  it('should have moon icon as absolute positioned', () => {
    mockUseTheme.mockReturnValue({
      theme: 'light',
      setTheme: vi.fn(),
    });

    render(<ThemeToggle />);

    const moonIcon = screen.getByTestId('moon-icon');
    expect(moonIcon).toHaveClass('absolute');
  });

  it('should display correct icon size', () => {
    mockUseTheme.mockReturnValue({
      theme: 'light',
      setTheme: vi.fn(),
    });

    render(<ThemeToggle />);

    const sunIcon = screen.getByTestId('sun-icon');
    const moonIcon = screen.getByTestId('moon-icon');

    expect(sunIcon).toHaveClass('h-[1.2rem]', 'w-[1.2rem]');
    expect(moonIcon).toHaveClass('h-[1.2rem]', 'w-[1.2rem]');
  });

  it('should handle rapid theme toggles', () => {
    const setTheme = vi.fn();
    mockUseTheme.mockReturnValue({
      theme: 'light',
      setTheme,
    });

    render(<ThemeToggle />);

    const button = screen.getByRole('button');

    fireEvent.click(button);
    fireEvent.click(button);
    fireEvent.click(button);

    expect(setTheme).toHaveBeenCalledTimes(3);
  });

  it('should render sr-only text for screen readers', () => {
    mockUseTheme.mockReturnValue({
      theme: 'light',
      setTheme: vi.fn(),
    });

    render(<ThemeToggle />);

    const srText = screen.getByText('Toggle theme');
    expect(srText).toBeInTheDocument();
    expect(srText.className).toContain('sr-only');
  });
});
