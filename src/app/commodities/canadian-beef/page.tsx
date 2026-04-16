
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft } from 'lucide-react';
import { Footer } from '@/components/jhi/Footer';
import { ChatWidget } from '@/components/jhi/ChatWidget';
import { QuoteProductButton } from '@/components/jhi/QuoteProductButton';

type CanadianBeefProduct = {
  id: number;
  filename: string;
  name: string;
  description: string;
};

const products: CanadianBeefProduct[] = [
  {
      id: 1,
      filename: "1.Blade Pot Roast.jpeg",
      name: "Blade Pot Roast",
      description: "Tender blade cut perfect for slow-cooking and pot roasting. Rich marbling ensures flavorful, fall-apart results. Ideal for family dinners and traditional comfort food."
  },
  {
      id: 2,
      filename: "2.Bottom Blade Simmering Steak Boneless.jpeg",
      name: "Bottom Blade Simmering Steak Boneless",
      description: "Boneless bottom blade cut ideal for simmering and braising. Tender when cooked low and slow. Perfect for stews and hearty dishes."
  },
  {
      id: 3,
      filename: "3.Boneless Short Ribs.jpeg",
      name: "Boneless Short Ribs",
      description: "Premium boneless short ribs with excellent meat-to-bone ratio removed. Perfect for braising and slow roasting. Creates rich, tender results."
  },
  {
      id: 4,
      filename: "4.Brisket Double Point End Deckle.jpeg",
      name: "Brisket Double Point End Deckle",
      description: "Premium brisket cut with excellent marbling. Perfect for smoking, braising, or slow roasting. Delivers authentic, flavorful results."
  },
  {
      id: 5,
      filename: "5.Centre Cut Tenderloin Premium Oven Roast.jpeg",
      name: "Centre Cut Tenderloin Premium Oven Roast",
      description: "Premium centre-cut tenderloin for elegant roasting. Exceptionally tender and lean. Perfect for special occasions and premium presentations."
  },
  {
      id: 6,
      filename: "6.Eye of Round Marinating Steak.jpeg",
      name: "Eye of Round Marinating Steak",
      description: "Lean eye of round steak perfect for marinating. Tender when properly prepared. Excellent for grilling or pan-searing after marinating."
  },
  {
      id: 7,
      filename: "7.Eye of Round Oven Roast.jpeg",
      name: "Eye of Round Oven Roast",
      description: "Lean eye of round roast ideal for oven roasting. Consistent quality and uniform cooking. Great for family meals and meal prep."
  },
  {
      id: 8,
      filename: "8.Flank Marinating Steak C.jpeg",
      name: "Flank Marinating Steak C",
      description: "Flavorful flank steak perfect for marinating and grilling. Tender when sliced against the grain. Excellent for fajitas and stir-fry dishes."
  },
  {
      id: 9,
      filename: "9.Flank Marinating Steak A.jpeg",
      name: "Flank Marinating Steak A",
      description: "Premium flank steak ideal for marinating. Lean and flavorful. Perfect for grilling, fajitas, or Asian-inspired dishes."
  },
  {
      id: 10,
      filename: "10.Flank Marinating Steak B.jpeg",
      name: "Flank Marinating Steak B",
      description: "Quality flank steak for marinating and grilling. Great for fajitas and stir-fry. Tender when properly sliced against the grain."
  },
  {
      id: 11,
      filename: "11.Inside Round Oven Roast.jpeg",
      name: "Inside Round Oven Roast",
      description: "Lean inside round roast perfect for oven roasting. Tender and flavorful. Ideal for family dinners and traditional roasts."
  },
  {
      id: 12,
      filename: "12.Outside Round Marinating Steak.jpeg",
      name: "Outside Round Marinating Steak",
      description: "Lean outside round steak perfect for marinating. Becomes tender when properly prepared. Excellent for grilling or pan-searing."
  },
  {
      id: 13,
      filename: "13.Outside Round Oven Roast.jpeg",
      name: "Outside Round Oven Roast",
      description: "Lean outside round roast ideal for oven roasting. Consistent quality and uniform texture. Perfect for family meals and slicing."
  },
  {
      id: 14,
      filename: "14.Rib Eye Grilling Steak.jpeg",
      name: "Rib Eye Grilling Steak",
      description: "Premium rib eye steak with excellent marbling. Perfect for grilling to perfection. Delivers exceptional flavor and tenderness."
  },
  {
      id: 15,
      filename: "15.Rib Premium Oven Roast.jpeg",
      name: "Rib Premium Oven Roast",
      description: "Premium rib roast with excellent marbling and bone structure. Ideal for elegant oven roasting. Perfect for special occasions."
  },
  {
      id: 16,
      filename: "16.Short Tenderloin Premium Oven Roast.jpeg",
      name: "Short Tenderloin Premium Oven Roast",
      description: "Premium short tenderloin roast. Exceptionally tender and lean. Perfect for elegant presentations and special dinners."
  },
  {
      id: 17,
      filename: "17.Simmering Short Ribs.jpeg",
      name: "Simmering Short Ribs",
      description: "Meaty short ribs perfect for simmering and braising. Creates rich, flavorful broths and tender meat. Ideal for stews and slow-cooked dishes."
  },
  {
      id: 18,
      filename: "18.Sirloin Grilling Steak.jpeg",
      name: "Sirloin Grilling Steak",
      description: "Quality sirloin steak perfect for grilling. Lean with good flavor. Excellent for outdoor cooking and family barbecues."
  },
  {
      id: 19,
      filename: "19.Sirloin Tip Marinating Steak.jpeg",
      name: "Sirloin Tip Marinating Steak",
      description: "Lean sirloin tip steak perfect for marinating. Tender when properly prepared. Great for grilling or pan-searing after marinating."
  },
  {
      id: 20,
      filename: "20.Stewing Beef.jpeg",
      name: "Stewing Beef",
      description: "Premium stewing beef cut into perfect portions. Ideal for hearty stews, soups, and slow-cooked dishes. Creates rich, flavorful results."
  },
  {
      id: 21,
      filename: "21.Strip Loin Premium Oven Roast.jpeg",
      name: "Strip Loin Premium Oven Roast",
      description: "Premium strip loin roast with excellent tenderness. Perfect for elegant oven roasting. Ideal for special occasions and premium presentations."
  },
  {
      id: 22,
      filename: "22.T-Bone Grilling Steak.jpeg",
      name: "T-Bone Grilling Steak",
      description: "Classic T-bone steak with excellent marbling. Perfect for grilling. Combines tenderloin and strip loin in one premium cut."
  },
  {
      id: 23,
      filename: "23.Top Sirloin Grilling Steak.jpeg",
      name: "Top Sirloin Grilling Steak",
      description: "Premium top sirloin steak perfect for grilling. Lean with excellent flavor. Great for outdoor cooking and premium presentations."
  },
  {
      id: 24,
      filename: "24.Top Sirloin Premium Oven Roast.jpeg",
      name: "Top Sirloin Premium Oven Roast",
      description: "Premium top sirloin roast ideal for oven roasting. Lean and flavorful. Perfect for family dinners and elegant presentations."
  }
];

export default function CanadianBeefCommoditiesPage() {
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
                Canadian Beef Catalog
              </h1>
              <p className="mt-4 text-base sm:text-lg max-w-3xl mx-auto text-gray-500 dark:text-gray-400">
                Premium canadian beef cuts and by-products selected for global trade. Explore all available items and request a
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
                    <Image
                      src={`/images/canadian-beef/${encodeURIComponent(product.filename)}`}
                      alt={product.name}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-contain p-2 transition-transform duration-700 group-hover:scale-105"
                      priority={product.id <= 3}
                    />
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#c9a84c] via-[#e2c66d] to-[#c9a84c] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
                  </div>

                  <div className="p-5 sm:p-6">
                    <p className="text-xs uppercase tracking-[0.2em] text-[#c9a84c] mb-2">Producto #{product.id}</p>
                    <h2 className="text-lg sm:text-xl font-bold mb-2 text-gray-900 dark:text-white group-hover:text-[#c9a84c] transition-colors duration-300">
                      {product.name}
                    </h2>
                    <p className="text-sm leading-relaxed text-gray-500 dark:text-gray-400">{product.description}</p>
                    <QuoteProductButton commodityCategory="canadian-beef" commodityProduct={product.name} />
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
