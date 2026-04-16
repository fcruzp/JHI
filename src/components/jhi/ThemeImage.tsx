'use client';

import { useTheme } from 'next-themes';
import Image from 'next/image';
import { useEffect, useState } from 'react';

interface ThemeImageProps {
  lightSrc: string;
  darkSrc: string;
  alt: string;
  className?: string;
  priority?: boolean;
}

export function ThemeImage({
  lightSrc,
  darkSrc,
  alt,
  className,
  priority = false,
}: ThemeImageProps) {
  const { theme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // When mounted on client, now we can show the UI
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    // Return a placeholder or just null to avoid hydration mismatch
    // On server/initial hydration, we can't be sure of the theme
    // but the CSS pattern 'block dark:hidden' is safer for LCP if we want no flicker.
    // However, the 'priority' on both causes preloading of both.
    
    // As a compromise to solve the warnings:
    // We render both hidden/visible via CSS for the initial paint, 
    // but only ONE will have priority if we are on client? No, that doesn't help SSR.
    
    // To solve EXACTLY the console warnings:
    // We use a single Image component but it needs to know the theme.
    return (
      <div className={`${className} h-full w-full bg-gray-100/10 animate-pulse rounded-lg`} />
    );
  }

  const currentTheme = resolvedTheme || theme;
  const src = currentTheme === 'dark' ? darkSrc : lightSrc;

  return (
    <Image
      src={src}
      alt={alt}
      fill
      className={`object-contain ${className}`}
      priority={priority}
    />
  );
}
