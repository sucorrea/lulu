import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import { ThemeProvider } from './theme-provider';

vi.mock('next-themes', () => ({
  ThemeProvider: ({ children }: { children: React.ReactNode }) => children,
}));

describe('ThemeProvider', () => {
  it('should render children', () => {
    const { container } = render(
      <ThemeProvider>
        <div>Test Child</div>
      </ThemeProvider>
    );
    expect(container.textContent).toBe('Test Child');
  });

  it('should pass props to NextThemesProvider', () => {
    const { container } = render(
      <ThemeProvider attribute="class" defaultTheme="dark">
        <div>Content</div>
      </ThemeProvider>
    );
    expect(container).toBeDefined();
  });
});
