import { Linkedin, Twitter } from 'lucide-react';
import Image from 'next/image';
import { getTranslationServer } from '@/lib/i18n-server';
import { cookies } from 'next/headers';

const navItems = [
  { key: 'headerAbout', href: '#about' },
  { key: 'headerCommodities', href: '#commodities' },
  { key: 'headerGlobalReach', href: '#global-reach' },
  { key: 'headerWhyJhi', href: '#why-jhi' },
  { key: 'headerSpeak', href: '#speak-with-team' },
  { key: 'headerContact', href: '#contact' },
];

export async function Footer() {
  const cookieStore = await cookies();
  const language = cookieStore.get('language')?.value || 'es';
  const t = getTranslationServer(language);

  const year = new Date().getFullYear();

  return (
    <footer className="border-t mt-auto bg-white dark:bg-[#0a0a0a] border-gray-100 dark:border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company info */}
          <div className="sm:col-span-2 lg:col-span-1">
            <div className="relative h-11 aspect-square mb-6 block dark:hidden rounded-lg border-2 border-[#c9a84c]/50 bg-black/5 p-1 shadow-sm overflow-hidden">
              <Image
                src="/images/logo-light.png"
                alt="J Huge International"
                fill
                className="object-contain"
              />
            </div>
            <div className="relative h-11 aspect-square mb-6 hidden dark:block rounded-lg border-2 border-[#c9a84c]/50 bg-white/5 p-1 shadow-sm overflow-hidden">
              <Image
                src="/images/logo-dark.png"
                alt="J Huge International"
                fill
                className="object-contain"
              />
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {t.heroSubtitle}
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="font-semibold text-sm mb-4 text-gray-900 dark:text-white">
              {t.footerNav}
            </h4>
            <ul className="space-y-2">
              {navItems.map((item) => (
                <li key={item.key}>
                  <a
                    href={item.href}
                    className="text-sm transition-colors duration-200 hover:text-[#c9a84c] text-gray-500 dark:text-gray-400"
                  >
                    {t[item.key as keyof typeof t]}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Social */}
          <div>
            <h4 className="font-semibold text-sm mb-4 text-gray-900 dark:text-white">
              {t.footerFollow}
            </h4>
            <div className="flex gap-3">
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 hover:bg-[#c9a84c]/10 hover:text-[#c9a84c] bg-gray-100 dark:bg-white/5 text-gray-500 dark:text-gray-400"
                aria-label="LinkedIn"
              >
                <Linkedin className="h-4 w-4" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 hover:bg-[#c9a84c]/10 hover:text-[#c9a84c] bg-gray-100 dark:bg-white/5 text-gray-500 dark:text-gray-400"
                aria-label="Twitter"
              >
                <Twitter className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Language */}
          <div>
            <h4 className="font-semibold text-sm mb-4 text-gray-900 dark:text-white">
              {t.footerLang}
            </h4>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              EN | ES | 中文
            </p>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-10 pt-6 border-t text-center border-gray-100 dark:border-white/5">
          <p className="text-sm text-gray-400 dark:text-gray-500">
            {t.footerCopyright.replace('{year}', year.toString())}
          </p>
        </div>
      </div>
    </footer>
  );
}
