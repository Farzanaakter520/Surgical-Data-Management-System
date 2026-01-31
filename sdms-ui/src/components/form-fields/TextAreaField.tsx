"use client"

interface Props {
  name?: string
  label?: string
  rows?: number
  placeholder?: string
  value?: string
  onChange?: (value: string) => void
  error?: string
}

export default function TextArea({ name, label, rows = 3, placeholder, value = "", onChange, error }: Props) {
  return (
    <div className="pt-1 flex flex-col space-y-1">
      {/* {label && <label className="block text-sm font-medium text-gray-700">{label}</label>} */}

      <textarea
        name={name}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        rows={rows}
        placeholder={placeholder}
        className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:outline-none
           border-gray-300 focus:ring-blue-200`
        }
      />

      {/* {error && <p className="text-sm text-red-600">{error}</p>} */}
    </div>
  )
}
