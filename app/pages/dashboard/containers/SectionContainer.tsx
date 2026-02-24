'use client';

import React from 'react';
import { SectionTable } from '../components/organisms/SectionTable';
import { useSectionContext } from '../hooks/useSectionContext';

export function SectionContainer() {
  const { section, addItem, removeItem, updateItem, updateSection, requestRemoveSection } = useSectionContext();

  return (
    <SectionTable 
      section={section}
      onAdd={addItem}
      onRemove={removeItem}
      onUpdate={updateItem}
      onUpdateSection={updateSection}
      onRemoveSection={requestRemoveSection}
    />
  );
}
