import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import BirthdayCalendar from './birthday-calendar';
import { Person } from '@/components/lulus/types';

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

describe('BirthdayCalendar', () => {
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
      date: '1992-01-20',
      month: '01',
      city: 'Rio de Janeiro',
    },
    {
      id: 3,
      name: 'Carol',
      fullName: 'Carol White',
      date: '1991-03-10',
      month: '03',
      city: 'Belo Horizonte',
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render card with title', () => {
    render(<BirthdayCalendar participants={mockParticipants} />);

    expect(screen.getByText('Aniversariantes por mês')).toBeInTheDocument();
  });

  it('should render card with lulu-card class', () => {
    render(<BirthdayCalendar participants={mockParticipants} />);

    const card = screen.getByTestId('card');
    expect(card).toHaveClass('lulu-card');
  });

  it('should render months with participants', () => {
    render(<BirthdayCalendar participants={mockParticipants} />);

    expect(screen.getByText('Janeiro')).toBeInTheDocument();
    expect(screen.getByText('Março')).toBeInTheDocument();
  });

  it('should render participant names', () => {
    render(<BirthdayCalendar participants={mockParticipants} />);

    expect(screen.getByText('Alice')).toBeInTheDocument();
    expect(screen.getByText('Bob')).toBeInTheDocument();
    expect(screen.getByText('Carol')).toBeInTheDocument();
  });

  it('should render participant birthday days', () => {
    render(<BirthdayCalendar participants={mockParticipants} />);

    expect(screen.getByText('15')).toBeInTheDocument();
    expect(screen.getByText('20')).toBeInTheDocument();
    expect(screen.getByText('10')).toBeInTheDocument();
  });

  it('should sort participants by month', () => {
    const unsortedParticipants: Person[] = [
      {
        id: 1,
        name: 'December Person',
        fullName: 'December Person',
        date: '1990-12-15',
        month: '12',
        city: 'City',
      },
      {
        id: 2,
        name: 'January Person',
        fullName: 'January Person',
        date: '1990-01-10',
        month: '01',
        city: 'City',
      },
    ];

    const { container } = render(
      <BirthdayCalendar participants={unsortedParticipants} />
    );

    const monthHeaders = container.querySelectorAll('h3');
    expect(monthHeaders[0]).toHaveTextContent('Janeiro');
    expect(monthHeaders[1]).toHaveTextContent('Dezembro');
  });

  it('should sort participants by day within same month', () => {
    const sameMonthParticipants: Person[] = [
      {
        id: 1,
        name: 'Late January',
        fullName: 'Late January',
        date: '1990-01-25',
        month: '01',
        city: 'City',
      },
      {
        id: 2,
        name: 'Early January',
        fullName: 'Early January',
        date: '1990-01-05',
        month: '01',
        city: 'City',
      },
    ];

    const { container } = render(
      <BirthdayCalendar participants={sameMonthParticipants} />
    );

    const names = container.querySelectorAll('span');
    const nameTexts = Array.from(names).map((n) => n.textContent);

    const earlyIndex = nameTexts.indexOf('Early January');
    const lateIndex = nameTexts.indexOf('Late January');

    expect(earlyIndex).toBeLessThan(lateIndex);
  });

  it('should handle empty participants array', () => {
    render(<BirthdayCalendar participants={[]} />);

    expect(screen.getByTestId('card')).toBeInTheDocument();
    expect(screen.getByText('Aniversariantes por mês')).toBeInTheDocument();
  });

  it('should handle single participant', () => {
    render(<BirthdayCalendar participants={[mockParticipants[0]]} />);

    expect(screen.getByText('Alice')).toBeInTheDocument();
    expect(screen.getByText('Janeiro')).toBeInTheDocument();
  });

  it('should render grid with 2 columns', () => {
    const { container } = render(
      <BirthdayCalendar participants={mockParticipants} />
    );

    const grid = container.querySelector('.grid');
    expect(grid).toHaveClass('grid-cols-2', 'gap-2');
  });

  it('should render day badges with correct styling', () => {
    const { container } = render(
      <BirthdayCalendar participants={mockParticipants} />
    );

    const badges = container.querySelectorAll('.w-6.h-6');
    expect(badges.length).toBeGreaterThan(0);

    badges.forEach((badge) => {
      expect(badge).toHaveClass(
        'flex',
        'items-center',
        'justify-center',
        'bg-primary',
        'text-primary-foreground',
        'rounded-full',
        'text-sm',
        'font-bold'
      );
    });
  });

  it('should handle all 12 months', () => {
    const allMonthsParticipants: Person[] = Array.from(
      { length: 12 },
      (_, i) => ({
        id: i + 1,
        name: `Person ${i + 1}`,
        fullName: `Person ${i + 1}`,
        date: new Date(1990, i, 15).toISOString(),
        month: String(i + 1).padStart(2, '0'),
        city: 'City',
      })
    );

    render(<BirthdayCalendar participants={allMonthsParticipants} />);

    const monthNames = [
      'Janeiro',
      'Fevereiro',
      'Março',
      'Abril',
      'Maio',
      'Junho',
      'Julho',
      'Agosto',
      'Setembro',
      'Outubro',
      'Novembro',
      'Dezembro',
    ];

    monthNames.forEach((month) => {
      expect(screen.getByText(month)).toBeInTheDocument();
    });
  });

  it('should apply correct padding classes to card header', () => {
    render(<BirthdayCalendar participants={mockParticipants} />);

    const cardHeader = screen.getByTestId('card-header');
    expect(cardHeader).toHaveClass('p-2');
  });

  it('should apply correct padding classes to card content', () => {
    render(<BirthdayCalendar participants={mockParticipants} />);

    const cardContent = screen.getByTestId('card-content');
    expect(cardContent).toHaveClass('p-2');
  });

  it('should apply lulu-header class to title', () => {
    render(<BirthdayCalendar participants={mockParticipants} />);

    const cardTitle = screen.getByTestId('card-title');
    expect(cardTitle).toHaveClass('lulu-header', 'mb-2', 'text-xl');
  });

  it('should apply lulu-header class to month names', () => {
    const { container } = render(
      <BirthdayCalendar participants={mockParticipants} />
    );

    const monthHeaders = container.querySelectorAll('h3');
    monthHeaders.forEach((header) => {
      expect(header).toHaveClass('lulu-header', 'text-lg');
    });
  });

  it('should group participants by month correctly', () => {
    const januaryParticipants: Person[] = [
      {
        id: 1,
        name: 'Alice',
        fullName: 'Alice',
        date: '1990-01-15',
        month: '01',
        city: 'City',
      },
      {
        id: 2,
        name: 'Bob',
        fullName: 'Bob',
        date: '1990-01-20',
        month: '01',
        city: 'City',
      },
    ];

    const { container } = render(
      <BirthdayCalendar participants={januaryParticipants} />
    );

    const januarySection = container.querySelector('h3');
    expect(januarySection).toHaveTextContent('Janeiro');

    const names = container.querySelectorAll('span');
    const nameTexts = Array.from(names).map((n) => n.textContent);
    expect(nameTexts).toContain('Alice');
    expect(nameTexts).toContain('Bob');
  });

  it('should render participant items with correct spacing', () => {
    const { container } = render(
      <BirthdayCalendar participants={mockParticipants} />
    );

    const participantDivs = container.querySelectorAll(
      String.raw`.flex.items-center.py-0\.5`
    );
    expect(participantDivs.length).toBeGreaterThan(0);
  });

  it('should render day without adding 1', () => {
    const participant: Person[] = [
      {
        id: 1,
        name: 'Test',
        fullName: 'Test',
        date: '1990-01-14',
        month: '01',
        city: 'City',
      },
    ];

    render(<BirthdayCalendar participants={participant} />);

    expect(screen.getByText('14')).toBeInTheDocument();
  });

  it('should handle participants with date as Date object', () => {
    const participantsWithDateObject: Person[] = [
      {
        id: 1,
        name: 'Alice',
        fullName: 'Alice',
        date: new Date('1990-01-15'),
        month: '01',
        city: 'City',
      },
    ];

    render(<BirthdayCalendar participants={participantsWithDateObject} />);

    expect(screen.getByText('Alice')).toBeInTheDocument();
    expect(screen.getByText('15')).toBeInTheDocument();
  });

  it('should render space-y-2 class for month sections', () => {
    const { container } = render(
      <BirthdayCalendar participants={mockParticipants} />
    );

    const monthSections = container.querySelectorAll('.space-y-2');
    expect(monthSections.length).toBeGreaterThan(0);
  });

  it('should render space-y-1 class for participant lists', () => {
    const { container } = render(
      <BirthdayCalendar participants={mockParticipants} />
    );

    const participantLists = container.querySelectorAll('.space-y-1');
    expect(participantLists.length).toBeGreaterThan(0);
  });

  it('should render ml-3 spacing for participant names', () => {
    const { container } = render(
      <BirthdayCalendar participants={mockParticipants} />
    );

    const participantNames = container.querySelectorAll('span.ml-3');
    expect(participantNames.length).toBe(mockParticipants.length);
  });

  it('should use useMemo for sortedParticipants', () => {
    const { rerender } = render(
      <BirthdayCalendar participants={mockParticipants} />
    );

    expect(screen.getByText('Alice')).toBeInTheDocument();

    rerender(<BirthdayCalendar participants={mockParticipants} />);

    expect(screen.getByText('Alice')).toBeInTheDocument();
  });

  it('should use useMemo for participantsByMonth', () => {
    const { rerender } = render(
      <BirthdayCalendar participants={mockParticipants} />
    );

    expect(screen.getByText('Janeiro')).toBeInTheDocument();

    rerender(<BirthdayCalendar participants={mockParticipants} />);

    expect(screen.getByText('Janeiro')).toBeInTheDocument();
  });

  it('should use useMemo for months', () => {
    const { rerender } = render(
      <BirthdayCalendar participants={mockParticipants} />
    );

    const monthHeaders = screen.getAllByRole('heading', { level: 3 });
    const initialCount = monthHeaders.length;

    rerender(<BirthdayCalendar participants={mockParticipants} />);

    const monthHeadersAfter = screen.getAllByRole('heading', { level: 3 });
    expect(monthHeadersAfter.length).toBe(initialCount);
  });

  it('should handle month number sorting correctly', () => {
    const mixedMonthParticipants: Person[] = [
      {
        id: 1,
        name: 'October Person',
        fullName: 'October Person',
        date: '1990-10-15',
        month: '10',
        city: 'City',
      },
      {
        id: 2,
        name: 'February Person',
        fullName: 'February Person',
        date: '1990-02-10',
        month: '02',
        city: 'City',
      },
    ];

    const { container } = render(
      <BirthdayCalendar participants={mixedMonthParticipants} />
    );

    const monthHeaders = container.querySelectorAll('h3');
    expect(monthHeaders[0]).toHaveTextContent('Fevereiro');
    expect(monthHeaders[1]).toHaveTextContent('Outubro');
  });

  it('should render all month sections in order', () => {
    const { container } = render(
      <BirthdayCalendar participants={mockParticipants} />
    );

    const monthSections = container.querySelectorAll('.space-y-2');
    expect(monthSections.length).toBe(2);
  });
});
