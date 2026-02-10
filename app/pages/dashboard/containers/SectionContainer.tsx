'use client';

import React from 'react';
import { useSection } from '../contexts/SectionContext';
import { SectionTable } from '../components/organisms/SectionTable';

export function SectionContainer() {
  const { section, addItem, removeItem, updateItem, updateSection } = useSection();

  return (
    <SectionTable 
      section={section}
      onAdd={addItem}
      onRemove={removeItem}
      onUpdate={updateItem}
      onUpdateSection={updateSection}
    />
  );
}
