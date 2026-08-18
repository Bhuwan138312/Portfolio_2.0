'use client';

import { ThemeProvider as NextThemesProvider } from 'next-themes';

export default function ThemeProvider({ children }) {
  return (
    <NextThemesProvider defaultTheme="system" enableSystem attribute="data-theme">
      {children}
    </NextThemesProvider>
  );
}
