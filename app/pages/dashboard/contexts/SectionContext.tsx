'use client';

import React, { createContext, useContext, ReactNode, useMemo } from 'react';
import { SectionDTO, SectionItemDTO } from '../dtos/dashboard.dto';
import { useDashboard } from './DashboardContext';

interface SectionContextInterface {
  section: SectionDTO;
  addItem: () => void;
  removeItem: (itemId: string) => void;
  updateItem: (itemId: string, updates: Partial<SectionItemDTO>) => void;
  total: number;
}

const SectionContext = createContext<SectionContextInterface | undefined>(undefined);

interface SectionProviderProps {
  children: ReactNode;
  sectionId: string;
}

export function SectionProvider({ children, sectionId }: SectionProviderProps) {
  const { sections, addSectionItem, removeSectionItem, updateSectionItem } = useDashboard();

  const section = useMemo(() => 
    sections.find(s => s.id === sectionId), 
    [sections, sectionId]
  );

  const contextValue = useMemo(() => {
    if (!section) {
      return undefined;
    }

    const total = section.type === 'summary_list' 
      ? section.items.reduce((acc, item) => acc + (item.amount || 0), 0)
      : (section.total || 0);

    return {
      section: {
        ...section,
        total // Override total with calculated one if needed, or just pass it
      },
      addItem: () => addSectionItem(sectionId),
      removeItem: (itemId: string) => removeSectionItem(sectionId, itemId),
      updateItem: (itemId: string, updates: Partial<SectionItemDTO>) => updateSectionItem(sectionId, itemId, updates),
      total
    };
  }, [section, sectionId, addSectionItem, removeSectionItem, updateSectionItem]);

  if (!section || !contextValue) {
    // Or return null, or render children with null context?
    // If section doesn't exist, we probably shouldn't render the consumer.
    return null; 
  }

  return (
    <SectionContext.Provider value={contextValue}>
      {children}
    </SectionContext.Provider>
  );
}

export function useSection() {
  const context = useContext(SectionContext);
  if (context === undefined) {
    throw new Error('useSection must be used within a SectionProvider');
  }
  return context;
}
