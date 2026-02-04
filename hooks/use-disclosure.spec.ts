import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useDisclosure } from './use-disclosure';

describe('useDisclosure', () => {
  it('should initialize with closed state by default', () => {
    const { result } = renderHook(() => useDisclosure());
    expect(result.current.isOpen).toBe(false);
  });

  it('should initialize with custom initial state', () => {
    const { result } = renderHook(() => useDisclosure(true));
    expect(result.current.isOpen).toBe(true);
  });

  it('should open when onOpen is called', () => {
    const { result } = renderHook(() => useDisclosure());
    act(() => {
      result.current.onOpen();
    });
    expect(result.current.isOpen).toBe(true);
  });

  it('should close when onClose is called', () => {
    const { result } = renderHook(() => useDisclosure(true));
    act(() => {
      result.current.onClose();
    });
    expect(result.current.isOpen).toBe(false);
  });

  it('should toggle state when onToggle is called', () => {
    const { result } = renderHook(() => useDisclosure());
    act(() => {
      result.current.onToggle();
    });
    expect(result.current.isOpen).toBe(true);
    act(() => {
      result.current.onToggle();
    });
    expect(result.current.isOpen).toBe(false);
  });

  it('should set state to true when setOpen is called with true', () => {
    const { result } = renderHook(() => useDisclosure());
    act(() => {
      result.current.setOpen(true);
    });
    expect(result.current.isOpen).toBe(true);
  });

  it('should set state to false when setOpen is called with false', () => {
    const { result } = renderHook(() => useDisclosure(true));
    act(() => {
      result.current.setOpen(false);
    });
    expect(result.current.isOpen).toBe(false);
  });

  it('should maintain stable function references', () => {
    const { result, rerender } = renderHook(() => useDisclosure());
    const firstOnOpen = result.current.onOpen;
    const firstOnClose = result.current.onClose;
    const firstOnToggle = result.current.onToggle;
    const firstSetOpen = result.current.setOpen;

    rerender();

    expect(result.current.onOpen).toBe(firstOnOpen);
    expect(result.current.onClose).toBe(firstOnClose);
    expect(result.current.onToggle).toBe(firstOnToggle);
    expect(result.current.setOpen).toBe(firstSetOpen);
  });
});
