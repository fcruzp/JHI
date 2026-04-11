'use client';

import { Clock, Languages, Mic } from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { getTranslation } from '@/lib/i18n';
import { ScrollAnimation, StaggerContainer, StaggerItem } from './ScrollAnimations';
import { Button } from '@/components/ui/button';

const features = [
  { key: '1', icon: Clock },
  { key: '2', icon: Languages },
  { key: '3', icon: Mic },
] as const;

export function SpeakWithTeamSection() {
  const { language, setChatOpen } = useAppStore();
  const t = getTranslation(language);

  return (
    <section
      id="speak-with-team"
      className="py-20 sm:py-28 bg-white dark:bg-[#0a0a0a] relative overflow-hidden"
    >
      {/* Subtle background glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(201,168,76,0.04)_0%,transparent_60%)] dark:bg-[radial-gradient(ellipse_at_center,rgba(201,168,76,0.06)_0%,transparent_60%)]" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Text side */}
          <ScrollAnimation direction="left" className="space-y-6">
            <div>
              <p className="text-[#c9a84c] font-semibold text-sm tracking-wider uppercase mb-2">
                {t.speakSubtitle}
              </p>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 text-gray-900 dark:text-white">
                {t.speakTitle}
              </h2>
            </div>

            <p className="text-base leading-relaxed text-gray-600 dark:text-gray-300">
              {t.speakDescription}
            </p>

            <Button
              onClick={() => setChatOpen(true)}
              size="lg"
              className="bg-[#c9a84c] hover:bg-[#b8973f] text-[#0a0a0a] font-semibold px-8 py-6 text-base rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-[#c9a84c]/20 animate-pulse-glow"
            >
              {t.speakCta}
            </Button>
          </ScrollAnimation>

          {/* Features cards */}
          <StaggerContainer className="space-y-4" staggerDelay={0.15}>
            {features.map(({ key, icon: Icon }) => (
              <StaggerItem key={key}>
                <div className="group flex items-start gap-5 p-5 sm:p-6 rounded-2xl border transition-all duration-500 hover:shadow-lg hover:shadow-[#c9a84c]/5 border-gray-100 dark:border-white/5 bg-gray-50/50 dark:bg-white/[0.02] hover:border-[#c9a84c]/30 dark:hover:border-[#c9a84c]/20">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl flex-shrink-0 transition-all duration-300 group-hover:scale-110 bg-[#c9a84c]/10 group-hover:bg-[#c9a84c]/20">
                    <Icon className="h-6 w-6 text-[#c9a84c]" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold mb-1 group-hover:text-[#c9a84c] transition-colors duration-300 text-gray-900 dark:text-white">
                      {t[`speakFeature${key}Title` as keyof typeof t]}
                    </h3>
                    <p className="text-sm leading-relaxed text-gray-500 dark:text-gray-400">
                      {t[`speakFeature${key}Desc` as keyof typeof t]}
                    </p>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </div>
    </section>
  );
}
