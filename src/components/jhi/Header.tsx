'use client';

import { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import { motion, AnimatePresence } from 'framer-motion';
import { Sun, Moon, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAppStore } from '@/lib/store';
import { getTranslation, languageNames, type Language } from '@/lib/i18n';

const navItems = [
  { key: 'headerAbout', href: '#about' },
  { key: 'headerCommodities', href: '#commodities' },
  { key: 'headerGlobalReach', href: '#global-reach' },
  { key: 'headerWhyJhi', href: '#why-jhi' },
  { key: 'headerSpeak', href: '#speak-with-team' },
  { key: 'headerContact', href: '#contact' },
] as const;

const languages: Language[] = ['en', 'es', 'zh'];

export function Header() {
  const { theme, setTheme } = useTheme();
  const { language, setLanguage } = useAppStore();
  const t = getTranslation(language);
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll, { passive: true });
    const raf = requestAnimationFrame(() => setMounted(true));
    return () => {
      window.removeEventListener('scroll', handleScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  // Only use isDark for things that MUST be different at JS level (like src, onClick handlers)
  const isDark = mounted && theme === 'dark';

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-white/90 dark:bg-[#0a0a0a]/90 backdrop-blur-xl border-b border-black/5 dark:border-white/5 shadow-lg shadow-black/5 dark:shadow-black/20'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo */}
          <a href="#" className="flex-shrink-0">
            <img
              src={isDark ? '/images/logo-light.png' : '/images/logo-dark.png'}
              alt="J Huge International"
              className="h-8 sm:h-10 w-auto transition-opacity duration-300"
            />
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => (
              <a
                key={item.key}
                href={item.href}
                className="px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-200 text-gray-600 dark:text-gray-300 hover:text-[#c9a84c] hover:bg-black/5 dark:hover:bg-white/5"
              >
                {t[item.key as keyof typeof t]}
              </a>
            ))}
          </nav>

          {/* Right side controls */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Language selector */}
            <div className="hidden sm:flex items-center gap-1 text-sm">
              {languages.map((lang, i) => (
                <span key={lang} className="flex items-center">
                  <button
                    onClick={() => setLanguage(lang)}
                    className={`px-2 py-1 rounded transition-colors duration-200 ${
                      language === lang
                        ? 'text-[#c9a84c] font-semibold'
                        : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                    }`}
                  >
                    {languageNames[lang]}
                  </button>
                  {i < languages.length - 1 && (
                    <span className="text-gray-300 dark:text-gray-600">|</span>
                  )}
                </span>
              ))}
            </div>

            {/* Theme toggle */}
            {mounted && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setTheme(isDark ? 'light' : 'dark')}
                className="rounded-full text-gray-500 dark:text-gray-400 hover:text-[#c9a84c] hover:bg-black/5 dark:hover:bg-white/5"
              >
                {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </Button>
            )}

            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden rounded-full"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? (
                <X className="h-5 w-5 text-gray-900 dark:text-white" />
              ) : (
                <Menu className="h-5 w-5 text-gray-900 dark:text-white" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="lg:hidden overflow-hidden bg-white/95 dark:bg-[#0a0a0a]/95 backdrop-blur-xl border-t border-black/5 dark:border-white/5"
          >
            <nav className="max-w-7xl mx-auto px-4 py-4 space-y-1">
              {navItems.map((item) => (
                <a
                  key={item.key}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className="block px-4 py-3 rounded-lg text-base font-medium transition-colors text-gray-600 dark:text-gray-300 hover:text-[#c9a84c] hover:bg-black/5 dark:hover:bg-white/5"
                >
                  {t[item.key as keyof typeof t]}
                </a>
              ))}
              {/* Mobile language selector */}
              <div className="flex items-center gap-2 px-4 py-3">
                {languages.map((lang, i) => (
                  <span key={lang} className="flex items-center">
                    <button
                      onClick={() => setLanguage(lang)}
                      className={`text-sm px-2 py-1 rounded transition-colors ${
                        language === lang
                          ? 'text-[#c9a84c] font-semibold'
                          : 'text-gray-500 dark:text-gray-400'
                      }`}
                    >
                      {languageNames[lang]}
                    </button>
                    {i < languages.length - 1 && (
                      <span className="text-sm text-gray-300 dark:text-gray-600">|</span>
                    )}
                  </span>
                ))}
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
