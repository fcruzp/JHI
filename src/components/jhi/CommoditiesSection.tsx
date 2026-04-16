'use client';

import Link from 'next/link';
import { useAppStore } from '@/lib/store';
import { getTranslation } from '@/lib/i18n';
import { StaggerContainer, StaggerItem } from './ScrollAnimations';

interface Commodity {
  key: string;
  image: string;
  href?: string;
}

const commodities: Commodity[] = [
  { key: 'Pork', image: '/images/commodities/pork.jpg', href: '/commodities/pork' },
  { key: 'Beef', image: '/images/commodities/beef.jpg', href: '/commodities/beef' },
  { key: 'CanadianBeef', image: '/images/commodities/canadian-beef.jpg' },
  { key: 'Veal', image: '/images/commodities/veal.jpg' },
  { key: 'Lamb', image: '/images/commodities/lamb.jpg' },
  { key: 'Poultry', image: '/images/commodities/poultry.jpg' },
  { key: 'Fish', image: '/images/commodities/fish.jpg' },
  { key: 'Dairy', image: '/images/commodities/dairy.jpg' },
  { key: 'GrainsOthers', image: '/images/commodities/grains-others.jpg' },
];

export function CommoditiesSection() {
  const { language } = useAppStore();
  const t = getTranslation(language);

  return (
    <section
      id="commodities"
      className="py-20 sm:py-28 bg-[#f8f8f8] dark:bg-[#111111]"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 text-gray-900 dark:text-white">
            {t.commoditiesTitle}
          </h2>
          <p className="text-lg max-w-2xl mx-auto text-gray-500 dark:text-gray-400">
            {t.commoditiesSubtitle}
          </p>
          <div className="mt-6 h-1 w-20 mx-auto bg-gradient-to-r from-[#c9a84c] via-[#e2c66d] to-[#c9a84c] rounded-full" />
        </div>

        {/* Commodities Grid */}
        <StaggerContainer className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6" staggerDelay={0.1}>
          {commodities.map(({ key, image, href }) => (
            <StaggerItem key={key}>
              <div className="group relative overflow-hidden rounded-2xl border transition-all duration-500 hover:shadow-xl hover:shadow-[#c9a84c]/5 hover:-translate-y-1 border-gray-100 dark:border-white/5 bg-white dark:bg-[#1a1a1a] hover:border-[#c9a84c]/30 dark:hover:border-[#c9a84c]/20">
                {/* Image */}
                <div className="relative h-48 sm:h-56 overflow-hidden">
                  <img
                    src={image}
                    alt={t[`commodity${key}Name` as keyof typeof t]}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  {/* Overlay on hover */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  {/* Gold accent line */}
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#c9a84c] via-[#e2c66d] to-[#c9a84c] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
                </div>

                {/* Content */}
                <div className="p-5 sm:p-6">
                  <h3 className="text-lg sm:text-xl font-bold mb-2 group-hover:text-[#c9a84c] transition-colors duration-300 text-gray-900 dark:text-white">
                    {t[`commodity${key}Name` as keyof typeof t]}
                  </h3>
                  <p className="text-sm leading-relaxed text-gray-500 dark:text-gray-400">
                    {t[`commodity${key}Desc` as keyof typeof t]}
                  </p>
                </div>
                {href && (
                  <Link
                    href={href}
                    aria-label={t[`commodity${key}Name` as keyof typeof t]}
                    className="absolute inset-0 z-10"
                  />
                )}
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
