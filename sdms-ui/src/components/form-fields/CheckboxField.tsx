"use client";

import type React from "react";

interface CheckboxFieldProps {
  name: string;
  /** If options is provided → multi-checkbox, otherwise → single checkbox */
  options?: { label: string; value: string }[];
  label?: string; // for single checkbox
  value?: string[] | boolean;
  onChange?: (value: string[] | boolean) => void;
  required?: boolean;
}

export default function CheckboxField({
  name,
  options,
  label,
  value,
  onChange,
  required = false,
}: CheckboxFieldProps) {
  // 👉 Handle multi-checkbox (array of values)
  const handleMultiChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    let updatedValues = Array.isArray(value) ? [...value] : [];

    if (e.target.checked) {
      updatedValues.push(newValue);
    } else {
      updatedValues = updatedValues.filter((v) => v !== newValue);
    }

    onChange?.(updatedValues);
  };

  // 👉 Handle single checkbox (boolean)
  const handleSingleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange?.(e.target.checked);
  };

  return (
    <div className="flex flex-col space-y-1">
      {options ? (
        // Multi-checkbox group
        <div className="space-y-2">
          {options.map((opt) => (
            <label key={opt.value} className="flex items-center space-x-2">
              <input
                type="checkbox"
                id={`${name}-${opt.value}`}
                name={name}
                value={opt.value}
                checked={Array.isArray(value) ? value.includes(opt.value) : false}
                onChange={handleMultiChange}
                className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">{opt.label}</span>
            </label>
          ))}
        </div>
      ) : (
        // Single checkbox
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            id={name}
            name={name}
            checked={typeof value === "boolean" ? value : false}
            onChange={handleSingleChange}
            required={required}
            className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
          <span className="text-sm text-gray-700">{label}</span>
        </label>
      )}
    </div>
  );
}
