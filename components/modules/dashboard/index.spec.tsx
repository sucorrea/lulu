import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';

import { Person } from '@/components/lulus/types';
import DashboardPage from './index';

const { mockSignsStats, mockMonthDashboard } = vi.hoisted(() => ({
  mockSignsStats: vi.fn(),
  mockMonthDashboard: ['Jan', 'Fev', 'Mar'],
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
  ZODIAC_ICONS: {
    Áries: 'aries',
    Touro: 'taurus',
  },
}));

vi.mock('../../lulus/zodiac-icon', () => ({
  default: ({ icon, className }: { icon: string; className?: string }) => (
    <span data-testid="zodiac-icon" data-icon={icon} className={className} />
  ),
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

  it('should call signsStats with participants', () => {
    render(<DashboardPage participants={mockParticipants} />);

    expect(mockSignsStats).toHaveBeenCalledWith(mockParticipants);
  });

  it('should render sign names from signsStats', () => {
    render(<DashboardPage participants={mockParticipants} />);

    expect(screen.getByText('Áries')).toBeInTheDocument();
    expect(screen.getByText('Touro')).toBeInTheDocument();
  });

  it('should render sign totals from signsStats', () => {
    render(<DashboardPage participants={mockParticipants} />);

    expect(screen.getByText('4')).toBeInTheDocument();
    expect(screen.getByText('6')).toBeInTheDocument();
  });

  it('should render signs sorted descending by total', () => {
    mockSignsStats.mockReturnValue([
      { name: 'Áries', total: 2 },
      { name: 'Touro', total: 6 },
      { name: 'Gêmeos', total: 4 },
    ]);

    render(<DashboardPage participants={mockParticipants} />);

    const taurus = screen.getByText('Touro');
    const gemini = screen.getByText('Gêmeos');
    const aries = screen.getByText('Áries');

    // compareDocumentPosition returns 4 (FOLLOWING) when taurus precedes gemini
    expect(
      taurus.compareDocumentPosition(gemini) & Node.DOCUMENT_POSITION_FOLLOWING
    ).toBeTruthy();
    expect(
      gemini.compareDocumentPosition(aries) & Node.DOCUMENT_POSITION_FOLLOWING
    ).toBeTruthy();
  });

  it('should render ZodiacIcon for signs present in ZODIAC_ICONS', () => {
    render(<DashboardPage participants={mockParticipants} />);

    const icons = screen.getAllByTestId('zodiac-icon');
    expect(icons.length).toBeGreaterThan(0);
    expect(icons[0]).toHaveAttribute('class', 'text-white');
  });

  it('should keep expected layout classes', () => {
    const { container } = render(
      <DashboardPage participants={mockParticipants} />
    );

    const section = container.querySelector('section');
    const innerDiv = container.querySelector('section > div');
    const grid = container.querySelector('.grid');

    expect(section).toHaveClass('bg-muted/40', 'py-6', 'md:py-8');
    expect(innerDiv).toHaveClass('container', 'space-y-6');
    expect(grid).toHaveClass('grid-cols-1', 'gap-4', 'md:grid-cols-2');
  });
});
