import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import NextBirthdayBanner, {
  getNextBirthdayLabel,
} from './next-birthday-banner';

describe('getNextBirthdayLabel', () => {
  it('should return plural label for many days', () => {
    expect(getNextBirthdayLabel(9)).toBe(
      'Próxima aniversariante · faltam 9 dias'
    );
  });

  it('should return singular label for one day', () => {
    expect(getNextBirthdayLabel(1)).toBe(
      'Próxima aniversariante · falta 1 dia'
    );
  });

  it('should return today label for zero days', () => {
    expect(getNextBirthdayLabel(0)).toBe('Próxima aniversariante · é hoje!');
  });
});

describe('NextBirthdayBanner', () => {
  it('should render the label as a wine pill', () => {
    render(<NextBirthdayBanner daysUntil={9} />);

    const pill = screen.getByText('Próxima aniversariante · faltam 9 dias');
    expect(pill).toHaveClass(
      'rounded-full',
      'bg-primary',
      'text-primary-foreground'
    );
  });

  it('should render today label', () => {
    render(<NextBirthdayBanner daysUntil={0} />);

    expect(
      screen.getByText('Próxima aniversariante · é hoje!')
    ).toBeInTheDocument();
  });
});
