import React from 'react';
import { Navbar } from '@/app/components/molecules/Navbar';
import { Footer } from '@/app/components/molecules/Footer';

interface DashboardTemplateProps {
  movements: React.ReactNode;
  physicalExpenses: React.ReactNode;
  digitalExpenses: React.ReactNode;
  summary: React.ReactNode;
  debts: React.ReactNode;
  exportCard: React.ReactNode;
}

export function DashboardTemplate({ 
  movements, 
  physicalExpenses, 
  digitalExpenses, 
  summary, 
  debts,
  exportCard 
}: DashboardTemplateProps) {
  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-200 font-sans">
      <Navbar />
      <main className="max-w-7xl mx-auto p-6 lg:p-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-7 space-y-8">
            {movements}
            {physicalExpenses}
            {digitalExpenses}
          </div>
          <div className="lg:col-span-5 space-y-8">
            {summary}
            {debts}
            {exportCard}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
