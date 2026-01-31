"use client"

import * as React from "react"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"

interface MultilingualLabel {
  en: string
  bn: string
  [key: string]: string
}

type Option =
  | string
  | { label: string; value: string }
  | { label: MultilingualLabel; value: string }

interface MultiSelectCheckboxProps {
  options: Option[] | (() => Promise<Option[]>)
  value: string[]                     // 🔥 works with react-hook-form
  onChange: (selected: string[]) => void
  placeholder?: string
  className?: string
  disabled?: boolean
  language?: string
  loadingText?: string
}

export default function MultiSelectCheckbox({
  options,
  value,
  onChange,
  placeholder = "Select options",
  className,
  disabled = false,
  language = "en",
  loadingText = "Loading options...",
}: MultiSelectCheckboxProps) {
  const [resolvedOptions, setResolvedOptions] = React.useState<Option[]>([])
  const [loading, setLoading] = React.useState(false)
  const [fetchError, setFetchError] = React.useState<string | null>(null)

  React.useEffect(() => {
    let isMounted = true
    const loadOptions = async () => {
      if (typeof options === "function") {
        setLoading(true)
        setFetchError(null)
        try {
          const result = await options()
          if (isMounted) setResolvedOptions(result)
        } catch (err) {
          if (isMounted) {
            setFetchError(err instanceof Error ? err.message : "Failed to load options")
            setResolvedOptions([])
          }
        } finally {
          if (isMounted) setLoading(false)
        }
      } else {
        setResolvedOptions(options)
      }
    }
    loadOptions()
    return () => {
      isMounted = false
    }
  }, [options])

  const getLabel = (option: Option): string => {
    if (typeof option === "string") return option
    if ("label" in option) {
      return typeof option.label === "string"
        ? option.label
        : option.label[language] || option.label.en
    }
    return ""
  }

  const getValue = (option: Option): string => {
    return typeof option === "string" ? option : option.value
  }

  const handleSelect = (item: string, checked: boolean) => {
    if (item === "NONE") {
      onChange(checked ? ["NONE"] : [])
      return
    }
    if (checked) {
      const newSelected = value.includes("NONE")
        ? value.filter((i) => i !== "NONE").concat(item)
        : [...value, item]
      onChange(newSelected)
    } else {
      onChange(value.filter((i) => i !== item))
    }
  }

  if (fetchError) {
    return (
      <div className="text-sm text-destructive">Error: {fetchError}</div>
    )
  }

  return (
    <div className={cn("w-full space-y-2", className)}>
      <ScrollArea className="max-h-64 rounded-md border p-2">
        {loading ? (
          <div className="text-sm text-muted-foreground">{loadingText}</div>
        ) : resolvedOptions.length === 0 ? (
          <div className="text-sm text-muted-foreground px-2">No options found</div>
        ) : (
          resolvedOptions.map((option) => {
            const label = getLabel(option)
            const val = getValue(option)
            const isChecked = value.includes(val)

            return (
              <Label
                key={val}
                className={cn(
                  "flex items-center gap-2 px-2 py-1 rounded hover:bg-accent cursor-pointer",
                  disabled && "cursor-not-allowed opacity-50"
                )}
              >
                <Checkbox
                  checked={isChecked}
                  onCheckedChange={(checked) => handleSelect(val, !!checked)}
                  disabled={disabled}
                />
                {label}
              </Label>
            )
          })
        )}
      </ScrollArea>
    </div>
  )
}
