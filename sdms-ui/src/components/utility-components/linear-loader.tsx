"use client"

import type * as React from "react"
import { cn } from "@/lib/utils"

interface LinearLoaderProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * The progress value (0-100)
   */
  value?: number
  /**
   * If true, the loader will be in indeterminate state
   */
  indeterminate?: boolean
  /**
   * The color of the loader
   */
  color?: "default" | "success" | "warning" | "danger"
  /**
   * The size of the loader
   */
  size?: "sm" | "md" | "lg"
  /**
   * If true, the percentage will be shown
   */
  showPercentage?: boolean
  /**
   * The animation speed in milliseconds
   */
  animationSpeed?: number
}

export function LinearLoader({
  value = 0,
  indeterminate = false,
  color = "default",
  size = "md",
  showPercentage = false,
  animationSpeed = 1500,
  className,
  ...props
}: LinearLoaderProps) {
  const progressValue = Math.min(Math.max(value, 0), 100)

  const colorVariants = {
    default: "bg-emerald-500",
    success: "bg-green-500",
    warning: "bg-amber-500",
    danger: "bg-rose-500",
  }

  const sizeVariants = {
    sm: "h-1",
    md: "h-2",
    lg: "h-3",
  }

  return (
    <div className={cn("w-full", className)} {...props}>
      <div className="flex items-center gap-3">
        <div className={cn("w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700", sizeVariants[size])}>
          {indeterminate ? (
            <div
              className={cn("h-full rounded-full", colorVariants[color])}
              style={{
                width: "30%",
                animation: `indeterminate ${animationSpeed}ms infinite linear`,
              }}
            />
          ) : (
            <div
              className={cn("h-full rounded-full transition-all duration-300 ease-in-out", colorVariants[color])}
              style={{ width: `${progressValue}%` }}
            />
          )}
        </div>
        {showPercentage && !indeterminate && (
          <span className="text-xs font-medium text-gray-700 dark:text-gray-300">{progressValue}%</span>
        )}
      </div>

      <style jsx global>{`
        @keyframes indeterminate {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(400%);
          }
        }
      `}</style>
    </div>
  )
}
