export const API_BASES = {
   sdms: process.env.NEXT_PUBLIC_SDMS_API_BASE!,
  };

export const APP_CONFIG = {
  // Debug mode is ON if either:
  //  - you're in development mode
  //  - or NEXT_PUBLIC_DEBUG_MODE is explicitly set to "true"
  debug:
    process.env.NODE_ENV !== "production" ||
    process.env.NEXT_PUBLIC_DEBUG_MODE === "true",
};
