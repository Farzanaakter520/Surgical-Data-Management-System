// app/login/actions.ts
"use server";

import { apiFetch, ApiResponse } from "@/lib/actions/apiServerActionBase";

export async function getData(formData: any): Promise<ApiResponse<any>> {
  //console.log(formData);
  try {
    const result = await apiFetch(
      "sdms",
      "/patientsReports/getpatientdata",
      formData
    );
    //console.log(result);

    return result;
  } catch (err: unknown) {
    return {
      success: false,
      errors:
        err instanceof Error
          ? { error: [err.message] }
          : { error: ["Data fetch failed"] },
    };
  }
}
