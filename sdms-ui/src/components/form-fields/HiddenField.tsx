"use client";

interface Props {
  id: string;
  value: string;
  onChange: (value: any) => void;
}

export default function HiddenField({ id, value, onChange }: Props) {
  return (
    <input
      type="hidden"
      id={id}
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  );
}
