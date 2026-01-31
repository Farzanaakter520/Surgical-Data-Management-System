"use client"

import type React from "react"

interface DateTimeFieldProps {
  name: string
  required?: boolean
  placeholder?: string
  value?: string
  onChange?: (value: string) => void
}

export default function DateTimeField({
  name,
  required = false,
  placeholder,
  value = "",
  onChange,
}: DateTimeFieldProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange?.(e.target.value)
  }

  return (
    <div className="flex flex-col space-y-1">
      <input
        type="datetime-local"
        id={name}
        placeholder={placeholder}
        value={value}
        onChange={handleChange}
        className="border rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  )
}