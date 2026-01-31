

import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"

export function ButtonDemo() {
    const router = useRouter()
  return (
    <div className="flex flex-wrap items-center gap-2 md:flex-row">
      <Button onClick={() => router.back()}> <ArrowLeft className="h-4 w-4" />
      </Button>
    </div>
  )
}
