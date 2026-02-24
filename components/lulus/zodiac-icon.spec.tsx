import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';

import ZodiacIcon from './zodiac-icon';

const getIcon = (container: HTMLElement) =>
  container.querySelector('span[aria-hidden="true"]');

describe('ZodiacIcon', () => {
  it('should render span with aria-hidden', () => {
    const { container } = render(<ZodiacIcon icon="aries" />);

    expect(getIcon(container)).toBeInTheDocument();
  });

  it('should have aria-hidden for decorative icon', () => {
    const { container } = render(<ZodiacIcon icon="aries" />);

    const icon = getIcon(container);
    expect(icon).toHaveAttribute('aria-hidden', 'true');
  });

  it('should use mask image URL with provided icon', () => {
    const { container } = render(<ZodiacIcon icon="capricorn" />);

    const icon = getIcon(container);
    expect(icon?.getAttribute('style')).toContain(
      "url('/icons/zodiac/capricorn.svg')"
    );
  });

  it('should apply custom className', () => {
    const { container } = render(
      <ZodiacIcon icon="leo" className="my-custom-class" />
    );

    const icon = getIcon(container);
    expect(icon).toHaveClass('my-custom-class');
  });

  it('should render with correct dimensions', () => {
    const { container } = render(<ZodiacIcon icon="aries" />);

    const icon = getIcon(container);
    expect(icon).toHaveStyle({
      width: '0.875rem',
      height: '0.875rem',
      display: 'inline-block',
    });
  });

  it('should use currentColor for backgroundColor', () => {
    const { container } = render(<ZodiacIcon icon="pisces" />);

    const icon = getIcon(container);
    expect(icon?.getAttribute('style')).toContain('background-color');
    expect(icon?.getAttribute('style')).toContain('currentcolor');
  });
});
