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

export function ContactSection() {
  const { language } = useAppStore();
  const t = getTranslation(language);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    commodity: '',
    quantity: '',
    origin: '',
    destination: '',
    incoterms: '',
    message: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const commodityOptions = [
    t.commoditySugarName,
    t.commodityMeatName,
    t.commodityGrainsName,
    t.commodityCoffeeName,
    t.commodityOilName,
    t.commodityDairyName,
  ];

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
    if (!formData.commodity) {
      newErrors.commodity = t.contactRequired;
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
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(t.contactSuccess);
        setFormData({ name: '', email: '', commodity: '', quantity: '', origin: '', destination: '', incoterms: '', message: '' });
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
      className="py-20 sm:py-28 bg-white dark:bg-[#0a0a0a]"
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <ScrollAnimation className="text-center mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 text-gray-900 dark:text-white">
            {t.contactTitle}
          </h2>
          <p className="text-lg max-w-2xl mx-auto text-gray-500 dark:text-gray-400">
            {t.contactSubtitle}
          </p>
          <div className="mt-6 h-1 w-20 mx-auto bg-gradient-to-r from-[#c9a84c] via-[#e2c66d] to-[#c9a84c] rounded-full" />
        </ScrollAnimation>

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

              {/* Commodity */}
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {t.contactCommodity}
                </Label>
                <Select
                  value={formData.commodity}
                  onValueChange={(value) =>
                    setFormData({ ...formData, commodity: value })
                  }
                >
                  <SelectTrigger className={inputClass}>
                    <SelectValue placeholder={t.contactCommodityPlaceholder} />
                  </SelectTrigger>
                  <SelectContent className="bg-white dark:bg-[#1a1a1a] border-gray-200 dark:border-white/10">
                    {commodityOptions.map((option) => (
                      <SelectItem
                        key={option}
                        value={option}
                        className="text-gray-900 dark:text-gray-300 focus:text-gray-900 dark:focus:text-white focus:bg-gray-50 dark:focus:bg-white/5"
                      >
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.commodity && (
                  <p className="text-red-400 text-xs mt-1">{errors.commodity}</p>
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
