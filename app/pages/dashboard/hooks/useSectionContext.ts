import { useContext } from "react";
import { SectionContext } from "../contexts/SectionContext";

export function useSectionContext() {
  const context = useContext(SectionContext);
  if (context === undefined) {
    throw new Error('useSection must be used within a SectionProvider');
  }
  return context;
}