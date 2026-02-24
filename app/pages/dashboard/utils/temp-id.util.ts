import { TmpId } from "../types/temp-id.type";

export function createTmpId(): TmpId {
  return `tmp_${Math.random().toString(36).slice(2, 11)}`;
}