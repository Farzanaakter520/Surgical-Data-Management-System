"use client";

import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export interface TabItem {
  value: string;
  label: string;
  icon?: React.ReactNode;
  component: React.ReactNode;
}

interface ConfigurableTabbedPageProps {
  tabs: TabItem[];
  defaultTab?: string;
  className?: string; // optional extra styles
}

const ConfigurableTabbedPage: React.FC<ConfigurableTabbedPageProps> = ({
  tabs,
  defaultTab,
  className = "",
}) => {
  if (!tabs || tabs.length === 0) return null;

  return (
    <div className={`w-full max-w-6xl mx-auto p-6 ${className}`}>
      <Tabs defaultValue={defaultTab || tabs[0].value} className="w-full">
        {/* Tabs Header */}
        <TabsList className={`grid w-full grid-cols-${tabs.length > 4 ? 4 : tabs.length} md:grid-cols-${tabs.length}`}>
          {tabs.map((tab) => (
            <TabsTrigger
              key={tab.value}
              value={tab.value}
              className="flex items-center gap-2"
            >
              {tab.icon}
              <span className="hidden sm:inline">{tab.label}</span>
            </TabsTrigger>
          ))}
        </TabsList>

        {/* Tabs Content */}
        {tabs.map((tab) => (
          <TabsContent key={tab.value} value={tab.value} className="mt-6">
            {tab.component}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default ConfigurableTabbedPage;
