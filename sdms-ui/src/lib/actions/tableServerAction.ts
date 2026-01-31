"use server";

import { apiFetch } from "@/lib/actions/apiServerActionBase";
import { ApiResponse } from "@/lib/actions/apiServerActionBase";

export async function fetchTableData<T>(
  service: keyof typeof import("@/lib/config/app-config").API_BASES,
  endpoint: string,
  payload: Record<string, any>
): Promise<T[]> {
    console.log('service :'+service, 'end point :' + endpoint, "payload"+ JSON.stringify(payload))
  const res: ApiResponse<T[]> = await apiFetch(service, endpoint, payload);

  if (!res.success) {
    throw new Error(res.message || "Failed to fetch data");
  }

  return res.data ?? [];
}

export async function deleteTableRow(
  service: keyof typeof import("@/lib/config/app-config").API_BASES,
  endpoint: string,
  id: string | number,
  payload: Record<string, any> = {}
): Promise<any> {
  const res: ApiResponse = await apiFetch(service, endpoint, { id, ...payload });

  if (!res.success) {
    throw new Error(res.message || "Failed to delete row");
  }

  return res.data;
}
