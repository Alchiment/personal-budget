import { PrismaClient } from '@/app/generated/prisma/client';
import { SectionDTO, SummaryDTO } from '../dtos/dashboard.dto';
import { computeSummary } from '../utils/compute-summary.util';

/**
 * Computes the dashboard summary by aggregating sections and debts for a user.
 * Sections with isIncome === true contribute to income.
 * All other sections and debt amounts are treated as expenses.
 */
export async function getSummaryByUser(
  db: PrismaClient,
  userId: string
): Promise<SummaryDTO> {
  const rows = await db.section.findMany({
    where: { userId },
    orderBy: { order: 'asc' },
    include: { items: true },
  });

  const debts = await db.debt.findMany({
    where: { userId },
  });

  const sections: SectionDTO[] = rows.map((row) => ({
    id: row.id,
    title: row.title,
    icon: row.icon,
    type: row.type.toLowerCase() as SectionDTO['type'],
    isIncome: row.isIncome,
    order: row.order,
    total: row.total,
    action: row.actionLabel ? { label: row.actionLabel } : undefined,
    items: row.items.map((item) => ({
      id: item.id,
      name: item.name,
      amount: item.amount,
      variant: (item.variant as SectionDTO['items'][number]['variant']) ?? 'default',
    })),
  }));

  const debtDTOs = debts.map((debt) => ({
    id: debt.id,
    name: debt.name,
    subtitle: debt.subtitle,
    amount: debt.amount,
    type: debt.type as 'credit_card',
    color: debt.color as 'purple' | 'blue',
    order: debt.order,
  }));

  return computeSummary(sections, debtDTOs);
}
