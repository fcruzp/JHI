'use client';

import React, { useState } from 'react';
import { getTranslation } from '@/lib/i18n';
import { useAppStore } from '@/lib/store';

export function FaqSection() {
  const { language } = useAppStore();
  const t = getTranslation(language);
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const faqs = [
    { q: t.faqQ1, a: t.faqA1 },
    { q: t.faqQ2, a: t.faqA2 },
    { q: t.faqQ3, a: t.faqA3 },
    { q: t.faqQ4, a: t.faqA4 },
    { q: t.faqQ5, a: t.faqA5 },
    { q: t.faqQ6, a: t.faqA6 },
    { q: t.faqQ7, a: t.faqA7 },
    { q: t.faqQ8, a: t.faqA8 },
    { q: t.faqQ9, a: t.faqA9 },
    { q: t.faqQ10, a: t.faqA10 },
  ];

  return (
    <section id="faq" className="py-20 bg-[#f8f8f8] dark:bg-[#111111] relative transition-colors duration-300">
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#c9a84c]/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#c9a84c]/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#c9a84c] via-[#e2c66d] to-[#c9a84c]">
            {t.faqTitle}
          </h2>
          <div className="mt-4 h-1 w-20 bg-gradient-to-r from-[#c9a84c] via-[#e2c66d] to-[#c9a84c] mx-auto rounded-full"></div>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div 
              key={index} 
              className="group bg-white dark:bg-[#1a1a1a] border border-gray-100 dark:border-white/5 rounded-xl shadow-sm hover:shadow-xl hover:shadow-[#c9a84c]/5 hover:border-[#c9a84c]/30 dark:hover:border-[#c9a84c]/20 hover:-translate-y-1 transition-all duration-300 overflow-hidden"
            >
              <button
                className="w-full px-6 py-5 text-left flex justify-between items-center focus:outline-none"
                onClick={() => toggleAccordion(index)}
              >
                <span className="font-semibold text-gray-900 dark:text-white pr-8 text-lg group-hover:text-[#c9a84c] transition-colors duration-300">
                  {faq.q}
                </span>
                <span className={`flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-xl bg-[#c9a84c]/10 text-[#c9a84c] transition-transform duration-300 ${openIndex === index ? 'rotate-180 bg-[#c9a84c]/20' : ''}`}>
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </span>
              </button>
              
              <div 
                className={`transition-all duration-300 ease-in-out ${
                  openIndex === index 
                    ? 'max-h-96 opacity-100 pb-5 px-6' 
                    : 'max-h-0 opacity-0 px-6'
                }`}
              >
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  {faq.a}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
