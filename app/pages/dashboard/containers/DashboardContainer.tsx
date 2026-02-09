'use client';

import React, { useState } from 'react';
import { DashboardTemplate } from '../templates/DashboardTemplate';
import { SectionTable } from '../components/organisms/SectionTable';
import { SummaryCard } from '../components/organisms/SummaryCard';
import { DebtList } from '../components/organisms/DebtList';
import { ExportCard } from '../components/organisms/ExportCard';
import { SectionDTO, SummaryDTO, DebtCardDTO, SectionItemDTO } from '../dtos/dashboard.dto';

interface DashboardContainerProps {
  sectionsData: SectionDTO[];
  summary: SummaryDTO;
  debts: DebtCardDTO[];
}

export function DashboardContainer({ sectionsData, summary, debts }: DashboardContainerProps) {
  const [sections, setSections] = useState<SectionDTO[]>(sectionsData);

  const handleAdd = (sectionId: string) => {
    console.log('STRING VARIABLE: ', 'Adding item to section', sectionId);
    setSections(prev => prev.map(section => {
      if (section.id === sectionId) {
        const newItem = {
          id: Math.random().toString(36).substr(2, 9),
          name: '',
          amount: 0,
          variant: 'neutral' as const // explicitly cast to allowed variant
        };
        return {
          ...section,
          items: [...section.items, newItem]
        };
      }
      return section;
    }));
  };

  const handleRemove = (sectionId: string, itemId: string) => {
    console.log('STRING VARIABLE: ', 'Removing item from section', sectionId, itemId);
    setSections(prev => prev.map(section => {
      if (section.id === sectionId) {
        return {
          ...section,
          items: section.items.filter(item => item.id !== itemId)
        };
      }
      return section;
    }));
  };

  const handleUpdate = (sectionId: string, itemId: string, updates: Partial<SectionItemDTO>) => {
    console.log('STRING VARIABLE: ', 'Updating item', sectionId, itemId, updates);
    setSections(prev => prev.map(section => {
      if (section.id === sectionId) {
        return {
          ...section,
          items: section.items.map(item => 
            item.id === itemId ? { ...item, ...updates } : item
          )
        };
      }
      return section;
    }));
  };

  const calculateTotal = (section: SectionDTO) => {
    if (section.type === 'summary_list') {
      return section.items.reduce((acc, item) => acc + (item.amount || 0), 0);
    }
    return section.total;
  };

  return (
    <DashboardTemplate 
      sections={
        <>
          {sections.map(section => (
            <SectionTable 
              key={section.id} 
              section={{
                ...section,
                total: calculateTotal(section)
              }} 
              onAdd={() => handleAdd(section.id)}
              onRemove={(itemId) => handleRemove(section.id, itemId)}
              onUpdate={(itemId, updates) => handleUpdate(section.id, itemId, updates)}
            />
          ))}
        </>
      }
      sidebar={
        <>
          <SummaryCard summary={summary} />
          <DebtList debts={debts} />
          <ExportCard />
        </>
      }
    />
  );
}
