import { SectionDTO, SectionItemDTO } from "./dashboard.dto";

export interface SectionContextInterface {
  section: SectionDTO;
  addItem: () => void;
  removeItem: (itemId: string) => void;
  updateItem: (itemId: string, updates: Partial<SectionItemDTO>) => void;
  updateSection: (updates: Partial<SectionDTO>) => void;
  removeSection: (sectionId: string) => void;
  requestRemoveSection: () => void;
  total: number;
}
