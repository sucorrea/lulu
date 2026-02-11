import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import Home from './page';

vi.mock('@/app/actions/participants', () => ({
  getParticipantsWithEditTokens: () => Promise.resolve([]),
}));

vi.mock('@/components/lulus/lulus', () => ({
  default: () => <div>Lulus Component</div>,
}));

describe('Home Page', () => {
  it('should render page title', async () => {
    const page = await Home();
    render(page);
    expect(screen.getByText('Participantes')).toBeInTheDocument();
  });

  it('should render page description', async () => {
    const page = await Home();
    render(page);
    expect(
      screen.getByText('Veja quem faz parte dessa rede de carinho e amizade')
    ).toBeInTheDocument();
  });

  it('should render Lulus component', async () => {
    const page = await Home();
    render(page);
    expect(screen.getByText('Lulus Component')).toBeInTheDocument();
  });
});
