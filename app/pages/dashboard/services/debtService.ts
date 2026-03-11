import { PrismaClient } from '@/app/generated/prisma/client';
import { DebtCardDTO, DebtItemDTO, DebtCardType, DebtColorType } from '../dtos/dashboard.dto';

// ============================================================================
// Helpers
// ============================================================================

function toDebtItemDTO(detail: {
  id: string;
  name: string;
  amount: number;
}): DebtItemDTO {
  return { id: detail.id, name: detail.name, amount: detail.amount };
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
    details: row.details.map(toDebtItemDTO),
  };
}

// ============================================================================
// Read
// ============================================================================

export async function getDebtsByUser(
  db: PrismaClient,
  userId: string
): Promise<DebtCardDTO[]> {
  const rows = await db.debt.findMany({
    where: { userId },
    orderBy: { order: 'asc' },
    include: { details: true },
  });

  return rows.map(toDebtCardDTO);
}

// ============================================================================
// Debt mutations
// ============================================================================

export async function createDebt(
  db: PrismaClient,
  userId: string,
  data: { name: string; subtitle: string; type?: DebtCardType; color?: DebtColorType; order?: number }
): Promise<DebtCardDTO> {
  const maxOrder = await db.debt.aggregate({
    where: { userId },
    _max: { order: true },
  });

  const row = await db.debt.create({
    data: {
      name: data.name,
      subtitle: data.subtitle,
      amount: 0,
      type: data.type ?? 'credit_card',
      color: data.color ?? 'blue',
      isPaid: false,
      order: data.order ?? (maxOrder._max.order ?? -1) + 1,
      userId,
    },
    include: { details: true },
  });

  return toDebtCardDTO(row);
}

export async function updateDebt(
  db: PrismaClient,
  debtId: string,
  userId: string,
  data: Partial<{ name: string; subtitle: string; color: DebtColorType }>
): Promise<DebtCardDTO> {
  const row = await db.debt.update({
    where: { id: debtId, userId },
    data,
    include: { details: true },
  });

  return toDebtCardDTO(row);
}

export async function deleteDebt(
  db: PrismaClient,
  debtId: string,
  userId: string
): Promise<void> {
  await db.debt.delete({ where: { id: debtId, userId } });
}

// ============================================================================
// Debt detail mutations
// ============================================================================

export async function createDebtDetail(
  db: PrismaClient,
  debtId: string,
  userId: string,
  data: { name: string; amount: number }
): Promise<DebtCardDTO> {
  await db.debt.findFirstOrThrow({ where: { id: debtId, userId } });

  await db.debtDetail.create({
    data: { name: data.name, amount: data.amount, debtId },
  });

  const details = await db.debtDetail.findMany({ where: { debtId } });
  const total = details.reduce((sum, d) => sum + d.amount, 0);

  const row = await db.debt.update({
    where: { id: debtId },
    data: { amount: total },
    include: { details: true },
  });

  return toDebtCardDTO(row);
}

export async function updateDebtDetail(
  db: PrismaClient,
  detailId: string,
  userId: string,
  data: Partial<{ name: string; amount: number }>
): Promise<DebtCardDTO> {
  const existing = await db.debtDetail.findFirstOrThrow({
    where: { id: detailId, debt: { userId } },
  });

  await db.debtDetail.update({ where: { id: detailId }, data });

  const details = await db.debtDetail.findMany({ where: { debtId: existing.debtId } });
  const total = details.reduce((sum, d) => sum + d.amount, 0);

  const row = await db.debt.update({
    where: { id: existing.debtId },
    data: { amount: total },
    include: { details: true },
  });

  return toDebtCardDTO(row);
}

export async function deleteDebtDetail(
  db: PrismaClient,
  detailId: string,
  userId: string
): Promise<DebtCardDTO> {
  const existing = await db.debtDetail.findFirstOrThrow({
    where: { id: detailId, debt: { userId } },
  });

  await db.debtDetail.delete({ where: { id: detailId } });

  const details = await db.debtDetail.findMany({ where: { debtId: existing.debtId } });
  const total = details.reduce((sum, d) => sum + d.amount, 0);

  const row = await db.debt.update({
    where: { id: existing.debtId },
    data: { amount: total },
    include: { details: true },
  });

  return toDebtCardDTO(row);
}
