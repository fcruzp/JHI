import React from 'react';
import { AuthProvider } from '@/components/auth/AuthProvider';

export default function BrokerLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0a0a0a] pt-20">
      <AuthProvider>
        {children}
      </AuthProvider>
    </div>
  );
}
