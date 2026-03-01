import { SectionDTO } from "../dtos/dashboard.dto";
import { apiFetch } from "../utils/ui-api-fetch.util";

export async function useSectionSave(data: SectionDTO) {
    return await apiFetch<SectionDTO>('/api/sections', {
        method: 'POST',
        body: JSON.stringify(data),
    });
}