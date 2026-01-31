"use client";

import React from "react";
import { PreOpsData } from "../type";


interface ProfileData {
  pre_ops_data?: PreOpsData[] | null;
}

interface Props {
  profile: ProfileData;
}

const joinOrNA = (arr?: string[] | null) =>
  Array.isArray(arr) && arr.length ? arr.join(", ") : "N/A";

export default function MedicalComponent({ profile }: Props) {
  const preOps = profile?.pre_ops_data;

  return (
    <div className="bg-gradient-to-br from-blue-50 to-blue-100/60 rounded-3xl shadow-2xl border border-blue-200/50 backdrop-blur-lg overflow-hidden">
      <div className="overflow-x-auto p-6 sm:p-8">
      

        {!preOps || preOps.length === 0 ? (
          <p className="text-gray-500 mt-2 italic bg-white p-4 rounded-xl shadow-sm text-center">
            No medical information available.
          </p>
        ) : (
          preOps.map((rec, idx) => (
            <div
              key={rec.id ?? idx}
              className="mb-6 rounded-xl bg-white border border-blue-100 shadow-sm hover:shadow-lg hover:bg-gradient-to-r hover:from-blue-50 hover:to-blue-100/80 transition-all duration-300"
            >
              <table className="min-w-full border-separate border-spacing-y-1 text-[17px]">
                <tbody>
                  <tr className="text-blue-800 font-semibold">
                    <th className="w-1/3 text-left p-3 bg-gradient-to-r from-blue-100 to-blue-200/70 rounded-l-lg">
                      Co-morbidities
                    </th>
                    <td className="p-3">{joinOrNA(rec.co_morbidities_id)}</td>
                  </tr>
                  <tr>
                    <th className="text-left p-3 bg-gradient-to-r from-blue-50 to-blue-100/60">
                      Diagnosis (IDs)
                    </th>
                    <td className="p-3">{joinOrNA(rec.diagnosis_id)}</td>
                  </tr>
                  <tr>
                    <th className="text-left p-3 bg-gradient-to-r from-blue-100 to-blue-200/70">
                      Drug History
                    </th>
                    <td className="p-3">{joinOrNA(rec.drug_history)}</td>
                  </tr>
                  <tr>
                    <th className="text-left p-3 bg-gradient-to-r from-blue-50 to-blue-100/60">
                      Surgical History
                    </th>
                    <td className="p-3">{rec.surgical_history ?? "N/A"}</td>
                  </tr>
                  <tr>
                    <th className="text-left p-3 bg-gradient-to-r from-blue-100 to-blue-200/70 rounded-bl-lg">
                      Remarks
                    </th>
                    <td className="p-3">{rec.remarks ?? "N/A"}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
