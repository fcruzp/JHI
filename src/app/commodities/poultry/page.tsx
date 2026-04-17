import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft } from 'lucide-react';
import { Footer } from '@/components/jhi/Footer';
import { ChatWidget } from '@/components/jhi/ChatWidget';
import { QuoteProductButton } from '@/components/jhi/QuoteProductButton';

type PoultryProduct = {
  id: number;
  filename: string;
  name: string;
  description: string;
};

const products: PoultryProduct[] = [
  { id: 1, filename: "1.Chicken 2 Joint Wing.jpeg", name: "Chicken 2 Joint Wing", description: "Two-joint chicken wing with excellent meat coverage. Perfect for grilling, frying, or baking. Popular choice for wings and appetizers." },
  { id: 2, filename: "2.Chicken Breast.jpeg", name: "Chicken Breast", description: "Boneless, skinless chicken breast. Lean and versatile. Perfect for grilling, pan-searing, or baking. Ideal for healthy meals." },
  { id: 3, filename: "3.Chicken Breast Bone In Skin On.jpeg", name: "Chicken Breast Bone In Skin On", description: "Bone-in, skin-on chicken breast. Flavorful and juicy. Perfect for roasting or grilling. Excellent for traditional preparations." },
  { id: 4, filename: "4.Chicken Feet.jpeg", name: "Chicken Feet", description: "Chicken feet. Traditional ingredient in many cuisines. Perfect for making rich stocks and broths. Adds collagen and flavor." },
  { id: 5, filename: "5.Chicken Fronts.jpeg", name: "Chicken Fronts", description: "Chicken front quarters. Versatile cut with breast and wings. Perfect for roasting, grilling, or portioning." },
  { id: 6, filename: "6.Chicken Gizzards.jpeg", name: "Chicken Gizzards", description: "Chicken gizzards. Lean organ meat with unique texture. Perfect for stewing, grilling, or specialty dishes." },
  { id: 7, filename: "7.Chicken Leg Quarter.jpeg", name: "Chicken Leg Quarter", description: "Chicken leg quarter with thigh and drumstick. Flavorful and juicy. Perfect for grilling, baking, or roasting." },
  { id: 8, filename: "8.Chicken Livers.jpeg", name: "Chicken Livers", description: "Chicken livers. Nutrient-dense organ meat. Perfect for pâtés, sautéing, or specialty dishes. Rich flavor." },
  { id: 9, filename: "9.Chicken Skin.jpeg", name: "Chicken Skin", description: "Chicken skin. Perfect for rendering fat or making crispy toppings. Traditional ingredient in many cuisines." },
  { id: 10, filename: "10.Chicken Tails.jpeg", name: "Chicken Tails", description: "Chicken tail pieces. Flavorful with good fat content. Perfect for stocks, broths, or grilling." },
  { id: 11, filename: "11.Chicken Thight.jpeg", name: "Chicken Thigh", description: "Boneless, skinless chicken thigh. Flavorful and juicy. Perfect for grilling, baking, or stewing." },
  { id: 12, filename: "12.Chicken Trimmings.jpeg", name: "Chicken Trimmings", description: "Chicken trimmings. Perfect for grinding, stocks, or specialty preparations. Economical option." },
  { id: 13, filename: "13.Chicken Whole Legs.jpeg", name: "Chicken Whole Legs", description: "Whole chicken legs with thigh and drumstick. Versatile for grilling, baking, or roasting. Excellent value." },
  { id: 14, filename: "14.Chicken Whole Wings.jpeg", name: "Chicken Whole Wings", description: "Whole chicken wings. Perfect for grilling, frying, or baking. Popular for wings and appetizers." },
  { id: 15, filename: "15.Chicken Inner Fillet.jpeg", name: "Chicken Inner Fillet", description: "Chicken inner fillet. Tender and lean. Perfect for quick cooking methods. Ideal for stir-fry or pan-searing." },
  { id: 16, filename: "16.Chicken Leg Hen.jpeg", name: "Chicken Leg Hen", description: "Chicken leg from hen. Flavorful and juicy. Perfect for grilling, baking, or braising." },
  { id: 17, filename: "17.Chicken Mid Joint Wings.jpeg", name: "Chicken Mid Joint Wings", description: "Mid-joint chicken wings. Excellent meat coverage. Perfect for grilling, frying, or baking." },
  { id: 18, filename: "18.Necks.jpeg", name: "Necks", description: "Chicken necks. Perfect for making rich stocks and broths. Traditional ingredient in many cuisines." },
  { id: 19, filename: "19.Chicken Hearts.jpeg", name: "Chicken Hearts", description: "Chicken hearts. Lean, flavorful organ meat. Perfect for grilling, stewing, or specialty preparations." },
  { id: 20, filename: "20.Chicken Drumsticks.jpeg", name: "Chicken Drumsticks", description: "Chicken drumsticks. Flavorful and juicy. Perfect for grilling, baking, or frying. Popular for family meals." },
  { id: 21, filename: "21.Hen Wings.jpeg", name: "Hen Wings", description: "Chicken wings from hen. Flavorful and meaty. Perfect for grilling, frying, or baking." },
  { id: 22, filename: "22.Whole Raw Chicken.jpeg", name: "Whole Raw Chicken", description: "Whole raw chicken. Perfect for roasting, grilling, or portioning. Versatile for various preparations." },
  { id: 23, filename: "23.Whole Boneless Chicken Shawarma.jpeg", name: "Whole Boneless Chicken Shawarma", description: "Boneless chicken prepared for shawarma. Ready for marinating and cooking. Perfect for Middle Eastern dishes." },
  { id: 24, filename: "24.Whole Raw Hen.jpeg", name: "Whole Raw Hen", description: "Whole raw hen. Perfect for roasting or stewing. Flavorful meat ideal for traditional preparations." },
  { id: 25, filename: "25.MDM Mechanically Deboned Meat.jpeg", name: "MDM Mechanically Deboned Meat", description: "Mechanically deboned chicken meat. Perfect for sausages, nuggets, or specialty products. Economical option." },
  { id: 26, filename: "26.Chicken Paws.jpeg", name: "Chicken Paws", description: "Chicken paws. Traditional ingredient in Asian cuisines. Perfect for stocks, soups, or specialty dishes." },
  { id: 27, filename: "27.Whole Chicken Griller 9 Pieces.jpeg", name: "Whole Chicken Griller 9 Pieces", description: "Whole chicken portioned into 9 pieces. Ready for grilling. Perfect for family meals and barbecues." },
  { id: 28, filename: "28.Whole Chicken Leg Boneless Skin-on.jpeg", name: "Whole Chicken Leg Boneless Skin-on", description: "Boneless chicken leg with skin. Flavorful and juicy. Perfect for grilling, baking, or roasting." },
  { id: 29, filename: "29.Boneless Leg Meat Skinless.jpeg", name: "Boneless Leg Meat Skinless", description: "Boneless, skinless leg meat. Lean and versatile. Perfect for grilling, baking, or grinding." },
  { id: 30, filename: "30.Drumettes.jpeg", name: "Drumettes", description: "Chicken drumettes. Meaty and flavorful. Perfect for grilling, frying, or baking. Popular appetizer." },
  { id: 31, filename: "31.Chicken Nuggets.jpeg", name: "Chicken Nuggets", description: "Breaded chicken nuggets. Ready-to-cook or ready-to-eat. Perfect for quick meals and family favorites." },
  { id: 32, filename: "32.Chicken Franks.jpeg", name: "Chicken Franks", description: "Chicken frankfurters. Ready-to-cook. Perfect for quick meals, sandwiches, or specialty dishes." }
];

export default function PoultryCommoditiesPage() {
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
                Poultry Catalog
              </h1>
              <p className="mt-4 text-base sm:text-lg max-w-3xl mx-auto text-gray-500 dark:text-gray-400">
                Premium poultry cuts selected for global trade. Explore all available items and request a
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
                      src={`/images/poultry/${encodeURIComponent(product.filename)}`}
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
                    <QuoteProductButton commodityCategory="poultry" commodityProduct={product.name} />
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
