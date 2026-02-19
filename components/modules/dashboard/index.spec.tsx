import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';

import { Person } from '@/components/lulus/types';
import DashboardPage from './index';

const { mockSignsStats, mockMonthDashboard } = vi.hoisted(() => ({
  mockSignsStats: vi.fn(),
  mockMonthDashboard: ['Jan', 'Fev', 'Mar'],
}));

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
  PieChart: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="pie-chart">{children}</div>
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
      data-length={data.length}
      data-key={dataKey}
      data-name-key={nameKey}
      data-cx={cx}
      data-cy={cy}
      data-outer-radius={outerRadius}
    >
      {children}
    </div>
  ),
  Cell: ({ fill }: { fill: string }) => (
    <div data-testid="cell" data-fill={fill} />
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

vi.mock('../../lulus/utils', () => ({
  monthDashboard: mockMonthDashboard,
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
      city: 'São Paulo',
    },
    {
      id: 2,
      name: 'Bob',
      fullName: 'Bob Smith',
      date: '1992-03-20',
      month: '03',
      city: 'Rio de Janeiro',
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    mockSignsStats.mockReturnValue([
      { name: 'Áries', total: 4 },
      { name: 'Touro', total: 6 },
    ]);
  });

  it('should render main heading and description', () => {
    render(<DashboardPage participants={mockParticipants} />);

    expect(screen.getByText('Dashboard das Lulus')).toBeInTheDocument();
    expect(
      screen.getByText(
        'Visão geral dos aniversários e signos das participantes, em um painel simples e visual.'
      )
    ).toBeInTheDocument();
  });

  it('should render birthday calendar with participants', () => {
    render(<DashboardPage participants={mockParticipants} />);

    expect(screen.getByTestId('birthday-calendar')).toHaveAttribute(
      'data-count',
      '2'
    );
  });

  it('should render the two dashboard cards', () => {
    render(<DashboardPage participants={mockParticipants} />);

    expect(screen.getAllByTestId('card')).toHaveLength(2);
    expect(screen.getByText('Aniversários por mês')).toBeInTheDocument();
    expect(screen.getByText('Distribuição por Signo')).toBeInTheDocument();
  });

  it('should render all month labels from monthDashboard', () => {
    render(<DashboardPage participants={mockParticipants} />);

    for (const month of mockMonthDashboard) {
      expect(screen.getByText(month)).toBeInTheDocument();
    }
  });

  it('should render month counts based on participant month', () => {
    render(<DashboardPage participants={mockParticipants} />);

    expect(screen.getAllByText('1')).toHaveLength(2);
    expect(screen.getByText('0')).toBeInTheDocument();
  });

  it('should render pie chart with expected props and data', () => {
    render(<DashboardPage participants={mockParticipants} />);

    const pie = screen.getByTestId('pie');
    expect(pie).toHaveAttribute('data-length', '2');
    expect(pie).toHaveAttribute('data-key', 'total');
    expect(pie).toHaveAttribute('data-name-key', 'name');
    expect(pie).toHaveAttribute('data-cx', '50%');
    expect(pie).toHaveAttribute('data-cy', '50%');
    expect(pie).toHaveAttribute('data-outer-radius', '100');
  });

  it('should call signsStats twice with participants', () => {
    render(<DashboardPage participants={mockParticipants} />);

    expect(mockSignsStats).toHaveBeenCalledTimes(2);
    expect(mockSignsStats).toHaveBeenCalledWith(mockParticipants);
  });

  it('should render cells with colors cycling through COLORS', () => {
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
    expect(cells).toHaveLength(6);
    expect(cells[0]).toHaveAttribute('data-fill', '#0088FE');
    expect(cells[1]).toHaveAttribute('data-fill', '#00C49F');
    expect(cells[2]).toHaveAttribute('data-fill', '#FFBB28');
    expect(cells[3]).toHaveAttribute('data-fill', '#FF8042');
    expect(cells[4]).toHaveAttribute('data-fill', '#A28BFE');
    expect(cells[5]).toHaveAttribute('data-fill', '#0088FE');
  });

  it('should render tooltip and responsive container for pie chart', () => {
    render(<DashboardPage participants={mockParticipants} />);

    expect(screen.getByTestId('tooltip')).toBeInTheDocument();

    const containers = screen.getAllByTestId('responsive-container');
    expect(containers).toHaveLength(1);
    expect(containers[0]).toHaveAttribute('data-width', '100%');
    expect(containers[0]).toHaveAttribute('data-height', '250');
  });

  it('should keep expected layout classes', () => {
    const { container } = render(
      <DashboardPage participants={mockParticipants} />
    );

    const page = container.querySelector('.min-h-screen');
    const grid = container.querySelector('.grid');

    expect(page).toHaveClass(
      'bg-background',
      'px-4',
      'pb-24',
      'pt-6',
      'md:px-8'
    );
    expect(grid).toHaveClass('grid-cols-1', 'gap-4', 'md:grid-cols-2');
  });
});
