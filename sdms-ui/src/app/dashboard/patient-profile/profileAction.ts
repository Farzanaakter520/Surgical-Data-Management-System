
"use server";

import { API_BASES } from "@/lib/config/app-config";

export async function getProfileAction(patient_id: number, admission_id?: number) {
  if (patient_id === undefined || patient_id === null) {
    console.error("❌ Invalid patient_id provided:", patient_id);
    throw new Error("Invalid patient_id provided");
  }

  const baseUrl =
    API_BASES.sdms || process.env.NEXT_PUBLIC_SDMS_API_BASE || "http://localhost:8000/api/v1";
  const normalizedBase = baseUrl.replace(/\/+$/, "");
  const payload = {
    action_mode: "get_profile_by_patient_id",
    patient_id,
    admission_id
  };

  const fetchProfile = async (base: string) => {
    const response = await fetch(`${base}/patientProfile/getProfile`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      cache: "no-store",
    });

    let data: any = null;
    try {
      data = await response.json();
    } catch {
      data = null;
    }

    return { response, data };
  };

  try {
    console.log("📤 Sending payload:", payload);

    let { response: res, data } = await fetchProfile(normalizedBase);

    console.log("📥 Response data:", data);
    let backendMessage = data?.message || data?.msg;

    const localBase = "http://localhost:8000/api/v1";
    const shouldRetryLocal =
      !res.ok &&
      typeof backendMessage === "string" &&
      backendMessage.includes("proc_patient_profile") &&
      normalizedBase !== localBase;

    if (shouldRetryLocal) {
      console.warn("⚠️ Profile API on configured base is legacy; retrying against local backend...");
      const retryResult = await fetchProfile(localBase);
      res = retryResult.response;
      data = retryResult.data;
      backendMessage = data?.message || data?.msg;
      console.log("📥 Retry response data:", data);
    }

    if (!res.ok) {
      console.error(`❌ HTTP error! status: ${res.status}, message: ${backendMessage}`);
      throw new Error(`HTTP error! status: ${res.status}, message: ${backendMessage || "Bad Request"}`);
    }

    return data;
  } catch (err: any) {
    console.error("❌ Fetch failed:", err);
    throw err;
  }
}
