import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import DashboardPage from './index';
import { Person } from '@/components/lulus/types';

vi.mock('recharts', () => ({
  ResponsiveContainer: ({
    children,
    width,
    height,
  }: {
    children: React.ReactNode;
    width: string;
    height: number;
  }) => (
    <div
      data-testid="responsive-container"
      data-width={width}
      data-height={height}
    >
      {children}
    </div>
  ),
  BarChart: ({
    children,
    data,
  }: {
    children: React.ReactNode;
    data: unknown[];
  }) => (
    <div data-testid="bar-chart" data-length={data.length}>
      {children}
    </div>
  ),
  PieChart: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="pie-chart">{children}</div>
  ),
  Bar: ({ dataKey, fill }: { dataKey: string; fill: string }) => (
    <div data-testid="bar" data-key={dataKey} data-fill={fill} />
  ),
  Pie: ({
    data,
    dataKey,
    nameKey,
    cx,
    cy,
    outerRadius,
    children,
  }: {
    data: unknown[];
    dataKey: string;
    nameKey: string;
    cx: string;
    cy: string;
    outerRadius: number;
    children: React.ReactNode;
  }) => (
    <div
      data-testid="pie"
      data-key={dataKey}
      data-name-key={nameKey}
      data-cx={cx}
      data-cy={cy}
      data-outer-radius={outerRadius}
      data-length={data.length}
    >
      {children}
    </div>
  ),
  Cell: ({ fill }: { fill: string }) => (
    <div data-testid="cell" data-fill={fill} />
  ),
  XAxis: ({ dataKey }: { dataKey: string }) => (
    <div data-testid="x-axis" data-key={dataKey} />
  ),
  YAxis: ({ allowDecimals }: { allowDecimals: boolean }) => (
    <div data-testid="y-axis" data-allow-decimals={String(allowDecimals)} />
  ),
  Tooltip: () => <div data-testid="tooltip" />,
}));

vi.mock('../../ui/card', () => ({
  Card: ({
    children,
    className,
  }: {
    children: React.ReactNode;
    className: string;
  }) => (
    <div data-testid="card" className={className}>
      {children}
    </div>
  ),
  CardHeader: ({
    children,
    className,
  }: {
    children: React.ReactNode;
    className: string;
  }) => (
    <div data-testid="card-header" className={className}>
      {children}
    </div>
  ),
  CardTitle: ({
    children,
    className,
  }: {
    children: React.ReactNode;
    className: string;
  }) => (
    <div data-testid="card-title" className={className}>
      {children}
    </div>
  ),
  CardContent: ({
    children,
    className,
  }: {
    children: React.ReactNode;
    className: string;
  }) => (
    <div data-testid="card-content" className={className}>
      {children}
    </div>
  ),
}));

vi.mock('./birthday-calendar', () => ({
  default: ({ participants }: { participants: Person[] }) => (
    <div data-testid="birthday-calendar" data-count={participants.length} />
  ),
}));

const mockBirthdayStats = vi.fn();
const mockSignsStats = vi.fn();

vi.mock('../../lulus/utils', () => ({
  birthdayStats: (participants: Person[]) => mockBirthdayStats(participants),
  signsStats: (participants: Person[]) => mockSignsStats(participants),
}));

vi.mock('../../lulus/constants', () => ({
  COLORS: ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A28BFE'],
}));

