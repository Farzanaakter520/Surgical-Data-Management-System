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
import { PatientFollowup } from "@/app/dashboard/manage-patient/form-components/followup-patient/patient-followup";
import DateRangePicker from "@/components/form-fields/StandaloneFromFields/DateRangePicker";
import { start } from "repl";

export const ColumnsConfig: TableColumn[] = [
  {
    id: "",
    accessorKey: "status",
    header: " ",
    cell: ({ row, onCellAction }) => (
      <Button
        variant="outline"
        className="bg-green-100 hover:bg-green-200 text-green-700 border-green-300 px-3 py-1 text-xs font-semibold"
        onClick={(e) => {
          e.stopPropagation(); // Prevent row click
          // ✅ Use the onCellAction handler
          onCellAction("patient_followup_click", row);
        }}
      >
        Followup
      </Button>
    ),
    width: 90,
  },
  {
    id: "actions",
    header: " ",
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
    width: 90,
  },
  
  {
    id: "patient_name",
    accessorKey: "patient_name",
    header: "Name",
    searchable: true,
    sortable: false,
    width: 180,
  },
  {
    id: "patient_id",
    accessorKey: "patient_id",
    header: "Pat. Id",
    searchable: true,
    sortable: false,
    width: 50,
  },

  // {
  //   id: "followup_schedule_id",
  //   accessorKey: "followup_schedule_id",
  //   header: "Sch. Id",
  //   searchable: true,
  //   sortable: false,
  //   width: 80,
  // },
  {
    id: "followup_date",
    accessorKey: "followup_date",
    header: "Sch. Dt",
    searchable: true,
    sortable: true,
    width: 80,
  },
  {
    id: "followup_start_time",
    accessorKey: "followup_start_time",
    header: "Start",
    searchable: true,
    sortable: false,
    width: 80,
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
    sortable: false,
    width: 200,
  },
  // {
  //   id: "followup_end_time",
  //   accessorKey: "followup_end_time",
  //   header: "end",
  //   searchable: true,
  //   sortable: false,
  //   width: 80,
  // },
  // {
  //   id: "admission_id",
  //   accessorKey: "admission_id",
  //   header: "Adm Id",
  //   searchable: true,
  //   sortable: false,
  //   width: 50,
  // },
  // {
  //   id: "admission_date",
  //   accessorKey: "admission_date",
  //   header: "Adm. dt",
  //   searchable: true,
  //   sortable: true,
  //   width: 100,
  // },

  

  {
    id: "mobile_number",
    accessorKey: "mobile_number",
    header: "Phone",
    searchable: true,
    width: 150,
  },
  {
    id: "age",
    accessorKey: "age",
    header: "Age",
    meta: { isNumeric: true },
    width: 30,
  },
  // {
  //   id: "Address",
  //   accessorKey: "address",
  //   header: "Address",
  //   searchable: true,
  //   width: 250,
  // },
 

  //   'followup_serial',
];

export const FollowupPatientList = () => {
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
        const result = await fetchTableData("sdms", "/patientData/getList", {
          //  action_mode: "date_to_date_pending_followup",
          action_mode: "date_to_date_pending_followup",
          start_date: startDate,
          end_date: endDate,
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
      case "patient_followup_click":
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
        router.push(`/dashboard/patient-profile/${rowData.patient_id}/${rowData.admission_id}`);
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

useEffect(()=>{
    loadPatients();
},[startDate,endDate])

  const handleDateChange = (from: string, to: string) => {
    setStartDate(from)
    setEndDate(to)
    console.log("Selected range:", { from, to })
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Followup Patient List
          </CardTitle>
          {/* <CardDescription>Admitted Patients</CardDescription> */}
        </CardHeader>
        <CardContent>
          <DateRangePicker
        fromDate={startDate}
        toDate={endDate}
        onChange={handleDateChange}
        showButton={true}
      />
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

      <PatientFollowup
        open={isShowModal}
        parentDataProps={selectedData}
        onClose={() => setIsShowModal(false)}
        onModalComplete={handleModalComplete}
      />
    </>
  );
};
