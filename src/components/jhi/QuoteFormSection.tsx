'use client';

import React, { useState } from 'react';
import { toast } from 'sonner';
import { Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useAppStore } from '@/lib/store';
import { getTranslation } from '@/lib/i18n';
import { ScrollAnimation } from './ScrollAnimations';

interface QuoteFormSectionProps {
  isEmbedded?: boolean;
}

export function QuoteFormSection({ isEmbedded = false }: QuoteFormSectionProps) {
  const { language, pendingQuoteSelection, setPendingQuoteSelection } = useAppStore();
  const t = getTranslation(language);

  const categoryOptions = [
    { value: 'pork', label: t.commodityPorkName, quoteLabel: 'PORK' },
    { value: 'beef', label: t.commodityBeefName, quoteLabel: 'BEEF' },
    { value: 'canadian-beef', label: t.commodityCanadianBeefName, quoteLabel: 'CANADIAN BEEF' },
    { value: 'veal', label: t.commodityVealName, quoteLabel: 'VEAL' },
    { value: 'lamb', label: t.commodityLambName, quoteLabel: 'LAMB' },
    { value: 'poultry', label: t.commodityPoultryName, quoteLabel: 'POULTRY' },
    { value: 'fish', label: t.commodityFishName, quoteLabel: 'FISH' },
    { value: 'dairy', label: t.commodityDairyName, quoteLabel: 'DAIRY' },
    { value: 'grains-others', label: t.commodityGrainsOthersName, quoteLabel: 'GRAINS / OTHERS' },
  ] as const;

  const commodityCatalog = {
    pork: [
      'Hams Bone In Skin On',
      'Hams Boneless Skinless',
      'Ham Outside Muscle',
      'Ham Inside Muscle',
      'Ham Knuckle',
      'Boneless Loin Short Cut',
      'Boneless Loin Main Muscle',
      'Tenderloin',
      'Sirloin Boneless Buckeye',
      'Belly Skinless Single Ribbed',
      'Belly Boneless',
      'Belly Skinless',
      'Shoulder Picnic Bone In',
      'Shoulder Picnic Boneless',
      'Shoulder Butt Boneless A',
      'Shoulder Butt Boneless B',
      'Diaphragm Untrimmed',
      'Tongues',
      'Hind Foot',
      'Front Foot',
      'Hock',
      'Jowl Skin On or Skinless',
      'Liver',
      'Heart',
      'Kidneys',
      'Back Fat',
      'Belly Skin',
      'Back Skin',
      'Mixed Skin',
      'Side Spareribs',
      'Center Spareribs',
      'Back Ribs',
      'Riblet',
    ],
    beef: [
      'Rib Primal',
      'Rib Blade Meat',
      'Roast Ready Short Cut',
      'Ribeye',
      'Chuck Shoulder Clod',
      'Chuck Square Cut',
      'Brisket Point Cut Boneless',
      'Inside Skirt',
      'Plate Outside Skirt',
      'Short Ribs',
      'Chuck Short Rib',
      'Striploin Boneless',
      'Tenderloin',
      'Tenderloin Side Muscle',
      'Butt Defatted',
      'Tenderloin Butt',
      'Flank Steak',
      'Aorta',
      'Diaphragm Membrane',
      'Hearts',
      'Kidneys',
      'Liver',
      'Tongue',
    ],
    'canadian-beef': [
      'Blade Pot Roast',
      'Bottom Blade Simmering Steak Boneless',
      'Boneless Short Ribs',
      'Brisket Double Point End Deckle',
      'Centre Cut Tenderloin Premium Oven Roast',
      'Eye of Round Marinating Steak',
      'Eye of Round Oven Roast',
      'Flank Marinating Steak C',
      'Flank Marinating Steak A',
      'Flank Marinating Steak B',
      'Inside Round Oven Roast',
      'Outside Round Marinating Steak',
      'Outside Round Oven Roast',
      'Rib Eye Grilling Steak',
      'Rib Premium Oven Roast',
      'Short Tenderloin Premium Oven Roast',
      'Simmering Short Ribs',
      'Sirloin Grilling Steak',
      'Sirloin Tip Marinating Steak',
      'Stewing Beef',
      'Strip Loin Premium Oven Roast',
      'T-Bone Grilling Steak',
      'Top Sirloin Grilling Steak',
      'Top Sirloin Premium Oven Roast',
    ],
    veal: [
      'Forequater',
      'Triangle',
      'Hindquarter',
      'Rack 7 Ribs',
      'Rack',
      'Rack Ribeye Roll',
      'Ribeye Boneless',
      'E-chuck Roll',
      'Chuck Shoulder Clod',
      'Chuck Tender',
      'Foreshank',
      'Loin Block',
      'Loin Trimmed',
      'Leg Shank Off',
      'Trimmed Sirloin Butt',
      'Striploin Boneless',
      'Short Tenderloin',
      'Leg Top Round',
      'Stew Meat',
      'Ground Veal',
      'Cube Steak',
      'Rib Chops French Style'
    ],
    lamb: [
      'Rack Roast Ready',
      'Ribeye Roll',
      'Shoulder Square Cut',
      'Shoulder Boneless',
      'Breast',
      'Rib Breast Bone Off',
      'Foreshank',
      'Leg Hindshank',
      'Loin Double Boneless',
      'Short Tenderloin',
      'Lamb Leg',
      'Leg Trotter Leg',
      'Leg',
      'Leg Bottom Boneless',
      'Leg Knuckle',
      'Top Sirloin',
      'Stew Lamb',
      'Ground Lamb',
      'Tongue',
      'Hearts',
      'Tripe',
      'Kabobs',
      'Loin Chops',
      'Rib Chops'
    ],
    poultry: [
      'Chicken 2 Joint Wing',
      'Chicken Breast',
      'Chicken Breast Bone In Skin On',
      'Chicken Feet',
      'Chicken Fronts',
      'Chicken Gizzards',
      'Chicken Leg Quarter',
      'Chicken Livers',
      'Chicken Skin',
      'Chicken Tails',
      'Chicken Thigh',
      'Chicken Trimmings',
      'Chicken Whole Legs',
      'Chicken Whole Wings',
      'Chicken Inner Fillet',
      'Chicken Leg Hen',
      'Chicken Mid Joint Wings',
      'Necks',
      'Chicken Hearts',
      'Chicken Drumsticks',
      'Hen Wings',
      'Whole Raw Chicken',
      'Whole Boneless Chicken Shawarma',
      'Whole Raw Hen',
      'MDM Mechanically Deboned Meat',
      'Chicken Paws',
      'Whole Chicken Griller 9 Pieces',
      'Whole Chicken Leg Boneless Skin-on',
      'Boneless Leg Meat Skinless',
      'Drumettes',
      'Chicken Nuggets',
      'Chicken Franks'
    ],
    fish: [],
    dairy: [],
    'grains-others': [],
  } as const;

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    commodityCategory: '',
    commodityProduct: '',
    quantity: '',
    origin: '',
    destination: '',
    incoterms: '',
    message: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const commodityCategoryOptions = categoryOptions;
  const commodityProductOptions = formData.commodityCategory
    ? commodityCatalog[formData.commodityCategory as keyof typeof commodityCatalog] || []
    : [];

  React.useEffect(() => {
    if (!pendingQuoteSelection) return;
    const { commodityCategory, commodityProduct } = pendingQuoteSelection;
    const productsForCategory = (commodityCatalog[commodityCategory as keyof typeof commodityCatalog] || []) as readonly string[];
    const validCategory = commodityCategoryOptions.some((option) => option.value === commodityCategory);
    if (!validCategory) return;
    const matchedProduct = productsForCategory.find((product) => product === commodityProduct);
    if (!matchedProduct) return;
    setFormData((prev) => ({
      ...prev,
      commodityCategory,
      commodityProduct: matchedProduct,
    }));
    setPendingQuoteSelection(null);
  }, [pendingQuoteSelection, language, setPendingQuoteSelection]);

  React.useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const categoryFromUrl = params.get('commodityCategory');
    const rawProductFromUrl = params.get('commodityProduct');
    const productFromUrl = rawProductFromUrl
      ? decodeURIComponent(rawProductFromUrl).replace(/\+/g, ' ')
      : null;
    if (!categoryFromUrl || !productFromUrl) return;
    const validCategory = commodityCategoryOptions.find((option) => option.value === categoryFromUrl);
    if (!validCategory) return;
    const productsForCategory = (commodityCatalog[categoryFromUrl as keyof typeof commodityCatalog] || []) as readonly string[];
    const normalizeValue = (value: string) => value.trim().replace(/\s+/g, ' ').toLowerCase();
    const matchedProduct = productsForCategory.find(
      (productOption) => normalizeValue(productOption) === normalizeValue(productFromUrl)
    );
    if (!matchedProduct) return;
    // Two-step set to avoid race conditions with dependent Select rendering.
    setFormData((prev) => ({
      ...prev,
      commodityCategory: categoryFromUrl,
      commodityProduct: '',
    }));
    const raf = window.requestAnimationFrame(() => {
      setFormData((prev) => ({
        ...prev,
        commodityCategory: categoryFromUrl,
        commodityProduct: matchedProduct,
      }));
    });
    return () => window.cancelAnimationFrame(raf);
  }, [language]);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = t.contactRequired;
    }
    if (!formData.email.trim()) {
      newErrors.email = t.contactRequired;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = t.contactInvalidEmail;
    }
    if (!formData.commodityCategory) {
      newErrors.commodityCategory = t.contactRequired;
    }
    if (!formData.commodityProduct) {
      newErrors.commodityProduct = t.contactRequired;
    }
    if (!formData.quantity.trim()) {
      newErrors.quantity = t.contactRequired;
    }
    if (!formData.origin.trim()) {
      newErrors.origin = t.contactRequired;
    }
    if (!formData.destination.trim()) {
      newErrors.destination = t.contactRequired;
    }
    if (!formData.incoterms) {
      newErrors.incoterms = t.contactRequired;
    }
    if (!formData.message.trim()) {
      newErrors.message = t.contactRequired;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          commodity: `${commodityCategoryOptions.find((option) => option.value === formData.commodityCategory)?.quoteLabel || formData.commodityCategory}: ${formData.commodityProduct}`,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(t.contactSuccess);
        setFormData({ name: '', email: '', commodityCategory: '', commodityProduct: '', quantity: '', origin: '', destination: '', incoterms: '', message: '' });
        setErrors({});
      } else {
        toast.error(data.error || t.contactError);
      }
    } catch {
      toast.error(t.contactError);
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClass = 'w-full bg-gray-50 dark:bg-white/5 border-gray-200 dark:border-white/10 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:border-[#c9a84c]/50 focus:ring-[#c9a84c]/20';

  return (
    <section
      id="contact"
      className={isEmbedded ? "py-8 bg-transparent" : "py-20 sm:py-28 bg-white dark:bg-[#0a0a0a]"}
    >
      <div className={isEmbedded ? "w-full" : "max-w-4xl mx-auto px-4 sm:px-6 lg:px-8"}>
        {/* Section Header */}
        {!isEmbedded && (
          <ScrollAnimation className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 text-gray-900 dark:text-white">
              {t.contactTitle}
            </h2>
            <p className="text-lg max-w-2xl mx-auto text-gray-500 dark:text-gray-400">
              {t.contactSubtitle}
            </p>
            <div className="mt-6 h-1 w-20 mx-auto bg-gradient-to-r from-[#c9a84c] via-[#e2c66d] to-[#c9a84c] rounded-full" />
          </ScrollAnimation>
        )}

        {/* Form */}
        <ScrollAnimation delay={0.2}>
          <form
            onSubmit={handleSubmit}
            className="rounded-2xl p-6 sm:p-8 lg:p-10 border border-gray-100 dark:border-white/5 bg-[#fafafa] dark:bg-[#111111]"
          >
            <div className="grid sm:grid-cols-2 gap-6">
              {/* Name */}
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {t.contactName}
                </Label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder={t.contactNamePlaceholder}
                  className={inputClass}
                />
                {errors.name && (
                  <p className="text-red-400 text-xs mt-1">{errors.name}</p>
                )}
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {t.contactEmail}
                </Label>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder={t.contactEmailPlaceholder}
                  className={inputClass}
                />
                {errors.email && (
                  <p className="text-red-400 text-xs mt-1">{errors.email}</p>
                )}
              </div>

              {/* Commodity Category */}
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {t.contactCommodityCategory}
                </Label>
                <Select
                  value={formData.commodityCategory}
                  onValueChange={(value) =>
                    setFormData({ ...formData, commodityCategory: value, commodityProduct: '' })
                  }
                >
                  <SelectTrigger className={inputClass}>
                    <SelectValue placeholder={t.contactCommodityCategoryPlaceholder} />
                  </SelectTrigger>
                  <SelectContent className="bg-white dark:bg-[#1a1a1a] border-gray-200 dark:border-white/10">
                    {commodityCategoryOptions.map((option) => (
                      <SelectItem
                        key={option.value}
                        value={option.value}
                        className="text-gray-900 dark:text-gray-300 focus:text-gray-900 dark:focus:text-white focus:bg-gray-50 dark:focus:bg-white/5"
                      >
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.commodityCategory && (
                  <p className="text-red-400 text-xs mt-1">{errors.commodityCategory}</p>
                )}
              </div>

              {/* Commodity Product */}
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {t.contactCommodity}
                </Label>
                <Select
                  value={formData.commodityProduct}
                  onValueChange={(value) =>
                    setFormData({ ...formData, commodityProduct: value })
                  }
                  disabled={!formData.commodityCategory}
                >
                  <SelectTrigger className={inputClass}>
                    <SelectValue
                      placeholder={formData.commodityCategory ? t.contactCommodityPlaceholder : t.contactCommoditySelectCategoryFirst}
                    />
                  </SelectTrigger>
                  <SelectContent className="bg-white dark:bg-[#1a1a1a] border-gray-200 dark:border-white/10">
                    {commodityProductOptions.length > 0 ? (
                      commodityProductOptions.map((option) => (
                        <SelectItem
                          key={option}
                          value={option}
                          className="text-gray-900 dark:text-gray-300 focus:text-gray-900 dark:focus:text-white focus:bg-gray-50 dark:focus:bg-white/5"
                        >
                          {option}
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem
                        value="N/A"
                        disabled
                        className="text-gray-900 dark:text-gray-300 focus:text-gray-900 dark:focus:text-white focus:bg-gray-50 dark:focus:bg-white/5"
                      >
                        {t.contactCommodityNoProducts}
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
                {errors.commodityProduct && (
                  <p className="text-red-400 text-xs mt-1">{errors.commodityProduct}</p>
                )}
              </div>

              {/* Quantity */}
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {t.contactQuantity}
                </Label>
                <Input
                  value={formData.quantity}
                  onChange={(e) =>
                    setFormData({ ...formData, quantity: e.target.value })
                  }
                  placeholder={t.contactQuantityPlaceholder}
                  className={inputClass}
                />
                {errors.quantity && (
                  <p className="text-red-400 text-xs mt-1">{errors.quantity}</p>
                )}
              </div>

              {/* Origin */}
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {t.contactOrigin}
                </Label>
                <Input
                  value={formData.origin}
                  onChange={(e) =>
                    setFormData({ ...formData, origin: e.target.value })
                  }
                  placeholder={t.contactOriginPlaceholder}
                  className={inputClass}
                />
                {errors.origin && (
                  <p className="text-red-400 text-xs mt-1">{errors.origin}</p>
                )}
              </div>

              {/* Destination */}
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {t.contactDestination}
                </Label>
                <Input
                  value={formData.destination}
                  onChange={(e) =>
                    setFormData({ ...formData, destination: e.target.value })
                  }
                  placeholder={t.contactDestinationPlaceholder}
                  className={inputClass}
                />
                {errors.destination && (
                  <p className="text-red-400 text-xs mt-1">{errors.destination}</p>
                )}
              </div>
            </div>

            {/* Incoterms */}
            <div className="space-y-2 mt-6">
              <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {t.contactIncoterms}
              </Label>
              <Select
                value={formData.incoterms}
                onValueChange={(value) =>
                  setFormData({ ...formData, incoterms: value })
                }
              >
                <SelectTrigger className={inputClass}>
                  <SelectValue placeholder={t.contactIncotermsPlaceholder} />
                </SelectTrigger>
                <SelectContent className="bg-white dark:bg-[#1a1a1a] border-gray-200 dark:border-white/10">
                  <SelectItem
                    value="FOB"
                    className="text-gray-900 dark:text-gray-300 focus:text-gray-900 dark:focus:text-white focus:bg-gray-50 dark:focus:bg-white/5"
                  >
                    FOB
                  </SelectItem>
                  <SelectItem
                    value="CIF"
                    className="text-gray-900 dark:text-gray-300 focus:text-gray-900 dark:focus:text-white focus:bg-gray-50 dark:focus:bg-white/5"
                  >
                    CIF
                  </SelectItem>
                  <SelectItem
                    value="CFR"
                    className="text-gray-900 dark:text-gray-300 focus:text-gray-900 dark:focus:text-white focus:bg-gray-50 dark:focus:bg-white/5"
                  >
                    CFR
                  </SelectItem>
                  <SelectItem
                    value="EXW"
                    className="text-gray-900 dark:text-gray-300 focus:text-gray-900 dark:focus:text-white focus:bg-gray-50 dark:focus:bg-white/5"
                  >
                    EXW
                  </SelectItem>
                  <SelectItem
                    value="DAP"
                    className="text-gray-900 dark:text-gray-300 focus:text-gray-900 dark:focus:text-white focus:bg-gray-50 dark:focus:bg-white/5"
                  >
                    DAP
                  </SelectItem>
                </SelectContent>
              </Select>
              {errors.incoterms && (
                <p className="text-red-400 text-xs mt-1">{errors.incoterms}</p>
              )}
            </div>

            {/* Message */}
            <div className="space-y-2 mt-6">
              <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {t.contactMessage}
              </Label>
              <Textarea
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder={t.contactMessagePlaceholder}
                rows={4}
                className={`${inputClass} resize-none`}
              />
              {errors.message && (
                <p className="text-red-400 text-xs mt-1">{errors.message}</p>
              )}
            </div>

            {/* Submit */}
            <Button
              type="submit"
              disabled={isSubmitting}
              size="lg"
              className="w-full mt-8 bg-[#c9a84c] hover:bg-[#b8973f] text-[#0a0a0a] font-semibold py-6 text-base rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-[#c9a84c]/20 disabled:opacity-50"
            >
              {isSubmitting ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-[#0a0a0a]/30 border-t-[#0a0a0a] rounded-full animate-spin" />
                  {t.loading}
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Send className="h-4 w-4" />
                  {t.contactSubmit}
                </div>
              )}
            </Button>
          </form>
        </ScrollAnimation>
      </div>
    </section>
  );
}
