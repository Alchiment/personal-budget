import { PrismaClient } from '@/app/generated/prisma/client';
import { SectionDTO, SectionItemDTO, SectionLayoutType, SectionItemVariantType } from '../dtos/dashboard.dto';
import { SectionLayoutEnum } from '../enums/SectionLayoutEnum';

// ============================================================================
// Helpers
// ============================================================================

function toSectionItemDTO(item: {
  id: string;
  name: string;
  amount: number;
  variant: string | null;
}): SectionItemDTO {
  return {
    id: item.id,
    name: item.name,
    amount: item.amount,
    variant: (item.variant as SectionItemVariantType) ?? 'default',
  };
}

function toSectionDTO(row: {
  id: string;
  title: string;
  icon: string;
  type: string;
  isIncome: boolean;
  total: number;
  actionLabel: string | null;
  items: { id: string; name: string; amount: number; variant: string | null }[];
}): SectionDTO {
  return {
    id: row.id,
    title: row.title,
    icon: row.icon,
    type: row.type.toLowerCase() as SectionLayoutType,
    isIncome: row.isIncome,
    total: row.total,
    action: row.actionLabel ? { label: row.actionLabel } : undefined,
    items: row.items.map(toSectionItemDTO),
  };
}

// ============================================================================
// Read
// ============================================================================

export async function getSectionsByUser(
  db: PrismaClient,
  userId: string
): Promise<SectionDTO[]> {
  const rows = await db.section.findMany({
    where: { userId },
    orderBy: { order: 'asc' },
    include: { items: true },
  });

  return rows.map(toSectionDTO);
}

// ============================================================================
// Section mutations
// ============================================================================

export async function createSection(
  db: PrismaClient,
  userId: string,
  data: { title: string; icon: string; type: SectionLayoutType; isIncome?: boolean; actionLabel?: string; order?: number }
): Promise<SectionDTO> {
  const row = await db.section.create({
    data: {
      title: data.title,
      icon: data.icon,
      type: data.type === SectionLayoutEnum.SIMPLE_LIST ? 'SIMPLE_LIST' : 'SUMMARY_LIST',
      isIncome: data.isIncome ?? false,
      actionLabel: data.actionLabel,
      order: data.order ?? 0,
      userId,
    },
    include: { items: true },
  });

  return toSectionDTO(row);
}

export async function updateSection(
  db: PrismaClient,
  sectionId: string,
  userId: string,
  data: Partial<{ title: string; icon: string; isIncome: boolean; actionLabel: string; order: number; total: number }>
): Promise<SectionDTO> {
  const row = await db.section.update({
    where: { id: sectionId, userId },
    data,
    include: { items: true },
  });

  return toSectionDTO(row);
}

export async function deleteSection(
  db: PrismaClient,
  sectionId: string,
  userId: string
): Promise<void> {
  await db.section.delete({ where: { id: sectionId, userId } });
}

// ============================================================================
// Section item mutations
// ============================================================================

export async function createSectionItem(
  db: PrismaClient,
  sectionId: string,
  userId: string,
  data: { name: string; amount: number; variant?: SectionItemVariantType }
): Promise<SectionItemDTO> {
  await db.section.findFirstOrThrow({ where: { id: sectionId, userId } });

  const row = await db.sectionItem.create({
    data: {
      name: data.name,
      amount: data.amount,
      variant: data.variant ?? 'default',
      sectionId,
    },
  });

  return toSectionItemDTO(row);
}

export async function updateSectionItem(
  db: PrismaClient,
  itemId: string,
  userId: string,
  data: Partial<{ name: string; amount: number; variant: SectionItemVariantType }>
): Promise<SectionItemDTO> {
  const existing = await db.sectionItem.findFirstOrThrow({
    where: { id: itemId, section: { userId } },
  });

  const row = await db.sectionItem.update({
    where: { id: existing.id },
    data,
  });

  return toSectionItemDTO(row);
}

export async function deleteSectionItem(
  db: PrismaClient,
  itemId: string,
  userId: string
): Promise<void> {
  await db.sectionItem.findFirstOrThrow({ where: { id: itemId, section: { userId } } });
  await db.sectionItem.delete({ where: { id: itemId } });
}
