import { describe, expect, it, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Filter from './filter';
import { useDisclosure } from '@/hooks/use-disclosure';

vi.mock('@/hooks/use-disclosure', () => ({
  useDisclosure: vi.fn(() => ({
    isOpen: false,
    onToggle: vi.fn(),
  })),
}));

vi.mock('./filter-component', () => ({
  default: () => <div data-testid="filter-bar">FilterBar Component</div>,
}));

vi.mock('@/components/ui/button', () => ({
  Button: ({
    children,
    onClick,
    className,
  }: {
    children: React.ReactNode;
    onClick: () => void;
    className: string;
  }) => (
    <button data-testid="filter-button" onClick={onClick} className={className}>
      {children}
    </button>
  ),
}));

describe('Filter', () => {
  const defaultProps = {
    filterMonth: 'all',
    setFilterMonth: vi.fn(),
    searchTerm: '',
    setSearchTerm: vi.fn(),
    sortBy: 'date',
    setSortBy: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render filter button', () => {
    render(<Filter {...defaultProps} />);
    expect(screen.getByTestId('filter-button')).toBeDefined();
  });

  it('should render Filtros text', () => {
    render(<Filter {...defaultProps} />);
    expect(screen.getByText('Filtros')).toBeDefined();
  });

  it('should not show FilterBar when closed', () => {
    render(<Filter {...defaultProps} />);
    expect(screen.queryByTestId('filter-bar')).toBeNull();
  });

  it('should show FilterBar when open', () => {
    vi.mocked(useDisclosure).mockReturnValue({
      isOpen: true,
      onToggle: vi.fn(),
      onOpen: vi.fn(),
      onClose: vi.fn(),
      setOpen: vi.fn(),
    });
    render(<Filter {...defaultProps} />);
    expect(screen.getByTestId('filter-bar')).toBeDefined();
  });

  it('should call onToggle when button is clicked', () => {
    const mockOnToggle = vi.fn();
    vi.mocked(useDisclosure).mockReturnValue({
      isOpen: false,
      onToggle: mockOnToggle,
      onOpen: vi.fn(),
      onClose: vi.fn(),
      setOpen: vi.fn(),
    });
    render(<Filter {...defaultProps} />);
    const button = screen.getByTestId('filter-button');
    fireEvent.click(button);
    expect(mockOnToggle).toHaveBeenCalledTimes(1);
  });

  it('should have mb-4 class on wrapper', () => {
    const { container } = render(<Filter {...defaultProps} />);
    const wrapper = container.querySelector('.mb-4');
    expect(wrapper).toBeDefined();
  });

  it('should render button with correct variant', () => {
    render(<Filter {...defaultProps} />);
    const button = screen.getByTestId('filter-button');
    expect(button.className).toContain('gap-2');
  });

  it('should render icon and text in button', () => {
    const { container } = render(<Filter {...defaultProps} />);
    const button = screen.getByTestId('filter-button');
    expect(button).toBeDefined();
    const svg = container.querySelector('svg');
    expect(svg).toBeDefined();
  });

  it('should have correct font weight on text', () => {
    render(<Filter {...defaultProps} />);
    const span = screen.getByText('Filtros');
    expect(span.className).toContain('font-semibold');
  });

  it('should have correct text size', () => {
    render(<Filter {...defaultProps} />);
    const span = screen.getByText('Filtros');
    expect(span.className).toContain('text-sm');
  });
});
