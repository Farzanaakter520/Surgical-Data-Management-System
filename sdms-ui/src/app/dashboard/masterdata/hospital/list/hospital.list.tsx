"use client";

import React, { useState, useTransition, useEffect } from "react";
import { useRouter } from "next/navigation";
import SmartTable from "@/components/reusable-ui-components/smart-table/smart-table";
import { fetchTableData } from "@/lib/actions/tableServerAction";
import { Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Building2 } from "lucide-react";
import { HospitalColumnsConfig } from "./columns-config";
import { Button } from "@/components/ui/button";
import { AddHospital } from "../add/add.form";

export const HospitalList = () => {
  const [isPending, startTransition] = useTransition();
  const [hospitals, setHospitals] = useState<any[]>([]);
  const [isShowModal,setIsShowModal]=useState<boolean>(false);
  const [selectedData,setSelectedData]=useState<any[]>([]);
  const [actionMode,setActionMode]=useState<string>("add");
  const router = useRouter();

  const loadHospitals = () => {
    startTransition(async () => {
      try {
        const result = await fetchTableData("sdms", "/hospitals/getlist", {
          action_mode: "getList"
        });
        console.log(result);
        setHospitals(result || []);
      } catch (error) {
        console.error("Error fetching hospital data:", error);
      }
    });
  };

  useEffect(() => {
    loadHospitals();
  }, []);

  // ✅ Handle table cell actions
  const handleCellAction = ({ action, row, rowData }: any) => {
    switch (action) {
      case "edit":
        setIsShowModal(true);
        setSelectedData(rowData);
        setActionMode("edit");
        //populateFormData(rowData);
        //router.push(`/hospital/edit/${rowData.id}`);
        break;

      case "delete":
        // You can open a confirmation modal or call delete API
        console.log("Deleting hospital:", rowData.name);
        break;

      case "view":
        router.push(`/hospital/${rowData.id}`);
        break;

      default:
        console.warn("Unknown action:", action);
    }
  };

  const handleAddNew = () => {
    //router.push("/hospital/add");
   // console.log("Add New");
    setIsShowModal(true);
    setSelectedData([]);
    setActionMode("add");
  };
 const handleModalComplete=()=>{
      setIsShowModal(false);
      loadHospitals();
 }
 
 return (
    <>
      <Card>
        <CardHeader className="flex justify-between items-center">
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Hospital / Clinic List
          </CardTitle>

          {/* <Button
            variant="default"
            className="bg-green-500 hover:bg-green-600 text-white"
            onClick={() => router.push("/hospital/add")}
          >
            + Add New
          </Button> */}
        </CardHeader>

        <CardContent>
          <SmartTable
            onAddNew={handleAddNew}
            data={hospitals}
            isLoading={isPending}
            variant="shrink"
            config={{
              allowAddNew: true,
              columns: HospitalColumnsConfig,
              searchable: true,
              columnfilterable: true,
              exportable: true,
              pagination: {
                pageSize: 10,
                showSizeSelector: true,
              },
            }}
            onCellAction={handleCellAction}
          />
        </CardContent>
      </Card>
       <AddHospital
              open={isShowModal}
              parentDataProps={selectedData}
              onClose={() => setIsShowModal(false)}
              onModalComplete={handleModalComplete}
              actionMode={actionMode}
            />
    </>
  );
};
