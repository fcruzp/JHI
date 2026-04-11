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
      <div className="text-4xl sm:text-5xl md:text-6xl font-bold text-[#c9a84c] mb-2">
        {isInView ? `${count}${suffix}` : value}
      </div>
      <div className="text-sm sm:text-base font-medium text-gray-500 dark:text-gray-400">
        {label}
      </div>
    </div>
  );
}

// Static animation values to avoid Math.random() hydration mismatch
const mapDots = [
  // North America
  { x: 140, y: 120, dur: 2.5, begin: 0.3 },
  { x: 160, y: 110, dur: 3.2, begin: 0.8 },
  { x: 180, y: 130, dur: 2.8, begin: 1.2 },
  { x: 150, y: 150, dur: 3.5, begin: 0.5 },
  { x: 170, y: 140, dur: 2.3, begin: 1.6 },
  { x: 130, y: 140, dur: 3.0, begin: 0.1 },
  { x: 160, y: 160, dur: 2.7, begin: 1.8 },
  { x: 190, y: 120, dur: 3.8, begin: 0.7 },
  // South America
  { x: 200, y: 220, dur: 2.6, begin: 1.1 },
  { x: 210, y: 250, dur: 3.4, begin: 0.4 },
  { x: 220, y: 270, dur: 2.9, begin: 1.5 },
  { x: 190, y: 240, dur: 3.1, begin: 0.9 },
  { x: 200, y: 280, dur: 2.4, begin: 1.9 },
  { x: 215, y: 230, dur: 3.6, begin: 0.6 },
  { x: 205, y: 260, dur: 2.2, begin: 1.3 },
  // Europe
  { x: 370, y: 100, dur: 3.3, begin: 0.2 },
  { x: 390, y: 90, dur: 2.5, begin: 1.7 },
  { x: 380, y: 110, dur: 3.9, begin: 0.8 },
  { x: 400, y: 100, dur: 2.7, begin: 1.4 },
  { x: 410, y: 120, dur: 3.2, begin: 0.5 },
  { x: 360, y: 120, dur: 2.8, begin: 1.0 },
  { x: 395, y: 115, dur: 3.5, begin: 0.3 },
  // Africa
  { x: 380, y: 190, dur: 2.3, begin: 1.6 },
  { x: 390, y: 220, dur: 3.7, begin: 0.7 },
  { x: 400, y: 240, dur: 2.6, begin: 1.2 },
  { x: 370, y: 210, dur: 3.4, begin: 0.4 },
  { x: 385, y: 250, dur: 2.9, begin: 1.8 },
  { x: 395, y: 200, dur: 3.1, begin: 0.9 },
  { x: 410, y: 230, dur: 2.4, begin: 1.5 },
  // Asia
  { x: 480, y: 110, dur: 3.6, begin: 0.6 },
  { x: 520, y: 100, dur: 2.8, begin: 1.3 },
  { x: 550, y: 120, dur: 3.3, begin: 0.2 },
  { x: 500, y: 130, dur: 2.5, begin: 1.7 },
  { x: 530, y: 110, dur: 3.0, begin: 0.8 },
  { x: 560, y: 140, dur: 2.7, begin: 1.1 },
  { x: 490, y: 150, dur: 3.8, begin: 0.4 },
  { x: 540, y: 150, dur: 2.2, begin: 1.9 },
  { x: 510, y: 100, dur: 3.5, begin: 0.5 },
  { x: 570, y: 130, dur: 2.9, begin: 1.4 },
  { x: 580, y: 110, dur: 3.2, begin: 0.3 },
  { x: 470, y: 130, dur: 2.6, begin: 1.6 },
  // Australia
  { x: 600, y: 280, dur: 3.1, begin: 0.7 },
  { x: 620, y: 290, dur: 2.4, begin: 1.2 },
  { x: 630, y: 270, dur: 3.7, begin: 0.1 },
  { x: 610, y: 300, dur: 2.8, begin: 1.8 },
  { x: 640, y: 280, dur: 3.4, begin: 0.5 },
  // Middle East
  { x: 440, y: 160, dur: 2.5, begin: 1.0 },
  { x: 450, y: 170, dur: 3.3, begin: 0.6 },
  { x: 460, y: 150, dur: 2.9, begin: 1.5 },
  { x: 430, y: 180, dur: 3.6, begin: 0.2 },
];

const connectionLines = [
  [180, 130, 370, 100],
  [370, 100, 520, 100],
  [200, 220, 380, 190],
  [520, 100, 600, 280],
  [390, 90, 480, 110],
];

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
      className="relative py-20 sm:py-28 overflow-hidden bg-gradient-to-b from-white via-[#fafafa] to-white dark:from-[#0a0a0a] dark:via-[#0d0d0d] dark:to-[#0a0a0a]"
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
        <ScrollAnimation className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 text-gray-900 dark:text-white">
            {t.globalReachTitle}
          </h2>
          <p className="text-lg max-w-2xl mx-auto text-gray-500 dark:text-gray-400">
            {t.globalReachSubtitle}
          </p>
          <div className="mt-6 h-1 w-20 mx-auto bg-gradient-to-r from-[#c9a84c] via-[#e2c66d] to-[#c9a84c] rounded-full" />
        </ScrollAnimation>

        {/* World Map SVG */}
        <ScrollAnimation delay={0.2} className="mb-16">
          <div className="relative flex justify-center">
            <svg
              viewBox="0 0 800 400"
              className="w-full max-w-3xl opacity-20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Simplified world map dots with static animation values */}
              {mapDots.map(({ x, y, dur, begin }, i) => (
                <circle
                  key={i}
                  cx={x}
                  cy={y}
                  r={3}
                  fill="#c9a84c"
                  opacity={0.6}
                >
                  <animate
                    attributeName="opacity"
                    values="0.3;0.8;0.3"
                    dur={`${dur}s`}
                    begin={`${begin}s`}
                    repeatCount="indefinite"
                  />
                </circle>
              ))}
              {/* Connection lines */}
              {connectionLines.map(([x1, y1, x2, y2], i) => (
                <line
                  key={`line-${i}`}
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  stroke="#c9a84c"
                  strokeWidth="0.5"
                  opacity="0.2"
                  strokeDasharray="4 4"
                >
                  <animate
                    attributeName="stroke-dashoffset"
                    values="0;8"
                    dur="2s"
                    repeatCount="indefinite"
                  />
                </line>
              ))}
            </svg>
          </div>
        </ScrollAnimation>

        {/* Statistics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 rounded-2xl p-6 sm:p-8 border border-gray-100 dark:border-white/5 bg-white/80 dark:bg-white/[0.02]">
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
