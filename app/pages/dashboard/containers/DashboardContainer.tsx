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

interface DashboardContainerProps {
  sectionsData: SectionDTO[];
  summary: SummaryDTO;
  debts: DebtCardDTO[];
}

function DashboardContent() {
  const { sections, summary } = useDashboard();

  return (
    <DashboardTemplate 
      sections={
        <>
          {sections.map(section => (
            <SectionProvider key={section.id} sectionId={section.id}>
              <SectionContainer />
            </SectionProvider>
          ))}
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
