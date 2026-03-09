import { PrismaClient } from '@/app/generated/prisma/client';
import { SectionDTO, DebtCardDTO, SectionItemDTO, DebtItemDTO, SectionLayoutType, SectionItemVariantType, DebtCardType, DebtColorType } from '../dtos/dashboard.dto';
import { SectionLayoutEnum } from '../enums/SectionLayoutEnum';

function isTmpId(id: string): boolean {
  return id.startsWith('tmp_');
}

function toSectionDTO(row: {
  id: string;
  title: string;
  icon: string;
  type: string;
  isIncome: boolean;
  order: number;
  total: number;
  actionLabel: string | null;
  items: { id: string; name: string; amount: number; variant: string | null; isPaid: boolean }[];
}): SectionDTO {
  return {
    id: row.id,
    title: row.title,
    icon: row.icon,
    type: row.type.toLowerCase() as SectionLayoutType,
    isIncome: row.isIncome,
    order: row.order,
    total: row.total,
    action: row.actionLabel ? { label: row.actionLabel } : undefined,
    items: row.items.map((item) => ({
      id: item.id,
      name: item.name,
      amount: item.amount,
      variant: (item.variant as SectionItemVariantType) ?? 'default',
      isPaid: item.isPaid ?? false,
    })),
  };
}

function toDebtCardDTO(row: {
  id: string;
  name: string;
  subtitle: string;
  amount: number;
  type: string;
  color: string;
  isPaid: boolean;
  order: number;
  details: { id: string; name: string; amount: number }[];
}): DebtCardDTO {
  return {
    id: row.id,
    name: row.name,
    subtitle: row.subtitle,
    amount: row.amount,
    type: row.type as DebtCardType,
    color: row.color as DebtColorType,
    isPaid: row.isPaid ?? false,
    order: row.order,
    details: row.details.map((detail) => ({
      id: detail.id,
      name: detail.name,
      amount: detail.amount,
    })),
  };
}

async function syncSectionItem(
  db: PrismaClient,
  sectionId: string,
  item: SectionItemDTO
): Promise<SectionItemDTO> {
  if (isTmpId(item.id)) {
    const row = await db.sectionItem.create({
      data: {
        name: item.name ?? '',
        amount: item.amount ?? 0,
        variant: item.variant ?? 'default',
        isPaid: item.isPaid ?? false,
        sectionId,
      },
    });
    return {
      id: row.id,
      name: row.name,
      amount: row.amount,
      variant: (row.variant as SectionItemVariantType) ?? 'default',
      isPaid: row.isPaid ?? false,
    };
  }

  const row = await db.sectionItem.update({
    where: { id: item.id },
    data: {
      name: item.name ?? '',
      amount: item.amount ?? 0,
      variant: item.variant,
      isPaid: item.isPaid ?? false,
    },
  });
  return {
    id: row.id,
    name: row.name,
    amount: row.amount,
    variant: (row.variant as SectionItemVariantType) ?? 'default',
    isPaid: row.isPaid ?? false,
  };
}

async function syncSection(
  db: PrismaClient,
  userId: string,
  section: SectionDTO
): Promise<SectionDTO> {
  let persistedSection;

  if (isTmpId(section.id)) {
    const row = await db.section.create({
      data: {
        title: section.title,
        icon: section.icon,
        type: section.type === SectionLayoutEnum.SIMPLE_LIST ? 'SIMPLE_LIST' : 'SUMMARY_LIST',
        isIncome: section.isIncome ?? false,
        actionLabel: section.action?.label,
        order: section.total ?? 0,
        userId,
      },
      include: { items: true },
    });
    persistedSection = row;
  } else {
    const row = await db.section.update({
      where: { id: section.id, userId },
      data: {
        title: section.title,
        icon: section.icon,
        isIncome: section.isIncome,
        actionLabel: section.action?.label,
      },
      include: { items: true },
    });
    persistedSection = row;
  }

  const receivedItemIds = new Set(section.items.map((item) => item.id).filter((id) => !isTmpId(id)));
  const existingItemIds = new Set(persistedSection.items.map((item) => item.id));
  const itemsToDelete = [...existingItemIds].filter((id) => !receivedItemIds.has(id));

  if (itemsToDelete.length > 0) {
    await db.sectionItem.deleteMany({
      where: { id: { in: itemsToDelete } },
    });
  }

  const syncedItems: SectionItemDTO[] = [];
  for (const item of section.items) {
    const syncedItem = await syncSectionItem(db, persistedSection.id, item);
    syncedItems.push(syncedItem);
  }

  return {
    id: persistedSection.id,
    title: persistedSection.title,
    icon: persistedSection.icon,
    type: persistedSection.type.toLowerCase() as SectionLayoutType,
    isIncome: persistedSection.isIncome,
    order: persistedSection.order,
    total: persistedSection.total,
    action: persistedSection.actionLabel ? { label: persistedSection.actionLabel } : undefined,
    items: syncedItems,
  };
}

