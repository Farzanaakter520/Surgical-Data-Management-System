// lib/serverApiFetch.ts
"use server";

import { getDeviceId } from "@/lib/utilities/device-utils";
import { API_BASES } from "@/lib/config/app-config";
import { toProperCase } from "@/lib/utilities/utilities";
import { cookies } from "next/headers";
//import { getSession } from "./session/sessionClient";

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: any | null;
  errors?: Record<string, string[]>;
}

interface RequestOptions {
  headers?: Record<string, string>;
}

const buildUrl = (
  service: keyof typeof API_BASES,
  endpoint: string
): string => {
  return `${API_BASES[service]}${
    endpoint.startsWith("/") ? endpoint : "/" + endpoint
  }`;
};

// const getMetadata = async () => ({
//   location_id: "loc",
//   company_id: "comp",
//   entry_by: await getCurrentUserId(),
//   device_id: await getDeviceId(),
//   dt: new Date().toISOString(),
// });

export async function apiFetch<T = any>(
  service: keyof typeof API_BASES,
  endpoint: string,
  payload: any,
  options: RequestOptions = {}
): Promise<ApiResponse<T>> {
  try {
    // const metadata = await getMetadata();
    const url = buildUrl(service, endpoint);
    const isFormData = payload instanceof FormData;
    const cookieStore = await cookies();
    const token = cookieStore.get("sessionId")?.value;
    console.log("token", token);

    console.log("url", url);
    // console.log("payload", payload);
    // console.log("options", options);
    // console.log("isFormData", isFormData);
    // console.log("cookieStore", cookieStore);
    // console.log("token", token);

    const headers: Record<string, string> = {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(!isFormData &&
        (options.headers ?? { "Content-Type": "application/json" })),
    };

    const body = isFormData
      ? payload
      : //  : JSON.stringify({ ...payload, metadata });
        JSON.stringify(payload);

    const res = await fetch(url, {
      method: "POST",
      headers,
      body,
      cache: "no-store", // Prevents caching on the server
    });

    const responseData: ApiResponse<T> = await res.json();

    if (!res.ok || !responseData.success) {
      const errorMessages = Object.entries(responseData.errors || {})
        .map(([key, val]) => `${key}: ${(val as string[]).join(", ")}`)
        .join("\n");

      //   console.error(
      //     `[API ERROR] ${toProperCase(
      //       responseData.message || "Failed to process request"
      //     )} - ${errorMessages}`
      //   );

      return responseData;
    }

    return responseData;
  } catch (err: any) {
    //console.error("[API ERROR]", err.message);
    return {
      success: false,
      message: err.message || "Something went wrong",
      errors: err.errors || {},
      data: null,
    };
  }
}
