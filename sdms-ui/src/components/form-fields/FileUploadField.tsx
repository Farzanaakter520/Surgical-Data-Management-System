"use client";
import { useFormContext } from "react-hook-form";

interface Props {
  name: string;
  label: string;
}

export default function FileUploadField({ name, label }: Props) {
  const { register } = useFormContext();

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <input
        type="file"
        {...register(name)}
        multiple
        className="w-full border border-gray-300 rounded-lg px-4 py-2"
      />
    </div>
  );
}
