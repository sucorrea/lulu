import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { NavbarBrand } from './navbar-brand';

describe('NavbarBrand', () => {
  it('should render the brand logo image', () => {
    render(<NavbarBrand currentYear={2026} />);
    const image = screen.getByAltText('luluzinha');
    expect(image).toBeInTheDocument();
  });

  it('should render the brand text with current year', () => {
    render(<NavbarBrand currentYear={2026} />);
    expect(screen.getByText('Luluzinha 2026')).toBeInTheDocument();
  });

  it('should render link to home page', () => {
    render(<NavbarBrand currentYear={2025} />);
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/');
  });

  it('should display correct year when different year is passed', () => {
    render(<NavbarBrand currentYear={2024} />);
    expect(screen.getByText('Luluzinha 2024')).toBeInTheDocument();
  });

  it('should have correct CSS classes for styling', () => {
    const { container } = render(<NavbarBrand currentYear={2026} />);
    const wrapper = container.querySelector('.flex.items-center');
    expect(wrapper).toBeInTheDocument();
  });

  it('should render image with correct alt text', () => {
    render(<NavbarBrand currentYear={2026} />);
    const image = screen.getByAltText('luluzinha');
    expect(image).toBeInTheDocument();
  });

  it('should have proper text styling', () => {
    render(<NavbarBrand currentYear={2026} />);
    const text = screen.getByText('Luluzinha 2026');
    expect(text.className).toContain('lulu-header');
    expect(text.className).toContain('font-bold');
  });
});
