'use client';

import React, { createContext, useState, useEffect, useCallback, useRef } from 'react';
import { SectionDTO, SummaryDTO, DebtCardDTO, SectionItemDTO, DebtItemDTO, DashboardProviderProps } from '../dtos/dashboard.dto';
import { DashboardContextInterface } from '../dtos/dashboard-context.dto';
import { ConfirmModal } from '../../../components/molecules/ConfirmModal';
import { createTmpId } from '../utils/temp-id.util';

export const DashboardContext = createContext<DashboardContextInterface | undefined>(undefined);

export function DashboardProvider({
  children,
  initialSections,
  initialDebts,
  initialSummary,
}: DashboardProviderProps) {
  const [sections, setSections] = useState<SectionDTO[]>(initialSections);
  const [debts, setDebts] = useState<DebtCardDTO[]>(initialDebts);
  const [summary, setSummary] = useState<SummaryDTO>(initialSummary);
  const [pendingRemoveSectionId, setPendingRemoveSectionId] = useState<string | null>(null);
  const timerAutoSave = useRef<NodeJS.Timeout | null>(null);
  let delay = 1;

  const handleAutoSave = (
    type: 'section' | 'debt',
    time: number = 3
  ) => {
    delay = time;

    if (timerAutoSave.current) {
      clearTimeout(timerAutoSave.current);
    }

    timerAutoSave.current = setTimeout(() => {
      if (type === 'section') {
        // complete save code
        // useSectionSave(sections);
      }
      console.log('handle autosave')
    }, delay * 1000);
  };

  useEffect(() => {
    console.log('timer', timerAutoSave.current);
  }, [timerAutoSave.current]);



  useEffect(() => {
    let totalIncome = 0;
    let totalExpenses = 0;

    sections.forEach((section, index) => {
      const sectionTotal = section.items.reduce((acc, item) => acc + item.amount, 0);
      if (index === 0 && section.type === 'simple_list') {
        totalIncome += sectionTotal;
      } else {
        totalExpenses += sectionTotal;
      }
    });

    const totalDebts = debts.reduce((acc, debt) => acc + debt.amount, 0);
    totalExpenses += totalDebts;

    setSummary({
      income: totalIncome,
      expenses: totalExpenses,
      savings: 0,
      balance: totalIncome - totalExpenses,
    });
    // handleAutoSave(5);
  }, [sections, debts]);
  useEffect(() => {
    handleAutoSave('section', 5);
  }, [sections]);

  // --------------------------------------------------------------------------
  // Section item mutations — optimistic state + enqueue
  // --------------------------------------------------------------------------

  // Done
  const addSectionItem = useCallback((sectionId: string) => {
    const section = sections.find(s => s.id === sectionId);
    const variant = section?.type === 'simple_list' ? 'income' : 'neutral';
    const tmpId = createTmpId();

    const newItem: SectionItemDTO = { id: tmpId, name: 'Nuevo Item', amount: 0, variant };

    setSections(prev => prev.map(s =>
      s.id === sectionId ? { ...s, items: [...s.items, newItem] } : s
    ));
    // TODO: Remove
    // enqueueAndResolve({
    //   type: 'ADD_SECTION_ITEM',
    //   tmpId,
    //   sectionId,
    //   data: { name: newItem.name, amount: newItem.amount, variant },
    // });
  }, [sections]);

  // Done
  const removeSectionItem = useCallback((sectionId: string, itemId: string) => {
    setSections(prev => prev.map(s =>
      s.id === sectionId ? { ...s, items: s.items.filter(item => item.id !== itemId) } : s
    ));
  }, []);

  const updateSectionItem = useCallback((
    sectionId: string,
    itemId: string,
    updates: Partial<SectionItemDTO>
  ) => {
    setSections(prev => prev.map(s =>
      s.id === sectionId
        ? { ...s, items: s.items.map(item => item.id === itemId ? { ...item, ...updates } : item) }
        : s
    ));
  }, []);

  const addSection = useCallback(() => {
    const tmpId = createTmpId();
    const newSection: SectionDTO = {
      id: tmpId,
      title: 'Nueva Sección',
      icon: 'list',
      type: 'summary_list',
      action: { label: 'Agregar' },
      items: [],
      total: 0,
    };

    setSections(prev => [...prev, newSection]);
  }, [sections]);

  // Done
  const updateSection = useCallback((sectionId: string, updates: Partial<SectionDTO>) => {
    setSections(prev => prev.map(s =>
      s.id === sectionId ? { ...s, ...updates } : s
    ));

    const payload: { title?: string; icon?: string; actionLabel?: string } = {};
    if (updates.title !== undefined) payload.title = updates.title;
    if (updates.icon !== undefined) payload.icon = updates.icon;
    if (updates.action?.label !== undefined) payload.actionLabel = updates.action.label;
  }, [sections]);

  const removeSection = useCallback((sectionId: string) => {
    setSections(prev => prev.filter(s => s.id !== sectionId));
  }, []);

  // --------------------------------------------------------------------------
  // Deletion start
  // --------------------------------------------------------------------------
  const requestRemoveSection = useCallback((sectionId: string) => {
    setPendingRemoveSectionId(sectionId);
  }, []);

  const confirmRemoveSection = useCallback(() => {
    if (pendingRemoveSectionId) {
      removeSection(pendingRemoveSectionId);
    }
    setPendingRemoveSectionId(null);
  }, [pendingRemoveSectionId, removeSection]);

  const cancelRemoveSection = useCallback(() => {
    setPendingRemoveSectionId(null);
  }, []);
  // --------------------------------------------------------------------------
  // Deletion end
  // --------------------------------------------------------------------------

  const addDebtDetail = useCallback((debtId: string) => {
    const tmpId = createTmpId();
    const newDetail: DebtItemDTO = { id: tmpId, name: 'Nueva Compra', amount: 0 };

    setDebts(prev => prev.map(d => {
      if (d.id !== debtId) return d;
      const updatedDetails = [...(d.details ?? []), newDetail];
      return { ...d, details: updatedDetails, amount: updatedDetails.reduce((s, i) => s + i.amount, 0) };
    }));
  }, []);

  const removeDebtDetail = useCallback((debtId: string, detailId: string) => {
    setDebts(prev => prev.map(d => {
      if (d.id !== debtId) return d;
      const updatedDetails = (d.details ?? []).filter(i => i.id !== detailId);
      return { ...d, details: updatedDetails, amount: updatedDetails.reduce((s, i) => s + i.amount, 0) };
    }));
  }, []);

  const updateDebtDetail = useCallback((
    debtId: string,
    detailId: string,
    updates: Partial<DebtItemDTO>
  ) => {
    setDebts(prev => prev.map(d => {
      if (d.id !== debtId) return d;
      const updatedDetails = (d.details ?? []).map(i =>
        i.id === detailId ? { ...i, ...updates } : i
      );
      return { ...d, details: updatedDetails, amount: updatedDetails.reduce((s, i) => s + i.amount, 0) };
    }));
  }, [debts]);

  const addDebt = useCallback(() => {
    const tmpId = createTmpId();
    const newDebt: DebtCardDTO = {
      id: tmpId,
      name: 'Nueva Tarjeta',
      subtitle: 'Saldo pendiente',
      amount: 0,
      type: 'credit_card',
      color: 'blue',
      details: [],
    };
    setDebts(prev => [...prev, newDebt]);
  }, []);

  const updateDebt = useCallback((debtId: string, updates: Partial<DebtCardDTO>) => {
    setDebts(prev => prev.map(d => d.id === debtId ? { ...d, ...updates } : d));

    const payload: { name?: string; subtitle?: string; color?: typeof updates.color } = {};
    if (updates.name !== undefined) payload.name = updates.name;
    if (updates.subtitle !== undefined) payload.subtitle = updates.subtitle;
    if (updates.color !== undefined) payload.color = updates.color;
  }, [debts]);

  return (
    <DashboardContext.Provider value={{
      sections,
      debts,
      summary,
      addSectionItem,
      removeSectionItem,
      updateSectionItem,
      addDebtDetail,
      removeDebtDetail,
      updateDebtDetail,
      updateDebt,
      addSection,
      addDebt,
      updateSection,
      removeSection,
      requestRemoveSection,
    }}>
      {children}
      <ConfirmModal
        open={pendingRemoveSectionId !== null}
        title="Eliminar sección"
        description="¿Estás seguro de que deseas eliminar esta sección? Esta acción no se puede deshacer."
        onConfirm={confirmRemoveSection}
        onCancel={cancelRemoveSection}
      />
    </DashboardContext.Provider>
  );
}
