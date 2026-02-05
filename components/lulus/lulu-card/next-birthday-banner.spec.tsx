import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import NextBirthdayBanner from './next-birthday-banner';

vi.mock('@/components/animation', () => ({
  default: () => <div data-testid="animation">Animation</div>,
}));

describe('NextBirthdayBanner', () => {
  it('should render the banner with correct title', () => {
    render(<NextBirthdayBanner daysForBirthday={5} />);

    expect(screen.getByText('Próxima Aniversariante')).toBeInTheDocument();
  });

  it('should display singular "dia" when 1 day until birthday', () => {
    render(<NextBirthdayBanner daysForBirthday={1} />);

    expect(screen.getByText('1 dia')).toBeInTheDocument();
    expect(screen.getByText('até o grande dia!')).toBeInTheDocument();
  });

  it('should display plural "dias" when multiple days until birthday', () => {
    render(<NextBirthdayBanner daysForBirthday={5} />);

    expect(screen.getByText('5 dias')).toBeInTheDocument();
    expect(screen.getByText('até o grande dia!')).toBeInTheDocument();
  });

  it('should render gift icon', () => {
    const { container } = render(<NextBirthdayBanner daysForBirthday={3} />);

    const giftIcon = container.querySelector('.lucide-gift');
    expect(giftIcon).toBeInTheDocument();
  });

  it('should render animation component', () => {
    render(<NextBirthdayBanner daysForBirthday={7} />);

    expect(screen.getByTestId('animation')).toBeInTheDocument();
  });

  it('should have correct styling classes', () => {
    const { container } = render(<NextBirthdayBanner daysForBirthday={2} />);

    const banner = container.querySelector('.bg-gradient-to-r');
    expect(banner).toHaveClass('border-l-4', 'border-primary', 'rounded-xl');
  });

  it('should display zero days correctly', () => {
    render(<NextBirthdayBanner daysForBirthday={0} />);

    expect(screen.getByText('0 dias')).toBeInTheDocument();
  });

  it('should have gift icon with pulse animation', () => {
    const { container } = render(<NextBirthdayBanner daysForBirthday={4} />);

    const giftIcon = container.querySelector('.animate-pulse');
    expect(giftIcon).toBeInTheDocument();
  });
});
