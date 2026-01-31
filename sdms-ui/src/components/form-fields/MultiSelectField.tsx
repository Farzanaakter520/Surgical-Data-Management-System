"use client"

import * as React from "react"
import { Badge } from "@/components/ui/badge"
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover"
import {
  Command,
  CommandInput,
  CommandList,
  CommandItem,
  CommandEmpty,
  CommandGroup,
} from "@/components/ui/command"
import { cn } from "@/lib/utils"
import { X } from "lucide-react"

export type Option =
  | string
  | { label: string; value: string }
  | { label: { en: string; [key: string]: string }; value: string }

interface MultiSelectFieldProps {
  name?: string
  label?: string
  options: Option[] | (() => Promise<Option[]>)
  placeholder?: string
  language?: string
  disabled?: boolean
  loadingText?: string
  value?: string[]
  onChange?: (value: string[]) => void
  defaultValue?: string[]
}

export default function MultiSelectField({
  name,
  label,
  options,
  placeholder = "Select options",
  language = "en",
  disabled = false,
  loadingText = "Loading...",
  value,
  onChange,
  defaultValue = [],
}: MultiSelectFieldProps) {
  const [internalValue, setInternalValue] = React.useState<string[]>(defaultValue)
  const [resolvedOptions, setResolvedOptions] = React.useState<Option[]>([])
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  const [open, setOpen] = React.useState(false)

  const currentValue = value !== undefined ? value : internalValue
  const handleChange = (newValue: string[]) => {
    if (onChange) onChange(newValue)
    else setInternalValue(newValue)
  }

  // Load options (sync or async)
  React.useEffect(() => {
    let isMounted = true
    const loadOptions = async () => {
      try {
        setLoading(true)
        const result = typeof options === "function" ? await options() : options
        if (isMounted) setResolvedOptions(result)
      } catch (err) {
        if (isMounted) setError(err instanceof Error ? err.message : "Failed to load options")
      } finally {
        if (isMounted) setLoading(false)
      }
    }
    loadOptions()
    return () => {
      isMounted = false
    }
  }, [options])

  const getLabel = (opt: Option) => {
    if (typeof opt === "string") return opt
    if ("label" in opt) {
      if (typeof opt.label === "string") return opt.label
      return opt.label[language] || opt.label.en
    }
    return ""
  }

  const getValue = (opt: Option) => (typeof opt === "string" ? opt : opt.value)

  const removeItem = (value: string[], itemToRemove: string) =>
    value.filter((v: string) => v !== itemToRemove)

  if (error) return <p className="text-red-500 text-sm">{error}</p>

  return (
    <div className="space-y-1">
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <div
            className={cn(
              "flex flex-wrap items-center gap-1 min-h-[2.5rem] w-full rounded-md border border-input bg-background px-2 py-1 text-sm shadow-sm transition-colors",
              "focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2",
              disabled && "cursor-not-allowed opacity-50",
              !disabled && "hover:border-primary"
            )}
          >
            {loading ? (
              <span className="text-muted-foreground">{loadingText}</span>
            ) : currentValue.length === 0 ? (
              <span className="text-muted-foreground">{placeholder}</span>
            ) : (
              currentValue.map((v: string) => {
                const opt = resolvedOptions.find((o) => getValue(o) === v)
                const label = opt ? getLabel(opt) : v
                return (
                  <Badge
                    key={v}
                    variant="secondary"
                    className="flex items-center gap-1 px-2 py-0.5 text-xs"
                  >
                    {label}
                    <X
                      className="h-3 w-3 cursor-pointer hover:text-red-500 transition"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleChange(removeItem(currentValue, v))
                      }}
                    />
                  </Badge>
                )
              })
            )}
          </div>
        </PopoverTrigger>

        <PopoverContent className="w-[250px] p-0" align="start">
          <Command>
            <CommandInput placeholder="Search..." className="h-9" />
            <CommandList>
              {loading ? (
                <div className="p-4 text-sm text-muted-foreground text-center">
                  {loadingText}
                </div>
              ) : (
                <>
                  <CommandEmpty>No options found</CommandEmpty>
                  <CommandGroup className="max-h-64 overflow-auto">
                    {resolvedOptions.map((opt) => {
                      const val = getValue(opt)
                      const label = getLabel(opt)
                      const isSelected = currentValue.includes(val)

                      return (
                        <CommandItem
                          key={val}
                          onSelect={() => {
                            const newValue = isSelected
                              ? currentValue.filter((v: string) => v !== val)
                              : [...currentValue, val]
                            handleChange(newValue)
                          }}
                          className="flex items-center gap-2"
                        >
                          <div
                            className={cn(
                              "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border",
                              isSelected
                                ? "bg-primary text-primary-foreground"
                                : "opacity-50"
                            )}
                          >
                            {isSelected && (
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                width="14"
                                height="14"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              >
                                <polyline points="20 6 9 17 4 12" />
                              </svg>
                            )}
                          </div>
                          {label}
                        </CommandItem>
                      )
                    })}
                  </CommandGroup>
                </>
              )}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  )
}
