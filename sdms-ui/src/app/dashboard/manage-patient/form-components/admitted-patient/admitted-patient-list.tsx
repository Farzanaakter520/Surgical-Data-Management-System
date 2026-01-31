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
import { ReleaseFollowupSchedule } from "./release-followup-schedule";
import { EditPatient } from "./edit-patient";

export const ColumnsConfig: TableColumn[] = [
  {
    id: "",
    accessorKey: "status",
    header: "",
    cell: ({ row, onCellAction }) => (
      <Button
        variant="outline"
        className="bg-green-100 hover:bg-green-200 text-green-700 border-green-300 px-3 py-1 text-xs font-semibold"
        onClick={(e) => {
          e.stopPropagation(); // Prevent row click
          // ✅ Use the onCellAction handler
          onCellAction("status_click", row);
        }}
      >
        {row.original.status || "Discharge"}
      </Button>
    ),
    width: 90,
  },
  {
    id: "profile",
    header: "",
    accessorKey: "profile",
    cell: ({ row, onCellAction }) => (
      <Button
        variant="default"
        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-1"
        onClick={(e) => {
          e.stopPropagation(); // Prevent row click
          // ✅ Use the onCellAction handler
          onCellAction("view_profile", row);
        }}
      >
        Profile
      </Button>
    ),
    width: 80,
  },
  {
    id: "edit",
    header: "",
    accessorKey: "edit",
    cell: ({ row, onCellAction }) => (
      <Button
        variant="default"
        className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-1"
        onClick={(e) => {
          e.stopPropagation(); // Prevent row click
          // ✅ Use the onCellAction handler
          onCellAction("edit", row);
        }}
      >
        Edit
      </Button>
    ),
    width: 60,
  },
  // {
  //   id: "Add-surgical-data",
  //   header: "",
  //   cell: ({ row, onCellAction }) => (
  //     <Button
  //       variant="default"
  //       className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-1"
  //       onClick={(e) => {
  //         e.stopPropagation(); // Prevent row click
  //         // ✅ Use the onCellAction handler
  //         onCellAction("add_surgical_data", row);
  //       }}
  //     >
  //       Add Surgical Data
  //     </Button>
  //   ),
  //   width: 150,
  // },
  {
    id: "patient_name",
    accessorKey: "patient_name",
    header: "Name",
    searchable: true,
    sortable: false,
    width: 150,
  },
  {
    id: "patient_id",
    accessorKey: "patient_id",
    header: "Pat Id",
    searchable: true,
    sortable: false,
    width: 80,
  },
  {
    id: "mobile_number",
    accessorKey: "mobile_number",
    header: "Phone",
    searchable: true,
    width: 100,
  },
  {
    id: "age",
    accessorKey: "age",
    header: "Age",
    meta: { isNumeric: true },
    width: 80,
  },

  // {
  //   id: "admission_id",
  //   accessorKey: "admission_id",
  //   header: "Admission Id",
  //   searchable: true,
  //   sortable: false,
  //   width: 80,
  // },
  // {
  //   id: "admission_date",
  //   accessorKey: "admission_date",
  //   header: "Adm. date",
  //   searchable: true,
  //   sortable: false,
  //   width: 80,
  // },

  // {
  //   id: "Address",
  //   accessorKey: "address",
  //   header: "Address",
  //   searchable: true,
  //   width: 250,
  // },
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
    header: "Surgery Date",
    searchable: true,
    sortable: true,
    width: 90,
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
    sortable: false,
    width: 200,
  },
];

export const AdmittedPatientList = () => {
  const [isPending, startTransition] = useTransition();
  const [patients, setPatients] = useState<any[]>([]);
  const [isShowModal, setIsShowModal] = useState(false);
    const [isShowEditPatient, setIsShowEditPatient] = useState(false);
  const [selectedData, setSelectedData] = useState(null);
  const router = useRouter();

  const loadPatients = () => {
    startTransition(async () => {
      try {
        const result = await fetchTableData("sdms", "/patientData/getList", {
          action_mode: "patient_admitted_not_released",
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

    //console.log("Action:", action);
    //console.log("Row:", row);

    switch (action) {
      case "status_click":
        console.log("Row Data:", rowData);
        setSelectedData(rowData);
        setIsShowModal(true);
        console.log(`Status clicked for patient: ${rowData.patient_name}`);
        // Handle status button click
        // You can open a modal, update status, etc.
        //handleStatusChange(rowData);
        break;

      case "view_profile":
        console.log("Row Data:", rowData);
        console.log(
          `View profile clicked for patient: ${rowData.patient_name}`
        );
        // Handle view profile button click
        // You can navigate to profile page, open modal, etc.
        // handleViewProfile(rowData);
        router.push(
          `/dashboard/patient-profile/${rowData.patient_id}/${rowData.admission_id}`
        );

        break;

        case "edit":
        console.log("Row Data:", rowData);
        console.log(
          `View profile clicked for patient: ${rowData.patient_name}`
        );
        setSelectedData(rowData);
        setIsShowEditPatient(true);
        // Handle view profile button click
        // You can navigate to profile page, open modal, etc.
        // handleViewProfile(rowData);
        // router.push(
        //   `/dashboard/patient-profile/${rowData.patient_id}/${rowData.admission_id}`
        // );

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
    setIsShowModal(false);
    loadPatients();
  };
  const handleEditPatientComplete = (data: any) => {
    setIsShowEditPatient(false);
    loadPatients();
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Current Admitted Patient List
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

      <ReleaseFollowupSchedule
        open={isShowModal}
        parentDataProps={selectedData}
        onClose={() => setIsShowModal(false)}
        onModalComplete={handleModalComplete}
      />
      <EditPatient
        open={isShowEditPatient}
        parentDataProps={selectedData}
        onClose={() => setIsShowEditPatient(false)}
        onModalComplete={handleEditPatientComplete}
      />
    </>
  );
};
