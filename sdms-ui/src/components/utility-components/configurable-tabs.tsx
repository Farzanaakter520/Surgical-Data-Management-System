"use client";

import { useState } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { ReactNode } from "react";

interface TabConfig {
  id: string;
  label: string;
  component: ReactNode;
  icon?: ReactNode;
  badge?: string | number;
  reloadOnClick?: boolean; // new flag
}

interface ConfigurableTabsProps {
  tabs: TabConfig[];
  defaultTab?: string;
  className?: string;
}

export function ConfigurableTabs({
  tabs,
  defaultTab,
  className = "",
}: ConfigurableTabsProps) {
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.id);

  return (
    <div className={`w-full ${className}`}>
      <Tabs
        value={activeTab}
        onValueChange={(val) => {
          setActiveTab(val);
        }}
        className="w-full"
      >
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg shadow-sm overflow-hidden">
          {/* Tab Header */}
          <div className="border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 rounded-t-lg">
            <TabsList
              className="
                w-full flex justify-center gap-1 sm:gap-2 
                px-2 sm:px-4 py-3 
                bg-transparent
                h-[70px] 
                overflow-x-auto overflow-y-hidden
                items-center
                scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600
              "
              style={{ scrollbarWidth: "thin" }}
            >
              {tabs.map((tab) => (
                <TabsTrigger
                  key={tab.id}
                  value={tab.id}
                  className={`
                    relative px-3 sm:px-5 py-2 sm:py-2.5 
                    text-xs sm:text-sm font-medium
                    text-gray-700 dark:text-gray-200
                    rounded-full border border-transparent
                    hover:bg-gray-100 dark:hover:bg-gray-800
                    hover:text-gray-900 dark:hover:text-white
                    data-[state=active]:bg-blue-100 dark:data-[state=active]:bg-blue-900/60
                    data-[state=active]:text-blue-700 dark:data-[state=active]:text-blue-400
                    data-[state=active]:border-blue-600 dark:data-[state=active]:border-blue-500
                    transition-all duration-200 flex items-center gap-1 sm:gap-2
                    focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500
                    whitespace-nowrap flex-shrink-0
                    min-w-fit h-fit
                  `}
                >
                  {tab.icon && (
                    <span className="flex-shrink-0 text-sm sm:text-base">
                      {tab.icon}
                    </span>
                  )}
                  <span className="whitespace-nowrap">{tab.label}</span>
                  {tab.badge && (
                    <span className="ml-1 px-1.5 sm:px-2 py-0.5 bg-gray-200 dark:bg-gray-700 text-xs font-medium rounded-full text-gray-800 dark:text-gray-200 data-[state=active]:bg-blue-200 dark:data-[state=active]:bg-blue-800 data-[state=active]:text-blue-800 dark:text-blue-200 flex-shrink-0">
                      {tab.badge}
                    </span>
                  )}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          {/* Tab Content */}
          <div className="bg-white dark:bg-gray-900 rounded-b-lg px-1 sm:px-3 py-1 sm:py-3">
            {tabs.map((tab) => {
              // reloadOnClick: true => re-render only if active
              if (tab.reloadOnClick) {
                return activeTab === tab.id ? (
                  <div
                    key={tab.id}
                    className="w-full max-w-4xl animate-in fade-in duration-300 text-gray-800 dark:text-gray-100 mx-auto"
                  >
                    {tab.component}
                  </div>
                ) : null;
              }

              // reloadOnClick: false => always mounted, just hidden
              return (
                <div
                  key={tab.id}
                  style={{ display: activeTab === tab.id ? "block" : "none" }}
                  className="w-full max-w-4xl text-gray-800 dark:text-gray-100 mx-auto"
                >
                  {tab.component}
                </div>
              );
            })}
          </div>
        </div>
      </Tabs>
    </div>
  );
}
