'use client';

import React, { createContext, useContext, ReactNode, useMemo } from 'react';
import { SectionDTO, SectionItemDTO } from '../dtos/dashboard.dto';
import { useDashboardContext } from '../hooks/useDashboardContext';
import { SectionContextInterface } from '../dtos/section-context.dto';
import { SectionProviderProps } from '../dtos/section.dto';
import { SectionLayoutEnum } from '../enums/SectionLayoutEnum';


export const SectionContext = createContext<SectionContextInterface | undefined>(undefined);

export function SectionProvider({ children, sectionId }: SectionProviderProps) {
  const { sections, addSectionItem, removeSectionItem, updateSectionItem, resetSectionItems, updateSection, removeSection, requestRemoveSection } = useDashboardContext();

  const section = useMemo(() => 
    sections.find(s => s.id === sectionId), 
    [sections, sectionId]
  );

  const contextValue = useMemo(() => {
    if (!section) {
      return undefined;
    }

    const total = section.type === SectionLayoutEnum.SUMMARY_LIST 
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
      resetPaidItems: () => resetSectionItems(sectionId),
      updateSection: (updates: Partial<SectionDTO>) => updateSection(sectionId, updates),
      removeSection: () => removeSection(sectionId),
      requestRemoveSection: () => requestRemoveSection(sectionId),
      total
    };
  }, [section, sectionId, addSectionItem, removeSectionItem, updateSectionItem, resetSectionItems, updateSection, removeSection, requestRemoveSection]);

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
