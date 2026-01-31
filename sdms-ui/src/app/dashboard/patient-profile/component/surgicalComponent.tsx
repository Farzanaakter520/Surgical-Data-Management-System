"use client";

import React from "react";
import { SurgicalData } from "../type";


interface ProfileData {
  surgical_data?: SurgicalData[] | null;
}

interface Props {
  profile: ProfileData;
}

const fmtDate = (iso?: string) =>
  iso ? new Date(iso).toLocaleDateString() : "N/A";

export default function SurgicalComponent({ profile }: Props) {
  const surgicals = profile?.surgical_data ?? [];

  return (
    <div className="bg-gradient-to-br from-blue-50 to-blue-100/60 rounded-3xl shadow-2xl border border-blue-200/50 backdrop-blur-lg overflow-hidden">
      <div className="overflow-x-auto p-6 sm:p-8">
        <h2 className="text-[clamp(1.4rem,1vw+1rem,2rem)] font-bold text-blue-800 mb-6 flex items-center gap-2">
          🩺 <span>Surgical / Post-Operative Information</span>
        </h2>

        <table className="min-w-full border-separate border-spacing-y-2 text-justify table-auto">
          <thead>
            <tr className="text-blue-700 text-[18px] font-semibold">
              {[
                "Operation Name",
                "Operation Date",
                "Procedure Notes",
                "Challenges During Surgery",
                "Complications",
                "Nature of Anesthesia",
                "Post-Operative Recovery",
                "Recovery Notes",
                "Remarks",
              ].map((head) => (
                <th
                  key={head}
                  className="px-4 py-3 text-left bg-gradient-to-r from-blue-100 to-blue-200/70 rounded-lg shadow-sm"
                >
                  {head}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {surgicals.length === 0 ? (
              <tr>
                <td
                  colSpan={9}
                  className="text-center py-8 text-gray-500 italic bg-white rounded-xl"
                >
                  No surgical information available.
                </td>
              </tr>
            ) : (
              surgicals.map((rec, idx) => (
                <tr
                  key={rec.id ?? idx}
                  className="group text-[17px] bg-white transition-all duration-300 rounded-xl hover:shadow-lg hover:scale-[1.01] hover:bg-gradient-to-r hover:from-blue-50 hover:to-blue-100/80"
                >
                  <td className="px-4 py-3 font-semibold text-gray-800">
                    {rec.operation_name ?? "N/A"}
                  </td>
                  <td className="px-4 py-3">{fmtDate(rec.operation_date)}</td>
                  <td className="px-4 py-3">{rec.procedure_notes ?? "N/A"}</td>
                  <td className="px-4 py-3">
                    {rec.challenges_during_surgery ?? "N/A"}
                  </td>
                  <td className="px-4 py-3">{rec.complications ?? "N/A"}</td>
                  <td className="px-4 py-3">
                    {rec.nature_of_anesthesia ?? "N/A"}
                  </td>
                  <td className="px-4 py-3">
                    {rec.post_operative_recovery ?? "N/A"}
                  </td>
                  <td className="px-4 py-3">
                    {rec.post_operative_recovery_notes ?? "N/A"}
                  </td>
                  <td className="px-4 py-3">{rec.remarks ?? "N/A"}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
