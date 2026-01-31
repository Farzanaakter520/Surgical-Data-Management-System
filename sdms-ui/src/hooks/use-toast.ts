// hooks/useToast.ts
"use client"

import { toast } from "sonner"

type ToastType = "success" | "error" | "warning" | "info" | "promise"

const normalizeDescription = (desc?: string | string[]): string | undefined => {
  if (!desc) return undefined;
  if (Array.isArray(desc)) return desc.join('\n'); // Join array items with newline or any separator you prefer
  return desc;
}

export function useToast() {
  const showToast = (
    type: ToastType,
    message: string,
    options?: {
      description?: string | string[]
      duration?: number
      // Promise-specific options
      promise?: Promise<any>
      loading?: string
      success?: string | ((data: any) => string)
      error?: string | ((error: any) => string)
    }
  ) => {
    const toastOptions = {
      duration: 4000, // default duration
      description: normalizeDescription(options?.description),
      ...options,    // override with user-provided options
    }

    switch (type) {
      case "success":
        toast.success(message, toastOptions)
        break
      case "error":
        toast.error(message, toastOptions)
        break
      case "warning":
        toast.warning(message, toastOptions)
        break
      case "info":
        toast.info(message, toastOptions)
        break
      case "promise":
        if (!options?.promise) {
          console.warn("Promise toast requires a promise to be provided")
          return
        }
        return toast.promise(options.promise, {
          loading: options.loading || "Loading...",
          success: (data) => {
            if (typeof options.success === "function") {
              return options.success(data)
            }
            return options.success || message
          },
          error: (error) => {
            if (typeof options.error === "function") {
              return options.error(error)
            }
            return options.error || "Something went wrong"
          },
        })
      default:
        toast(message, toastOptions)
    }
  }

  return { showToast }
}