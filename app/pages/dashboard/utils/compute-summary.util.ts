import { SectionDTO, DebtCardDTO, SummaryDTO } from '../dtos/dashboard.dto';

/**
 * Computes the dashboard summary from the current sections and debts state.
 *
 * Sections with `isIncome === true` contribute to income.
 * All other sections and debt amounts contribute to expenses.
 * Savings is reserved for future use and defaults to 0.
 */
export function computeSummary(
  sections: SectionDTO[],
  debts: DebtCardDTO[]
): SummaryDTO {
  let totalIncome = 0;
  let totalExpenses = 0;

  for (const section of sections) {
    const sectionTotal = section.items.reduce((acc, item) => acc + (item.amount ?? 0), 0);
    if (section.isIncome) {
      totalIncome += sectionTotal;
    } else {
      totalExpenses += sectionTotal;
    }
  }

  const totalDebts = debts.reduce((acc, debt) => acc + (debt.amount ?? 0), 0);
  totalExpenses += totalDebts;

  return {
    income: totalIncome,
    expenses: totalExpenses,
    savings: 0,
    balance: totalIncome - totalExpenses,
  };
}
