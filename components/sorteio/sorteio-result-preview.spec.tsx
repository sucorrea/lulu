import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';

import type { SorteioPair } from '@/lib/sorteio';
import { SorteioResultPreview } from './sorteio-result-preview';

vi.mock('../lulus/utils', () => ({
  formatDate: () => '15/06',
}));

const makePair = (overrides: Partial<SorteioPair> = {}): SorteioPair => ({
  responsibleId: 1,
  responsibleName: 'Ana Silva',
  birthdayPersonId: 2,
  birthdayPersonName: 'Bia Souza',
  birthdayDate: '2000-06-15',
  ...overrides,
});

const pairs: SorteioPair[] = [
  makePair({
    responsibleId: 1,
    responsibleName: 'Ana Silva',
    birthdayPersonId: 2,
    birthdayPersonName: 'Bia Souza',
    birthdayDate: '2000-06-15',
  }),
  makePair({
    responsibleId: 3,
    responsibleName: 'Carlos Lima',
    birthdayPersonId: 4,
    birthdayPersonName: 'Duda Ferreira',
    birthdayDate: '2000-03-10',
  }),
  makePair({
    responsibleId: 5,
    responsibleName: 'Eva Martins',
    birthdayPersonId: 6,
    birthdayPersonName: 'Fabi Rocha',
    birthdayDate: '2000-09-20',
  }),
];

describe('SorteioResultPreview', () => {
  it('renders "Preview do Sorteio" when isSaved is false (default)', () => {
    render(<SorteioResultPreview pairs={pairs} relaxed={false} />);
    expect(screen.getByText('Preview do Sorteio')).toBeInTheDocument();
  });

  it('renders "Resultado do Sorteio" when isSaved is true', () => {
    render(<SorteioResultPreview pairs={pairs} relaxed={false} isSaved />);
    expect(screen.getByText('Resultado do Sorteio')).toBeInTheDocument();
  });

  it('renders badge with correct pair count', () => {
    render(<SorteioResultPreview pairs={pairs} relaxed={false} />);
    expect(screen.getByText('3 atribuições')).toBeInTheDocument();
  });

  it('renders "Salvo" badge when isSaved is true', () => {
    render(<SorteioResultPreview pairs={pairs} relaxed={false} isSaved />);
    expect(screen.getByText('Salvo')).toBeInTheDocument();
  });

  it('does not render "Salvo" badge when isSaved is false', () => {
    render(<SorteioResultPreview pairs={pairs} relaxed={false} />);
    expect(screen.queryByText('Salvo')).not.toBeInTheDocument();
  });

  it('renders "Restrições relaxadas" badge when relaxed is true', () => {
    render(<SorteioResultPreview pairs={pairs} relaxed />);
    expect(screen.getByText('Restrições relaxadas')).toBeInTheDocument();
  });

  it('does not render "Restrições relaxadas" badge when relaxed is false', () => {
    render(<SorteioResultPreview pairs={pairs} relaxed={false} />);
    expect(screen.queryByText('Restrições relaxadas')).not.toBeInTheDocument();
  });

  it('renders the relaxed amber warning block when relaxed is true', () => {
    render(<SorteioResultPreview pairs={pairs} relaxed />);
    expect(
      screen.getByText(
        /Não foi possível evitar todas as repetições do ano anterior/
      )
    ).toBeInTheDocument();
  });

  it('does not render the relaxed amber warning when relaxed is false', () => {
    render(<SorteioResultPreview pairs={pairs} relaxed={false} />);
    expect(
      screen.queryByText(
        /Não foi possível evitar todas as repetições do ano anterior/
      )
    ).not.toBeInTheDocument();
  });

  it('renders first name of birthdayPerson', () => {
    render(<SorteioResultPreview pairs={pairs} relaxed={false} />);
    expect(screen.getAllByText('Bia')[0]).toBeInTheDocument();
  });

  it('renders first name of responsible', () => {
    render(<SorteioResultPreview pairs={pairs} relaxed={false} />);
    expect(screen.getAllByText('Ana')[0]).toBeInTheDocument();
  });

  it('renders all pairs', () => {
    render(<SorteioResultPreview pairs={pairs} relaxed={false} />);
    expect(screen.getAllByText('Ana')[0]).toBeInTheDocument();
    expect(screen.getAllByText('Carlos')[0]).toBeInTheDocument();
    expect(screen.getAllByText('Eva')[0]).toBeInTheDocument();
  });

  it('renders pair index numbers starting at 1', () => {
    render(<SorteioResultPreview pairs={pairs} relaxed={false} />);
    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
  });

  it('sorts pairs by MM-DD of birthday date ascending', () => {
    render(<SorteioResultPreview pairs={pairs} relaxed={false} />);
    const indexNumbers = screen
      .getAllByText(/^[123]$/)
      .map((el) => el.textContent);
    expect(indexNumbers).toEqual(['1', '2', '3']);
    const allFirstNames = screen
      .getAllByRole('generic')
      .map((el) => el.textContent)
      .filter((t) => ['Carlos', 'Bia', 'Fabi'].includes(t ?? ''));
    expect(allFirstNames[0]).toBe('Carlos');
  });

  it('renders pair with missing birthdayDate gracefully', () => {
    const pairsWithoutDate: SorteioPair[] = [
      makePair({ birthdayDate: undefined }),
    ];
    render(<SorteioResultPreview pairs={pairsWithoutDate} relaxed={false} />);
    expect(screen.getByText('15/06')).toBeInTheDocument();
  });

  it('sorts pairs correctly when some have missing birthdayDate (covers comparator falsy branch)', () => {
    const mixedPairs: SorteioPair[] = [
      makePair({
        responsibleId: 1,
        birthdayPersonId: 2,
        birthdayDate: '2000-09-15',
      }),
      makePair({
        responsibleId: 2,
        birthdayPersonId: 3,
        birthdayDate: undefined,
      }),
    ];
    render(<SorteioResultPreview pairs={mixedPairs} relaxed={false} />);
    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
  });

  it('sorts pairs correctly when first pair has missing birthdayDate', () => {
    const pairsFirstMissing: SorteioPair[] = [
      makePair({
        responsibleId: 2,
        birthdayPersonId: 3,
        birthdayDate: undefined,
      }),
      makePair({
        responsibleId: 1,
        birthdayPersonId: 2,
        birthdayDate: '2000-09-15',
      }),
    ];
    render(<SorteioResultPreview pairs={pairsFirstMissing} relaxed={false} />);
    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
  });

  it('renders 1 atribuição in badge when only one pair', () => {
    render(<SorteioResultPreview pairs={[makePair()]} relaxed={false} />);
    expect(screen.getByText('1 atribuições')).toBeInTheDocument();
  });

  it('renders empty pairs list', () => {
    render(<SorteioResultPreview pairs={[]} relaxed={false} />);
    expect(screen.getByText('0 atribuições')).toBeInTheDocument();
  });
});
