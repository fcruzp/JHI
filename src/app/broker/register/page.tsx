'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { ArrowLeft } from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { getTranslation } from '@/lib/i18n';

export default function RegisterPage() {
  const { language } = useAppStore();
  const t = getTranslation(language);
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Registration error');
      }

      toast.success(t.registerSuccessTitle, {
        description: t.registerSuccessDesc,
      });
      
      // Redirect to login or verification info page
      router.push('/broker/login?registered=true');
    } catch (err: any) {
      toast.error(t.registerErrorTitle, {
        description: err.message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center py-20 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white dark:bg-[#1a1a1a] rounded-2xl shadow-xl border border-black/5 dark:border-white/5 p-8"
      >
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 dark:hover:text-white mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          {t.backToHome}
        </Link>
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{t.registerTitle}</h1>
          <p className="text-gray-500 mt-2 text-sm">{t.registerSubtitle}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-200">{t.registerLabelFirstName}</label>
              <input
                type="text"
                required
                className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-800 bg-transparent"
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-200">{t.registerLabelLastName}</label>
              <input
                type="text"
                required
                className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-800 bg-transparent"
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-200">{t.loginLabelEmail}</label>
            <input
              type="email"
              required
              className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-800 bg-transparent"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-200">{t.loginLabelPassword}</label>
            <input
              type="password"
              required
              minLength={6}
              className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-800 bg-transparent"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />
          </div>

          <Button type="submit" disabled={loading} className="w-full bg-[#c9a84c] hover:bg-[#b0923f] text-white">
            {loading ? t.registerButtonLoading : t.registerButton}
          </Button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-500">
          {t.registerHaveAccount}{' '}
          <a href="/broker/login" className="text-[#c9a84c] hover:underline">
            {t.registerLoginHere}
          </a>
        </div>
      </motion.div>
    </div>
  );
}
