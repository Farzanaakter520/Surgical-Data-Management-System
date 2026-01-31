"use client";

import { Button } from "@/components/ui/button";
import { TableColumn } from "@/components/reusable-ui-components/smart-table/smart-table";
import { Pencil, Trash2 } from "lucide-react"; // ✅ Import icons

export const HospitalColumnsConfig: TableColumn[] = [
  {
    id: "Edit",
    header: " ",
    width: 50,
    cell: ({ row, onCellAction }) => (
      <Button
        variant="ghost"
        size="icon"
        className="text-yellow-600 hover:text-yellow-800 hover:bg-yellow-50"
        onClick={(e) => {
          e.stopPropagation();
          onCellAction("edit", row);
        }}
      >
        <Pencil className="h-4 w-4" />
      </Button>
    ),
  },
  // {
  //   id: "Delete",
  //   header: " ",
  //   width: 50,
  //   cell: ({ row, onCellAction }) => (
  //     <Button
  //       variant="ghost"
  //       size="icon"
  //       className="text-red-600 hover:text-red-800 hover:bg-red-50"
  //       onClick={(e) => {
  //         e.stopPropagation();
  //         onCellAction("delete", row);
  //       }}
  //     >
  //       <Trash2 className="h-4 w-4" />
  //     </Button>
  //   ),
  // },
  {
    id: "id",
    accessorKey: "id",
    header: "Hospital ID",
    searchable: true,
    sortable: true,
    width: 120,
  },
  {
    id: "name",
    accessorKey: "name",
    header: "Name",
    searchable: true,
    sortable: true,
    width: 180,
  },
  {
    id: "contact_number",
    accessorKey: "contact_number",
    header: "Contact",
    width: 140,
  },
  {
    id: "alt_contact_number",
    accessorKey: "alt_contact_number",
    header: "Alt. Contact",
    width: 140,
  },
  {
    id: "email",
    accessorKey: "email",
    header: "Email",
    searchable: true,
    width: 200,
  },
  {
    id: "web_site",
    accessorKey: "web_site",
    header: "Website",
    searchable: true,
    width: 200,
  },
  {
    id: "address_line_1",
    accessorKey: "address_line_1",
    header: "Address",
    width: 250,
  },
];
