import { render } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { VaulPatch } from './vaul-patch';

describe('VaulPatch', () => {
  let originalRelease: (pointerId: number) => void;

  beforeEach(() => {
    originalRelease = Element.prototype.releasePointerCapture;
  });

  afterEach(() => {
    Element.prototype.releasePointerCapture = originalRelease;
  });

  it('renders null', () => {
    const { container } = render(<VaulPatch />);
    expect(container.firstChild).toBeNull();
  });

  it('patches Element.prototype.releasePointerCapture on mount', () => {
    render(<VaulPatch />);
    expect(Element.prototype.releasePointerCapture).not.toBe(originalRelease);
  });

  it('restores the original releasePointerCapture on unmount', () => {
    const { unmount } = render(<VaulPatch />);
    unmount();
    expect(Element.prototype.releasePointerCapture).toBe(originalRelease);
  });

  it('swallows DOMException with name NotFoundError', () => {
    Element.prototype.releasePointerCapture = () => {
      const error = new DOMException('No pointer', 'NotFoundError');
      throw error;
    };

    render(<VaulPatch />);

    expect(() => {
      document.body.releasePointerCapture(1);
    }).not.toThrow();
  });

  it('re-throws non-NotFoundError DOMExceptions', () => {
    Element.prototype.releasePointerCapture = () => {
      throw new DOMException('Invalid state', 'InvalidStateError');
    };

    render(<VaulPatch />);

    expect(() => {
      document.body.releasePointerCapture(1);
    }).toThrow(DOMException);
  });

  it('re-throws non-DOMException errors', () => {
    Element.prototype.releasePointerCapture = () => {
      throw new TypeError('Unexpected error');
    };

    render(<VaulPatch />);

    expect(() => {
      document.body.releasePointerCapture(1);
    }).toThrow(TypeError);
  });

  it('calls original releasePointerCapture when it does not throw', () => {
    const mockRelease = vi.fn();
    Element.prototype.releasePointerCapture = mockRelease;

    render(<VaulPatch />);

    document.body.releasePointerCapture(42);
    expect(mockRelease).toHaveBeenCalledWith(42);
  });
});
