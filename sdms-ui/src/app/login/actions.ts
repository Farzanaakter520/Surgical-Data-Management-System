"use server";

import { AuthAction } from "@/lib/actions/authActions";
import { API_BASES } from "@/lib/config/app-config";
import { cookies } from "next/headers";
import { randomUUID } from "crypto";

// Helper to call Express backend to create session
async function createSessionInBackend(
  sessionId: string,
  token: string,
  data: any,
  expireMs: number
) {
  // Store as ISO timestamp so PostgreSQL timestamptz accepts it directly.
  const expiresAt = new Date(Date.now() + expireMs).toISOString();

  // ✅ Use fallback base URL safely
  const baseUrl =
    API_BASES.sdms || process.env.NEXT_PUBLIC_SDMS_API_BASE || "http://localhost:8000/api/v1";

  const normalizedBase = baseUrl.replace(/\/+$/, "");

  const res = await fetch(`${normalizedBase}/sessionstorage/createsession`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      session_id: sessionId,
      token: token,
      data: data,
      expires_at: expiresAt,
      device_id: "device-001",
      insert_by: "system",
    }),
  });

  if (!res.ok) {
    const raw = await res.text();
    let parsedMsg = "";
    try {
      const parsed = JSON.parse(raw);
      parsedMsg = parsed?.msg || parsed?.message || parsed?.error || "";
    } catch {
      parsedMsg = raw;
    }

    throw new Error(
      parsedMsg || `Failed to create session in backend (${res.status})`
    );
  }

  return res.json();
}

export async function loginAction(formData: FormData) {
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");

  const auth = new AuthAction("sdms");

  try {
    // ✅ Perform authentication
    const resp = await auth.login(email, password);

    // ✅ Generate a secure random UUID
    const sessionId = randomUUID();

    // ✅ Create session in backend (1 day expiry)
    await createSessionInBackend(
      sessionId,
      resp.token,
      resp,
      24 * 60 * 60 * 1000 // 1 day in ms
    );

    // ✅ Set cookie on server
    const cookieStore = await cookies();
    cookieStore.set({
      name: "sessionId",
      value: sessionId,
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      secure: process.env.NODE_ENV === "production",
      maxAge: 24 * 60 * 60, // 1 day in seconds
    });

    return {
      success: true,
      user: { ...resp.user, token: resp.token },
    };
  } catch (err: unknown) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Login failed",
    };
  }
}
