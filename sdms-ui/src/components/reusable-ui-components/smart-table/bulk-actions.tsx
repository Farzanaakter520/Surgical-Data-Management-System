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
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog"
import { Trash2, Mail, Download, Archive, MoreHorizontal } from "lucide-react"
import type { Table } from "@tanstack/react-table"

interface BulkActionsProps<TData> {
  table: Table<TData>
  onBulkDelete?: (rows: TData[]) => void
  onBulkEmail?: (rows: TData[]) => void
  onBulkExport?: (rows: TData[]) => void
  onBulkArchive?: (rows: TData[]) => void
}

export function BulkActions<TData>({
  table,
  onBulkDelete,
  onBulkEmail,
  onBulkExport,
  onBulkArchive,
}: BulkActionsProps<TData>) {
  const selectedRows = table.getFilteredSelectedRowModel().rows
  const selectedData = selectedRows.map((row) => row.original)

  if (selectedRows.length === 0) return null

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-muted-foreground">{selectedRows.length} row(s) selected</span>

      {/* Quick actions */}
      {/* {onBulkExport && (
        <Button variant="outline" size="sm" onClick={() => onBulkExport(selectedData)} className="h-8">
          <Download className="mr-2 h-4 w-4" />
          Export
        </Button>
      )} */}

      {/* More actions dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="h-8">
            <MoreHorizontal className="h-4 w-4" />
            <span className="sr-only">More bulk actions</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Bulk Actions</DropdownMenuLabel>
          <DropdownMenuSeparator />

          {onBulkEmail && (
            <DropdownMenuItem onClick={() => onBulkEmail(selectedData)}>
              <Mail className="mr-2 h-4 w-4" />
              Send Email
            </DropdownMenuItem>
          )}

          {onBulkArchive && (
            <DropdownMenuItem onClick={() => onBulkArchive(selectedData)}>
              <Archive className="mr-2 h-4 w-4" />
              Archive
            </DropdownMenuItem>
          )}

          {onBulkDelete && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete Selected
                </DropdownMenuItem>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete {selectedRows.length} selected record(s).
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={() => onBulkDelete(selectedData)}>
                    Delete {selectedRows.length} item(s)
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      <Button variant="outline" size="sm" onClick={() => table.resetRowSelection()} className="h-8">
        Clear Selection
      </Button>
    </div>
  )
}

