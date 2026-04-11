'use client';

import { Briefcase, Zap, ShieldCheck, Globe, Headphones } from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { getTranslation } from '@/lib/i18n';
import { StaggerContainer, StaggerItem } from './ScrollAnimations';

const advantages = [
  { key: 'Professionalism', icon: Briefcase },
  { key: 'Speed', icon: Zap },
  { key: 'Security', icon: ShieldCheck },
  { key: 'Global', icon: Globe },
  { key: 'Support', icon: Headphones },
] as const;

export function WhyChooseSection() {
  const { language } = useAppStore();
  const t = getTranslation(language);

  return (
    <section
      id="why-jhi"
      className="py-20 sm:py-28 bg-[#f8f8f8] dark:bg-[#111111]"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 text-gray-900 dark:text-white">
            {t.whyChooseTitle}
          </h2>
          <p className="text-lg max-w-2xl mx-auto text-gray-500 dark:text-gray-400">
            {t.whyChooseSubtitle}
          </p>
          <div className="mt-6 h-1 w-20 mx-auto bg-gradient-to-r from-[#c9a84c] via-[#e2c66d] to-[#c9a84c] rounded-full" />
        </div>

        {/* Advantage Cards */}
        <StaggerContainer
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
          staggerDelay={0.1}
        >
          {advantages.map(({ key, icon: Icon }, index) => (
            <StaggerItem key={key}>
              <div className={`group relative p-6 sm:p-8 rounded-2xl border transition-all duration-500 hover:shadow-xl hover:shadow-[#c9a84c]/5 hover:-translate-y-1 h-full border-gray-100 dark:border-white/5 bg-white dark:bg-[#1a1a1a] hover:border-[#c9a84c]/30 dark:hover:border-[#c9a84c]/20 ${index === 4 ? 'sm:col-span-2 lg:col-span-1' : ''}`}>
                {/* Gold accent corner */}
                <div className="absolute top-0 right-0 w-16 h-16 overflow-hidden rounded-tr-2xl">
                  <div className="absolute top-0 right-0 w-0 h-0 border-l-[32px] border-l-transparent border-t-[32px] border-t-[#c9a84c]/10 group-hover:border-t-[#c9a84c]/20 transition-colors duration-500" />
                </div>

                {/* Icon */}
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl mb-5 transition-all duration-300 group-hover:scale-110 bg-[#c9a84c]/10 group-hover:bg-[#c9a84c]/20">
                  <Icon className="h-6 w-6 text-[#c9a84c]" />
                </div>

                {/* Title */}
                <h3 className="text-lg sm:text-xl font-bold mb-3 group-hover:text-[#c9a84c] transition-colors duration-300 text-gray-900 dark:text-white">
                  {t[`why${key}Title` as keyof typeof t]}
                </h3>

                {/* Description */}
                <p className="text-sm leading-relaxed text-gray-500 dark:text-gray-400">
                  {t[`why${key}Desc` as keyof typeof t]}
                </p>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
