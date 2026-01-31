"use client";

import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Stethoscope, Clock, StickyNote, LucideIcon } from "lucide-react";

interface TabItem {
  value: string;
  label: string;
  icon: LucideIcon;
  bgColor?: string;
  hoverColor?: string;
}

interface ReusableTabsProps {
  tabs: TabItem[];
}


function ReusableTabs({ tabs }: ReusableTabsProps) {
  return (
    // <div className="w-full mb-4 overflow-visible">
      <TabsList className="flex flex-wrap gap-2 w-full">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <TabsTrigger
              key={tab.value}
              value={tab.value}
              className={`flex items-center gap-2 px-2 py-2 sm:px-3 sm:py-3 md:px-4 md:py-4 text-sm sm:text-base md:text-lg lg:text-xl text-gray-800 rounded-sm whitespace-nowrap
          ${tab.bgColor || "bg-gray-100"} 
          ${tab.hoverColor || "hover:bg-gray-200"}`}
              style={{ minHeight: "50px" }}      >
              <Icon className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 lg:w-6 lg:h-6" />
              {tab.label}
            </TabsTrigger>
          );
        })}
      </TabsList>
    // </div>
  );
}


export default function PatientTabs() {
  const tabs: TabItem[] = [
    {
      value: "medical-history",
      label: "Medical History",
      icon: Stethoscope,
      bgColor: "bg-cyan-100",
      hoverColor: "hover:bg-cyan-200",
    },
    {
      value: "recent-visits",
      label: "Recent Visits",
      icon: Clock,
      bgColor: "bg-yellow-100",
      hoverColor: "hover:bg-yellow-200",
    },
   
    {
      value: "notes",
      label: "Notes",
      icon: StickyNote,
      bgColor: "bg-pink-100",
      hoverColor: "hover:bg-pink-200",
    },
  ];

  return <ReusableTabs tabs={tabs} />;
}
