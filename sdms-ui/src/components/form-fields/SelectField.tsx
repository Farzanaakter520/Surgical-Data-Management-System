"use client"

import { useEffect, useState, useCallback } from "react"
import { Loader2, ChevronDown } from "lucide-react"

interface Option {
  value: string
  label: string | Record<string, string>
}

interface Props {
  name: string
  label: string
  options?: Option[] | Promise<Option[]> | (() => Option[]) | (() => Promise<Option[]>) | null
  value?: string
  onChange?: (value: string) => void
  language?: string // Added language prop for internationalization
}

export default function SelectField({ name, label, options, value, onChange, language = "en" }: Props) {
  const [resolvedOptions, setResolvedOptions] = useState<Option[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const getLabel = useCallback(
    (opt: Option) => (typeof opt.label === "string" ? opt.label : opt.label[language] || opt.label.en),
    [language],
  )

  useEffect(() => {
    const loadOptions = async () => {
      if (!options) {
        setResolvedOptions([])
        return
      }

      setIsLoading(true)

      try {
        let result: Option[]

        if (Array.isArray(options)) {
          // Sync array
          result = options
        } else if (typeof options === "function") {
          // Function that returns sync or async data
          const functionResult = options()
          if (functionResult instanceof Promise) {
            result = await functionResult
          } else {
            result = functionResult
          }
        } else if (options instanceof Promise) {
          // Promise
          result = await options
        } else {
          result = []
        }

        // Validate options
        const validOptions = Array.isArray(result)
          ? result.filter((opt) => opt && typeof opt === "object" && "value" in opt && "label" in opt)
          : []

        setResolvedOptions(validOptions)
      } catch (error) {
        setResolvedOptions([])
      } finally {
        setIsLoading(false)
      }
    }

    loadOptions()
  }, [options])

  return (
    <div className="space-y-2">
      {label && (
        <label htmlFor={name} className="block text-sm font-medium text-foreground">
          {label}
        </label>
      )}

      <div className="relative">
        <select
          id={name}
          name={name}
          value={value || ""}
          onChange={(e) => onChange?.(e.target.value)}
          disabled={isLoading}
          className="w-full appearance-none bg-background border border-border rounded-md px-3 py-2.5 pr-10 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <option value="" disabled>
            {isLoading ? "Loading..." : `Select ${label?.toLowerCase() || "option"}`}
          </option>
          {resolvedOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {getLabel(opt)}
            </option>
          ))}
        </select>

        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
          {isLoading ? (
            <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
          ) : (
            <ChevronDown className="w-4 h-4 text-muted-foreground" />
          )}
        </div>
      </div>
    </div>
  )
}
