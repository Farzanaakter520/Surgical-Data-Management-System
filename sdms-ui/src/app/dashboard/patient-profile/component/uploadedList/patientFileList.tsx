"use client";

import React, { useEffect, useState } from "react";
import { downloadFileById } from "@/lib/actions/fileActions";

// ✅ Define SurgicalData type (in case it’s missing from ../../type)
export interface SurgicalData {
  id?: string | number;
  file_name?: string;
  file_type?: string;
  insert_date?: string;
  document_type?: string;
  patient_id?: string | number;
  admission_id?: string | number;
  dt?: string | Date;
}

interface Props {
  postOps?: SurgicalData[];
}

export default function PatientFilesList({ postOps = [] }: Props) {
  const [records, setRecords] = useState<SurgicalData[]>(postOps);
  const [loading, setLoading] = useState(true);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [previewType, setPreviewType] = useState<"pdf" | "video" | "image" | null>(null);

  // ✅ Ensure props update triggers re-render
  useEffect(() => {
    setRecords(postOps);
    setLoading(false);
  }, [postOps]);

  // ✅ Determine MIME type from file extension
  const getMimeType = (type?: string): string => {
    if (!type) return "application/octet-stream";
    if (type.includes("/")) return type;
    const lower = type.toLowerCase();
    if (lower === "pdf") return "application/pdf";
    if (["mp4", "mov", "avi", "mkv"].includes(lower)) return `video/${lower}`;
    if (["png", "jpg", "jpeg", "gif"].includes(lower)) return `image/${lower}`;
    return "application/octet-stream";
  };

  // ✅ Handle file preview (PDF, video, or image)
  const handlePreview = async (file: SurgicalData) => {
    if (!file.id) {
      alert("File ID missing!");
      return;
    }

    try {
      const blobData = await downloadFileById(
        String(file.id),
        String(file.patient_id ?? ""),
        String(file.admission_id ?? "")
      );

      const mimeType = getMimeType(file.file_type);
      const blob = new Blob([blobData], { type: mimeType });
      const url = window.URL.createObjectURL(blob);

      setPreviewUrl(url);

      if (mimeType.startsWith("video/")) {
        setPreviewType("video");
      } else if (mimeType === "application/pdf") {
        setPreviewType("pdf");
      } else if (mimeType.startsWith("image/")) {
        window.open(url, "_blank", "width=900,height=600");
      } else {
        alert("Only PDF, video, and images are supported for preview!");
      }

      // ✅ Clean up preview URL after 10s
      setTimeout(() => window.URL.revokeObjectURL(url), 10000);
    } catch (err) {
      console.error("Preview failed:", err);
      alert("Failed to preview file");
    }
  };

  if (loading) return <p>Loading files...</p>;
  if (!records || records.length === 0) return <p>No files available.</p>;

  return (
    <div className="bg-white shadow-md rounded-xl p-4 mt-6 overflow-x-auto">
      <h2 className="text-lg font-bold text-blue-700 mb-4">List of Uploaded Files</h2>
      <table className="min-w-full border border-gray-300 rounded-lg">
        <thead className="bg-blue-100">
          <tr>
            <th className="p-2 border">#</th>
            <th className="p-2 border">File Name</th>
            <th className="p-2 border">Insert Date</th>
            <th className="p-2 border">Document Type</th>
            <th className="p-2 border">View File</th>
            <th className="p-2 border">Datetime</th>
          </tr>
        </thead>
        <tbody>
          {records.map((item, index) => (
            <tr key={item.id ?? index} className="border-t text-center hover:bg-gray-50">
              <td className="p-2 border">{index + 1}</td>
              <td className="p-2 border">
                {item.file_name || "N/A"} ({item.file_type || "N/A"})
              </td>
              <td className="p-2 border">{item.insert_date || "N/A"}</td>
              <td className="p-2 border">{item.document_type || "N/A"}</td>
              <td className="p-2 border">
                <button
                  onClick={() => handlePreview(item)}
                  className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 transition"
                >
                  View
                </button>
              </td>
              <td className="p-2 border">
                {item.dt ? new Date(item.dt).toLocaleString() : "N/A"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* ✅ File preview modal */}
      {previewUrl && previewType && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex justify-center items-center z-50 p-4">
          {previewType === "pdf" && (
            <iframe
              src={`${previewUrl}#toolbar=0&navpanes=0&scrollbar=0`}
              className="w-full max-w-4xl h-full max-h-[90vh] bg-white rounded-xl shadow-2xl"
              style={{ border: "none" }}
            />
          )}
          {previewType === "video" && (
            <video
              src={previewUrl}
              controls
              autoPlay
              className="w-full max-w-4xl h-full max-h-[90vh] rounded-xl shadow-2xl"
            />
          )}
          {previewType === "image" && (
            <img
              src={previewUrl}
              alt="Preview"
              className="w-full max-w-4xl h-full max-h-[90vh] rounded-xl shadow-2xl object-contain"
            />
          )}
          <button
            onClick={() => {
              setPreviewUrl("");
              setPreviewType(null);
            }}
            className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
          >
            Close
          </button>
        </div>
      )}
    </div>
  );
}
