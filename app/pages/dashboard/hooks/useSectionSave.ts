import { SectionDTO } from "../dtos/dashboard.dto";

export async function useSectionSave(data: SectionDTO) {
    return await apiFetch<SectionDTO>('/api/sections', {
        method: 'POST',
        body: JSON.stringify(data),
    });
}