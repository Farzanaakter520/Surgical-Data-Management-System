"use client";

import React, { useEffect, useState, useMemo, useCallback, useRef } from "react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import { Check, ChevronsUpDown, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

// Debounce hook
const useDebounce = <T,>(value: T, delay: number = 300): T => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debouncedValue;
};

interface Option {
  value: string | number;
  label: string | { en: string; bn: string };
}

interface DynamicSelectFieldProps {
  id: string;
  value: string; // controlled
  onChange: (v: string) => void; // controlled
  label?: string;
  placeholder?: string;
  options: Option[] | Promise<Option[]> | (() => Option[] | Promise<Option[]>);
  required?: boolean;
  language?: "en" | "bn";
  error?: string;
}

export default function DynamicSelectField({
  id,
  value,
  onChange,
  label,
  placeholder,
  options,
  required = false,
  language = "en",
  error,
}: DynamicSelectFieldProps) {
  const [resolvedOptions, setResolvedOptions] = useState<Option[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 300);
  const inputRef = useRef<HTMLInputElement>(null);

  // Load options (sync or async)
  useEffect(() => {
    let mounted = true;
    const normalize = (res: any): Option[] => Array.isArray(res) ? res : [];

    (async () => {
      setLoading(true);
      setLoadError(null);
      try {
        const maybe = typeof options === "function" ? options() : options;
        const result = await Promise.resolve(maybe);
        if (mounted) setResolvedOptions(normalize(result));
      } catch {
        if (mounted) setLoadError("Failed to load options");
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => { mounted = false; };
  }, [options]);

  const getLabel = useCallback(
    (opt: Option) =>
      typeof opt.label === "string" ? opt.label : opt.label[language] || opt.label.en,
    [language]
  );

  const filteredOptions = useMemo(() => {
    if (!debouncedSearch) return resolvedOptions;
    return resolvedOptions.filter(opt =>
      getLabel(opt).toLowerCase().includes(debouncedSearch.toLowerCase())
    );
  }, [debouncedSearch, resolvedOptions, getLabel]);

  const handleSelect = (val: string | number) => {
    onChange(String(val));
    setOpen(false);
    setSearch("");
  };

  useEffect(() => {
    if (open && inputRef.current) {
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  }, [open]);

  return (
    <div className="flex flex-col space-y-1">
      {label && <Label htmlFor={id}>{label}{required && " *"}</Label>}

      {loading && (
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Loader2 className="w-4 h-4 animate-spin" /> Loading...
        </div>
      )}
      {loadError && <div className="text-red-500 text-sm">{loadError}</div>}

      {!loading && !loadError && (
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={open}
              className="w-full justify-between font-normal"
            >
              <span className="truncate">
                {resolvedOptions.find(opt => String(opt.value) === value)?.label
                  ? getLabel(resolvedOptions.find(opt => String(opt.value) === value)!)
                  : placeholder || "Select"}
              </span>
              <ChevronsUpDown className="ml-2 h-4 w-4 text-muted-foreground" />
            </Button>
          </PopoverTrigger>
          <PopoverContent
            className="p-0 w-[var(--radix-popover-trigger-width)]"
            align="start"
            onOpenAutoFocus={e => e.preventDefault()}
          >
            <Command shouldFilter={false}>
              <CommandInput
                autoFocus={open}
                ref={inputRef}
                placeholder={`Search ${label || "option"}...`}
                value={search}
                onValueChange={setSearch}
              />
              <CommandEmpty>No option found.</CommandEmpty>
              <CommandGroup className="max-h-60 overflow-y-auto">
                {filteredOptions.map(opt => (
                  <CommandItem
                    key={String(opt.value)}
                    value={String(opt.value)}
                    onSelect={() => handleSelect(opt.value)}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        String(value) === String(opt.value) ? "opacity-100" : "opacity-0"
                      )}
                    />
                    <span className="truncate">{getLabel(opt)}</span>
                  </CommandItem>
                ))}
              </CommandGroup>
            </Command>
          </PopoverContent>
        </Popover>
      )}

      {/* {error && <p className="text-red-500 text-sm">{error}</p>} */}
    </div>
  );
}
