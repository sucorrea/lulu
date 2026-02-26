import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { useRouter } from 'next/navigation';
import PageError from './page-error';

vi.mock('next/navigation', () => ({
  useRouter: vi.fn(() => ({ refresh: vi.fn() })),
}));

describe('PageError', () => {
  it('renders with default props', () => {
    render(<PageError />);
    expect(screen.getByText('Ops! Algo deu errado')).toBeInTheDocument();
    expect(
      screen.getByText(
        'Não foi possível carregar os dados. Por favor, tente novamente.'
      )
    ).toBeInTheDocument();
  });

  it('renders with custom title and message', () => {
    render(
      <PageError title="Erro customizado" message="Mensagem personalizada" />
    );
    expect(screen.getByText('Erro customizado')).toBeInTheDocument();
    expect(screen.getByText('Mensagem personalizada')).toBeInTheDocument();
  });

  it('calls router.refresh when retry button is clicked', () => {
    const mockRefresh = vi.fn();
    vi.mocked(useRouter).mockReturnValue({
      refresh: mockRefresh,
    } as unknown as ReturnType<typeof useRouter>);

    render(<PageError />);
    fireEvent.click(screen.getByRole('button', { name: /tentar novamente/i }));
    expect(mockRefresh).toHaveBeenCalledTimes(1);
  });
});
