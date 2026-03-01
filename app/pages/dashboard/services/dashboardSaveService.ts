import { SectionDTO, SectionItemDTO, DebtCardDTO, DebtItemDTO } from '../dtos/dashboard.dto';
import { apiFetch } from '../utils/ui-api-fetch.util';

// ============================================================================
// Helpers
// ============================================================================

function isTmpId(id: string): boolean {
  return id.startsWith('tmp_');
}

// ============================================================================
// Section sync
// ============================================================================

async function syncSectionItem(
  sectionId: string,
  item: SectionItemDTO
): Promise<SectionItemDTO> {
  if (isTmpId(item.id)) {
    return apiFetch<SectionItemDTO>(`/api/sections/${sectionId}/items`, {
      method: 'POST',
      body: JSON.stringify({ name: item.name, amount: item.amount, variant: item.variant }),
    });
  }

  return apiFetch<SectionItemDTO>(`/api/sections/${sectionId}/items/${item.id}`, {
    method: 'PATCH',
    body: JSON.stringify({ name: item.name, amount: item.amount, variant: item.variant }),
  });
}

async function syncSection(section: SectionDTO): Promise<SectionDTO> {
  let persistedSection: SectionDTO;

  if (isTmpId(section.id)) {
    persistedSection = await apiFetch<SectionDTO>('/api/sections', {
      method: 'POST',
      body: JSON.stringify({
        title: section.title,
        icon: section.icon,
        type: section.type,
        actionLabel: section.action?.label,
      }),
    });
  } else {
    persistedSection = await apiFetch<SectionDTO>(`/api/sections/${section.id}`, {
      method: 'PATCH',
      body: JSON.stringify({
        title: section.title,
        icon: section.icon,
        actionLabel: section.action?.label,
      }),
    });
  }

  const syncedItems = await Promise.all(
    section.items.map((item) => syncSectionItem(persistedSection.id, item))
  );

  return { ...persistedSection, items: syncedItems };
}

export async function syncSections(sections: SectionDTO[]): Promise<SectionDTO[]> {
  return Promise.all(sections.map(syncSection));
}

// ============================================================================
// Debt sync
// ============================================================================

async function syncDebtDetail(
  debtId: string,
  detail: DebtItemDTO
): Promise<DebtItemDTO> {
  if (isTmpId(detail.id)) {
    return apiFetch<DebtItemDTO>(`/api/debts/${debtId}/details`, {
      method: 'POST',
      body: JSON.stringify({ name: detail.name, amount: detail.amount }),
    });
  }

  return apiFetch<DebtItemDTO>(`/api/debts/${debtId}/details/${detail.id}`, {
    method: 'PATCH',
    body: JSON.stringify({ name: detail.name, amount: detail.amount }),
  });
}

async function syncDebt(debt: DebtCardDTO): Promise<DebtCardDTO> {
  let persistedDebt: DebtCardDTO;

  if (isTmpId(debt.id)) {
    persistedDebt = await apiFetch<DebtCardDTO>('/api/debts', {
      method: 'POST',
      body: JSON.stringify({
        name: debt.name,
        subtitle: debt.subtitle,
        type: debt.type,
        color: debt.color,
      }),
    });
  } else {
    persistedDebt = await apiFetch<DebtCardDTO>(`/api/debts/${debt.id}`, {
      method: 'PATCH',
      body: JSON.stringify({
        name: debt.name,
        subtitle: debt.subtitle,
        color: debt.color,
      }),
    });
  }

  const syncedDetails = await Promise.all(
    (debt.details ?? []).map((detail) => syncDebtDetail(persistedDebt.id, detail))
  );

  return { ...persistedDebt, details: syncedDetails };
}

export async function syncDebts(debts: DebtCardDTO[]): Promise<DebtCardDTO[]> {
  return Promise.all(debts.map(syncDebt));
}
