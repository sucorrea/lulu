import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { DeviceProvider, useIsMobile } from './device-provider';
import { act } from 'react';

vi.mock('react-device-detect', () => ({
  isMobile: false,
}));

vi.mock('lodash', () => ({
  debounce: (fn: () => void) => fn,
}));

describe('DeviceProvider', () => {
  beforeEach(() => {
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 1200,
    });
  });

  it('should render children', () => {
    render(
      <DeviceProvider>
        <div>Test Content</div>
      </DeviceProvider>
    );
    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  it('should provide mobile context', () => {
    function TestComponent() {
      const { isMobile } = useIsMobile();
      return <div>{isMobile ? 'Mobile' : 'Desktop'}</div>;
    }

    render(
      <DeviceProvider>
        <TestComponent />
      </DeviceProvider>
    );

    expect(screen.getByText('Desktop')).toBeInTheDocument();
  });

  it('should update on window resize', () => {
    function TestComponent() {
      const { isMobile } = useIsMobile();
      return <div>{isMobile ? 'Mobile' : 'Desktop'}</div>;
    }

    render(
      <DeviceProvider>
        <TestComponent />
      </DeviceProvider>
    );

    act(() => {
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 800,
      });
      window.dispatchEvent(new Event('resize'));
    });

    expect(screen.getByText('Mobile')).toBeInTheDocument();
  });

  it('should throw error when useIsMobile is used outside provider', () => {
    function TestComponent() {
      useIsMobile();
      return <div>Test</div>;
    }

    const consoleError = vi
      .spyOn(console, 'error')
      .mockImplementation(() => {});

    expect(() => render(<TestComponent />)).toThrow();

    consoleError.mockRestore();
  });
});
