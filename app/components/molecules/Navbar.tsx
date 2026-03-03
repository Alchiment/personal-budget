'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Icon } from '../atoms/Icon';
import { Button } from '../atoms/Button';
import { logout } from '@/app/pages/auth/services/authApiService';
import { AlertBanner } from './AlertBanner';
import { useAlert } from '@/app/contexts/AlertContext';
import { useUser } from '@/app/contexts/UserContext';

export function Navbar() {
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const { alert, clearAlert } = useAlert();
  const { name, email } = useUser();

  const displayName = name || email.split('@')[0];
  const initial = displayName.charAt(0).toUpperCase();

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      await logout();
      router.push('/login');
    } catch (error) {
      console.error('Logout failed:', error);
      router.push('/login');
    }
  };

  return (
    <div className="sticky top-0 z-50">
      <nav className="border-b border-slate-200 dark:border-slate-800 bg-card">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Icon name="account_balance_wallet" className="text-primary text-3xl" />
            <h1 className="text-xl font-bold tracking-tight">
              {displayName.toUpperCase()} <span className="text-slate-400 font-normal">| Finanzas</span>
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="rounded-full">
              <Icon name="settings" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full"
              onClick={handleLogout}
              disabled={isLoggingOut}
              title="Logout"
            >
              <Icon name="logout" />
            </Button>
            <div className="h-8 w-8 bg-primary rounded-full flex items-center justify-center text-white font-bold">
              {initial}
            </div>
          </div>
        </div>
      </nav>
      {alert && (
        <div className="max-w-7xl mx-auto px-6 py-2">
          <AlertBanner message={alert.message} variant={alert.variant} onClose={clearAlert} />
        </div>
      )}
    </div>
  );
}
