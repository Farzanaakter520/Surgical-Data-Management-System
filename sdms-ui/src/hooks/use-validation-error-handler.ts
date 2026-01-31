// lib/utils/handleValidationErrors.ts

import { useToast } from "@/hooks/use-toast"

type ValidationErrors = Record<string, string[]>

/**
 * Displays validation errors using the custom toast hook
 * @param errors - Record of field keys with array of error messages
 * @param fallbackMessage - Default message if no specific errors are found
 */
export function useValidationErrorHandler() {
  const { showToast } = useToast()

  const handleValidationErrors = (
    errors: ValidationErrors,
    fallbackMessage = "Validation failed"
  ) => {
    const messages = Object.values(errors)
      .flat()
      .filter((msg) => typeof msg === "string" && msg.trim().length > 0)

    if (messages.length > 0) {
      showToast("error", fallbackMessage, {
        description: messages,
      })
    } else {
      showToast("error", fallbackMessage)
    }
  }

  return { handleValidationErrors }
}