describe('DashboardPage', () => {
  const mockParticipants: Person[] = [
    {
      id: 1,
      name: 'Alice',
      fullName: 'Alice Johnson',
      date: '1990-01-15',
      month: '01',
      gives_to: 'Bob',
      gives_to_id: 2,
      city: 'São Paulo',
    },
    {
      id: 2,
      name: 'Bob',
      fullName: 'Bob Smith',
      date: '1992-03-20',
      month: '03',
      gives_to: 'Alice',
      gives_to_id: 1,
      city: 'Rio de Janeiro',
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    mockBirthdayStats.mockReturnValue([
      { name: 'Jan', total: 5 },
      { name: 'Feb', total: 3 },
    ]);
    mockSignsStats.mockReturnValue([
      { name: 'Áries', total: 4 },
      { name: 'Touro', total: 6 },
    ]);
  });

  it('should render dashboard page with main heading', () => {
    render(<DashboardPage participants={mockParticipants} />);

    expect(screen.getByText('Dashboard das Lulus')).toBeInTheDocument();
  });

  it('should render description text', () => {
    render(<DashboardPage participants={mockParticipants} />);

    expect(
      screen.getByText(
        'Visão geral dos aniversários e signos das participantes, em um painel simples e visual.'
      )
    ).toBeInTheDocument();
  });

  it('should render BirthdayCalendar component', () => {
    render(<DashboardPage participants={mockParticipants} />);

    const calendar = screen.getByTestId('birthday-calendar');
    expect(calendar).toBeInTheDocument();
    expect(calendar).toHaveAttribute('data-count', '2');
  });

  it('should render birthday statistics card', () => {
    render(<DashboardPage participants={mockParticipants} />);

    expect(
      screen.getByText('Número de Aniversários por mês')
    ).toBeInTheDocument();
  });

  it('should render signs distribution card', () => {
    render(<DashboardPage participants={mockParticipants} />);

    expect(screen.getByText('Distribuição por Signo')).toBeInTheDocument();
  });

  it('should render three cards total', () => {
    render(<DashboardPage participants={mockParticipants} />);

    const cards = screen.getAllByTestId('card');
    expect(cards).toHaveLength(2);
  });

  it('should render bar chart with correct data', () => {
    mockBirthdayStats.mockReturnValue([
      { name: 'Jan', total: 5 },
      { name: 'Feb', total: 3 },
    ]);

    render(<DashboardPage participants={mockParticipants} />);

    const barChart = screen.getByTestId('bar-chart');
    expect(barChart).toHaveAttribute('data-length', '2');
    expect(mockBirthdayStats).toHaveBeenCalledWith(mockParticipants);
  });

  it('should render pie chart with correct data', () => {
    mockSignsStats.mockReturnValue([
      { name: 'Áries', total: 4 },
      { name: 'Touro', total: 6 },
    ]);

    render(<DashboardPage participants={mockParticipants} />);

    const pie = screen.getByTestId('pie');
    expect(pie).toHaveAttribute('data-length', '2');
    expect(mockSignsStats).toHaveBeenCalledWith(mockParticipants);
  });

  it('should render bar with correct fill color', () => {
    render(<DashboardPage participants={mockParticipants} />);

    const bar = screen.getByTestId('bar');
    expect(bar).toHaveAttribute('data-fill', '#4BBF73');
    expect(bar).toHaveAttribute('data-key', 'total');
  });

  it('should render X and Y axes for bar chart', () => {
    render(<DashboardPage participants={mockParticipants} />);

    const xAxis = screen.getByTestId('x-axis');
    const yAxis = screen.getByTestId('y-axis');

    expect(xAxis).toHaveAttribute('data-key', 'name');
    expect(yAxis).toHaveAttribute('data-allow-decimals', 'false');
  });

  it('should render pie chart with correct props', () => {
    render(<DashboardPage participants={mockParticipants} />);

    const pie = screen.getByTestId('pie');
    expect(pie).toHaveAttribute('data-key', 'total');
    expect(pie).toHaveAttribute('data-name-key', 'name');
    expect(pie).toHaveAttribute('data-cx', '50%');
    expect(pie).toHaveAttribute('data-cy', '50%');
    expect(pie).toHaveAttribute('data-outer-radius', '100');
  });

  it('should render cells for pie chart', () => {
    mockSignsStats.mockReturnValue([
      { name: 'Áries', total: 4 },
      { name: 'Touro', total: 6 },
    ]);

    render(<DashboardPage participants={mockParticipants} />);

    const cells = screen.getAllByTestId('cell');
    expect(cells).toHaveLength(2);
  });

  it('should render tooltips for charts', () => {
    render(<DashboardPage participants={mockParticipants} />);

    const tooltips = screen.getAllByTestId('tooltip');
    expect(tooltips).toHaveLength(2);
  });

  it('should render responsive containers with correct dimensions', () => {
    render(<DashboardPage participants={mockParticipants} />);

    const containers = screen.getAllByTestId('responsive-container');
    expect(containers).toHaveLength(2);
    expect(containers[0]).toHaveAttribute('data-width', '100%');
    expect(containers[0]).toHaveAttribute('data-height', '200');
    expect(containers[1]).toHaveAttribute('data-height', '250');
  });

  it('should apply correct classes to main container', () => {
    const { container } = render(
      <DashboardPage participants={mockParticipants} />
    );

    const mainDiv = container.firstChild as HTMLElement;
    expect(mainDiv).toHaveClass(
      'min-h-screen',
      'bg-background',
      'px-4',
      'pb-24',
      'pt-6',
      'md:px-8'
    );
  });

  it('should apply lulu-header class to heading', () => {
    render(<DashboardPage participants={mockParticipants} />);

    const heading = screen.getByText('Dashboard das Lulus');
    expect(heading).toHaveClass('lulu-header', 'text-2xl', 'md:text-3xl');
  });

  it('should apply lulu-card class to cards', () => {
    render(<DashboardPage participants={mockParticipants} />);

    const cards = screen.getAllByTestId('card');
    cards.forEach((card) => {
      expect(card).toHaveClass('lulu-card');
    });
  });

  it('should handle empty participants array', () => {
    mockBirthdayStats.mockReturnValue([]);
    mockSignsStats.mockReturnValue([]);

    render(<DashboardPage participants={[]} />);

    const calendar = screen.getByTestId('birthday-calendar');
    expect(calendar).toHaveAttribute('data-count', '0');
    expect(mockBirthdayStats).toHaveBeenCalledWith([]);
    expect(mockSignsStats).toHaveBeenCalledWith([]);
  });

  it('should handle single participant', () => {
    const singleParticipant = [mockParticipants[0]];
    mockBirthdayStats.mockReturnValue([{ name: 'Jan', total: 1 }]);
    mockSignsStats.mockReturnValue([{ name: 'Capricórnio', total: 1 }]);

    render(<DashboardPage participants={singleParticipant} />);

    const calendar = screen.getByTestId('birthday-calendar');
    expect(calendar).toHaveAttribute('data-count', '1');
  });

  it('should handle multiple participants', () => {
    const manyParticipants = Array.from({ length: 50 }, (_, i) => ({
      ...mockParticipants[0],
      id: i + 1,
      name: `Person ${i + 1}`,
    }));

    mockBirthdayStats.mockReturnValue([{ name: 'Jan', total: 50 }]);
    mockSignsStats.mockReturnValue([{ name: 'Capricórnio', total: 50 }]);

    render(<DashboardPage participants={manyParticipants} />);

    const calendar = screen.getByTestId('birthday-calendar');
    expect(calendar).toHaveAttribute('data-count', '50');
  });

  it('should apply correct padding to card headers', () => {
    render(<DashboardPage participants={mockParticipants} />);

    const cardHeaders = screen.getAllByTestId('card-header');
    cardHeaders.forEach((header) => {
      expect(header).toHaveClass('p-2');
    });
  });

  it('should apply correct padding to card content', () => {
    render(<DashboardPage participants={mockParticipants} />);

    const cardContents = screen.getAllByTestId('card-content');
    cardContents.forEach((content) => {
      expect(content).toHaveClass('p-2');
    });
  });

  it('should apply correct classes to card titles', () => {
    render(<DashboardPage participants={mockParticipants} />);

    const cardTitles = screen.getAllByTestId('card-title');
    cardTitles.forEach((title) => {
      expect(title).toHaveClass('lulu-header', 'mb-2', 'text-xl');
    });
  });

  it('should render grid layout with correct classes', () => {
    const { container } = render(
      <DashboardPage participants={mockParticipants} />
    );

    const grid = container.querySelector('.grid');
    expect(grid).toHaveClass('grid-cols-1', 'gap-4', 'md:grid-cols-2');
  });

  it('should call birthdayStats with participants', () => {
    render(<DashboardPage participants={mockParticipants} />);

    expect(mockBirthdayStats).toHaveBeenCalledTimes(1);
    expect(mockBirthdayStats).toHaveBeenCalledWith(mockParticipants);
  });

  it('should call signsStats with participants twice', () => {
    render(<DashboardPage participants={mockParticipants} />);

    expect(mockSignsStats).toHaveBeenCalledTimes(2);
    expect(mockSignsStats).toHaveBeenCalledWith(mockParticipants);
  });

  it('should render cells with colors from COLORS array', () => {
    mockSignsStats.mockReturnValue([
      { name: 'Áries', total: 4 },
      { name: 'Touro', total: 6 },
      { name: 'Gêmeos', total: 3 },
      { name: 'Câncer', total: 5 },
      { name: 'Leão', total: 2 },
      { name: 'Virgem', total: 7 },
    ]);

    render(<DashboardPage participants={mockParticipants} />);

    const cells = screen.getAllByTestId('cell');
    expect(cells[0]).toHaveAttribute('data-fill', '#0088FE');
    expect(cells[1]).toHaveAttribute('data-fill', '#00C49F');
    expect(cells[2]).toHaveAttribute('data-fill', '#FFBB28');
    expect(cells[3]).toHaveAttribute('data-fill', '#FF8042');
    expect(cells[4]).toHaveAttribute('data-fill', '#A28BFE');
    expect(cells[5]).toHaveAttribute('data-fill', '#0088FE');
  });

  it('should have correct structure with description and charts', () => {
    render(<DashboardPage participants={mockParticipants} />);

    const description = screen.getByText(/Visão geral dos aniversários/);
    expect(description).toHaveClass('text-sm', 'text-muted-foreground');
  });

  it('should render heading inside mb-4 container', () => {
    const { container } = render(
      <DashboardPage participants={mockParticipants} />
    );

    const headerContainer = container.querySelector('.mb-4');
    expect(headerContainer).toBeInTheDocument();
    expect(headerContainer?.querySelector('h1')).toHaveTextContent(
      'Dashboard das Lulus'
    );
  });
});
