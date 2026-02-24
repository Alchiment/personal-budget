import { PrismaClient } from '@/app/generated/prisma/client';
import { SummaryDTO } from '../dtos/dashboard.dto';

/**
 * Computes the dashboard summary by aggregating sections and debts for a user.
 * The first SIMPLE_LIST section (by order) is treated as income.
 * All remaining sections and debt amounts are treated as expenses.
 */
export async function getSummaryByUser(
  db: PrismaClient,
  userId: string
): Promise<SummaryDTO> {
  const sections = await db.section.findMany({
    where: { userId },
    orderBy: { order: 'asc' },
    include: { items: true },
  });

  const debts = await db.debt.findMany({
    where: { userId },
  });

  let totalIncome = 0;
  let totalExpenses = 0;

  sections.forEach((section, index) => {
    const sectionTotal = section.items.reduce((acc, item) => acc + item.amount, 0);
    if (index === 0 && section.type === 'SIMPLE_LIST') {
      totalIncome += sectionTotal;
    } else {
      totalExpenses += sectionTotal;
    }
  });

  const totalDebts = debts.reduce((acc, debt) => acc + debt.amount, 0);
  totalExpenses += totalDebts;

  return {
    income: totalIncome,
    expenses: totalExpenses,
    savings: 0,
    balance: totalIncome - totalExpenses,
  };
}
