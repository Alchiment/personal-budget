import { DebtCardDTO, DebtItemDTO, SectionDTO, SectionItemDTO, SummaryDTO } from "./dashboard.dto";

export interface DashboardContextInterface {
  sections: SectionDTO[];
  debts: DebtCardDTO[];
  summary: SummaryDTO;
  saveError: string | null;
  clearSaveError: () => void;
  addSectionItem: (sectionId: string) => void;
  removeSectionItem: (sectionId: string, itemId: string) => void;
  updateSectionItem: (sectionId: string, itemId: string, updates: Partial<SectionItemDTO>) => void;
  addDebtDetail: (debtId: string) => void;
  removeDebtDetail: (debtId: string, detailId: string) => void;
  updateDebtDetail: (debtId: string, detailId: string, updates: Partial<DebtItemDTO>) => void;
  updateDebt: (debtId: string, updates: Partial<DebtCardDTO>) => void;
  addSection: () => void;
  addIncomeSection: () => void;
  addDebt: () => void;
  updateSection: (sectionId: string, updates: Partial<SectionDTO>) => void;
  removeSection: (sectionId: string) => void;
  requestRemoveSection: (sectionId: string) => void;
}