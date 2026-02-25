import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import PageLayout from './page-layout';

describe('PageLayout', () => {
  it('should render children', () => {
    render(
      <PageLayout>
        <span data-testid="child">Conteúdo da página</span>
      </PageLayout>
    );

    expect(screen.getByTestId('child')).toHaveTextContent('Conteúdo da página');
  });

  it('should render section with default layout classes', () => {
    const { container } = render(
      <PageLayout>
        <div>Content</div>
      </PageLayout>
    );

    const section = container.querySelector('section');
    expect(section).toHaveClass('bg-muted/40', 'py-6', 'md:py-8');
  });

  it('should render inner div with container and space-y-6', () => {
    const { container } = render(
      <PageLayout>
        <div>Content</div>
      </PageLayout>
    );

    const innerDiv = container.querySelector('section > div');
    expect(innerDiv).toHaveClass('container', 'space-y-6');
  });

  it('should merge custom className with default classes', () => {
    const { container } = render(
      <PageLayout className="max-w-4xl px-4">
        <div>Content</div>
      </PageLayout>
    );

    const innerDiv = container.querySelector('section > div');
    expect(innerDiv).toHaveClass('container', 'space-y-6', 'max-w-4xl', 'px-4');
  });
});
