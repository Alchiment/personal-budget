'use client';

import React from 'react';
import { DashboardTemplate } from '../templates/DashboardTemplate';
import { SummaryCard } from '../components/organisms/SummaryCard';
import { DebtsContainer } from './DebtsContainer';
import { ExportCard } from '../components/organisms/ExportCard';
import { SectionDTO, SummaryDTO, DebtCardDTO } from '../dtos/dashboard.dto';
import { DashboardProvider, useDashboard } from '../contexts/DashboardContext';
import { SectionProvider } from '../contexts/SectionContext';
import { SectionContainer } from './SectionContainer';
import { Button } from '@/app/components/atoms/Button';
import { Icon } from '@/app/components/atoms/Icon';

interface DashboardContainerProps {
  sectionsData: SectionDTO[];
  summary: SummaryDTO;
  debts: DebtCardDTO[];
}

function DashboardContent() {
  const { sections, summary, addSection } = useDashboard();

  return (
    <DashboardTemplate 
      sections={
        <>
          {sections.map(section => (
            <SectionProvider key={section.id} sectionId={section.id}>
              <SectionContainer />
            </SectionProvider>
          ))}
          <Button 
            variant="ghost" 
            className="w-full border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl p-8 text-slate-400 hover:text-slate-600 hover:border-slate-300 dark:hover:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-900/50 flex flex-col items-center justify-center gap-2 transition-all"
            onClick={addSection}
          >
            <Icon name="add_circle" className="text-3xl opacity-50" />
            <span className="font-medium">Agregar Nueva Sección</span>
          </Button>
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

export function DashboardContainer({ sectionsData, summary, debts }: DashboardContainerProps) {
  return (
    <DashboardProvider 
      initialSections={sectionsData} 
      initialDebts={debts} 
      initialSummary={summary}
    >
      <DashboardContent />
    </DashboardProvider>
  );
}
