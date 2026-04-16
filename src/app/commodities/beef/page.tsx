import fs from 'node:fs/promises';
import path from 'node:path';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Footer } from '@/components/jhi/Footer';
import { ChatWidget } from '@/components/jhi/ChatWidget';
import { QuoteProductButton } from '@/components/jhi/QuoteProductButton';

type BeefProduct = {
  id: number;
  filename: string;
  name: string;
  description: string;
};

async function getBeefProducts(): Promise<BeefProduct[]> {
  const filePath = path.join(process.cwd(), 'src', 'data', 'commodities', 'beef-products.json');
  const raw = await fs.readFile(filePath, 'utf-8');
  return JSON.parse(raw) as BeefProduct[];
}

export default async function BeefCommoditiesPage() {
  const products = await getBeefProducts();

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-[#0a0a0a]" suppressHydrationWarning>
      <main className="flex-1">
        <section className="pt-24 sm:pt-28 pb-14 sm:pb-20 bg-gradient-to-b from-[#f8f8f8] to-white dark:from-[#111111] dark:to-[#0a0a0a]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Link
              href="/#commodities"
              className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-[#c9a84c] transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Volver a commodities
            </Link>

            <div className="mt-8 sm:mt-10 text-center">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white">
                Beef Catalog
              </h1>
              <p className="mt-4 text-base sm:text-lg max-w-3xl mx-auto text-gray-500 dark:text-gray-400">
                Premium beef cuts and by-products selected for global trade. Explore all available items and request a
                quote with our team.
              </p>
              <div className="mt-6 h-1 w-20 mx-auto bg-gradient-to-r from-[#c9a84c] via-[#e2c66d] to-[#c9a84c] rounded-full" />
            </div>
          </div>
        </section>

        <section className="pb-20 sm:pb-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <article
                  key={product.id}
                  className="group relative overflow-hidden rounded-2xl border transition-all duration-500 hover:shadow-xl hover:shadow-[#c9a84c]/5 hover:-translate-y-1 border-gray-100 dark:border-white/5 bg-white dark:bg-[#1a1a1a] hover:border-[#c9a84c]/30 dark:hover:border-[#c9a84c]/20"
                >
                  <div className="relative h-56 overflow-hidden bg-white">
                    <img
                      src={`/images/beef/${encodeURIComponent(product.filename)}`}
                      alt={product.name}
                      className="w-full h-full object-contain p-2 transition-transform duration-700 group-hover:scale-105"
                      loading="lazy"
                    />
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#c9a84c] via-[#e2c66d] to-[#c9a84c] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
                  </div>

                  <div className="p-5 sm:p-6">
                    <p className="text-xs uppercase tracking-[0.2em] text-[#c9a84c] mb-2">Producto #{product.id}</p>
                    <h2 className="text-lg sm:text-xl font-bold mb-2 text-gray-900 dark:text-white group-hover:text-[#c9a84c] transition-colors duration-300">
                      {product.name}
                    </h2>
                    <p className="text-sm leading-relaxed text-gray-500 dark:text-gray-400">{product.description}</p>
                    <QuoteProductButton commodityCategory="beef" commodityProduct={product.name} />
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <ChatWidget />
    </div>
  );
}
