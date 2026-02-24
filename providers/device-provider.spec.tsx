import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { DeviceProvider, useIsMobile } from './device-provider';
import { act } from 'react';

let matches = false;
let changeListener: (() => void) | null = null;

describe('DeviceProvider', () => {
  beforeEach(() => {
    matches = false;
    changeListener = null;
    vi.stubGlobal(
      'matchMedia',
      vi.fn().mockImplementation(() => ({
        get matches() {
          return matches;
        },
        addEventListener: (_: string, listener: () => void) => {
          changeListener = listener;
        },
        removeEventListener: vi.fn(() => {
          changeListener = null;
        }),
      }))
    );
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

  it('should update when media query matches', () => {
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
      matches = true;
      changeListener?.();
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
