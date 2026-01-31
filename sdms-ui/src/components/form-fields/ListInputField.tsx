"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";


interface ListItem {
  label: string | any;
  value: string | number;
}

interface ListInputProps {
  value?: Record<string, string>; // controlled value
  onChange: (val: Record<string, string>) => void; // controlled update
  options: (() => Promise<ListItem[]>) | ListItem[];
  placeholder?: string;
}

function resolveLabel(label: string | any): string {
  if (typeof label === "string") return label;
  return label.en || label.bn || label[Object.keys(label)[0]] || "Unnamed";
}

export default function ListInputField({
  value = {},
  onChange,
  options,
  placeholder = "Enter value",
}: ListInputProps) {
  const [items, setItems] = useState<ListItem[] | null>(null);

  // Load options
  useEffect(() => {
    let isMounted = true;
    const loadOptions = async () => {
      try {
        const result = typeof options === "function" ? await options() : options;
        if (isMounted) setItems(result);
      } catch (err) {
        console.error("Failed to load list options:", err);
        if (isMounted) setItems([]);
      }
    };
    loadOptions();
    return () => {
      isMounted = false;
    };
  }, [options]);

  const handleChange = (key: string, val: string) => {
    const updated = { ...value };
    if (val === "") {
      delete updated[key];
    } else {
      updated[key] = val;
    }
    onChange(updated);
  };

  return (
    <div className="space-y-4">
      {!items ? (
        Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="flex items-center gap-4">
            <Skeleton className="h-5 w-40" />
            <Skeleton className="h-9 flex-1" />
          </div>
        ))
      ) : (
        items.map((item) => {
          const labelText = resolveLabel(item.label);
          const key = item.value.toString();

          return (
            <div
              key={key}
              className="
                grid grid-cols-1 md:grid-cols-2 gap-4 items-center
                focus-within:bg-blue-50 dark:focus-within:bg-blue-900
                rounded-md p-2
                transition-colors
              "
            >
              <Label
                htmlFor={key}
                className="text-sm font-medium text-gray-800 dark:text-gray-200"
              >
                {labelText}
              </Label>
              <Input
                id={key}
                value={value?.[key] || ""}
                placeholder={`${placeholder} (${labelText.toLowerCase()})`}
                onChange={(e) => handleChange(key, e.target.value)}
              />
            </div>
          );
        })
      )}
    </div>
  );
}
