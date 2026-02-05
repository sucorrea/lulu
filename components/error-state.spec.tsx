import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import ErrorState from './error-state';

describe('ErrorState', () => {
  it('renders with default props', () => {
    render(<ErrorState />);
    expect(screen.getByText('Ops! Algo deu errado')).toBeInTheDocument();
    expect(
      screen.getByText(
        'Não foi possível carregar os dados. Por favor, tente novamente.'
      )
    ).toBeInTheDocument();
  });

  it('renders with custom title and message', () => {
    render(
      <ErrorState title="Erro customizado" message="Mensagem personalizada" />
    );
    expect(screen.getByText('Erro customizado')).toBeInTheDocument();
    expect(screen.getByText('Mensagem personalizada')).toBeInTheDocument();
  });

  it('shows retry button when onRetry is provided', () => {
    const onRetry = vi.fn();
    render(<ErrorState onRetry={onRetry} />);
    const button = screen.getByRole('button', { name: /tentar novamente/i });
    expect(button).toBeInTheDocument();
    fireEvent.click(button);
    expect(onRetry).toHaveBeenCalledTimes(1);
  });

  it('does not show retry button when onRetry is not provided', () => {
    render(<ErrorState />);
    expect(
      screen.queryByRole('button', { name: /tentar novamente/i })
    ).not.toBeInTheDocument();
  });
});
