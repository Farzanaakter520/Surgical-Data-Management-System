"use client";
import { Button } from "@/components/ui/button";
import SmartTable, {
  TableColumn,
} from "@/components/reusable-ui-components/smart-table/smart-table";
import React, { useTransition, useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { BarChart3 } from "lucide-react";
import { useRouter } from "next/navigation";
import { fetchTableData } from "@/lib/actions/tableServerAction";
//import { PatientReadmission} from "./readmission";

export const ColumnsConfig: TableColumn[] = [
  {
    id: "actions",
    header: " ",
    cell: ({ row, onCellAction }) => (
      <Button
        variant="default"
        className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 text-xs font-semibold"
        onClick={(e) => {
          e.stopPropagation(); // Prevent row click
          onCellAction("view_profile", row);
        }}
      >
        Profile
      </Button>
    ),
    width: 60,
  },

  {
    id: "patient_name",
    accessorKey: "patient_name",
    header: "Name",
    searchable: true,
    sortable: true,
    width: 120,
  },
  {
    id: "patient_id",
    accessorKey: "patient_id",
    header: "Patient ID",
    searchable: true,
    sortable: true,
    width: 60,
  },
  {
    id: "mobile",
    accessorKey: "mobile",
    header: "Phone",
    searchable: true,
    width: 100,
  },
  // {
  //   id: "address",
  //   accessorKey: "address",
  //   header: "Address",
  //   searchable: true,
  //   width: 220,
  // },
  {
    id: "age",
    accessorKey: "age",
    header: "Age",
    meta: { isNumeric: true },
    width: 30,
  },

  {
    id: "surgery_name",
    accessorKey: "surgery_name",
    header: "Name Of Surgery",
    searchable: true,
    sortable: true,
    width: 230,
  },
  {
    id: "surgery_date",
    accessorKey: "surgery_date",
    header: "Date of Surgery",
    searchable: true,
    sortable: true,
    width: 110,
    cell: ({ row }) => {
      const date = new Date(row.original.surgery_date);
      return date.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
    },
  },
  {
    id: "hospital_name",
    accessorKey: "hospital_name",
    header: "Hospital",
    searchable: true,
    sortable: true,
    width: 200,
  },
  // {
  //   id: "admission_id",
  //   accessorKey: "admission_id",
  //   header: "Adm. ID",
  //   searchable: true,
  //   sortable: true,
  //   width: 80,
  // },
  // {
  //   id: "admission_date",
  //   accessorKey: "admission_date",
  //   header: "Adm. Date",
  //   searchable: true,
  //   sortable: true,
  //   width: 120,
  //   cell: ({ row }) => {
  //     const date = new Date(row.original.admission_date);
  //     return date.toLocaleDateString("en-GB", {
  //       day: "2-digit",
  //       month: "short",
  //       year: "numeric",
  //     });
  //   },
  // },
];

export const RecentSurgeryPatientList = () => {
  const [isPending, startTransition] = useTransition();
  const [patients, setPatients] = useState<any[]>([]);
  const [isShowModal, setIsShowModal] = useState(false);
  const [selectedData, setSelectedData] = useState(null);
  const router = useRouter();
  const today = new Date().toISOString().split("T")[0];

  const [startDate, setStartDate] = useState(today);
  const [endDate, setEndDate] = useState(today);

  const loadPatients = () => {
    startTransition(async () => {
      try {
        const result = await fetchTableData("sdms", "/dashboard/getData", {
          //  action_mode: "date_to_date_pending_followup",
          action_mode: "recent_surgery_patient",
        });
        //console.log(result)
        setPatients(result || []);
      } catch (error) {
        console.error("Error fetching patients:", error);
      }
    });
  };

  useEffect(() => {
    loadPatients();
  }, []);

  // ✅ Handle cell actions (button clicks)
  const handleCellAction = (payload: any) => {
    const { action, row, rowData } = payload;

    console.log("Action:", action);
    //console.log("Row:", row);

    switch (action) {
      case "patient_readmission_click":
        console.log("Row Data:", rowData);
        setSelectedData(rowData);
        setIsShowModal(true);
        console.log(`Status clicked for patient: ${rowData.patient_name}`);
        // Handle status button click
        // You can open a modal, update status, etc.
        //handleStatusChange(rowData);
        break;

      case "view_profile":
        setSelectedData(rowData);
        console.log("Row Data:", rowData);
        // console.log(
        //   `View profile clicked for patient: ${rowData.patient_name}`
        // );
        // Handle view profile button click
        // You can navigate to profile page, open modal, etc.
        // handleViewProfile(rowData);
        router.push(
          `/dashboard/patient-profile/${rowData.patient_id}/${rowData.admission_id}`
        );
        break;

      default:
        console.log("Unknown action:", action);
    }
  };

  const handleRowClick = (row: any) => {
    // setIsShowModal(true)
    // alert(JSON.stringify(row))
    // alert(`Row Clicked!\nPatient: ${row.name}\nID: ${row.patient_id}`);
  };

  const handleModalComplete = (data: any) => {
    loadPatients();
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Recent Surgery Patient List
          </CardTitle>
          {/* <CardDescription>Admitted Patients</CardDescription> */}
        </CardHeader>
        <CardContent>
          <SmartTable
            data={patients}
            variant="shrink"
            isLoading={isPending}
            config={{
              columns: ColumnsConfig,
              // title: "Discharge Patients",
              // description: "Recently discharged and readmitted patients",
              columnfilterable: false,
              searchable: true,
              enablePagination: true,
              // exportable:true,
              pagination: {
                pageSize: 10,
                showSizeSelector: true,
              },
            }}
            onRowClick={handleRowClick}
            onCellAction={handleCellAction} // ✅ Pass the cell action handler
          />
        </CardContent>
      </Card>

      {/* <PatientReadmission
open={isShowModal}
parentDataProps={selectedData}
onClose={() => setIsShowModal(false)}
onModalComplete={handleModalComplete}
/> */}
    </>
  );
};
