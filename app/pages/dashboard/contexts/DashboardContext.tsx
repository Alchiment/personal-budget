'use client';

import React, { createContext, useState, useEffect, useCallback, useRef } from 'react';
import { SectionDTO, SummaryDTO, DebtCardDTO, SectionItemDTO, DebtItemDTO, DashboardProviderProps } from '../dtos/dashboard.dto';
import { DashboardContextInterface } from '../dtos/dashboard-context.dto';
import { ConfirmModal } from '../../../components/molecules/ConfirmModal';
import { createTmpId } from '../utils/temp-id.util';
import { saveDashboard } from '../services/dashboardSaveService';
import { computeSummary } from '../utils/compute-summary.util';
import { SectionLayoutEnum } from '../enums/SectionLayoutEnum';
import { useAlert } from '@/app/contexts/AlertContext';

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
  const [pendingRemoveDebtId, setPendingRemoveDebtId] = useState<string | null>(null);
  const { showAlert } = useAlert();
  const timerAutoSave = useRef<NodeJS.Timeout | null>(null);
  const sectionsRef = useRef<SectionDTO[]>(sections);
  const debtsRef = useRef<DebtCardDTO[]>(debts);

  useEffect(() => { sectionsRef.current = sections; }, [sections]);
  useEffect(() => { debtsRef.current = debts; }, [debts]);

  const handleAutoSave = useCallback((
    time: number = 3
  ) => {
    if (timerAutoSave.current) {
      clearTimeout(timerAutoSave.current);
    }

    timerAutoSave.current = setTimeout(async () => {
      try {
        await saveDashboard(sectionsRef.current, debtsRef.current);
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to save changes';
        showAlert(message);
      }
    }, time * 1000);
  }, [showAlert]);



  useEffect(() => {
    setSummary(computeSummary(sections, debts));
  }, [sections, debts]);

  useEffect(() => {
    handleAutoSave();
  }, [sections, debts]);

  // --------------------------------------------------------------------------
  // Section item mutations — optimistic state + enqueue
  // --------------------------------------------------------------------------

  // Done
  const addSectionItem = useCallback((sectionId: string) => {
    const section = sections.find(s => s.id === sectionId);
    const variant = section?.isIncome ? 'income' : 'neutral';
    const tmpId = createTmpId();

    const newItem: SectionItemDTO = { id: tmpId, name: null, amount: null, variant };

    setSections(prev => prev.map(s =>
      s.id === sectionId ? { ...s, items: [...s.items, newItem] } : s
    ));
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
    const maxOrder = sections.length > 0 ? Math.max(...sections.map(s => s.order)) : -1;
    const newSection: SectionDTO = {
      id: tmpId,
      title: 'Nueva Sección',
      icon: 'list',
      type: SectionLayoutEnum.SUMMARY_LIST,
      isIncome: false,
      order: maxOrder + 1,
      action: { label: 'Agregar' },
      items: [],
      total: 0,
    };

    setSections(prev => [...prev, newSection]);
  }, [sections]);

  const addIncomeSection = useCallback(() => {
    const tmpId = createTmpId();
    const maxOrder = sections.length > 0 ? Math.max(...sections.map(s => s.order)) : -1;
    const newSection: SectionDTO = {
      id: tmpId,
      title: 'Nueva Sección de Ingresos',
      icon: 'payments',
      type: SectionLayoutEnum.SIMPLE_LIST,
      isIncome: true,
      order: maxOrder + 1,
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
    const newDetail: DebtItemDTO = { id: tmpId, name: '', amount: 0 };

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
    const maxOrder = debts.length > 0 ? Math.max(...debts.map(d => d.order)) : -1;
    const newDebt: DebtCardDTO = {
      id: tmpId,
      name: '',
      subtitle: '',
      amount: 0,
      type: 'credit_card',
      color: 'blue',
      order: maxOrder + 1,
      details: [],
    };
    setDebts(prev => [...prev, newDebt]);
  }, []);

  const updateDebt = useCallback((debtId: string, updates: Partial<DebtCardDTO>) => {
    setDebts(prev => prev.map(d => d.id === debtId ? { ...d, ...updates } : d));

    const payload: { name?: string; subtitle?: string; color?: typeof updates.color } = {};
    if (updates.name) payload.name = updates.name;
    if (updates.subtitle) payload.subtitle = updates.subtitle;
    if (updates.color) payload.color = updates.color;
  }, [debts]);

  const removeDebt = useCallback((debtId: string) => {
    setDebts(prev => prev.filter(d => d.id !== debtId));
  }, []);

  const requestRemoveDebt = useCallback((debtId: string) => {
    setPendingRemoveDebtId(debtId);
  }, []);

  const confirmRemoveDebt = useCallback(() => {
    if (pendingRemoveDebtId) {
      removeDebt(pendingRemoveDebtId);
    }
    setPendingRemoveDebtId(null);
  }, [pendingRemoveDebtId, removeDebt]);

  const cancelRemoveDebt = useCallback(() => {
    setPendingRemoveDebtId(null);
  }, []);

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
      addIncomeSection,
      addDebt,
      updateSection,
      removeSection,
      requestRemoveSection,
      removeDebt,
      requestRemoveDebt,
    }}>
      {children}
      <ConfirmModal
        open={pendingRemoveSectionId !== null}
        title="Eliminar sección"
        description="¿Estás seguro de que deseas eliminar esta sección? Esta acción no se puede deshacer."
        onConfirm={confirmRemoveSection}
        onCancel={cancelRemoveSection}
      />
      <ConfirmModal
        open={pendingRemoveDebtId !== null}
        title="Eliminar tarjeta"
        description="¿Estás seguro de que deseas eliminar esta tarjeta? Esta acción no se puede deshacer."
        onConfirm={confirmRemoveDebt}
        onCancel={cancelRemoveDebt}
      />
    </DashboardContext.Provider>
  );
}
