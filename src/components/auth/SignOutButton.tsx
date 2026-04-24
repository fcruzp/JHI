'use client';

import { signOut } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { getTranslation } from '@/lib/i18n';

export function SignOutButton() {
  const { language } = useAppStore();
  const t = getTranslation(language);

  return (
    <Button 
      variant="outline" 
      className="flex items-center gap-2" 
      onClick={() => signOut({ callbackUrl: '/broker/login' })}
    >
      <LogOut className="h-4 w-4" />
      {t.signOut}
    </Button>
  );
}
