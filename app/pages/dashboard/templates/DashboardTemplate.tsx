import React from 'react';
import { Navbar } from '@/app/components/molecules/Navbar';
import { Footer } from '@/app/components/molecules/Footer';
import { AlertBanner } from '@/app/components/molecules/AlertBanner';

interface DashboardTemplateProps {
  sections: React.ReactNode;
  sidebar: React.ReactNode;
  saveError: string | null;
  clearSaveError: () => void;
}

export function DashboardTemplate({ 
  sections, 
  sidebar,
  saveError,
  clearSaveError
}: DashboardTemplateProps) {
  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-200 font-sans">
      <Navbar />
      {saveError && (
        <div className="mx-4 mt-4 lg:mx-auto lg:max-w-7xl">
          <AlertBanner message={saveError} onClose={clearSaveError} />
        </div>
      )}
      <main className="max-w-7xl mx-auto p-6 lg:p-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-7 space-y-8">
            {sections}
          </div>
          <div className="lg:col-span-5 space-y-8">
            {sidebar}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
