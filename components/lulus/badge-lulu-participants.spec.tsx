import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { CURRENT_YEAR } from '@/lib/constants';
import BadgeLuluParticipants from './badge-lulu-participants';

const mockUseGetCurrentYearAssignments = vi.fn();

vi.mock('@/services/queries/vaquinhaHistory', () => ({
  useGetCurrentYearAssignments: () => mockUseGetCurrentYearAssignments(),
}));

describe('BadgeLuluParticipants', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should display total participants when assignments are loaded', () => {
    mockUseGetCurrentYearAssignments.mockReturnValue({
      data: {
        byBirthday: {
          '2025-01-15': {},
          '2025-03-20': {},
          '2025-07-10': {},
        },
      },
      isLoading: false,
      isError: false,
    });

    render(<BadgeLuluParticipants />);

    expect(screen.getByTestId('badge-lulu-participants')).toHaveTextContent(
      `3na vaquinha de ${CURRENT_YEAR}`
    );
  });

  it('should display dash when assignments are loading', () => {
    mockUseGetCurrentYearAssignments.mockReturnValue({
      data: undefined,
      isLoading: true,
      isError: false,
    });

    render(<BadgeLuluParticipants />);

    expect(screen.getByTestId('badge-lulu-participants')).toHaveTextContent(
      `—na vaquinha de ${CURRENT_YEAR}`
    );
  });

  it('should display dash when assignments query fails', () => {
    mockUseGetCurrentYearAssignments.mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: true,
    });

    render(<BadgeLuluParticipants />);

    expect(screen.getByTestId('badge-lulu-participants')).toHaveTextContent(
      `—na vaquinha de ${CURRENT_YEAR}`
    );
  });

  it('should display zero when byBirthday is empty', () => {
    mockUseGetCurrentYearAssignments.mockReturnValue({
      data: { byBirthday: {} },
      isLoading: false,
      isError: false,
    });

    render(<BadgeLuluParticipants />);

    expect(screen.getByTestId('badge-lulu-participants')).toHaveTextContent(
      `0na vaquinha de ${CURRENT_YEAR}`
    );
  });

  it('should display zero when assignments data is undefined', () => {
    mockUseGetCurrentYearAssignments.mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: false,
    });

    render(<BadgeLuluParticipants />);

    expect(screen.getByTestId('badge-lulu-participants')).toHaveTextContent(
      `0na vaquinha de ${CURRENT_YEAR}`
    );
  });
});
