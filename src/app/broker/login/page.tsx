'use client';

import React, { useState, Suspense } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { ArrowLeft } from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { getTranslation } from '@/lib/i18n';

function LoginContent() {
  const { language } = useAppStore();
  const t = getTranslation(language);
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const registered = searchParams.get('registered');
  const callbackUrl = searchParams.get('callbackUrl') || '/broker';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await signIn('credentials', {
        redirect: false,
        email,
        password,
      });

      if (res?.error) {
        toast.error(t.loginErrorTitle, {
          description: res.error,
        });
      } else {
        toast.success(t.loginSuccessTitle, {
          description: t.loginSuccessDesc,
        });
        router.push(callbackUrl);
      }
    } catch (err: any) {
      toast.error(t.loginErrorTitle, {
        description: t.loginErrorDesc,
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
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{t.loginTitle}</h1>
          <p className="text-gray-500 mt-2 text-sm">
            {registered 
              ? t.loginSubtitle 
              : t.loginSubtitleSimple}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-200">{t.loginLabelEmail}</label>
            <input
              type="email"
              required
              className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-800 bg-transparent"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-200">{t.loginLabelPassword}</label>
            <input
              type="password"
              required
              className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-800 bg-transparent"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <Button type="submit" disabled={loading} className="w-full bg-[#c9a84c] hover:bg-[#b0923f] text-white">
            {loading ? t.loginButtonLoading : t.loginButton}
          </Button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-500">
          {t.loginNoAccount}{' '}
          <a href="/broker/register" className="text-[#c9a84c] hover:underline">
            {t.loginRequestAccess}
          </a>
        </div>
      </motion.div>
    </div>
  );
}

export default function LoginPage() {
  const { language } = useAppStore();
  const t = getTranslation(language);

  return (
    <Suspense fallback={<div className="py-20 text-center">{t.loading}</div>}>
      <LoginContent />
    </Suspense>
  );
}
