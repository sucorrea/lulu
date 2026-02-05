import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import LulusInteractive from './lulus-interactive';

vi.mock('@/hooks/user-verify', () => ({
  useUserVerification: () => ({ user: null, isLoading: false }),
}));

vi.mock('@tanstack/react-query', () => ({
  useQuery: () => ({ data: [] }),
}));

vi.mock('react-spinners/BounceLoader', () => ({
  default: () => <div>Loading...</div>,
}));

vi.mock('./filter/filter', () => ({
  default: () => <div>Filter Component</div>,
}));

vi.mock('./lulu-card/lulu-card-home', () => ({
  default: () => <div>LuluCard</div>,
}));

describe('LulusInteractive', () => {
  it('should render with empty participants', () => {
    render(<LulusInteractive initialParticipants={[]} />);
    expect(screen.getByText('Filter Component')).toBeInTheDocument();
  });

  it('should show total participants badge', () => {
    render(<LulusInteractive initialParticipants={[]} />);
    expect(screen.getByText(/0 Participantes/)).toBeInTheDocument();
  });
});
