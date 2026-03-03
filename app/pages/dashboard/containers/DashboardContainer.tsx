'use client';

import React from 'react';
import { DashboardTemplate } from '../templates/DashboardTemplate';
import { SummaryCard } from '../components/organisms/SummaryCard';
import { DebtsContainer } from './DebtsContainer';
import { ExportCard } from '../components/organisms/ExportCard';
import { SectionDTO, SummaryDTO, DebtCardDTO } from '../dtos/dashboard.dto';
import { DashboardProvider } from '../contexts/DashboardContext';
import { SectionProvider } from '../contexts/SectionContext';
import { SectionContainer } from './SectionContainer';
import { Button } from '@/app/components/atoms/Button';
import { Icon } from '@/app/components/atoms/Icon';
import { useDashboardContext } from '../hooks/useDashboardContext';
import { AlertProvider } from '@/app/contexts/AlertContext';
import { UserProvider } from '@/app/contexts/UserContext';
import { Navbar } from '@/app/components/molecules/Navbar';

interface DashboardContainerProps {
  userName?: string;
  userEmail: string;
  sectionsData: SectionDTO[];
  summary: SummaryDTO;
  debts: DebtCardDTO[];
}

function DashboardContent() {
  const { sections, summary, addSection, addIncomeSection } = useDashboardContext();

  return (
    <DashboardTemplate 
      sections={
        <>
          {sections.map(section => (
            <SectionProvider key={section.id} sectionId={section.id}>
              <SectionContainer />
            </SectionProvider>
          ))}
          <div className="grid grid-cols-2 gap-3">
            <Button 
              variant="ghost" 
              className="w-full border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl p-8 text-slate-400 hover:text-slate-600 hover:border-slate-300 dark:hover:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-900/50 flex flex-col items-center justify-center gap-2 transition-all"
              onClick={addSection}
            >
              <Icon name="add_circle" className="text-3xl opacity-50" />
              <span className="font-medium">Agregar Sección de Egresos</span>
            </Button>
            <Button 
              variant="ghost" 
              className="w-full border-2 border-dashed border-yellow-200 dark:border-yellow-800/50 rounded-xl p-8 text-yellow-500 hover:text-yellow-600 hover:border-yellow-300 dark:hover:border-yellow-700 hover:bg-yellow-50 dark:hover:bg-yellow-900/20 flex flex-col items-center justify-center gap-2 transition-all"
              onClick={addIncomeSection}
            >
              <Icon name="payments" className="text-3xl opacity-50" />
              <span className="font-medium">Agregar Sección de Ingresos</span>
            </Button>
          </div>
        </>
      }
      sidebar={
        <>
          <SummaryCard summary={summary} />
          <DebtsContainer />
          <ExportCard />
        </>
      }
    />
  );
}

export function DashboardContainer({ userName, userEmail, sectionsData, summary, debts }: DashboardContainerProps) {
  return (
    <AlertProvider>
      <UserProvider name={userName} email={userEmail}>
        <DashboardProvider 
          initialSections={sectionsData} 
          initialDebts={debts} 
          initialSummary={summary}
        >
          <DashboardContent />
        </DashboardProvider>
      </UserProvider>
    </AlertProvider>
  );
}