async function syncDebtDetail(
  db: PrismaClient,
  debtId: string,
  detail: DebtItemDTO
): Promise<DebtItemDTO> {
  if (isTmpId(detail.id)) {
    const row = await db.debtDetail.create({
      data: {
        name: detail.name,
        amount: detail.amount,
        debtId,
      },
    });
    return { id: row.id, name: row.name, amount: row.amount };
  }

  const row = await db.debtDetail.update({
    where: { id: detail.id },
    data: {
      name: detail.name,
      amount: detail.amount,
    },
  });
  return { id: row.id, name: row.name, amount: row.amount };
}

async function syncDebt(
  db: PrismaClient,
  userId: string,
  debt: DebtCardDTO
): Promise<DebtCardDTO> {
  let persistedDebt;

  if (isTmpId(debt.id)) {
    const maxOrder = await db.debt.aggregate({
      where: { userId },
      _max: { order: true },
    });

    const row = await db.debt.create({
      data: {
        name: debt.name,
        subtitle: debt.subtitle,
        type: debt.type ?? 'credit_card',
        color: debt.color ?? 'blue',
        isPaid: debt.isPaid ?? false,
        order: debt.order ?? (maxOrder._max.order ?? -1) + 1,
        userId,
      },
      include: { details: true },
    });
    persistedDebt = row;
  } else {
    const row = await db.debt.update({
      where: { id: debt.id, userId },
      data: {
        name: debt.name,
        subtitle: debt.subtitle,
        color: debt.color,
        isPaid: debt.isPaid ?? false,
      },
      include: { details: true },
    });
    persistedDebt = row;
  }

  const receivedDetailIds = new Set((debt.details ?? []).map((d) => d.id).filter((id) => !isTmpId(id)));
  const existingDetailIds = new Set(persistedDebt.details.map((d) => d.id));
  const detailsToDelete = [...existingDetailIds].filter((id) => !receivedDetailIds.has(id));

  if (detailsToDelete.length > 0) {
    await db.debtDetail.deleteMany({
      where: { id: { in: detailsToDelete } },
    });
  }

  const syncedDetails: DebtItemDTO[] = [];
  for (const detail of debt.details ?? []) {
    const syncedDetail = await syncDebtDetail(db, persistedDebt.id, detail);
    syncedDetails.push(syncedDetail);
  }

  const total = syncedDetails.reduce((sum, d) => sum + d.amount, 0);
  const updatedDebt = await db.debt.update({
    where: { id: persistedDebt.id },
    data: { amount: total },
    include: { details: true },
  });

  return toDebtCardDTO(updatedDebt);
}

export interface SaveDashboardData {
  sections: SectionDTO[];
  debts: DebtCardDTO[];
}

export async function saveDashboard(
  db: PrismaClient,
  userId: string,
  data: SaveDashboardData
): Promise<{ sections: SectionDTO[]; debts: DebtCardDTO[] }> {
  const existingSections = await db.section.findMany({
    where: { userId },
    select: { id: true },
  });
  const existingSectionIds = new Set(existingSections.map((s) => s.id));

  const existingDebts = await db.debt.findMany({
    where: { userId },
    select: { id: true },
  });
  const existingDebtIds = new Set(existingDebts.map((d) => d.id));

  const receivedSectionIds = new Set(data.sections.map((s) => s.id).filter((id) => !isTmpId(id)));
  const sectionsToDelete = [...existingSectionIds].filter((id) => !receivedSectionIds.has(id));

  const receivedDebtIds = new Set(data.debts.map((d) => d.id).filter((id) => !isTmpId(id)));
  const debtsToDelete = [...existingDebtIds].filter((id) => !receivedDebtIds.has(id));

  await db.$transaction([
    db.sectionItem.deleteMany({
      where: { sectionId: { in: sectionsToDelete } },
    }),
    db.section.deleteMany({
      where: { id: { in: sectionsToDelete } },
    }),
    db.debtDetail.deleteMany({
      where: { debtId: { in: debtsToDelete } },
    }),
    db.debt.deleteMany({
      where: { id: { in: debtsToDelete } },
    }),
  ]);

  const syncedSections: SectionDTO[] = [];
  for (const section of data.sections) {
    const syncedSection = await syncSection(db, userId, section);
    syncedSections.push(syncedSection);
  }

  const syncedDebts: DebtCardDTO[] = [];
  for (const debt of data.debts) {
    const syncedDebt = await syncDebt(db, userId, debt);
    syncedDebts.push(syncedDebt);
  }

  return { sections: syncedSections, debts: syncedDebts };
}
