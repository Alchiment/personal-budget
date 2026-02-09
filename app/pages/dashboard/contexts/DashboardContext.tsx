'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { SectionDTO, SummaryDTO, DebtCardDTO, SectionItemDTO } from '../dtos/dashboard.dto';

interface DashboardContextInterface {
  sections: SectionDTO[];
  debts: DebtCardDTO[];
  summary: SummaryDTO;
  addSectionItem: (sectionId: string) => void;
  removeSectionItem: (sectionId: string, itemId: string) => void;
  updateSectionItem: (sectionId: string, itemId: string, updates: Partial<SectionItemDTO>) => void;
}

const DashboardContext = createContext<DashboardContextInterface | undefined>(undefined);

interface DashboardProviderProps {
  children: ReactNode;
  initialSections: SectionDTO[];
  initialDebts: DebtCardDTO[];
  initialSummary: SummaryDTO; // Optional if we calculate it immediately, but good for initial render
}

export function DashboardProvider({ 
  children, 
  initialSections, 
  initialDebts,
  initialSummary 
}: DashboardProviderProps) {
  const [sections, setSections] = useState<SectionDTO[]>(initialSections);
  const [debts, setDebts] = useState<DebtCardDTO[]>(initialDebts);
  const [summary, setSummary] = useState<SummaryDTO>(initialSummary);

  // Calculate summary whenever sections change
  useEffect(() => {
    let totalIncome = 0;
    let totalExpenses = 0;

    sections.forEach(section => {
      if (section.id === 'movements') {
        // For movements, we sum everything as income (net income)
        const sectionTotal = section.items.reduce((acc, item) => acc + item.amount, 0);
        totalIncome += sectionTotal;
      } else {
        // For other sections, we treat them as expenses
        // Calculate section total
        const sectionTotal = section.items.reduce((acc, item) => acc + (item.amount || 0), 0);
        totalExpenses += sectionTotal;
      }
    });

    setSummary({
      income: totalIncome,
      expenses: totalExpenses,
      savings: 0, // TODO: Implement savings logic if needed
      balance: totalIncome - totalExpenses
    });
  }, [sections]);

  const addSectionItem = (sectionId: string) => {
    console.log('STRING VARIABLE: ', 'Adding item to section', sectionId);
    setSections(prev => prev.map(section => {
      if (section.id === sectionId) {
        const newItem: SectionItemDTO = {
          id: Math.random().toString(36).substr(2, 9),
          name: 'Nuevo Item',
          amount: 0,
          variant: section.id === 'movements' ? 'income' : 'neutral'
        };
        return {
          ...section,
          items: [...section.items, newItem]
        };
      }
      return section;
    }));
  };

  const removeSectionItem = (sectionId: string, itemId: string) => {
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

  const updateSectionItem = (sectionId: string, itemId: string, updates: Partial<SectionItemDTO>) => {
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

  return (
    <DashboardContext.Provider value={{
      sections,
      debts,
      summary,
      addSectionItem,
      removeSectionItem,
      updateSectionItem
    }}>
      {children}
    </DashboardContext.Provider>
  );
}

export function useDashboard() {
  const context = useContext(DashboardContext);
  if (context === undefined) {
    throw new Error('useDashboard must be used within a DashboardProvider');
  }
  return context;
}
