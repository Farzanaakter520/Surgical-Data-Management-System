// "use client";

// import { useState, useEffect } from "react";
// import { DynamicFormDialogue } from "@/components/dynamic-form-builder/dynamic-form-dialogue";
// import { formConfig, tableConfig } from "./configx";
// import PortalModal from "@/components/utility-components/portal-modal";
// import { AuthGuard } from "@/components/utility-components/auth-guard";
// import { useLanguage } from "@/contexts/LanguageProvider";
// import { useDynamicForm } from "@/components/dynamic-form-builder/useDynamicForm";
// import { useApiFetch } from "@/hooks/useApiFetch";
// import { useToast } from "@/hooks/use-toast";
// import AdvancedTable from "@/components/dynamic-table-builder/advanced-table-component/advanced-table";
// import { TableAction } from "@/components/dynamic-table-builder/advanced-table-component/table-types";
// import { useTableActions } from "@/components/dynamic-table-builder/advanced-table-component/useTableActions";
// import { PageHeader } from "@/components/shared-components/page-header-with-backbutton";

// export default function PatientsPage() {
//   return (
//     <AuthGuard>
//       <HospitalScreen />
//     </AuthGuard>
//   );
// }

// const HospitalScreen = () => {
//   const { t } = useLanguage();
//   const { request } = useApiFetch();
//   const { showToast } = useToast();

//   const [listData, setListData] = useState<any[]>([]);
//   const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
//   const [sharedInfo, setSharedInfo] = useState<Partial<any>>({});
//   const [actionMode, setActionMode] = useState<
//     "Add" | "Edit" | "View" | "Delete"
//   >("Add");

//   const {
//     form,
//     formRef,
//     isFormLoading,
//     handleSubmit,
//     handleReset,
//     handleCancel,
//     populateFormData,
//   } = useDynamicForm({
//     formConfig,
//     onBeforeSubmit: async (data: any) => {
//       /* data mapping here */
//       //console.log("Onsubmit");
//       //console.log(data);
//          if (actionMode === "Edit") {
//            return { ...data, "action_mode": "update"};
//          }
//          if (actionMode === "Add") {
//           return { ...data, "action_mode": "insert"};
//         }
//         return data;
//     },
//   });

//     useEffect(() => {
//     document.body.style.overflow = "hidden";
//     return () => {
//       document.body.style.overflow = "unset";
//     };
//   }, []);

//   const { data, loading, fetchData, deleteRow, setTableData, refreshData } =
//     useTableActions<any>({
//       tableConfig,
//       initialPayload: { page: 1, pageSize: 10 }, // or any default
//       onFetchSuccess: (data) => console.log("Loaded hospitals", data),
//       onDeleteSuccess: (id) => console.log("Deleted ID", id),
//     });

//   const handleDelete = async (row: any) => {
//     setActionMode("Delete");
//     console.log("TODO: Call delete API for", row);
//     let id = row.id;
//     // const success = await executeDelete(id);
//     //   if (success) {
//     // maybe refresh table, show modal, etc.
//     // }
//   };

//   const onSubmit = async (data: any) => {
//     const success = await handleSubmit(data, {
//       successMessage: `Hospital ${actionMode} successfully!`,
//       resetAfterSubmit: true,
//       resetFocusField: "name",
//     });

//     // refresh table data

//     if (success) {
//        if (actionMode=="Edit"){
//           setIsModalOpen(false);
//        }
      
//       refreshData();
//     }

//     //setShowSuccess(success);
//   };
//   const handleRowAction = async (action: TableAction, row: any) => {
//     console.log("Action:", action, "Row:", row);

//     switch (action) {
//       case "View":
//         alert(`Viewing hospital: ${row.name}`);
//         break;
//       case "Edit":
//         // alert(`Editing hospital: ${row.name}`);
//         setIsModalOpen(true);
//         setActionMode("Edit");
//         populateFormData(row);
//         break;
//       case "Delete":
//         const success = await deleteRow(row.id);
//         if (success) {
//           refreshData(); // optional: re-fetch if optimistic update is not enough
//         }

//         break;
//     }
//   };

//   const bulkActions = {
//     onBulkDelete: (rows: any[]) => alert(`Deleting ${rows.length} records`),
//     onBulkEmail: (rows: any[]) =>
//       alert(`Sending email to ${rows.length} doctors`),
//     onBulkArchive: (rows: any[]) => alert(`Archiving ${rows.length} records`),
//     onBulkExport: (rows: any[]) => alert(`Exporting ${rows.length} records`),
//   };

//   return (
//     <>
//       {/* Reusable header */}
//       {/* <PageHeader title="Hospital master data" /> */}

//       {/* Table container with scroll */}
//       <div className="container py-0  ">
//         <AdvancedTable
//           data={data}
//           config={tableConfig}
//           onRowAction={handleRowAction}
//           bulkActions={bulkActions}
//           onAddNew={() => {setIsModalOpen(true),setActionMode("Add")}}
//         />
//       </div>

//       <PortalModal
//         title={`${actionMode} ${formConfig.form_title.en}`}
//         isOpen={isModalOpen}
//         onClose={() => setIsModalOpen(false)}
//         maxWidth="max-w-3xl"
//       >
//         <DynamicFormDialogue
//           schema={formConfig}
//           form={form}
//           onSubmit={onSubmit}
//           onReset={() => handleReset("name")}
//           onCancel={() => setIsModalOpen(false)}
//           formRef={formRef}
//         />
//       </PortalModal>
//     </>
//   );
// };
