import { describe, expect, it, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Filter from './filter';
import { useDisclosure } from '@/hooks/use-disclosure';

vi.mock('@/hooks/use-disclosure', () => ({
  useDisclosure: vi.fn(() => ({
    isOpen: false,
    onToggle: vi.fn(),
    onOpen: vi.fn(),
    onClose: vi.fn(),
    setOpen: vi.fn(),
  })),
}));

vi.mock('@/providers/device-provider', () => ({
  useIsMobile: vi.fn(() => ({
    isMobile: false,
  })),
}));

vi.mock('./filter-component', () => ({
  default: ({
    searchTerm,
    filterMonth,
    sortBy,
  }: {
    searchTerm: string;
    filterMonth: string;
    sortBy: string;
  }) => (
    <div data-testid="filter-bar">
      FilterBar Component {searchTerm} {filterMonth} {sortBy}
    </div>
  ),
}));

vi.mock('@/components/ui/button', () => ({
  Button: ({
    children,
    onClick,
    className,
    variant,
    size,
  }: {
    children: React.ReactNode;
    onClick?: () => void;
    className?: string;
    variant?: string;
    size?: string;
  }) => (
    <button
      data-testid={variant === 'ghost' ? 'clear-button' : 'filter-button'}
      onClick={onClick}
      className={className}
      data-variant={variant}
      data-size={size}
    >
      {children}
    </button>
  ),
}));

vi.mock('@/components/ui/badge', () => ({
  Badge: ({
    children,
    variant,
    className,
  }: {
    children: React.ReactNode;
    variant?: string;
    className?: string;
  }) => (
    <span data-testid="badge" data-variant={variant} className={className}>
      {children}
    </span>
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
    vi.mocked(useDisclosure).mockReturnValue({
      isOpen: false,
      onToggle: vi.fn(),
      onOpen: vi.fn(),
      onClose: vi.fn(),
      setOpen: vi.fn(),
    });
  });

  describe('Basic Rendering', () => {
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

    it('should have mb-6 class on wrapper', () => {
      const { container } = render(<Filter {...defaultProps} />);
      const wrapper = container.querySelector('.mb-6');
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

  describe('Toggle Functionality', () => {
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
  });

  describe('Active Filters Count', () => {
    it('should show badge with count 1 when only search term is active', () => {
      render(<Filter {...defaultProps} searchTerm="test" />);
      const badge = screen.getByTestId('badge');
      expect(badge).toBeDefined();
      expect(badge.textContent).toBe('1');
    });

    it('should show badge with count 1 when only filter month is active', () => {
      render(<Filter {...defaultProps} filterMonth="janeiro" />);
      const badge = screen.getByTestId('badge');
      expect(badge).toBeDefined();
      expect(badge.textContent).toBe('1');
    });

    it('should show badge with count 1 when only sort is active', () => {
      render(<Filter {...defaultProps} sortBy="name" />);
      const badge = screen.getByTestId('badge');
      expect(badge).toBeDefined();
      expect(badge.textContent).toBe('1');
    });

    it('should show badge with count 2 when two filters are active', () => {
      render(
        <Filter {...defaultProps} searchTerm="test" filterMonth="janeiro" />
      );
      const badge = screen.getByTestId('badge');
      expect(badge).toBeDefined();
      expect(badge.textContent).toBe('2');
    });

    it('should show badge with count 3 when all filters are active', () => {
      render(
        <Filter
          {...defaultProps}
          searchTerm="test"
          filterMonth="janeiro"
          sortBy="name"
        />
      );
      const badge = screen.getByTestId('badge');
      expect(badge).toBeDefined();
      expect(badge.textContent).toBe('3');
    });

    it('should not show badge when no filters are active', () => {
      render(<Filter {...defaultProps} />);
      expect(screen.queryByTestId('badge')).toBeNull();
    });

    it('should have destructive variant on badge', () => {
      render(<Filter {...defaultProps} searchTerm="test" />);
      const badge = screen.getByTestId('badge');
      expect(badge.dataset.variant).toBe('destructive');
    });
  });

  describe('Clear Filters Button', () => {
    it('should show clear filters button when filters are active', () => {
      render(<Filter {...defaultProps} searchTerm="test" />);
      expect(screen.getByText('Limpar filtros')).toBeInTheDocument();
    });

    it('should not show clear filters button when no filters are active', () => {
      render(<Filter {...defaultProps} />);
      expect(screen.queryByText('Limpar filtros')).toBeNull();
    });

    it('should call clear functions when clear button is clicked', () => {
      const setSearchTerm = vi.fn();
      const setFilterMonth = vi.fn();
      const setSortBy = vi.fn();

      render(
        <Filter
          {...defaultProps}
          searchTerm="test"
          filterMonth="janeiro"
          sortBy="name"
          setSearchTerm={setSearchTerm}
          setFilterMonth={setFilterMonth}
          setSortBy={setSortBy}
        />
      );

      const clearButton = screen.getByTestId('clear-button');
      fireEvent.click(clearButton);

      expect(setSearchTerm).toHaveBeenCalledWith('');
      expect(setFilterMonth).toHaveBeenCalledWith('all');
      expect(setSortBy).toHaveBeenCalledWith('date');
    });

    it('should have ghost variant on clear button', () => {
      render(<Filter {...defaultProps} searchTerm="test" />);
      const clearButton = screen.getByTestId('clear-button');
      expect(clearButton.dataset.variant).toBe('ghost');
    });

    it('should have sm size on clear button', () => {
      render(<Filter {...defaultProps} searchTerm="test" />);
      const clearButton = screen.getByTestId('clear-button');
      expect(clearButton.dataset.size).toBe('sm');
    });
  });

  describe('FilterBar Props', () => {
    it('should pass correct props to FilterBar when open', () => {
      vi.mocked(useDisclosure).mockReturnValue({
        isOpen: true,
        onToggle: vi.fn(),
        onOpen: vi.fn(),
        onClose: vi.fn(),
        setOpen: vi.fn(),
      });

      render(
        <Filter
          {...defaultProps}
          searchTerm="maria"
          filterMonth="janeiro"
          sortBy="name"
        />
      );

      const filterBar = screen.getByTestId('filter-bar');
      expect(filterBar.textContent).toContain('maria');
      expect(filterBar.textContent).toContain('janeiro');
      expect(filterBar.textContent).toContain('name');
    });
  });
});
