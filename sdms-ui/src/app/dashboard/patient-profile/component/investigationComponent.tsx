"use client";

import React from "react";

type Investigations = Record<string, string | number | null>;

interface PreOp {
  id?: number | string;
  investigations?: Investigations;
  [key: string]: any;
}

interface ProfileData {
  pre_ops_data?: PreOp[] | null;
}

interface Props {
  profile: ProfileData;
}

export default function InvestigationComponent({ profile }: Props) {
  const preOps = profile?.pre_ops_data;

  return (
    <div className="bg-gradient-to-br from-blue-50 to-blue-100/70 rounded-3xl shadow-2xl border border-blue-200/50 backdrop-blur-md p-6 sm:p-8 overflow-x-auto">
      <h2 className="text-[clamp(1.4rem,1vw+1rem,2rem)] font-bold text-blue-800 mb-6 flex items-center gap-2">
        🔬 <span>Investigations</span>
      </h2>

      {!preOps || !Array.isArray(preOps) || preOps.length === 0 ? (
        <p className="text-gray-500 italic text-center bg-white rounded-xl shadow-sm p-6">
          No investigation records available.
        </p>
      ) : (
        preOps.flatMap((rec) =>
          rec.investigations && Object.keys(rec.investigations).length > 0 ? (
            <div
              key={rec.id}
              className="mb-6 bg-white border border-blue-100 rounded-2xl shadow-sm hover:shadow-lg hover:bg-gradient-to-r hover:from-blue-50 hover:to-blue-100/80 transition-all duration-300"
            >
              <table className="min-w-full text-[16px] border-separate border-spacing-y-2">
                <tbody>
                  <tr className="text-blue-900">
                    <th className="text-left p-4 bg-gradient-to-r from-blue-100 to-blue-200/70 rounded-l-lg font-semibold w-1/4">
                      Investigation Details
                    </th>
                    <td className="p-4">
                      <ul className="list-disc ml-5 space-y-1 text-gray-700">
                        {Object.entries(rec.investigations).map(([k, v]) => (
                          <li key={k} className="hover:text-blue-700 transition-colors duration-200">
                            <span className="font-medium">{k}:</span> {String(v)}
                          </li>
                        ))}
                      </ul>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          ) : (
            <div
              key={rec.id ?? Math.random()}
              className="text-center text-gray-500 p-4 bg-white rounded-xl border border-blue-100 shadow-sm italic"
            >
              No investigations found for this record.
            </div>
          )
        )
      )}
    </div>
  );
}
