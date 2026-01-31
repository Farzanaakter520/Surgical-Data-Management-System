"use client"

import { useState, type ReactNode } from "react"
import { ChevronDown, ChevronUp, Settings } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface ExpandableConfigProps {
  title?: string
  icon?: ReactNode
  children: ReactNode
  defaultExpanded?: boolean
  className?: string
  previewHeight?: number
}

export function ExpandableSection({
  title = "Configuration",
  icon = <Settings className="h-5 w-5 text-primary" />,
  children,
  defaultExpanded = false,
  className = "",
  previewHeight = 100,
}: ExpandableConfigProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded)

  return (
    <Card className={`overflow-hidden ${className}`}>
      {/* Always visible header - clickable to expand/collapse */}
      <CardHeader
        className="cursor-pointer hover:bg-muted/50 transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {icon}
            <CardTitle className="text-lg">{title}</CardTitle>
          </div>
          <Button variant="ghost" size="sm">
            {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <div className="pt-4 border-t">
          <div
            className={`transition-all duration-300 ease-in-out overflow-hidden ${isExpanded ? "" : "relative"}`}
            style={{
              maxHeight: isExpanded ? "none" : `${previewHeight}px`,
            }}
          >
            {children}
            {!isExpanded && (
              <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-background to-transparent pointer-events-none" />
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
