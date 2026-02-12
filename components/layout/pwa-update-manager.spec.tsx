import { render } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { PwaUpdateManager } from './pwa-update-manager';

vi.mock('@/hooks/usePwaUpdate', () => ({
  usePwaUpdate: vi.fn(),
}));

describe('PwaUpdateManager', () => {
  it('should render without errors', () => {
    expect(() => render(<PwaUpdateManager />)).not.toThrow();
  });

  it('should return null (no visual output)', () => {
    const { container } = render(<PwaUpdateManager />);
    expect(container.firstChild).toBeNull();
  });
});
