import { render } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { PwaInstallManager } from './pwa-install-manager';

vi.mock('@/hooks/usePwaInstall', () => ({
  usePwaInstall: vi.fn(),
}));

describe('PwaInstallManager', () => {
  it('should render without errors', () => {
    expect(() => render(<PwaInstallManager />)).not.toThrow();
  });

  it('should return null (no visual output)', () => {
    const { container } = render(<PwaInstallManager />);
    expect(container.firstChild).toBeNull();
  });
});
