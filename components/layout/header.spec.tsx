import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import Header from './header';

describe('Header', () => {
  it('should render title', () => {
    render(<Header title="Participantes" />);

    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      'Participantes'
    );
  });

  it('should render description when provided', () => {
    render(
      <Header title="Galeria" description="Galeria de fotos da vaquinha." />
    );

    expect(
      screen.getByText('Galeria de fotos da vaquinha.')
    ).toBeInTheDocument();
  });

  it('should render empty description when not provided', () => {
    render(<Header title="Título" />);

    const header = screen.getByRole('banner');
    const paragraph = header.querySelector('p');
    expect(paragraph).toHaveTextContent('');
  });

  it('should render semantic header element', () => {
    render(<Header title="Test" />);

    expect(screen.getByRole('banner')).toBeInTheDocument();
  });

  it('should apply lulu-header class to title', () => {
    render(<Header title="Dashboard" />);

    const h1 = screen.getByRole('heading', { level: 1 });
    expect(h1).toHaveClass('lulu-header', 'font-serif');
  });

  it('should render the eyebrow above the title when provided', () => {
    render(<Header title="Nossa roda de amigas" eyebrow="Novembro · 2026" />);

    const eyebrow = screen.getByText('Novembro · 2026');
    expect(eyebrow).toHaveClass('uppercase', 'text-gold');
    expect(
      eyebrow.compareDocumentPosition(
        screen.getByRole('heading', { level: 1 })
      ) & Node.DOCUMENT_POSITION_FOLLOWING
    ).toBeTruthy();
  });

  it('should not render the eyebrow when not provided', () => {
    render(<Header title="Título" description="Descrição" />);

    expect(screen.getByRole('banner').querySelectorAll('p')).toHaveLength(1);
  });
});
