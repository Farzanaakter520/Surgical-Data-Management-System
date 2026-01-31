"use client";

import SmartTable, { TableConfig } from "@/components/reusable-ui-components/smart-table/smart-table";

import { Edit, Eye, Trash2 } from "lucide-react";
import { useMemo } from "react";

export const tableConfig: TableConfig = {
  title: "Patient Records",
  description: "List and manage all patient details",
  exportFileName: "patient-data",
  searchable: true,
  exportable: true,
  columnfilterable: true,
  enableRowselection: false,
  enablePagination: true,

  columns: [
    {
      accessorKey: "patient_id",
      label: "Patient ID",
      sortable: true,
      searchable: true,
    },
    {
      accessorKey: "name",
      label: "Name",
      sortable: true,
      searchable: true,
    },
    {
      accessorKey: "age",
      label: "Age",
      sortable: true,
      width: 80,
      summable: false,
      meta: { isNumeric: true },
    },
    {
      accessorKey: "gender",
      label: "Gender",
      width: 80,
    },
    {
      accessorKey: "marital_status",
      label: "Marital Status",
    },
    {
      accessorKey: "occupation",
      label: "Occupation",
    },
    {
      accessorKey: "mobile_no",
      label: "Mobile",
      searchable: true,
    },
    {
      accessorKey: "address_line",
      label: "Address",
    },
    {
      accessorKey: "date_of_admission",
      label: "Admission Date",
      sortable: true,
      width: 130,
    },
    {
      accessorKey: "date_of_operation",
      label: "Operation Date",
      sortable: true,
      width: 130,
    },
    {
      accessorKey: "date_of_discharge",
      label: "Discharge Date",
      sortable: true,
      width: 130,
    },
    {
      accessorKey: "pre_op_diagnosis",
      label: "Pre-op Diagnosis",
    },
    {
      accessorKey: "operations",
      label: "Proposed OT",
    },
    {
      accessorKey: "pre_op_investigations",
      label: "Pre-op Investigations",
    },
    {
      accessorKey: "co_morbidities",
      label: "Co-morbidities",
    },
    {
      accessorKey: "post_operative_recovery",
      label: "Post-op Recovery",
    },
    {
      accessorKey: "complications",
      label: "Complications",
    },
    {
      accessorKey: "advice_on_discharge",
      label: "Discharge Advice",
    },
    {
      accessorKey: "follow_up_date",
      label: "Follow-up Date",
    },
    {
      accessorKey: "follow_up_received",
      label: "F/U Received",
    },
    {
      accessorKey: "follow_up_procedure",
      label: "F/U Procedure",
    },
    {
      accessorKey: "outcome",
      label: "Outcome",
    },
  ],

  pagination: {
    pageSize: 10,
    showSizeSelector: true,
  },
};

const handleActionButtonClick = ({ action, row }: any) => {
  console.log({ action, row });
  // console.log(row)
};

export default function TableComponent({ data }: any) {
  const handleRowClick = (row: any) => {
    // console.log("Row clicked:", row)
  };

  // Bulk action handlers
  const bulkActions = {
    onBulkDelete: (rows: any[]) => {
      console.log("Bulk delete:", rows);
      // Implement your bulk delete logic here
      alert(`Deleting ${rows.length} records`);
    },
    onBulkEmail: (rows: any[]) => {
      console.log("Bulk email:", rows);
      // Implement your bulk email logic here
      alert(`Sending email to ${rows.length} doctors`);
    },
    onBulkArchive: (rows: any[]) => {
      console.log("Bulk archive:", rows);
      // Implement your bulk archive logic here
      alert(`Archiving ${rows.length} records`);
    },
    onBulkExport: (rows: any[]) => {
      console.log("Bulk export:", rows);
      // Implement your bulk export logic here
      alert(`Exporting ${rows.length} records`);
    },
  };

  return (
    <div className="container mx-auto py-8">
      <SmartTable
        data={data}
        config={tableConfig}
        onRowClick={handleRowClick}
        bulkActions={bulkActions}
      />
    </div>
  );
}
