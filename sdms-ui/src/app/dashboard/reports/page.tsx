"use client"

import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { createTileIconConfigs, type IconConfig } from "./report-tile-menu-config"
import { AuthGuard } from "@/components/utility-components/auth-guard"

export default function ReportMenuPage() {
  return (
    // <AuthGuard>
      <ReportsMenuContainer />
    // </AuthGuard>
  )
}

const ReportsMenuContainer = () => {
  const router = useRouter()

  const handleIconClick = (iconId: string) => {
    if (iconId === "patient-reporting") {
      router.push("/reports/patient")
    }
    // Add more routes if needed
  }

  const iconConfigs: IconConfig[] = createTileIconConfigs(handleIconClick)

  return (
    <div className="max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
          Analytics & Reports Panel
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          Manage and navigate through available reports and analytics modules.
        </p>
      </div>

      {/* Report Tiles */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
        {iconConfigs.map((config) => {
          const IconComponent = config.icon
          return (
            <Card
              key={config.id}
              className="cursor-pointer hover:shadow-lg hover:scale-105 transition-all dark:bg-gray-800 dark:border-gray-700"
              onClick={config.onClick}
            >
              <CardContent className="p-6">
                <div className="flex flex-col items-center text-center space-y-3">
                  <div className={`relative p-4 rounded-xl ${config.bgColor}`}>
                    <IconComponent className={`w-8 h-8 ${config.color}`} />
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
          )
        })}
      </div>
    </div>
  )
}
