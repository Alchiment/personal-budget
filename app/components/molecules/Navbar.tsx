import React from 'react';
import { Icon } from '../atoms/Icon';
import { Button } from '../atoms/Button';

export function Navbar() {
  return (
    <nav className="border-b border-slate-200 dark:border-slate-800 bg-card sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Icon name="account_balance_wallet" className="text-primary text-3xl" />
          <h1 className="text-xl font-bold tracking-tight">
            RICHARD <span className="text-slate-400 font-normal">| Finanzas</span>
          </h1>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" className="rounded-full">
            <Icon name="settings" />
          </Button>
          <div className="h-8 w-8 bg-primary rounded-full flex items-center justify-center text-white font-bold">
            R
          </div>
        </div>
      </div>
    </nav>
  );
}
