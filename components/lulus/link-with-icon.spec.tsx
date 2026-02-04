import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import LinkIconWithText from './link-with-icon';

describe('LinkIconWithText', () => {
  const mockIcon = <span data-testid="mock-icon">Icon</span>;

  it('should render link with correct href', () => {
    render(
      <LinkIconWithText
        link="https://example.com"
        text="Test Link"
        icon={mockIcon}
      />
    );

    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', 'https://example.com');
  });

  it('should have target _blank and rel attributes', () => {
    render(
      <LinkIconWithText
        link="https://example.com"
        text="Test Link"
        icon={mockIcon}
      />
    );

    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('should render icon', () => {
    render(
      <LinkIconWithText
        link="https://example.com"
        text="Test Link"
        icon={mockIcon}
      />
    );

    expect(screen.getByTestId('mock-icon')).toBeInTheDocument();
  });

  it('should show description when showDescription is true', () => {
    render(
      <LinkIconWithText
        link="https://example.com"
        text="Test Link"
        icon={mockIcon}
        showDescription={true}
      />
    );

    expect(screen.getByText('Test Link')).toBeInTheDocument();
  });

  it('should not show description when showDescription is false', () => {
    render(
      <LinkIconWithText
        link="https://example.com"
        text="Test Link"
        icon={mockIcon}
        showDescription={false}
      />
    );

    expect(screen.queryByText('Test Link')).not.toBeInTheDocument();
  });

  it('should not show description when showDescription is undefined', () => {
    render(
      <LinkIconWithText
        link="https://example.com"
        text="Test Link"
        icon={mockIcon}
      />
    );

    expect(screen.queryByText('Test Link')).not.toBeInTheDocument();
  });

  it('should have correct layout classes', () => {
    render(
      <LinkIconWithText
        link="https://example.com"
        text="Test Link"
        icon={mockIcon}
      />
    );

    const div = screen.getByTestId('mock-icon').parentElement;
    expect(div).toHaveClass('flex', 'items-center', 'flex-colgap-2');
  });

  it('should render with different icons', () => {
    const customIcon = <span data-testid="custom-icon">Custom</span>;
    render(
      <LinkIconWithText
        link="https://example.com"
        text="Test Link"
        icon={customIcon}
      />
    );

    expect(screen.getByTestId('custom-icon')).toBeInTheDocument();
  });

  it('should render with different links', () => {
    render(
      <LinkIconWithText
        link="https://different.com"
        text="Test Link"
        icon={mockIcon}
      />
    );

    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', 'https://different.com');
  });

  it('should render description with correct text size classes', () => {
    render(
      <LinkIconWithText
        link="https://example.com"
        text="Test Link"
        icon={mockIcon}
        showDescription={true}
      />
    );

    const description = screen.getByText('Test Link');
    expect(description).toHaveClass('md:text-sm', 'xs:', 'text-xs');
  });
});
