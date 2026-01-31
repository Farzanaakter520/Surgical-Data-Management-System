"use client"

import React, { useState, useEffect } from "react"

interface DateRangePickerProps {
  fromDate?: string
  toDate?: string
  onChange?: (fromDate: string, toDate: string) => void
  showButton?: boolean
  buttonLabel?: string
}

export default function DateRangePicker({
  fromDate = "",
  toDate = "",
  onChange,
  showButton = false,
  buttonLabel = "Apply",
}: DateRangePickerProps) {
  const [from, setFrom] = useState(fromDate)
  const [to, setTo] = useState(toDate)
  const [error, setError] = useState("")

  useEffect(() => {
    if (from && to && new Date(from) > new Date(to)) {
      setError("From date cannot be later than To date")
    } else {
      setError("")
      if (!showButton) {
        // Only auto trigger if showButton is false
        onChange?.(from, to)
      }
    }
  }, [from, to, showButton])

  // Utility to compute quick date ranges
  const getQuickRange = (
    type: "last" | "next" | "single",
    period: "week" | "month" | "year" | "today" | "nextday"
  ) => {
    const today = new Date()
    const start = new Date(today)
    const end = new Date(today)

    const adjust = (date: Date, value: number, unit: "days" | "months" | "years") => {
      if (unit === "days") date.setDate(date.getDate() + value)
      if (unit === "months") date.setMonth(date.getMonth() + value)
      if (unit === "years") date.setFullYear(date.getFullYear() + value)
    }

    if (type === "last") {
      if (period === "week") adjust(start, -7, "days")
      if (period === "month") adjust(start, -1, "months")
      if (period === "year") adjust(start, -1, "years")
    } else if (type === "next") {
      if (period === "week") adjust(end, 7, "days")
      if (period === "month") adjust(end, 1, "months")
      if (period === "year") adjust(end, 1, "years")
    } else if (type === "single") {
      if (period === "today") {
        return {
          from: today.toISOString().slice(0, 10),
          to: today.toISOString().slice(0, 10),
        }
      }
      if (period === "nextday") {
        adjust(today, 1, "days")
        const nextDay = today.toISOString().slice(0, 10)
        return { from: nextDay, to: nextDay }
      }
    }

    return {
      from: type === "last" ? start.toISOString().slice(0, 10) : today.toISOString().slice(0, 10),
      to: type === "last" ? today.toISOString().slice(0, 10) : end.toISOString().slice(0, 10),
    }
  }

  const handleQuickSelect = (
    type: "last" | "next" | "single",
    period: "week" | "month" | "year" | "today" | "nextday"
  ) => {
    const range = getQuickRange(type, period)
    setFrom(range.from)
    setTo(range.to)
  }

  const handleButtonClick = () => {
    if (!error && from && to) {
      onChange?.(from, to)
    }
  }

  return (
    <div className="flex flex-col space-y-3">
      {/* Date inputs */}
      <div className="flex items-end space-x-2">
        <div className="flex flex-col space-y-1">
          <label className="text-sm font-medium">From</label>
          <input
            type="date"
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            className="border rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex flex-col space-y-1">
          <label className="text-sm font-medium">To</label>
          <div className="flex items-center space-x-2">
            <input
              type="date"
              value={to}
              onChange={(e) => setTo(e.target.value)}
              className="border rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {showButton && (
              <button
                onClick={handleButtonClick}
                disabled={!!error || !from || !to}
                className={`px-4 py-2 rounded-md text-white text-sm font-medium ${
                  !!error || !from || !to
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700"
                }`}
              >
                {buttonLabel}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && <p className="text-red-500 text-sm">{error}</p>}

      {/* Quick selectors */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => handleQuickSelect("single", "today")}
          className="bg-gray-200 hover:bg-gray-300 px-3 py-1 rounded-md text-sm"
        >
          Today
        </button>
        <button
          onClick={() => handleQuickSelect("single", "nextday")}
          className="bg-gray-200 hover:bg-gray-300 px-3 py-1 rounded-md text-sm"
        >
          Next Day
        </button>
        <button
          onClick={() => handleQuickSelect("last", "week")}
          className="bg-gray-200 hover:bg-gray-300 px-3 py-1 rounded-md text-sm"
        >
          Last Week
        </button>
        <button
          onClick={() => handleQuickSelect("next", "week")}
          className="bg-gray-200 hover:bg-gray-300 px-3 py-1 rounded-md text-sm"
        >
          Next Week
        </button>
        <button
          onClick={() => handleQuickSelect("last", "month")}
          className="bg-gray-200 hover:bg-gray-300 px-3 py-1 rounded-md text-sm"
        >
          Last Month
        </button>
        <button
          onClick={() => handleQuickSelect("next", "month")}
          className="bg-gray-200 hover:bg-gray-300 px-3 py-1 rounded-md text-sm"
        >
          Next Month
        </button>
        <button
          onClick={() => handleQuickSelect("last", "year")}
          className="bg-gray-200 hover:bg-gray-300 px-3 py-1 rounded-md text-sm"
        >
          Last Year
        </button>
        <button
          onClick={() => handleQuickSelect("next", "year")}
          className="bg-gray-200 hover:bg-gray-300 px-3 py-1 rounded-md text-sm"
        >
          Next Year
        </button>
      </div>
    </div>
  )
}
