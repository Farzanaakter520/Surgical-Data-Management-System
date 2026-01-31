import { NextResponse } from "next/server";
import { cookies } from "next/headers";

// Helper to call Express backend to delete session
async function deleteSessionInBackend(sessionId: string) {
  const baseUrl =
    process.env.NEXT_PUBLIC_SDMS_API_BASE || "http://localhost:5000/api/v1";

  const res = await fetch(`${baseUrl}/sessionstorage/deletesession`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ session_id: sessionId }),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || "Failed to delete session in backend");
  }

  return res.json();
}

// API endpoint: POST /api/session/logout
export async function POST() {
  try {
    const cookieStore = await cookies();
    const sessionId = cookieStore.get("sessionId")?.value;

    if (sessionId) {
      // 1️⃣ Delete session from backend
      await deleteSessionInBackend(sessionId);

      // 2️⃣ Clear cookie
      cookieStore.delete({
        name: "sessionId",
        path: "/",
      });
    }

    // ✅ Return success
    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    console.error("Logout error:", err);
    return NextResponse.json(
      { success: false, error: err instanceof Error ? err.message : "Logout failed" },
      { status: 500 }
    );
  }
}
