"use server";

import { apiFetch } from "@/lib/actions/apiServerActionBase";

// Generic action response type
export interface ActionResponse<T = any> {
  success: boolean;
  data?: T;
  msg?: string;
  error?: string;
}

/**
 * Generic server action to submit data to any backend service/endpoint
 * @param service - Service name (ex: "iam", "inventory")
 * @param endpoint - API endpoint path (ex: "/users/save")
 * @param formData - Data payload (object, form values, etc.)
 * @returns Promise<ActionResponse<T>>
 */
export async function submitForm<T = any>(
  service: string|any,
  endpoint: string,
  formData: any
): Promise<ActionResponse<T>> {
  try {
    console.log("inside submit form .........................")
    console.log(service, endpoint, formData)
    const result = await apiFetch(service, endpoint, formData);

    return {
      success: result.success,
      data: result.data,
      msg: result.message,
    };
  } catch (err: unknown) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Something went wrong",
    };
  }
}
