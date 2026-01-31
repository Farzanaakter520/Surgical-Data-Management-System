"use client";

import { Controller, useFormContext } from "react-hook-form";
import { fieldRegistry } from "./field----------Registry";

interface FormFieldControllerProps {
  name: string;
  label: string;
  type: keyof typeof fieldRegistry;
  placeholder?: string;
  componentProps?: Record<string, any>;
  required?: boolean;
  size?: "default" | "full"|"half"; // 👈 added size prop
}

export default function FormFieldController({
  name,
  label,
  type,
  placeholder,
  componentProps = {},
  required = false,
  size = "default", // 👈 default to normal
}: FormFieldControllerProps) {
  const { control, formState: { errors } } = useFormContext();

  const fieldError = name?.split(".").reduce((acc: any, key) => acc?.[key], errors);
  const Component = fieldRegistry[type];

  if (!Component) {
    console.error(`No field registered for type "${type}"`);
    return null;
  }

  // 👇 the core field UI
  const fieldContent = (
    <div className="flex flex-col space-y-1">
      <label htmlFor={name} className="text-sm font-medium text-gray-700">
        {label} {required && <span className="text-red-500">*</span>}
      </label>

      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <Component
            id={name}
            value={field.value ?? ""}
            onChange={field.onChange}
            error={fieldError?.message}
            placeholder={placeholder}
            {...componentProps}
          />
        )}
      />

      {fieldError && !componentProps?.hideError && (
        <p className="mt-1 text-sm text-red-600">{fieldError.message}</p>
      )}
    </div>
  );

   // 👇 map size to responsive classes
   const sizeClasses =
   size === "full"
     ? "md:col-span-2"
     : size === "half"
     ? "md:col-span-1"
     : "";

 return <div className={sizeClasses}>{fieldContent}</div>;
}