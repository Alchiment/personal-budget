import { SectionDTO, DebtCardDTO } from '../dtos/dashboard.dto';
import { apiFetch } from '../utils/ui-api-fetch.util';

export interface SaveDashboardResponse {
  sections: SectionDTO[];
  debts: DebtCardDTO[];
}

export async function saveDashboard(
  sections: SectionDTO[],
  debts: DebtCardDTO[]
): Promise<SaveDashboardResponse> {
  return apiFetch<SaveDashboardResponse>('/api/dashboard', {
    method: 'POST',
    body: JSON.stringify({ sections, debts }),
  });
}
