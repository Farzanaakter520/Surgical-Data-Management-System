
"use server";

export async function getProfileAction(patient_id: number, admission_id?: number) {
  if (patient_id === undefined || patient_id === null) {
    console.error("❌ Invalid patient_id provided:", patient_id);
    throw new Error("Invalid patient_id provided");
  }

  const baseUrl = 'https://sdms-api-o74bb.ondigitalocean.app/api/v1';
  const payload = {
    action_mode: "get_profile_by_patient_id",
    patient_id,
    admission_id
  };

  try {
    console.log("📤 Sending payload:", payload);

    const res = await fetch(`${baseUrl}/patientProfile/getProfile`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      cache: "no-store",
    });

    const data = await res.json();

    console.log("📥 Response data:", data);

    if (!res.ok) {
      console.error(`❌ HTTP error! status: ${res.status}, message: ${data?.message}`);
      throw new Error(`HTTP error! status: ${res.status}, message: ${data?.message || "Bad Request"}`);
    }

    return data;
  } catch (err: any) {
    console.error("❌ Fetch failed:", err);
    throw err;
  }
}
