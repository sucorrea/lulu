import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Lulus from './lulus';
import { Person } from './types';

vi.mock('./lulus-interactive', () => ({
  default: ({ initialParticipants }: { initialParticipants: Person[] }) => (
    <div data-testid="lulus-interactive">
      <span data-testid="participant-count">{initialParticipants.length}</span>
    </div>
  ),
}));

describe('Lulus', () => {
  const mockParticipants: Person[] = [
    {
      id: 1,
      name: 'Test Person 1',
      fullName: 'Test Person 1 Full',
      date: new Date('1990-01-15'),
      month: '01',
      gives_to: 'Person 2',
      gives_to_id: 2,
      city: 'Test City',
    },
    {
      id: 2,
      name: 'Test Person 2',
      fullName: 'Test Person 2 Full',
      date: new Date('1990-02-20'),
      month: '02',
      gives_to: 'Person 1',
      gives_to_id: 1,
      city: 'Test City',
    },
  ];

  it('should render LulusInteractive component', () => {
    render(<Lulus participants={mockParticipants} />);

    expect(screen.getByTestId('lulus-interactive')).toBeInTheDocument();
  });

  it('should pass participants to LulusInteractive', () => {
    render(<Lulus participants={mockParticipants} />);

    expect(screen.getByTestId('participant-count')).toHaveTextContent('2');
  });

  it('should handle empty participants array', () => {
    render(<Lulus participants={[]} />);

    expect(screen.getByTestId('participant-count')).toHaveTextContent('0');
  });

  it('should handle single participant', () => {
    render(<Lulus participants={[mockParticipants[0]]} />);

    expect(screen.getByTestId('participant-count')).toHaveTextContent('1');
  });

  it('should render with multiple participants', () => {
    const manyParticipants = Array.from({ length: 10 }, (_, i) => ({
      ...mockParticipants[0],
      id: i + 1,
      name: `Person ${i + 1}`,
    }));

    render(<Lulus participants={manyParticipants} />);

    expect(screen.getByTestId('participant-count')).toHaveTextContent('10');
  });
});
