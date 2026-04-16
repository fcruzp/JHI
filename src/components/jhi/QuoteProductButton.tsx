'use client';

import { useRouter } from 'next/navigation';
import { useAppStore } from '@/lib/store';

type QuoteProductButtonProps = {
  commodityCategory: string;
  commodityProduct: string;
};

export function QuoteProductButton({ commodityCategory, commodityProduct }: QuoteProductButtonProps) {
  const router = useRouter();
  const { setPendingQuoteSelection } = useAppStore();

  const handleClick = () => {
    setPendingQuoteSelection({ commodityCategory, commodityProduct });
    router.push('/#contact');
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className="inline-flex mt-4 items-center justify-center rounded-lg px-4 py-2 text-sm font-semibold bg-[#c9a84c] hover:bg-[#b8973f] text-[#0a0a0a] transition-colors"
    >
      Cotizar
    </button>
  );
}
