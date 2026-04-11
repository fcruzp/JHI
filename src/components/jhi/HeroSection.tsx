'use client';

import { useState, useEffect, Suspense } from 'react';
import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAppStore } from '@/lib/store';
import { getTranslation } from '@/lib/i18n';

// Dynamic import Globe3D with SSR disabled
const Globe3D = dynamic(() => import('./Globe3D'), {
  ssr: false,
  loading: () => null,
});

export function HeroSection() {
  const { language, setChatOpen } = useAppStore();
  const t = getTranslation(language);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const raf = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(raf);
  }, []);

  const scrollToContact = () => {
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-b from-gray-50 to-white dark:from-[#0a0a0a] dark:to-[#0a0a0a]">
      {/* 3D Globe - hidden on very small screens */}
      <div className="absolute inset-0 z-0 hidden sm:block">
        <Suspense fallback={null}>
          <Globe3D />
        </Suspense>
      </div>

      {/* Gradient overlay */}
      <div className="absolute inset-0 z-[1] bg-gradient-to-b from-white/60 via-white/40 to-white/80 dark:from-[#0a0a0a]/60 dark:via-[#0a0a0a]/40 dark:to-[#0a0a0a]/80" />

      {/* Radial gradient glow */}
      <div className="absolute inset-0 z-[1] bg-[radial-gradient(ellipse_at_center,rgba(201,168,76,0.06)_0%,transparent_70%)] dark:bg-[radial-gradient(ellipse_at_center,rgba(201,168,76,0.08)_0%,transparent_70%)]" />

      {/* Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-8 sm:mb-12"
        >
          <img
            src="/images/logo-light.png"
            alt="J Huge International"
            className="h-[4.5rem] sm:h-24 md:h-[7.5rem] mx-auto rounded-2xl block dark:hidden"
          />
          <img
            src="/images/logo-dark.png"
            alt="J Huge International"
            className="h-[4.5rem] sm:h-24 md:h-[7.5rem] mx-auto rounded-2xl hidden dark:block"
          />
        </motion.div>

        {/* Tagline */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white leading-tight mb-6"
        >
          {mounted ? (
            <>
              {t.heroTagline.split(' ').map((word, i, arr) => {
                const isHighlight =
                  word.toLowerCase().includes('trust') ||
                  word.toLowerCase().includes('confianza') ||
                  word.toLowerCase().includes('信任') ||
                  word.toLowerCase().includes('excelencia') ||
                  word.toLowerCase().includes('excellence') ||
                  word.toLowerCase().includes('卓越');
                return (
                  <span key={i}>
                    {isHighlight ? (
                      <span className="gold-shimmer">{word}</span>
                    ) : (
                      word
                    )}
                    {i < arr.length - 1 ? ' ' : ''}
                  </span>
                );
              })}
            </>
          ) : (
            <span className="gold-shimmer">{t.heroTagline}</span>
          )}
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="text-lg sm:text-xl md:text-2xl text-gray-500 dark:text-gray-400 mb-10 sm:mb-12 max-w-3xl mx-auto"
        >
          {t.heroSubtitle}
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.9 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <Button
            onClick={scrollToContact}
            size="lg"
            className="bg-[#c9a84c] hover:bg-[#b8973f] text-[#0a0a0a] font-semibold px-8 py-6 text-base sm:text-lg rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-[#c9a84c]/20 animate-pulse-glow"
          >
            {t.heroCtaQuote}
          </Button>
          <Button
            onClick={() => setChatOpen(true)}
            variant="outline"
            size="lg"
            className="border-[#c9a84c]/40 text-[#c9a84c] hover:bg-[#c9a84c]/10 hover:border-[#c9a84c]/60 font-semibold px-8 py-6 text-base sm:text-lg rounded-xl transition-all duration-300 bg-transparent"
          >
            {t.heroCtaChat}
          </Button>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 0.8 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
      >
        <a
          href="#about"
          className="flex flex-col items-center gap-2 text-gray-400 dark:text-gray-500 hover:text-[#c9a84c] transition-colors"
        >
          <ChevronDown className="h-6 w-6 animate-bounce-gentle" />
        </a>
      </motion.div>
    </section>
  );
}
