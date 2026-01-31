"use client"
import { LinearLoader } from "@/components/utility-components/linear-loader"
import { useLoading } from "@/contexts/loading-context"

interface GlobalLoaderProps {
  position?: "top" | "fixed"
  color?: "default" | "success" | "warning" | "danger"
  size?: "sm" | "md" | "lg"
  showPercentage?: boolean
}

export function GlobalLoader({
  position = "top",
  color = "default",
  size = "md",
  showPercentage = false,
}: GlobalLoaderProps) {
  const { isLoading, progress } = useLoading()

  // Hide the loader when it's not visible
  if (!isLoading) {
    return null
  }

  return (
    <div
      className={`
        ${position === "top" ? "w-full left-0 top-0 z-50" : "fixed left-0 top-0 w-full z-50"}
        ${position === "fixed" ? "p-4" : ""}
      `}
    >
      <LinearLoader
        value={progress}
        color={color}
        size={size}
        showPercentage={showPercentage}
        className={position === "fixed" ? "max-w-md mx-auto" : ""}
      />
    </div>
  )
}
