'use client';

import { useEffect, useRef, useState } from 'react';
import { useInView } from 'framer-motion';
import { useAppStore } from '@/lib/store';
import { getTranslation } from '@/lib/i18n';
import { ScrollAnimation } from './ScrollAnimations';

interface StatItemProps {
  value: string;
  label: string;
  numericValue: number;
  suffix: string;
}

function StatItem({ value, label, numericValue, suffix }: StatItemProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isInView) return;

    let start = 0;
    const duration = 2000;
    const increment = numericValue / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= numericValue) {
        setCount(numericValue);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);

    return () => clearInterval(timer);
  }, [isInView, numericValue]);

  return (
    <div ref={ref} className="text-center p-6">
      <div className="text-4xl sm:text-5xl md:text-6xl font-bold text-[#c9a84c] mb-2 drop-shadow-md">
        {isInView ? `${count}${suffix}` : value}
      </div>
      <div className="text-sm sm:text-base font-medium text-gray-500 dark:text-gray-400">
        {label}
      </div>
    </div>
  );
}

export function GlobalReachSection() {
  const { language } = useAppStore();
  const t = getTranslation(language);

  const stats = [
    { key: 'Countries', numericValue: 50, suffix: '+' },
    { key: 'Volume', numericValue: 2, suffix: 'B+' },
    { key: 'Years', numericValue: 15, suffix: '+' },
    { key: 'Partners', numericValue: 200, suffix: '+' },
  ];

  return (
    <section
      id="global-reach"
      className="relative py-20 sm:py-28 overflow-hidden bg-gradient-to-b from-white via-[#fafafa] to-white dark:from-[#0a0a0a] dark:via-[#111111] dark:to-[#0a0a0a]"
    >
      {/* Subtle grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, #c9a84c 1px, transparent 0)',
          backgroundSize: '40px 40px',
        }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <ScrollAnimation className="text-center mb-16 relative z-20">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 text-gray-900 dark:text-white drop-shadow-sm">
            {t.globalReachTitle}
          </h2>
          <p className="text-lg max-w-2xl mx-auto text-gray-500 dark:text-gray-400">
            {t.globalReachSubtitle}
          </p>
          <div className="mt-6 h-1 w-20 mx-auto bg-gradient-to-r from-[#c9a84c] via-[#e2c66d] to-[#c9a84c] rounded-full shadow-[0_0_10px_rgba(201,168,76,0.5)]" />
        </ScrollAnimation>

        {/* Premium Dotted Map Visualization */}
        <ScrollAnimation delay={0.2} className="mb-20">
          <div className="relative w-full aspect-[2/1] max-w-5xl mx-auto flex justify-center items-center overflow-visible">
            
            {/* World Map Mask Layer */}
            <div 
              className="absolute inset-0 z-10 transition-transform duration-1000 ease-in-out hover:scale-105"
              style={{
                WebkitMaskImage: 'url("/world-map-mask.svg")',
                WebkitMaskSize: 'contain',
                WebkitMaskPosition: 'center',
                WebkitMaskRepeat: 'no-repeat',
                maskImage: 'url("/world-map-mask.svg")',
                maskSize: 'contain',
                maskPosition: 'center',
                maskRepeat: 'no-repeat',
                filter: 'drop-shadow(0px 0px 4px rgba(201, 168, 76, 0.4)) blur(0.5px)',
              }}
            >
              {/* Dot Grid Mask Layer */}
              <div 
                className="absolute inset-0"
                style={{
                  WebkitMaskImage: 'radial-gradient(circle, black 1.5px, transparent 1.5px)',
                  WebkitMaskSize: '10px 10px',
                  maskImage: 'radial-gradient(circle, black 1.5px, transparent 1.5px)',
                  maskSize: '10px 10px',
                }}
              >
                {/* Base color for dots */}
                <div className="absolute inset-0 bg-[#c9a84c]/20 dark:bg-[#c9a84c]/30" />
                
                {/* Animated glowing orbs behind dots for a dynamic "breathing" effect */}
                <div className="absolute inset-0">
                  <div className="absolute top-[20%] left-[20%] w-[40%] h-[40%] bg-[#e2c66d] rounded-full mix-blend-screen filter blur-[60px] animate-[pulse_6s_ease-in-out_infinite]" />
                  <div className="absolute top-[30%] right-[20%] w-[50%] h-[50%] bg-[#c9a84c] rounded-full mix-blend-screen filter blur-[80px] animate-[pulse_7s_ease-in-out_infinite] [animation-delay:2s]" />
                  <div className="absolute bottom-[20%] left-[30%] w-[45%] h-[45%] bg-[#f0d060] rounded-full mix-blend-screen filter blur-[70px] animate-[pulse_5s_ease-in-out_infinite] [animation-delay:1s]" />
                  
                  {/* Slow sweeping gradient for extra premium feel */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-[#ffffff]/20 to-transparent dark:via-[#ffffff]/10 animate-[spin_10s_linear_infinite] scale-[2]" />
                </div>
              </div>
            </div>

            {/* Connecting abstract lines (simulated) that float over the map */}
            <div className="absolute inset-0 z-20 pointer-events-none opacity-40 mix-blend-screen filter blur-[1px]">
               <svg viewBox="0 0 1000 500" className="w-full h-full" preserveAspectRatio="xMidYMid meet">
                  <path d="M 250 150 Q 400 50 600 150" fill="none" stroke="#c9a84c" strokeWidth="1" strokeDasharray="4 4" className="animate-[pulse_3s_infinite_ease-in-out]" />
                  <path d="M 300 300 Q 450 400 550 200" fill="none" stroke="#e2c66d" strokeWidth="1" strokeDasharray="3 6" className="animate-[pulse_4s_infinite_ease-in-out] [animation-delay:1s]" />
                  <path d="M 600 150 Q 750 200 850 350" fill="none" stroke="#f0d060" strokeWidth="1.5" strokeDasharray="2 8" className="animate-[pulse_5s_infinite_ease-in-out] [animation-delay:2s]" />
               </svg>
            </div>
            
          </div>
        </ScrollAnimation>

        {/* Statistics */}
        <div className="relative z-20 grid grid-cols-2 lg:grid-cols-4 gap-6 rounded-2xl p-6 sm:p-8 border border-gray-100 dark:border-white/5 bg-white/80 dark:bg-black/40 backdrop-blur-md shadow-xl transition-transform hover:-translate-y-1 duration-300">
          {stats.map(({ key, numericValue, suffix }) => (
            <StatItem
              key={key}
              value={t[`stat${key}` as keyof typeof t]}
              label={t[`stat${key}Label` as keyof typeof t]}
              numericValue={numericValue}
              suffix={suffix}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
