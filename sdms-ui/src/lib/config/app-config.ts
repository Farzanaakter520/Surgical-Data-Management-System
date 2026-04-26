const FALLBACK_SDMS_API_BASE = "http://localhost:8000/api/v1";

const normalizeApiBase = (raw?: string) => {
  if (!raw) return FALLBACK_SDMS_API_BASE;

  const trimmed = raw.trim();
  if (!trimmed || trimmed === "undefined" || trimmed === "null") {
    return FALLBACK_SDMS_API_BASE;
  }

  const withProtocol = /^https?:\/\//i.test(trimmed)
    ? trimmed
    : `http://${trimmed}`;

  return withProtocol.replace(/\/+$/, "");
};

export const API_BASES = {
  sdms: normalizeApiBase(process.env.NEXT_PUBLIC_SDMS_API_BASE),
};

export const APP_CONFIG = {
  // Debug mode is ON if either:
  //  - you're in development mode
  //  - or NEXT_PUBLIC_DEBUG_MODE is explicitly set to "true"
  debug:
    process.env.NODE_ENV !== "production" ||
    process.env.NEXT_PUBLIC_DEBUG_MODE === "true",
};
