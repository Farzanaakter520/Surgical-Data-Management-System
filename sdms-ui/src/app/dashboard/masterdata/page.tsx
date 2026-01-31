"use client";
import { useMemo, useState } from "react";
import { ArrowLeft, Search } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AuthGuard } from "@/components/utility-components/auth-guard";

import { createIconConfigs, type IconConfig } from "./icon-config";
import { useRouter } from "next/navigation";

export default function PatientsPage() {
  return (
    <AuthGuard>
      <MasterContainer />
    </AuthGuard>
  );
}

const MasterContainer = () => {
  const router = useRouter();

  const handleIconClick = (path: string) => {
    router.push(path);
  };

  // Memoize the icon configs to prevent unnecessary recalculations
  const iconConfigs = useMemo<IconConfig[]>(
    () => createIconConfigs(handleIconClick),
    [] // Removed handleIconClick from dependencies since it's stable
  );
  return (
    <div className="max-w-7xl mx-auto px-1 sm:px-1 lg:px-1 py-1">
      <IconGrid configs={iconConfigs} />
    </div>
  );
};

interface IconGridProps {
  configs: IconConfig[];
}

const IconGrid = ({ configs }: IconGridProps) => (
  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
    {configs.map((config) => {
      const Icon = config.icon;
      return (
        <Card
          key={config.id}
          className="cursor-pointer hover:shadow-lg hover:scale-105 transition-all dark:bg-gray-800 dark:border-gray-700"
          onClick={config.onClick}
        >
          <CardContent className="p-6">
            <div className="flex flex-col items-center text-center space-y-3">
              <div className={`relative p-4 rounded-xl ${config.bgColor}`}>
                <Icon className={`w-8 h-8 ${config.color}`} />
                {config.notifications && (
                  <Badge
                    variant="destructive"
                    className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center text-xs"
                  >
                    {config.notifications}
                  </Badge>
                )}
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white text-sm mb-1">
                  {config.label}
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 leading-tight">
                  {config.description}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      );
    })}
  </div>
);

// ------------------ Header ------------------

// interface HeaderProps {
//   title: string;
//   showBack: boolean;
//   onBack: () => void;
//   showSearch: boolean;
// }

// const Header = ({ title, showBack, onBack, showSearch }: HeaderProps) => (
//   <div className="flex items-center justify-between mb-3">
//     <div className="flex items-center space-x-2">
//       {showBack && (
//         <Button
//           variant="ghost"
//           size="icon"
//           onClick={onBack}
//           className="text-blue-600 hover:text-blue-800"
//         >
//           <ArrowLeft className="w-5 h-5" />
//         </Button>
//       )}
//       <h1 className="text-2xl font-bold text-gray-900 dark:text-white mt-1 mb-1">
//         {title}
//       </h1>
//     </div>

//     {showSearch && (
//       <Button
//         variant="outline"
//         size="sm"
//         className="bg-white dark:bg-gray-800 dark:text-white border dark:border-gray-700"
//       >
//         <Search className="w-4 h-4 mr-2" />
//         Search
//       </Button>
//     )}
//   </div>
// );

// ------------------ Icon Grid ------------------
