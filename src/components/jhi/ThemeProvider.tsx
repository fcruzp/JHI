'use client';

import { ThemeProvider as NextThemesProvider } from 'next-themes';
import React, { useEffect, type ComponentProps } from 'react';

export function ThemeProvider({
  children,
  ...props
}: ComponentProps<typeof NextThemesProvider>) {
  // Suppress React 19 warning for next-themes script tag
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      const orig = console.error;
      // eslint-disable-next-line no-console
      console.error = (...args: unknown[]) => {
        if (typeof args[0] === 'string' && args[0].includes('Encountered a script tag')) {
          return;
        }
        orig.apply(console, args);
      };
      return () => {
        // eslint-disable-next-line no-console
        console.error = orig;
      };
    }
  }, []);

  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}
