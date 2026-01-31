"use client";

import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { UserSquare2, BarChart3, UserRoundPlus } from "lucide-react";
 import { DischargedPatientList } from "@/app/dashboard/manage-patient/form-components/recent-discharged-patient/discharge-patient-list";
 import { FollowupPatientList } from "@/app/dashboard/manage-patient/form-components/followup-patient/followup-patient-list";
import { AuthGuard } from "@/components/utility-components/auth-guard";
import { RecentSurgeryPatientList } from "../a-reusable-form-page-components/recentSurgeryPatientList";


export default function DashboardPage() {
  return (
    <AuthGuard>
      <DashboardPageContainer />
    </AuthGuard>
  );
}

const DashboardPageContainer = () => {
  const router = useRouter();

  const menus = [
    {
      label: "Manage Patients",
      icon: UserSquare2,
      url: "/dashboard/manage-patient",
    },
    // {
    //   label: "Quick Manage ",
    //   icon: UserRoundPlus,
    //   url: "dashboard/quickmanage",
    // },
    // {
    //   label: "Reports",
    //   icon: BarChart3,
    //   url: "dashboard/reports",
    // },
  ];

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 p-6">
        {menus.map((menu, idx) => (
          <Card
            key={idx}
            onClick={() => router.push(menu.url)}
            className="cursor-pointer hover:shadow-xl transition-all duration-300 rounded-2xl border border-gray-200"
          >
            <CardContent className="flex flex-col items-center justify-center p-8 space-y-4">
              <menu.icon className="w-12 h-12 text-blue-600" />
              <span className="text-lg font-semibold text-gray-800">
                {menu.label}
              </span>
            </CardContent>

            {/* recent discharge patient list  */}
          </Card>
        ))}
      </div>
      <div>
         <RecentSurgeryPatientList /> 
        <FollowupPatientList /> 
        <DischargedPatientList />
      </div>
    </>
  );
}
