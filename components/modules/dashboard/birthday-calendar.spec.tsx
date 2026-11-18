import { describe, it, expect, vi, afterEach, beforeEach } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import BirthdayCalendar from './birthday-calendar';
import { Person } from '@/components/lulus/types';

const make = (
  id: number,
  name: string,
  date: string,
  photo?: string
): Person => ({
  id,
  name,
  fullName: name,
  date,
  month: date.slice(5, 7),
  city: 'City',
  photoURL: photo,
});

describe('BirthdayCalendar', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2026, 10, 18, 12));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  const people = [
    make(1, 'Alice', '1980-01-10', 'https://example.com/a.jpg'),
    make(2, 'Bob', '1990-11-25', 'https://example.com/b.jpg'),
    make(3, 'Carol', '1991-11-03'),
    make(4, 'Dani', '1992-12-01', 'https://example.com/d.jpg'),
  ];

  it('renders the year title', () => {
    render(<BirthdayCalendar participants={people} />);
    expect(screen.getByText('O ano das Lulus')).toBeInTheDocument();
  });

  it('starts at the current month, then wraps to January', () => {
    render(<BirthdayCalendar participants={people} />);
    const headings = screen
      .getAllByRole('heading', { level: 3 })
      .map((h) => h.textContent);
    expect(headings).toEqual(['Novembro', 'Dezembro', 'Janeiro']);
  });

  it('marks only the current month with AGORA', () => {
    render(<BirthdayCalendar participants={people} />);
    expect(screen.getAllByText('AGORA')).toHaveLength(1);
  });

  it('shows photo with alt equal to name and the day', () => {
    render(<BirthdayCalendar participants={people} />);
    const bob = screen.getByAltText('Bob');
    expect(bob.tagName).toBe('IMG');
    const item = bob.closest('li') as HTMLElement;
    expect(within(item).getByText('25')).toBeInTheDocument();
    expect(within(item).getByText('Bob')).toBeInTheDocument();
  });

  it('sorts people by day within the month', () => {
    render(<BirthdayCalendar participants={people} />);
    const items = screen.getAllByRole('listitem').map((li) => li.textContent);
    expect(items[0]).toContain('Carol');
    expect(items[1]).toContain('Bob');
  });

  it('falls back to initials when there is no photo', () => {
    render(<BirthdayCalendar participants={people} />);
    expect(screen.queryByAltText('Carol')).not.toBeInTheDocument();
    expect(screen.getByText('C')).toBeInTheDocument();
  });

  it('handles empty participants', () => {
    render(<BirthdayCalendar participants={[]} />);
    expect(screen.getByText('O ano das Lulus')).toBeInTheDocument();
    expect(screen.queryAllByRole('heading', { level: 3 })).toHaveLength(0);
  });
});
