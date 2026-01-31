"use client";
import { useState, useEffect } from "react";
import { AdmissionData, ReleaseData } from "../type";

interface Props {
  admissionData: AdmissionData | null;
  releaseData?: ReleaseData[] | null;
}

export default function AdmissionRelease({ admissionData, releaseData }: Props) {
  const [admissions, setAdmissions] = useState<AdmissionData[]>([]);
  const [releases, setReleases] = useState<ReleaseData[]>([]);

  useEffect(() => {
    if (admissionData) setAdmissions([admissionData]);
    if (releaseData && releaseData.length > 0) setReleases(releaseData);
  }, [admissionData, releaseData]);

  const fmtDate = (iso?: string) =>
    iso ? new Date(iso).toLocaleDateString() : "N/A";
  const fmtDateTime = (iso?: string) =>
    iso ? new Date(iso).toLocaleString() : "N/A";

  return (
    <div className="space-y-12">
      {/* ====== Admission Table ====== */}
      <div className="bg-gradient-to-br from-blue-50 to-blue-100/60 rounded-3xl shadow-2xl border border-blue-200/50 backdrop-blur-lg overflow-hidden">
        <div className="overflow-x-auto p-6 sm:p-8">
          <h2 className="text-[clamp(1.4rem,1vw+1rem,2rem)] font-bold text-blue-800 mb-6 flex items-center gap-2">
            🏥 <span>Admission Details</span>
          </h2>

          <table className="min-w-full border-separate border-spacing-y-2 text-justify table-auto">
            <thead>
              <tr className="text-blue-700 text-[18px] font-semibold">
                {[
                  "Admission ID",
                  "Hospital",
                  "Admission Date",
                  "Status",
                  "Remarks",
                  "Referral Source",
                  "Inserted By",
                  "Insert Date",
                  "Updated By",
                  "Update Date",
                  "Is Active",
                ].map((head) => (
                  <th
                    key={head}
                    className="px-4 py-3 text-left bg-gradient-to-r text-[18px] from-blue-100 to-blue-200/70 rounded-lg shadow-sm"
                  >
                    {head}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {admissions.length === 0 ? (
                <tr>
                  <td
                    colSpan={11}
                    className="text-center py-8 text-gray-500 italic  bg-white rounded-xl"
                  >
                    No admission records found.
                  </td>
                </tr>
              ) : (
                admissions.map((adm) => (
                  <tr
                    key={adm.id}
                    className="group text-[18px] bg-white hover:bg-blue-50 transition-all duration-300 shadow-sm hover:shadow-md rounded-xl"
                  >
                    <td className="px-4 py-3 font-semibold text-gray-800">
                      {adm.id}
                    </td>
                    <td className="px-4 py-3">{adm.hospital_name}</td>
                    <td className="px-4 py-3">{fmtDate(adm.date_of_adm)}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold ${
                          adm.adm_status === "Active"
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-100 text-gray-500"
                        }`}
                      >
                        {adm.adm_status || "N/A"}
                      </span>
                    </td>
                    <td className="px-4 py-3">{adm.remarks || "N/A"}</td>
                    <td className="px-4 py-3">
                      {adm.referral_source_name || "N/A"}
                    </td>
                    <td className="px-4 py-3">{adm.insert_by || "N/A"}</td>
                    <td className="px-4 py-3">{fmtDate(adm.insert_date)}</td>
                    <td className="px-4 py-3">{adm.update_by || "N/A"}</td>
                    <td className="px-4 py-3">{fmtDate(adm.insert_date)}</td>
                    <td className="px-4 py-3 font-semibold">
                      <span
                        className={`${
                          adm.is_active ? "text-green-600" : "text-red-500"
                        }`}
                      >
                        {adm.is_active ? "Yes" : "No"}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ====== Release Table ====== */}
      <div className="bg-gradient-to-br from-green-50 to-green-100/70 rounded-3xl shadow-2xl border border-green-200/50 backdrop-blur-lg overflow-hidden">
        <div className="overflow-x-auto p-6 sm:p-8">
          <h2 className="text-[clamp(1.4rem,1vw+1rem,2rem)] font-bold text-green-800 mb-6 flex items-center gap-2">
            📤 <span>Release Details</span>
          </h2>

          <table className="min-w-full border-separate border-spacing-y-2 text-justify table-auto">
            <thead>
              <tr className="text-green-900 text-[18px] font-semibold">
                {[
                  "Release ID",
                  "Admission ID",
                  "Discharge Date",
                  "Outcome",
                  "Advice on Discharge",
                  "Created At",
                  "Hospital ID",
                ].map((head) => (
                  <th
                    key={head}
                    className="px-4 py-3 text-left bg-gradient-to-r from-green-100 to-green-200/70 rounded-lg shadow-sm"
                  >
                    {head}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {releases.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="text-center py-8 text-gray-500 italic bg-white rounded-xl"
                  >
                    No release records found.
                  </td>
                </tr>
              ) : (
                releases.map((rel) => (
                  <tr
                    key={rel.id}
                    className="group text-[18px] bg-white hover:bg-green-50 transition-all duration-300 shadow-sm hover:shadow-md rounded-xl"
                  >
                    <td className="px-4 py-3 font-semibold text-gray-800">
                      {rel.id}
                    </td>
                    <td className="px-4 py-3">{rel.admission_id}</td>
                    <td className="px-4 py-3">
                      {fmtDateTime(rel.discharge_date_time)}
                    </td>
                    <td className="px-4 py-3">{rel.outcome}</td>
                    <td className="px-4 py-3">{rel.advice_on_discharge}</td>
                    <td className="px-4 py-3">{fmtDateTime(rel.created_at)}</td>
                    <td className="px-4 py-3">{rel.hospital_id}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
