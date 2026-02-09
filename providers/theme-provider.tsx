'use client';
import {
  ThemeProvider as NextThemesProvider,
  ThemeProviderProps,
} from 'next-themes';

export const ThemeProvider = ({
  children,
  ...props
}: Readonly<ThemeProviderProps>) => {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
};
