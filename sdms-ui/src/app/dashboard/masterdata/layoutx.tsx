import type { ReactNode } from "react"

export default function FullscreenLayout({ children }: { children: ReactNode }) {
  // No <html>/<body> tags here -- we already have them in the root layout
  return <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">{children}</div>
}
