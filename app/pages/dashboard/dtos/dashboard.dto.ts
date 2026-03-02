// ============================================================================
// Types
// ============================================================================

import { ReactNode } from "react";
import { SectionLayoutEnum } from "../enums/SectionLayoutEnum";

export type SectionItemVariantType = 'income' | 'expense' | 'neutral' | 'default';
export type SectionLayoutType = `${SectionLayoutEnum}`;
export type DebtColorType = 'purple' | 'blue';
export type DebtCardType = 'credit_card';

// ============================================================================
// Interfaces
// ============================================================================

export interface SectionItemInterface {
  id: string;
  name: string | null;
  amount: number | null;
  variant?: SectionItemVariantType;
}

export interface SectionInterface {
  id: string;
  title: string;
  icon: string;
  type: SectionLayoutType;
  /** Whether this section contributes to income. false = expense section. */
  isIncome: boolean;
  order: number;
  total?: number;
  items: SectionItemInterface[];
  action?: {
    label: string;
  };
}

export interface DebtItemInterface {
  id: string;
  name: string;
  amount: number;
}

export interface DebtCardInterface {
  id: string;
  name: string;
  subtitle: string;
  amount: number;
  type: DebtCardType;
  color: DebtColorType;
  order: number;
  details?: DebtItemInterface[];
}

export interface SummaryInterface {
  income: number;
  expenses: number;
  savings: number;
  balance: number;
}

// ============================================================================
// DTOs — plain object types implementing their interfaces.
// No constructors: class instances cannot cross the server/client boundary in
// Next.js (React requires plain objects for serialization).
// ============================================================================

export type SectionItemDTO = SectionItemInterface;
export type SectionDTO = SectionInterface;
export type DebtItemDTO = DebtItemInterface;
export type DebtCardDTO = DebtCardInterface;
export type SummaryDTO = SummaryInterface;

export interface DashboardProviderProps {
  children: ReactNode;
  initialSections: SectionDTO[];
  initialDebts: DebtCardDTO[];
  initialSummary: SummaryDTO;
}
