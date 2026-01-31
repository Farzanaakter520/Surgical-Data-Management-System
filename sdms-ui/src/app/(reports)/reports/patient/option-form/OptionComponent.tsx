"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Search } from "lucide-react";
import DateRangePickerForReport from "@/components/form-fields/StandaloneFromFields/DateRangePickerForReport";

interface OptionComponentProps {
  onShow: (data: Record<string, any>) => void;
}

export default function OptionComponent({ onShow }: OptionComponentProps) {
  const [selectedCriteria, setSelectedCriteria] = useState("dateRange");
  const [dateRange, setDateRange] = useState<{ from?: string; to?: string }>({});

  const handleShowClick = () => {
    onShow({
      action_mode: "date_between_patient_report",
      from_date: dateRange.from,
      to_date: dateRange.to,
    });
  };

  const isButtonDisabled = !dateRange.from || !dateRange.to;

  return (
    <div className="bg-white/5 border border-white/10 rounded-xl p-4 backdrop-blur max-w-full mx-auto">
      <h2 className="text-xl font-semibold text-white mb-4">Search Options</h2>

      {/* Criteria Selection */}
      <RadioGroup
        value={selectedCriteria}
        onValueChange={setSelectedCriteria}
        className="flex flex-wrap gap-6 mb-6"
      >
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="dateRange" id="dateRange" />
          <Label htmlFor="dateRange" className="text-white cursor-pointer">
            Date Range
          </Label>
        </div>
      </RadioGroup>

      <hr className="my-4 border-gray-700" />

      <form>
        <label className="text-sm font-semibold text-white block mb-4">
          Search by: Date Range
        </label>

        <DateRangePickerForReport
          label="Report Period"
          value={{ from: new Date().toISOString(), to: new Date().toISOString() }}
          config={{ allowQuickSelect: true }}
          onChange={setDateRange}
        />

        <div className="flex justify-end pt-4 border-t border-gray-700 mt-6">
          <Button
            type="button"
            disabled={isButtonDisabled}
            onClick={handleShowClick}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md shadow-sm flex items-center gap-2"
          >
            <Search className="w-4 h-4" />
            Show
          </Button>
        </div>
      </form>
    </div>
  );
}
