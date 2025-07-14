import React from 'react';
import { render, screen } from '@testing-library/react';
import Footer from './index';
import '@testing-library/jest-dom';
import { usePathname } from 'next/navigation';

// Mock the next/navigation module to control the return value of usePathname
jest.mock('next/navigation', () => ({
  usePathname: jest.fn(),
}));

// Mock lucide-react icons to avoid testing implementation details of the icon library
jest.mock('lucide-react', () => ({
  Gift: () => <div data-testid="gift-icon" />,
  LayoutDashboardIcon: () => <div data-testid="dashboard-icon" />,
  CameraIcon: () => <div data-testid="camera-icon" />,
}));

// Cast the mock to the correct type to allow manipulation in tests
const mockedUsePathname = usePathname as jest.Mock;

describe('Footer', () => {
  beforeEach(() => {
    // Reset mock before each test to ensure test isolation
    mockedUsePathname.mockClear();
  });

  it('renders all navigation links and icons', () => {
    mockedUsePathname.mockReturnValue('/');
    render(<Footer />);

    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Galeria')).toBeInTheDocument();

    expect(screen.getByTestId('gift-icon')).toBeInTheDocument();
    expect(screen.getByTestId('dashboard-icon')).toBeInTheDocument();
    expect(screen.getByTestId('camera-icon')).toBeInTheDocument();
  });

  it('highlights the "Home" link as active on the root path', () => {
    mockedUsePathname.mockReturnValue('/');
    render(<Footer />);

    const homeLink = screen.getByText('Home').closest('a');
    const dashboardLink = screen.getByText('Dashboard').closest('a');
    const galeriaLink = screen.getByText('Galeria').closest('a');

    expect(homeLink).toHaveClass('text-primary');
    expect(dashboardLink).not.toHaveClass('text-primary');
    expect(galeriaLink).not.toHaveClass('text-primary');
  });

  it('highlights the "Dashboard" link as active on the dashboard path', () => {
    mockedUsePathname.mockReturnValue('/dashboard');
    render(<Footer />);

    const homeLink = screen.getByText('Home').closest('a');
    const dashboardLink = screen.getByText('Dashboard').closest('a');
    const galeriaLink = screen.getByText('Galeria').closest('a');

    expect(homeLink).not.toHaveClass('text-primary');
    expect(dashboardLink).toHaveClass('text-primary');
    expect(galeriaLink).not.toHaveClass('text-primary');
  });

  it('highlights the "Galeria" link as active on the galeria path', () => {
    mockedUsePathname.mockReturnValue('/galeria');
    render(<Footer />);

    const homeLink = screen.getByText('Home').closest('a');
    const dashboardLink = screen.getByText('Dashboard').closest('a');
    const galeriaLink = screen.getByText('Galeria').closest('a');

    expect(homeLink).not.toHaveClass('text-primary');
    expect(dashboardLink).not.toHaveClass('text-primary');
    expect(galeriaLink).toHaveClass('text-primary');
  });

  it('does not highlight any link on an unknown path', () => {
    mockedUsePathname.mockReturnValue('/some/other/page');
    render(<Footer />);

    const allLinks = screen.getAllByRole('link');
    allLinks.forEach((link) => {
      expect(link).not.toHaveClass('text-primary');
    });
  });

  it('has correct href attributes for all links', () => {
    mockedUsePathname.mockReturnValue('/');
    render(<Footer />);

    expect(screen.getByText('Home').closest('a')).toHaveAttribute('href', '/');
    expect(screen.getByText('Dashboard').closest('a')).toHaveAttribute(
      'href',
      '/dashboard'
    );
    expect(screen.getByText('Galeria').closest('a')).toHaveAttribute(
      'href',
      '/galeria'
    );
  });
});
