"use server";

//https://sdms-api-o74bb.ondigitalocean.app/api/v1/fileupload/fileuploadapi/";

const API_URL = process.env.NEXT_PUBLIC_SDMS_API_BASE+ "/fileupload/fileuploadapi/";

// ===== Submit record with file =====
export async function submitRecordWithFile(formData: FormData) {
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      body: formData,
      credentials: "include",
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error("API Error:", errorData);
      throw new Error(errorData);
    }

    return await response.json();
  } catch (err: unknown) {
    console.error("API Error:", err);
    throw err;
  }
}

// ===== List all records =====
export async function listRecords() {
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action_mode: "getlist" }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error("List Error:", errorData);
      throw new Error(errorData);
    }

    return await response.json();
  } catch (err: unknown) {
    console.error("List Error:", err);
    throw err;
  }
}

// ===== Download file by ID =====
export async function downloadFileById(
  file_id: string,
  patient_id: string,
  admission_id: string
) {
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action_mode: "download-single",
        file_id,
        patient_id,
        admission_id,
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error("Download Error:", errorData);
      throw new Error(errorData);
    }

    const blob = await response.blob();
    return blob;
  } catch (err: unknown) {
    console.error("Download Error:", err);
    throw err;
  }
}

// ===== Preview file by ID =====
export async function previewFileById(drive_file_id: string) {
  try {
    const previewLink = `${API_URL}preview?drive_file_id=${drive_file_id}`;
    // Must be run client-side
    if (typeof window !== "undefined") {
      window.open(previewLink, "_blank");
    }
  } catch (err: unknown) {
    console.error("Preview Error:", err);
    throw err;
  }
}
