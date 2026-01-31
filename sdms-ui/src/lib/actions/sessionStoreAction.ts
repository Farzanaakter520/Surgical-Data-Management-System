"use server";

import { cookies } from "next/headers";

async function getSessionFromBackend(sessionId: string) {
  const baseUrl =
    process.env.NEXT_PUBLIC_SDMS_API_BASE || "http://localhost:5000/api/v1";

  const res = await fetch(`${baseUrl}/sessionstorage/getsession`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ session_id: sessionId }),
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Invalid or expired session");
  }

  return res.json();
}

// ✅ Server Action to get user session
export async function getSessionUser() {
  try {
    const cookieStore = await cookies();
    const sessionId = cookieStore.get("sessionId")?.value;

    if (!sessionId) {
      return { error: "No session cookie found", user: null };
    }

    const session = await getSessionFromBackend(sessionId);
  ///  console.log(session.data?.data?.user);

    if (!session || !session.data?.data?.user) {
      return { error: "Invalid session", user: null };
    }

    return { data:session.data.data, error: null };
  } catch (err) {
    console.error("Session validation failed:", err);
    return { error: "Unauthorized", user: null };
  }
}
