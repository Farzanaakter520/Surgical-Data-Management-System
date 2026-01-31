"use client";

import React, { useEffect, useState } from "react";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface Option {
  value: string | number;
  label: string | { [lang: string]: string };
}

interface RadioFieldProps {
  value?: string | number;
  onChange: (val: string | number) => void;
  name: string;
  label?: string;
  options: Option[] | Promise<Option[]> | (() => Option[] | Promise<Option[]>);
  required?: boolean;
  language?: any;
  error?: string;
}

export default function RadioField({
  value,
  onChange,
  name,
  label,
  options,
  required = false,
  language = "en",
  error,
}: RadioFieldProps) {
  const [resolvedOptions, setResolvedOptions] = useState<Option[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    const normalize = (res: any): Option[] => {
      if (Array.isArray(res)) return res;
      if (res?.data && Array.isArray(res.data)) return res.data;
      if (res?.items && Array.isArray(res.items)) return res.items;

      if (res && typeof res === "object") {
        return Object.entries(res).map(([k, v]:any,any) => {
          const label =
            typeof v === "object" && v !== null
              ? v.label ?? JSON.stringify(v)
              : String(v);
          return { value: k, label };
        });
      }
      return [];
    };

    (async () => {
      setLoading(true);
      setLoadError(null);
      try {
        const maybe = typeof options === "function" ? options() : options;
        const result = await Promise.resolve(maybe);
        if (mounted) setResolvedOptions(normalize(result));
      } catch (err: any) {
        if (mounted) setLoadError(err?.message ?? "Failed to load options");
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [options]);

  const getLabel = (label: Option["label"]) => {
    if (typeof label === "string") return label;
    if (typeof label === "object" && label !== null) {
      return label[language] ?? Object.values(label)[0] ?? "";
    }
    return String(label);
  };

  return (
    <div className="flex flex-col space-y-2">
      {label && (
        <Label className="text-sm font-medium text-gray-700">
          {label} {required && <span className="text-red-500">*</span>}
        </Label>
      )}

      {loading && (
        <span className="text-gray-500 text-sm animate-pulse">
          Loading options...
        </span>
      )}
      {loadError && <span className="text-red-500 text-sm">{loadError}</span>}

      {!loading && (
        <div className="flex flex-wrap gap-4">
          {resolvedOptions.map((option) => (
            <label
              key={String(option.value)}
              className={cn(
                "flex items-center space-x-2 cursor-pointer rounded-lg border px-3 py-2",
                "hover:bg-gray-50 transition-all",
                String(value) === String(option.value) &&
                  "border-blue-500 bg-blue-50"
              )}
            >
              <input
                type="radio"
                name={name}
                value={String(option.value)}
                checked={String(value) === String(option.value)}
                onChange={() => onChange(option.value)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
              />
              <span className="text-sm text-gray-700">
                {getLabel(option.label)}
              </span>
            </label>
          ))}
        </div>
      )}

      {!loading && resolvedOptions.length === 0 && !loadError && (
        <span className="text-gray-500 text-sm">No options available</span>
      )}

      {/* {error && <p className="text-red-500 text-xs">{error}</p>} */}
    </div>
  );
}
