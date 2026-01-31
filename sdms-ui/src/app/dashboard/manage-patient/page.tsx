"use client";

import { BarChart3, FileText, Settings, User } from "lucide-react";
import ConfigurableTabbedPage from "@/components/reusable-ui-components/tabs/conigurabletabs";
import { AdmittedPatientList } from "@/app/dashboard/manage-patient/form-components/admitted-patient/admitted-patient-list";
import { FollowupPatientList } from "@/app/dashboard/manage-patient/form-components/followup-patient/followup-patient-list";
// import { ReadmitPatientList } from "@/app/dashboard/manage-patient/form-components/readmit-patient/re-admit-patient";
import { DischargedPatientList } from "@/app/dashboard/manage-patient/form-components/recent-discharged-patient/discharge-patient-list";
import { AddSurgicalPatient } from "@/app/dashboard/manage-patient/form-components/add-surgical-patient/add-surgical-patient";
// import { SearchedPatientList } from "./form-components/search-and-action/search-patient-list";
import { AuthGuard } from "@/components/utility-components/auth-guard";

// import ProfileComponent from "@/app/components/ProfileComponent";
// import SettingsComponent from "@/app/components/SettingsComponent";
// import DocumentsComponent from "@/app/components/DocumentsComponent";
export default function PatientsPage() {
  return (
    <AuthGuard>
      <ManagePatientTabbedPage />
    </AuthGuard>
  );
}
const ManagePatientTabbedPage = () => {
  const tabs = [
    {
      value: "admittedpatient",
      label: "Admitted Patient",
      icon: <BarChart3 className="h-4 w-4" />,
      component: <AdmittedPatientList />,
    },
    {
      value: "dashboard1",
      label: "Followup Patients",
      icon: <BarChart3 className="h-4 w-4" />,
      component: <FollowupPatientList />,
    },
    {
      value: "addsurgicalpatient",
      label: "Add Surgical Patient",
      icon: <BarChart3 className="h-4 w-4" />,
      component: <AddSurgicalPatient />,
    },
    {
      value: "DischargedPatientList",
      label: "Recent Discharged ",
      icon: <User className="h-4 w-4" />,
      component: <DischargedPatientList />,
    },
    // {
    //   value: "search",
    //   label: "Search and Action",
    //   icon: <FileText className="h-4 w-4" />,
    //   component: <SearchedPatientList />,
    // },
    // {
    //   value: "settings",
    //   label: "Settings",
    //   icon: <Settings className="h-4 w-4" />,
    //   component: <SettingsComponent />,
    // },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <ConfigurableTabbedPage tabs={tabs} defaultTab="admittedpatient" />
    </div>
  );
};
