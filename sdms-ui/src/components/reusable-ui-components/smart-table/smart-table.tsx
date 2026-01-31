"use client";

import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  flexRender,
  type ColumnDef,
  type SortingState,
  type ColumnFiltersState,
  type VisibilityState,
  type RowSelectionState,
} from "@tanstack/react-table";
import clsx from "clsx";
import { useState, useMemo, useCallback, useEffect, useRef } from "react";
import {
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  Eye,
  ChevronDown,
  Search,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { TableExport } from "./table-export";
import { TablePagination } from "./table-pagination";
import { BulkActions } from "./bulk-actions";

export interface TableConfig {
  title?: string;
  description?: string;
  allowAddNew?: boolean;
  exportFileName?: string;
  searchable?: boolean;
  exportable?: boolean;
  columnfilterable?: boolean;
  enableRowselection?: boolean;
  enablePagination?: boolean;
  columns: TableColumn[];
  pagination?: {
    pageSize: number;
    showSizeSelector?: boolean;
  };
}

export interface TableColumn {
  id?: string;
  key?: string;
  accessorKey?: string;
  label?: string;
  header?: string;
  sortable?: boolean;
  searchable?: boolean;
  summable?: boolean;
  width?: number;
  cell?: ({ getValue, row, onCellAction }: any) => React.ReactNode;
  footer?: ({ table }: any) => React.ReactNode;
  meta?: {
    isNumeric?: boolean;
  };
}

interface BulkActionHandlers<TData = any> {
  onBulkDelete?: (rows: TData[]) => void;
  onBulkEmail?: (rows: TData[]) => void;
  onBulkExport?: (rows: TData[]) => void;
  onBulkArchive?: (rows: TData[]) => void;
}

export interface CellActionPayload {
  action: string;
  row: any;
  rowData: any;
}

interface AdvancedTableProps {
  data: any[];
  config: TableConfig;
  variant?: "regular" | "shrink";
  onRowClick?: (row: any) => void;
  onRowAction?: (action: any, row: any) => void;
  onCellAction?: (payload: CellActionPayload) => void;
  bulkActions?: BulkActionHandlers;
  onAddNew?: () => void;
  isLoading?: boolean;
}

export default function SmartTable({
  data,
  config,
  variant = "regular",
  onRowClick,
  onAddNew,
  onRowAction,
  onCellAction,
  bulkActions,
  isLoading = false,
}: AdvancedTableProps) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [globalFilter, setGlobalFilter] = useState("");
  const [selectedRow, setSelectedRow] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [toggleColumnCount, setToggleColumnCount] = useState(1);

  useEffect(() => setToggleColumnCount((prev) => prev + 1), []);

  // Variant-based styling
  const tableStyles = {
    regular: {
      headerPadding: "px-3 py-2",
      cellPadding: "px-1 py-1",
      minRowHeight: "min-h-[40px]",
      buttonSize: "default",
      textSize: "text-sm",
    },
    shrink: {
      headerPadding: "px-2 py-1",
      cellPadding: "px-1 py-0.5",
      minRowHeight: "min-h-[32px]",
      buttonSize: "sm" as const,
      textSize: "text-xs",
    },
  };

  const styles = tableStyles[variant];

  const getSortIcon = (isSorted: false | "asc" | "desc") => {
    if (isSorted === "asc") return <ArrowUp className="w-4 h-4" />;
    if (isSorted === "desc") return <ArrowDown className="w-4 h-4" />;
    return <ArrowUpDown className="w-4 h-4" />;
  };

  // Cell action handler
  const handleCellAction = useCallback(
    (action: string, row: any) => {
      if (onCellAction) {
        onCellAction({
          action,
          row,
          rowData: row.original,
        });
      }
    },
    [onCellAction]
  );

  const columns = useMemo<ColumnDef<any>[]>(() => {
    const baseColumns: ColumnDef<any>[] = config.columns.map(
      (col: TableColumn) => {
        const accessorKey = col.accessorKey || col.key || col.id || "";
        const validatedWidth =
          col.width !== undefined
            ? Math.min(Math.max(col.width, 80), 400)
            : 150;

        return {
          accessorKey,
          id: col.id || accessorKey,
          header: ({ column }) => {
            const label = col.header || col.label || accessorKey;
            return (
              <Button
                variant="ghost"
                size={"sm"}
                onClick={column.getToggleSortingHandler()}
                className="h-auto"
              >
                {label}
                {col.sortable && getSortIcon(column.getIsSorted())}
              </Button>
            );
          },
          cell:
            col.cell ||
            (({ getValue }) => {
              const value = getValue();
              const isNumeric =
                col.meta?.isNumeric || typeof value === "number";
              return (
                <div
                  className={`${styles.cellPadding} ${
                    styles.minRowHeight
                  } flex items-center border-gray-200 dark:border-gray-700 ${
                    isNumeric ? "justify-end" : "justify-start"
                  }`}
                >
                  <span className={`truncate ${styles.textSize}`}>
                    {value?.toString() || ""}
                  </span>
                </div>
              );
            }),
          footer: col.footer,
          meta: {
            isNumeric: col.meta?.isNumeric || false,
          },
          enableSorting: col.sortable,
          enableColumnFilter: config.columnfilterable,
          size: validatedWidth,
        };
      }
    );

    if (config.enableRowselection) {
      baseColumns.unshift({
        id: "select",
        header: ({ table }) => (
          <div
            className={`${styles.headerPadding} flex items-center justify-center`}
          >
            <Checkbox
              checked={table.getIsAllPageRowsSelected()}
              onCheckedChange={(value) =>
                table.toggleAllPageRowsSelected(!!value)
              }
              aria-label="Select all"
            />
          </div>
        ),
        cell: ({ row }) => (
          <div
            className={`${styles.cellPadding} flex items-center justify-center border-r border-gray-200 dark:border-gray-700`}
          >
            <Checkbox
              checked={row.getIsSelected()}
              onCheckedChange={(value) => row.toggleSelected(!!value)}
              aria-label="Select row"
            />
          </div>
        ),
        enableSorting: false,
        enableHiding: false,
        size: 30,
      });
    }

    return baseColumns;
  }, [config, styles]);

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: config.enablePagination
      ? getPaginationRowModel()
      : undefined,
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: "includesString",
    columnResizeMode: "onChange",
    defaultColumn: { size: 150, minSize: 30, maxSize: 400 },
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      globalFilter,
    },
    initialState: {
      pagination: { pageSize: config.pagination?.pageSize || 10 },
      columnSizing: Object.fromEntries(
        config.columns.map((col) => {
          const validatedWidth =
            col.width !== undefined
              ? Math.min(Math.max(col.width, 80), 400)
              : 150;
          return [col.accessorKey || col.key || col.id || "", validatedWidth];
        })
      ),
    },
    meta: { onCellAction: handleCellAction },
  });

  const handleRowClick = useCallback(
    (row: any) => {
      setSelectedRow(row.id);
      onRowClick?.(row.original);
    },
    [onRowClick]
  );

  return (
    <Card className="w-full relative">
      <CardHeader className={variant === "shrink" ? "pb-3" : ""}>
        <div className="flex justify-between items-start flex-wrap gap-2">
          <div>
            <CardTitle className={variant === "shrink" ? "text-lg" : ""}>
              {config.title}
            </CardTitle>
            {config.description && (
              <CardDescription
                className={variant === "shrink" ? "text-sm" : ""}
              >
                {config.description}
              </CardDescription>
            )}
          </div>

          <div className="flex items-center gap-2 ml-auto">
            {config.allowAddNew && (
              <Button
                onClick={() => onAddNew?.()}
                size={"sm"}
                className="bg-primary text-white hover:bg-primary/90"
              >
                + Add New
              </Button>
            )}
            {config.exportable && (
              <TableExport
                data={data}
                fileName={config.exportFileName || "table-data"}
                columns={config.columns.map((col) => ({
                  key: col.accessorKey || col.key || col.id || "",
                  label: col.header || col.label || "",
                }))}
                
              />
            )}
            {config.columnfilterable && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size={"sm"}>
                    <Eye className="mr-2 h-4 w-4" />
                    Columns
                    <ChevronDown className="ml-2 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {table
                    .getAllColumns()
                    .filter((column) => column.getCanHide())
                    .map((column) => (
                      <DropdownMenuCheckboxItem
                        key={column.id}
                        className="capitalize"
                        checked={column.getIsVisible()}
                        onCheckedChange={(value) => {
                          column.toggleVisibility(!!value);
                          setToggleColumnCount((prev) => prev + 1);
                        }}
                      >
                        {column.id}
                      </DropdownMenuCheckboxItem>
                    ))}
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>

        {config.searchable && (
          <div className="relative flex-1 max-w-sm mt-4">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              aria-label="Search table"
              placeholder="Search all columns..."
              value={globalFilter ?? ""}
              onChange={(event) => setGlobalFilter(String(event.target.value))}
              className="pl-8"
              // size={variant === "shrink" ? "sm" : "default"}
            />
          </div>
        )}

        {config.enableRowselection && bulkActions && (
          <BulkActions
            table={table}
            {...bulkActions}
            // buttonSize={styles.buttonSize}
          />
        )}
      </CardHeader>

      <CardContent className={variant === "shrink" ? "py-3" : ""}>
        <div className="rounded-md border overflow-hidden relative">
          {isLoading && (
            <div className="absolute inset-0 z-20 flex items-center justify-center bg-white/70 dark:bg-gray-900/70">
              <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}

          <div className="overflow-x-auto" ref={scrollRef}>
            <table
              className={`w-full table-fixed font-sans ${styles.textSize} text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-700 border-collapse`}
            >
              <thead className="bg-gray-100 dark:bg-gray-800 sticky top-0 z-10">
                {table.getHeaderGroups().map((headerGroup) => (
                  <tr key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <th
                        key={header.id}
                        style={{ width: header.getSize() }}
                        className={`border border-gray-300 dark:border-gray-700 ${styles.headerPadding} text-left font-semibold bg-gray-100 dark:bg-gray-800 relative`}
                      >
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                        {header.column.getCanResize() && (
                          <div
                            onMouseDown={header.getResizeHandler()}
                            onTouchStart={header.getResizeHandler()}
                            className="absolute right-0 top-0 h-full w-[5px] cursor-col-resize bg-transparent hover:bg-blue-400/40"
                          />
                        )}
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>

              <tbody>
                {isLoading ? (
                  <tr>
                    <td
                      colSpan={columns.length}
                      className={`text-center text-muted-foreground ${
                        variant === "shrink" ? "py-4" : "py-6"
                      }`}
                    >
                      Loading...
                    </td>
                  </tr>
                ) : table.getRowModel().rows.length ? (
                  table.getRowModel().rows.map((row, rowIndex) => (
                    <tr
                      key={row.id}
                      onClick={() => handleRowClick(row)}
                      className={clsx(
                        "transition-colors cursor-pointer",
                        rowIndex % 2 === 0
                          ? "bg-white dark:bg-gray-900"
                          : "bg-gray-50 dark:bg-gray-800",
                        "hover:bg-blue-50 dark:hover:bg-blue-900",
                        selectedRow === row.id && "bg-blue-100 dark:bg-blue-700"
                      )}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <td
                          key={cell.id}
                          style={{ width: cell.column.getSize() }}
                          className={`border border-gray-300 dark:border-gray-700 ${styles.cellPadding} truncate whitespace-nowrap overflow-hidden`}
                        >
                          {flexRender(cell.column.columnDef.cell, {
                            ...cell.getContext(),
                            onCellAction: handleCellAction,
                          })}
                        </td>
                      ))}
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={columns.length}
                      className={`text-center text-muted-foreground ${
                        variant === "shrink" ? "py-4" : "py-6"
                      }`}
                    >
                      No results found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {config.enablePagination && (
          <div className={variant === "shrink" ? "py-2" : "py-4"}>
            <TablePagination table={table} />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
