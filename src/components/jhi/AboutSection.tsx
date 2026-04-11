'use client';

import { useTheme } from 'next-themes';
import { Shield, Zap, Globe } from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { getTranslation } from '@/lib/i18n';
import { ScrollAnimation } from './ScrollAnimations';

const values = [
  { key: '1', icon: Shield },
  { key: '2', icon: Zap },
  { key: '3', icon: Globe },
] as const;

export function AboutSection() {
  const { language } = useAppStore();
  const t = getTranslation(language);

  return (
    <section
      id="about"
      className="py-20 sm:py-28 bg-white dark:bg-[#0a0a0a]"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Image side */}
          <ScrollAnimation direction="left" className="relative">
            <div className="relative overflow-hidden rounded-2xl">
              <img
                src="/images/about.png"
                alt="J Huge International - About"
                className="w-full h-[300px] sm:h-[400px] lg:h-[500px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
              {/* Gold accent border */}
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-[#c9a84c] via-[#e2c66d] to-[#c9a84c]" />
            </div>
            {/* Floating badge */}
            <div className="absolute -bottom-4 -right-4 sm:bottom-6 sm:right-6 glass dark:glass rounded-xl p-4 sm:p-6 text-center">
              <div className="text-3xl sm:text-4xl font-bold text-[#c9a84c]">15+</div>
              <div className="text-sm text-gray-600 dark:text-gray-300">
                {t.statYearsLabel}
              </div>
            </div>
          </ScrollAnimation>

          {/* Text side */}
          <ScrollAnimation direction="right" className="space-y-6">
            <div>
              <p className="text-[#c9a84c] font-semibold text-sm tracking-wider uppercase mb-2">
                J Huge International
              </p>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 text-gray-900 dark:text-white">
                {t.aboutTitle}
              </h2>
              <p className="text-lg text-gray-500 dark:text-gray-400">
                {t.aboutSubtitle}
              </p>
            </div>

            <div className="space-y-4">
              <p className="text-base leading-relaxed text-gray-600 dark:text-gray-300">
                {t.aboutP1}
              </p>
              <p className="text-base leading-relaxed text-gray-600 dark:text-gray-300">
                {t.aboutP2}
              </p>
              <p className="text-base leading-relaxed font-medium text-gray-700 dark:text-gray-200">
                {t.aboutP3}
              </p>
            </div>

            {/* Values */}
            <div className="grid sm:grid-cols-3 gap-4 pt-4">
              {values.map(({ key, icon: Icon }) => (
                <div
                  key={key}
                  className="p-4 rounded-xl border transition-all duration-300 hover:border-[#c9a84c]/30 border-gray-100 dark:border-white/5 bg-gray-50/50 dark:bg-white/[0.02] hover:bg-gray-50 dark:hover:bg-white/[0.05]"
                >
                  <Icon className="h-6 w-6 text-[#c9a84c] mb-2" />
                  <h4 className="font-semibold text-sm mb-1 text-gray-900 dark:text-white">
                    {t[`aboutValue${key}Title` as keyof typeof t]}
                  </h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {t[`aboutValue${key}Desc` as keyof typeof t]}
                  </p>
                </div>
              ))}
            </div>
          </ScrollAnimation>
        </div>
      </div>
    </section>
  );
}
