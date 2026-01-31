"use server";

export interface Option {
    label: string|MultiLangText;  // can support multiple languages
    value: string | number;
  }

export interface MultiLangText {
  [languageCode: string]: string;  // e.g., { "en": "Title", "es": "Título" }
}

import { cookies } from "next/headers";
import { API_BASES } from "@/lib/config/app-config";

/**
 * Generic function to call APIs and return dropdown options
 */
export async function fetchOptions(
  service: keyof typeof API_BASES,
  url: string,
  params: Record<string, any> = {},
  valueKey: string = "value",
  labelKey: string = "label"
): Promise<Option[]> {
  try {
    const baseUrl = API_BASES[service];
    if (!baseUrl) {
      throw new Error(`API_BASES has no service for key "${service}"`);
    }

    // read token from cookies (set at login)
    const cookieStore = await cookies();
    const token = cookieStore.get("sessionId")?.value;
    // console.log("baseUrl", baseUrl);
    // console.log("url", url);
    // console.log("params", params);
    const response = await fetch(
      `${baseUrl}${url.startsWith("/") ? url : "/" + url}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify(params),
        cache: "no-store", // avoid stale data
      }
    );

    if (!response.ok) {
      console.error(
        `fetchOptions failed: ${response.status} ${response.statusText}`
      );
      return [];
    }

    const raw = await response.json();
    const data = Array.isArray(raw) ? raw : raw?.data;

    if (!Array.isArray(data)) {
      console.error("fetchOptions error: Response is not an array", raw);
      return [];
    }

    return data.map((item: any) => ({
      value: String(item?.[valueKey] ?? item?.id),
      label: item?.[labelKey] ?? item?.name,
    }));
  } catch (error: any) {
    console.error("fetchOptions exception:", error?.message || error);
    return [];
  }
}

/**
 * Get label object for a single option
 */
export async function getOptionLabel(
  entityType: string,
  value: string
): Promise<MultiLangText | undefined> {
  const options = await fetchOptionsForEntity(entityType);
  return options.find((opt) => opt.value === value)?.label as MultiLangText;
}

/**
 * Get label text for a given language
 */
export async function getOptionLabelText(
  entityType: string,
  value: string,
  lang: string = "en"
): Promise<string | undefined> {
  const label = await getOptionLabel(entityType, value);
  return label?.[lang];
}

/**
 * Entity → API mapping for dynamic dropdowns
 */
export async function fetchOptionsForEntity(
  entityType: string
): Promise<Option[]> {
  switch (entityType) {
    case "users":
      return await fetchOptions(
        "sdms",
        "/users",
        { region: "Asia" },
        "id",
        "name"
      );
    case "departments":
      return await fetchOptions("sdms", "/api/departments", {
        action_mode: "departments",
      });
    case "religion":
      return await fetchOptions("sdms", "/options/getoptiondata", {
        action_mode: "religion",
      });
    case "gender":
      return await fetchOptions("sdms", "/options/getoptiondata", {
        action_mode: "gender",
      });
    case "maritalstatus":
      return await fetchOptions("sdms", "/options/getoptiondata", {
        action_mode: "maritalstatus",
      });
    case "contactType":
      return [
        { label: { en: "Primary", bn: "Primary" }, value: "primary" },
        { label: { en: "Secondary", bn: "Secondary" }, value: "secondary" },
      ];
    case "occupation":
      return await fetchOptions("sdms", "/options/getoptiondata", {
        action_mode: "occupation",
      });
    case "investigations":
      return await fetchOptions("sdms", "/options/getoptiondata", {
        action_mode: "investigation_master",
      });
    case "refsource":
      return await fetchOptions("sdms", "/options/getoptiondata", {
        action_mode: "refsource",
      });
    case "sex":
      return [
        { value: "M", label: { en: "Male", bn: "পুরুষ" } },
        { value: "F", label: { en: "Female", bn: "নারী" } },
        { value: "O", label: { en: "Other", bn: "অন্যান্য" } },
      ];
    case "patientstatus":
      return [
        { value: "A", label: { en: "Admitted", bn: "ভর্তি" } },
        { value: "D", label: { en: "Discharged", bn: "ছাড়া" } },
        { value: "T", label: { en: "Transferred", bn: "স্থানান্তরিত" } },
      ];
    case "hospitalmaster":
      return await fetchOptions("sdms", "/options/getoptiondata", {
        action_mode: "hospitals",
      });

      case "doctormaster":
      return await fetchOptions("sdms", "/options/getoptiondata", {
        action_mode: "doctors"
      });

      
    case "comorbidities":
      return await fetchOptions("sdms", "/options/getoptiondata", {
        action_mode: "co_morbidities",
      });
    case "drughistory":
      return await fetchOptions("sdms", "/options/getoptiondata", {
        action_mode: "drug_history",
      });
    case "previoussurgicalhistory":
      return await fetchOptions("sdms", "/options/getoptiondata", {
        action_mode: "previoussurgicalhistory",
      });
    case "postoprecoverystatus":
      return await fetchOptions("sdms", "/options/getoptiondata", {
        action_mode: "postoprecoverystatus",
      });
    case "complicationstatus":
      return await fetchOptions("sdms", "/options/getoptiondata", {
        action_mode: "complicationstatus",
      });
    case "anesthesiatype":
      return await fetchOptions("sdms", "/options/getoptiondata", {
        action_mode: "nature_of_anaesthesia",
      });
    case "outcome":
      return await fetchOptions("sdms", "/options/getoptiondata", {
        action_mode: "outcome",
      });
    case "followupreceived":
      return await fetchOptions("sdms", "/options/getoptiondata", {
        action_mode: "followupreceived",
      });
    case "operationmaster":
      return await fetchOptions("sdms", "/options/getoptiondata", {
        action_mode: "operation_master",
      });
    case "diagnosis":
      return await fetchOptions("sdms", "/options/getoptiondata", {
        action_mode: "clinical_diagnosis",
      });

      case "followuptypes":
      return await fetchOptions("sdms", "/options/getoptiondata", {
        action_mode: "follow_types",
      });

      
    case "mixed":
      const baseOptions = [
        { value: "static", label: { en: "Static Option", bn: "স্ট্যাটিক" } },
      ];
      const dynamic = await fetchOptions("sdms", "/api/users");
      return [...baseOptions, ...dynamic];
    default:
      return [];
  }
}
