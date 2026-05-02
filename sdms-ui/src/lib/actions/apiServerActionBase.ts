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
  msg?: string;
  data?: any | null;
  errors?: Record<string, string[]>;
}

interface RequestOptions {
  headers?: Record<string, string>;
}

type InFlightRequest<T> = {
  startedAt: number;
  promise: Promise<ApiResponse<T>>;
};

const IN_FLIGHT_REQUEST_TTL_MS = 1500;
const inFlightRequests = new Map<string, InFlightRequest<any>>();

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
    const requestKey = JSON.stringify({
      service,
      endpoint,
      payload,
      headers: options.headers ?? null,
    });

    const existingRequest = inFlightRequests.get(requestKey) as
      | InFlightRequest<T>
      | undefined;

    if (
      existingRequest &&
      Date.now() - existingRequest.startedAt <= IN_FLIGHT_REQUEST_TTL_MS
    ) {
      return existingRequest.promise;
    }

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

    const requestPromise = (async () => {
      const res = await fetch(url, {
        method: "POST",
        headers,
        body,
        cache: "no-store", // Prevents caching on the server
      });

      const responseData: ApiResponse<T> = await res.json();
      const normalizedResponse: ApiResponse<T> = {
        ...responseData,
        message: responseData.message ?? responseData.msg,
      };

      if (!res.ok || !normalizedResponse.success) {
        const errorMessages = Object.entries(responseData.errors || {})
          .map(([key, val]) => `${key}: ${(val as string[]).join(", ")}`)
          .join("\n");

        //   console.error(
        //     `[API ERROR] ${toProperCase(
        //       responseData.message || "Failed to process request"
        //     )} - ${errorMessages}`
        //   );

        return normalizedResponse;
      }

      return normalizedResponse;
    })();

    inFlightRequests.set(requestKey, {
      startedAt: Date.now(),
      promise: requestPromise,
    });

    try {
      return await requestPromise;
    } finally {
      inFlightRequests.delete(requestKey);
    }
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
