import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft } from 'lucide-react';
import { Footer } from '@/components/jhi/Footer';
import { ChatWidget } from '@/components/jhi/ChatWidget';
import { QuoteProductButton } from '@/components/jhi/QuoteProductButton';

type LambProduct = {
  id: number;
  filename: string;
  name: string;
  description: string;
};

const products: LambProduct[] = [
  { id: 1, filename: "1.Rack Roast Ready.jpeg", name: "Rack Roast Ready", description: "Premium rack roast pre-trimmed and ready for cooking. Perfect for elegant oven roasting. Creates a stunning presentation for special occasions." },
  { id: 2, filename: "2.Ribeye Roll.jpeg", name: "Ribeye Roll", description: "Boneless ribeye roll with excellent tenderness. Perfect for roasting or slicing into premium steaks. Consistent quality throughout." },
  { id: 3, filename: "3.Shoulder Square Cut.jpeg", name: "Shoulder Square Cut", description: "Square-cut shoulder section. Versatile for roasting, braising, or grinding. Great for traditional lamb dishes and family meals." },
  { id: 4, filename: "4.Shoulder Boneless.jpeg", name: "Shoulder Boneless", description: "Boneless shoulder cut with excellent flavor. Perfect for roasting, braising, or grinding. Lean and tender when properly prepared." },
  { id: 5, filename: "5.Breast.jpeg", name: "Breast", description: "Lamb breast with bone. Perfect for braising or stewing. Creates rich, flavorful dishes when cooked low and slow." },
  { id: 6, filename: "6.Rib Breast Bone Off.jpeg", name: "Rib Breast Bone Off", description: "Boneless rib breast cut. Tender and flavorful. Perfect for braising, stewing, or specialty preparations." },
  { id: 7, filename: "7.Foreshank.jpeg", name: "Foreshank", description: "Foreshank with bone. Perfect for braising, stewing, or making rich stocks. Creates tender, flavorful results when cooked slowly." },
  { id: 8, filename: "8.Leg Hindshank.jpeg", name: "Leg Hindshank", description: "Leg with hindshank attached. Perfect for roasting or braising. Excellent for traditional lamb preparations." },
  { id: 9, filename: "9.Loin Double Boneless.jpeg", name: "Loin Double Boneless", description: "Premium double boneless loin. Exceptionally tender and lean. Perfect for elegant roasting or portioning into premium steaks." },
  { id: 10, filename: "10.Short Tenderloin.jpeg", name: "Short Tenderloin", description: "Short tenderloin cut. Exceptionally tender and lean. Perfect for premium steaks or elegant roasting. Premium quality." },
  { id: 11, filename: "11.Lamb Leg.jpeg", name: "Lamb Leg", description: "Complete lamb leg. Versatile for roasting, grilling, or portioning. Excellent for traditional and contemporary preparations." },
  { id: 12, filename: "12.Leg Trotter Leg.jpeg", name: "Leg Trotter Leg", description: "Leg with trotter attached. Perfect for roasting or braising. Creates elegant presentations for special dinners." },
  { id: 13, filename: "13.Leg.jpeg", name: "Leg", description: "Premium lamb leg. Perfect for roasting, grilling, or slicing. Tender and flavorful for various cooking methods." },
  { id: 14, filename: "14.Leg Bottom Boneless.jpeg", name: "Leg Bottom Boneless", description: "Boneless bottom leg cut. Lean and tender. Perfect for roasting or portioning into steaks. Excellent for elegant presentations." },
  { id: 15, filename: "15.Leg Knuckle.jpeg", name: "Leg Knuckle", description: "Leg knuckle section. Perfect for braising, stewing, or grinding. Creates flavorful, tender results when cooked properly." },
  { id: 16, filename: "16.Top Sirloin.jpeg", name: "Top Sirloin", description: "Premium top sirloin cut. Lean with excellent flavor. Perfect for grilling, roasting, or portioning into steaks." },
  { id: 17, filename: "17.Stew Lamb.jpeg", name: "Stew Lamb", description: "Premium lamb cut into perfect stew portions. Ideal for hearty stews and braised dishes. Creates tender, flavorful results." },
  { id: 18, filename: "18.Ground Lamb.jpeg", name: "Ground Lamb", description: "Premium ground lamb. Perfect for meatballs, burgers, or specialty dishes. Lean and flavorful for various culinary applications." },
  { id: 19, filename: "19.Tongue.jpeg", name: "Tongue", description: "Lamb tongue. Delicacy in many cuisines. Tender when properly prepared. Excellent for braising, boiling, or specialty dishes." },
  { id: 20, filename: "20.Hearts.jpeg", name: "Hearts", description: "Lamb hearts. Lean, flavorful organ meat. Perfect for grinding into sausages, stewing, or specialty preparations. Tender when cooked properly." },
  { id: 21, filename: "21.Tripe.jpeg", name: "Tripe", description: "Lamb tripe. Traditional ingredient in many cuisines. Perfect for stewing, braising, or specialty preparations. Requires proper cooking." },
  { id: 22, filename: "22.Kabobs.jpeg", name: "Kabobs", description: "Lamb cut into perfect kabob portions. Ideal for skewering and grilling. Creates delicious, flavorful results." },
  { id: 23, filename: "23.Loin Chops.jpeg", name: "Loin Chops", description: "Premium loin chops. Tender and lean. Perfect for grilling, pan-searing, or quick cooking methods. Excellent flavor." },
  { id: 24, filename: "24.Rib Chops.jpeg", name: "Rib Chops", description: "Premium rib chops with excellent marbling. Perfect for grilling or pan-searing. Creates elegant presentations for special meals." }
];

export default function LambCommoditiesPage() {
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
                Lamb Catalog
              </h1>
              <p className="mt-4 text-base sm:text-lg max-w-3xl mx-auto text-gray-500 dark:text-gray-400">
                Premium lamb cuts selected for global trade. Explore all available items and request a
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
                      src={`/images/lamb/${encodeURIComponent(product.filename)}`}
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
                    <QuoteProductButton commodityCategory="lamb" commodityProduct={product.name} />
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
