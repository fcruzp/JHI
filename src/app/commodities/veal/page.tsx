import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft } from 'lucide-react';
import { Footer } from '@/components/jhi/Footer';
import { ChatWidget } from '@/components/jhi/ChatWidget';
import { QuoteProductButton } from '@/components/jhi/QuoteProductButton';

type VealProduct = {
  id: number;
  filename: string;
  name: string;
  description: string;
};

const products: VealProduct[] = [
  { id: 1, filename: "1.Forequater.jpeg", name: "Forequater", description: "Complete forequarter cut including shoulder, chuck, and foreshank. Versatile for various cooking methods. Excellent for roasting, braising, or grinding." },
  { id: 2, filename: "2.Triangle.jpeg", name: "Triangle", description: "Tender triangle cut from the shoulder area. Perfect for roasting or braising. Delicate flavor and tender texture ideal for veal preparations." },
  { id: 3, filename: "3.Hindquater.jpeg", name: "Hindquarter", description: "Complete hindquarter including leg, loin, and sirloin. Premium cuts perfect for elegant presentations. Versatile for roasting, grilling, or specialty dishes." },
  { id: 4, filename: "4.Rack 7 Ribs.jpeg", name: "Rack 7 Ribs", description: "Seven-rib rack with excellent bone structure. Perfect for roasting or grilling. Creates an elegant presentation for special occasions." },
  { id: 5, filename: "5.Rack.jpeg", name: "Rack", description: "Premium veal rack with tender meat and delicate bones. Ideal for elegant roasting. Perfect for fine dining presentations." },
  { id: 6, filename: "6.Rack Ribeye Roll.jpeg", name: "Rack Ribeye Roll", description: "Boneless ribeye roll from the rack section. Tender and flavorful. Perfect for roasting or slicing into premium steaks." },
  { id: 7, filename: "7.Ribeye Boneless.jpeg", name: "Ribeye Boneless", description: "Boneless ribeye cut with excellent tenderness. Perfect for grilling, pan-searing, or roasting. Premium quality for special dishes." },
  { id: 8, filename: "8.Echuck Roll.jpeg", name: "E-chuck Roll", description: "Boneless chuck roll from the shoulder. Tender and flavorful. Ideal for roasting or braising. Great for elegant presentations." },
  { id: 9, filename: "9.Chuck Shoulder Clod.jpeg", name: "Chuck Shoulder Clod", description: "Lean shoulder clod cut. Perfect for roasting or braising. Tender when cooked properly. Excellent for family meals." },
  { id: 10, filename: "10.Chuck Tender.jpeg", name: "Chuck Tender", description: "Tender chuck cut ideal for grilling or pan-searing. Delicate flavor and tender texture. Perfect for premium veal dishes." },
  { id: 11, filename: "11.Foreshank.jpeg", name: "Foreshank", description: "Foreshank with bone. Perfect for braising, stewing, or making rich stocks. Creates flavorful, tender results when cooked low and slow." },
  { id: 12, filename: "12.Loin Block.jpeg", name: "Loin Block", description: "Complete loin block with excellent tenderness. Versatile for roasting, grilling, or portioning into steaks. Premium quality throughout." },
  { id: 13, filename: "13.Loin Trimmed.jpeg", name: "Loin Trimmed", description: "Pre-trimmed loin cut ready for cooking. Excellent tenderness and lean meat. Perfect for elegant roasting or grilling." },
  { id: 14, filename: "14.Leg Shank Off.jpeg", name: "Leg Shank Off", description: "Leg cut with shank removed. Tender and lean. Perfect for roasting or portioning into steaks. Excellent for premium presentations." },
  { id: 15, filename: "15.Trimmed Sirloin Butt.jpeg", name: "Trimmed Sirloin Butt", description: "Pre-trimmed sirloin butt. Lean and tender. Perfect for roasting or grilling. Excellent for elegant veal dishes." },
  { id: 16, filename: "16.Striploin Boneless.jpeg", name: "Striploin Boneless", description: "Premium boneless striploin. Tender and lean. Perfect for grilling, pan-searing, or roasting. Consistent quality throughout." },
  { id: 17, filename: "17.Short Tenderloin.jpeg", name: "Short Tenderloin", description: "Short tenderloin cut. Exceptionally tender and lean. Perfect for premium steaks or elegant roasting. Premium quality." },
  { id: 18, filename: "18.Leg Top Round.jpeg", name: "Leg Top Round", description: "Lean top round from the leg. Perfect for roasting or portioning into steaks. Tender and flavorful when properly prepared." },
  { id: 19, filename: "18.Stew Meat.jpeg", name: "Stew Meat", description: "Premium veal cut into perfect stew portions. Ideal for hearty stews and braised dishes. Creates tender, flavorful results." },
  { id: 20, filename: "20.Ground Veal.jpeg", name: "Ground Veal", description: "Premium ground veal. Perfect for meatballs, burgers, or specialty dishes. Lean and flavorful for various culinary applications." },
  { id: 21, filename: "21.Cube Steak.jpeg", name: "Cube Steak", description: "Tenderized cube steak. Perfect for quick cooking methods. Ideal for pan-frying or breading. Tender and flavorful." },
  { id: 22, filename: "22.Rib Chops French Style.jpeg", name: "Rib Chops French Style", description: "Premium rib chops with French-style presentation. Elegant and tender. Perfect for grilling or pan-searing. Premium quality." }
];

export default function VealCommoditiesPage() {
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
                Veal Catalog
              </h1>
              <p className="mt-4 text-base sm:text-lg max-w-3xl mx-auto text-gray-500 dark:text-gray-400">
                Premium veal cuts selected for global trade. Explore all available items and request a
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
                      src={`/images/veal/${encodeURIComponent(product.filename)}`}
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
                    <QuoteProductButton commodityCategory="veal" commodityProduct={product.name} />
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
