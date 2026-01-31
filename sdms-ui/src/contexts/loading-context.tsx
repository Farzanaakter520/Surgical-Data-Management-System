"use client"

import { createContext, useContext, useState, useCallback, type ReactNode } from "react"

interface LoadingContextType {
  isLoading: boolean
  progress: number
  startLoading: (isIndeterminate?: boolean) => void
  stopLoading: () => void
  setProgress: (value: number) => void
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined)

export function LoadingProvider({ children }: { children: ReactNode }) {
  const [isLoading, setIsLoading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [progressInterval, setProgressInterval] = useState<NodeJS.Timeout | null>(null)

  const startLoading = useCallback(
    (isIndeterminate = true) => {
      setIsLoading(true)

      // Reset progress
      setProgress(0)

      // If indeterminate, we can simulate progress for visual feedback
      if (isIndeterminate && progressInterval === null) {
        const interval = setInterval(() => {
          setProgress((prev) => {
            // Never reach 100% for indeterminate loading
            // This creates a more realistic loading experience
            if (prev >= 90) {
              return 90
            }
            return prev + Math.random() * 5
          })
        }, 300)

        setProgressInterval(interval)
      }
    },
    [progressInterval],
  )

  const stopLoading = useCallback(() => {
    // When stopping, quickly complete to 100%
    setProgress(100)

    // Clear any running intervals
    if (progressInterval) {
      clearInterval(progressInterval)
      setProgressInterval(null)
    }

    // Small delay to show the completed progress before hiding
    setTimeout(() => {
      setIsLoading(false)
      setProgress(0)
    }, 300)
  }, [progressInterval])

  const updateProgress = useCallback(
    (value: number) => {
      // Clear any automatic progress updates
      if (progressInterval) {
        clearInterval(progressInterval)
        setProgressInterval(null)
      }

      setProgress(Math.min(Math.max(value, 0), 100))
    },
    [progressInterval],
  )

  return (
    <LoadingContext.Provider
      value={{
        isLoading,
        progress,
        startLoading,
        stopLoading,
        setProgress: updateProgress,
      }}
    >
      {children}
    </LoadingContext.Provider>
  )
}

export function useLoading() {
  const context = useContext(LoadingContext)
  if (context === undefined) {
    throw new Error("useLoading must be used within a LoadingProvider")
  }
  return context
}
