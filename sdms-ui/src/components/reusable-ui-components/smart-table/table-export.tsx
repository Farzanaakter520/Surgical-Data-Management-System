"use client"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Download } from "lucide-react"

interface TableExportProps<TData> {
  data: TData[]
  fileName: string
  columns?: Array<{
    key: string
    label: string
  }>
}

export function TableExport<TData>({ data, fileName, columns }: TableExportProps<TData>) {
  const exportToCSV = () => {
    if (data.length === 0) return

    // Use provided columns or extract from data
    const headers = columns
      ? columns.map((col) => col.label).join(",")
      : Object.keys(data[0] as Record<string, unknown>).join(",")

    const csvRows = data.map((row) => {
      const values = columns
        ? columns.map((col) => (row as any)[col.key])
        : Object.values(row as Record<string, unknown>)
      return values.map((value) => `"${value ?? ""}"`).join(",")
    })

    const csvContent = [headers, ...csvRows].join("\n")

    // Create and download the file
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.setAttribute("href", url)
    link.setAttribute("download", `${fileName}.csv`)
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  const exportToJSON = () => {
    if (data.length === 0) return

    // Filter data to only include specified columns if provided
    const exportData = columns
      ? data.map((row) => {
          const filteredRow: any = {}
          columns.forEach((col) => {
            filteredRow[col.key] = (row as any)[col.key]
          })
          return filteredRow
        })
      : data

    const jsonContent = JSON.stringify(exportData, null, 2)
    const blob = new Blob([jsonContent], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.setAttribute("href", url)
    link.setAttribute("download", `${fileName}.json`)
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  const exportToExcel = () => {
    // In a real application, you would use a library like xlsx
    // This is a simplified version that creates a CSV with .xlsx extension
    if (data.length === 0) return

    const headers = columns
      ? columns.map((col) => col.label).join("\t")
      : Object.keys(data[0] as Record<string, unknown>).join("\t")

    const csvRows = data.map((row) => {
      const values = columns
        ? columns.map((col) => (row as any)[col.key])
        : Object.values(row as Record<string, unknown>)
      return values.map((value) => `${value ?? ""}`).join("\t")
    })

    const csvContent = [headers, ...csvRows].join("\n")
    const blob = new Blob([csvContent], { type: "application/vnd.ms-excel" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.setAttribute("href", url)
    link.setAttribute("download", `${fileName}.xlsx`)
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm">
          <Download className="mr-2 h-4 w-4" />
          Export
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Export Options</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={exportToCSV}>Export as CSV</DropdownMenuItem>
        <DropdownMenuItem onClick={exportToJSON}>Export as JSON</DropdownMenuItem>
        <DropdownMenuItem onClick={exportToExcel}>Export as Excel</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

