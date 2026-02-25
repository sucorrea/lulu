import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
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

    expect(screen.getByText(/3 Participantes da vaquinha/)).toBeInTheDocument();
  });

  it('should display dash when assignments are loading', () => {
    mockUseGetCurrentYearAssignments.mockReturnValue({
      data: undefined,
      isLoading: true,
      isError: false,
    });

    render(<BadgeLuluParticipants />);

    expect(screen.getByText(/— Participantes da vaquinha/)).toBeInTheDocument();
  });

  it('should display dash when assignments query fails', () => {
    mockUseGetCurrentYearAssignments.mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: true,
    });

    render(<BadgeLuluParticipants />);

    expect(screen.getByText(/— Participantes da vaquinha/)).toBeInTheDocument();
  });

  it('should display zero when byBirthday is empty', () => {
    mockUseGetCurrentYearAssignments.mockReturnValue({
      data: { byBirthday: {} },
      isLoading: false,
      isError: false,
    });

    render(<BadgeLuluParticipants />);

    expect(screen.getByText(/0 Participantes da vaquinha/)).toBeInTheDocument();
  });

  it('should display zero when assignments data is undefined', () => {
    mockUseGetCurrentYearAssignments.mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: false,
    });

    render(<BadgeLuluParticipants />);

    expect(screen.getByText(/0 Participantes da vaquinha/)).toBeInTheDocument();
  });

  it('should render GiftIcon', () => {
    mockUseGetCurrentYearAssignments.mockReturnValue({
      data: { byBirthday: { '2025-01-01': {} } },
      isLoading: false,
      isError: false,
    });

    const { container } = render(<BadgeLuluParticipants />);

    const giftIcon = container.querySelector('.lucide-gift');
    expect(giftIcon).toBeInTheDocument();
  });
});
