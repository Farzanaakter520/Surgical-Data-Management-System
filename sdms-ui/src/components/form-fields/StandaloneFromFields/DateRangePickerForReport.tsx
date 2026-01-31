"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { Calendar, X } from "lucide-react";
import { cn } from "@/lib/utils";

export interface DateRangeSelectorFieldProps {
  label?: string;
  default_value?:
    | "today"
    | "yesterday"
    | "1w"
    | "2w"
    | "1m"
    | "6m"
    | "1y"
    | "2y";
  value?: { from: string; to: string };
  config?: {
    allowQuickSelect?: boolean;
    className?: string;
  };
  onChange: (range: { from: string; to: string }) => void;
}

const formatDate = (d: Date) => d.toISOString().split("T")[0];

const DateRangePickerForReport: React.FC<DateRangeSelectorFieldProps> = ({
  label = "Select Date Range",
  default_value = "today",
  value,
  config,
  onChange,
}) => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [selectedQuick, setSelectedQuick] = useState(default_value);

  /** 🔹 Initialize default date range */
  useEffect(() => {
    const todayStr = formatDate(new Date());
    if (value) {
      setStartDate(value.from || "");
      setEndDate(value.to || "");
    } else {
      setStartDate(todayStr);
      setEndDate(todayStr);
      setSelectedQuick("today");
      onChange({ from: todayStr, to: todayStr });
    }
  }, []);

  /** 🔹 Apply quick range presets */
  const applyQuickRange = (
    range: "today" | "yesterday" | "1w" | "2w" | "1m" | "6m" | "1y" | "2y"
  ) => {
    const today = new Date();
    const from = new Date(today);
    const to = new Date(today);

    switch (range) {
      case "yesterday":
        from.setDate(today.getDate() - 1);
        to.setDate(today.getDate() - 1);
        break;
      case "1w":
        from.setDate(today.getDate() - 7);
        break;
      case "2w":
        from.setDate(today.getDate() - 14);
        break;
      case "1m":
        from.setMonth(today.getMonth() - 1);
        break;
      case "6m":
        from.setMonth(today.getMonth() - 6);
        break;
      case "1y":
        from.setFullYear(today.getFullYear() - 1);
        break;
      case "2y":
        from.setFullYear(today.getFullYear() - 2);
        break;
    }

    const fromStr = formatDate(from);
    const toStr = formatDate(to);
    setStartDate(fromStr);
    setEndDate(toStr);
    setSelectedQuick(range);
    onChange({ from: fromStr, to: toStr });
  };

  /** 🔹 Validation check */
  const isValidRange = useMemo(() => {
    if (!startDate || !endDate) return true;
    return new Date(endDate) >= new Date(startDate);
  }, [startDate, endDate]);

  const clearAll = () => {
    setStartDate("");
    setEndDate("");
    setSelectedQuick("today");
    onChange({ from: "", to: "" });
  };

  return (
    <div
      className={cn(
        "space-y-3 rounded-lg p-3 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 transition-colors",
        config?.className
      )}
    >
      <label className="text-sm font-medium text-gray-800 dark:text-gray-100">
        {label}
      </label>

      {config?.allowQuickSelect && (
        <select
          value={selectedQuick}
          onChange={(e) => applyQuickRange(e.target.value as any)}
          className="w-full text-sm border border-gray-300 dark:border-gray-700 px-3 py-2 rounded-md bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
        >
          <option value="today">Today</option>
          <option value="yesterday">Yesterday</option>
          <option value="1w">Last 1 Week</option>
          <option value="2w">Last 2 Weeks</option>
          <option value="1m">Last 1 Month</option>
          <option value="6m">Last 6 Months</option>
          <option value="1y">Last 1 Year</option>
          <option value="2y">Last 2 Years</option>
        </select>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 relative">
        {/* Start Date */}
        <div className="relative">
          <Input
            type="date"
            value={startDate}
            onChange={(e) => {
              const newFrom = e.target.value;
              setStartDate(newFrom);
              setSelectedQuick("today");
              onChange({ from: newFrom, to: endDate });
            }}
            className="pl-10 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-700"
          />
          <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500 dark:text-gray-400" />
        </div>

        {/* End Date */}
        <div className="relative">
          <Input
            type="date"
            value={endDate}
            min={startDate}
            onChange={(e) => {
              const newTo = e.target.value;
              setEndDate(newTo);
              setSelectedQuick("today");
              onChange({ from: startDate, to: newTo });
            }}
            className={cn(
              "pl-10 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-700",
              !isValidRange && "border-red-500 dark:border-red-500"
            )}
          />
          <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500 dark:text-gray-400" />
          {(startDate || endDate) && (
            <button
              type="button"
              onClick={clearAll}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      {!isValidRange && (
        <p className="text-xs text-red-500 dark:text-red-400">
          End date must be after start date.
        </p>
      )}
    </div>
  );
};

export default DateRangePickerForReport;
