import '@testing-library/jest-dom';
import { act, render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';

import { VisitCounter } from './visit-counter';

const mocks = vi.hoisted(() => ({
  incrementSiteVisits: vi.fn(),
  listenSiteVisits: vi.fn(),
}));

vi.mock('@/app/actions/visits', () => ({
  incrementSiteVisits: mocks.incrementSiteVisits,
}));

vi.mock('@/services/siteStats', () => ({
  listenSiteVisits: mocks.listenSiteVisits,
}));

const STORAGE_KEY = 'lulu_visited';

const renderCounter = () => render(<VisitCounter />);

describe('VisitCounter', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    sessionStorage.removeItem(STORAGE_KEY);
    mocks.listenSiteVisits.mockReturnValue(vi.fn());
    mocks.incrementSiteVisits.mockResolvedValue(undefined);
  });

  it('renders nothing while count is null (listener not yet fired)', () => {
    mocks.listenSiteVisits.mockReturnValue(vi.fn());
    const { container } = renderCounter();
    expect(container.firstChild).toBeNull();
  });

  it('renders count once listener fires', async () => {
    let fireCallback: (count: number) => void = vi.fn();
    mocks.listenSiteVisits.mockImplementation((cb: (count: number) => void) => {
      fireCallback = cb;
      return vi.fn();
    });

    renderCounter();

    await act(async () => {
      fireCallback(123);
    });

    expect(screen.getByTitle('Total de acessos ao site')).toHaveTextContent(
      /123/
    );
  });

  it('displays correct aria-label with count', async () => {
    let fireCallback: (count: number) => void = vi.fn();
    mocks.listenSiteVisits.mockImplementation((cb: (count: number) => void) => {
      fireCallback = cb;
      return vi.fn();
    });

    renderCounter();

    await act(async () => {
      fireCallback(7);
    });

    expect(screen.getByLabelText('Site acessado 7 vezes')).toBeInTheDocument();
  });

  it('calls incrementSiteVisits on first visit', async () => {
    renderCounter();

    await act(async () => {});

    expect(mocks.incrementSiteVisits).toHaveBeenCalledTimes(1);
    expect(sessionStorage.getItem(STORAGE_KEY)).toBe('1');
  });

  it('does not call incrementSiteVisits when already visited in session', async () => {
    sessionStorage.setItem(STORAGE_KEY, '1');

    renderCounter();

    await act(async () => {});

    expect(mocks.incrementSiteVisits).not.toHaveBeenCalled();
  });

  it('unsubscribes the listener on unmount', async () => {
    const unsubscribe = vi.fn();
    mocks.listenSiteVisits.mockReturnValue(unsubscribe);

    const { unmount } = renderCounter();
    unmount();

    expect(unsubscribe).toHaveBeenCalledTimes(1);
  });
});
