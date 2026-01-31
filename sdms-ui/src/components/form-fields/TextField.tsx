"use client";

interface Props {
  id: string;
  value: string;
  onChange: (value: any) => void;
  placeholder?: string;
  error?: string; // optional (ignored if you don’t want errors)
}

export default function TextField({ id, value, onChange, placeholder }: Props) {
  return (
    <input
      id={id}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full px-3 py-2 border rounded-lg focus:ring-2 outline-none border-gray-300 focus:ring-blue-200"
    />
  );
}
