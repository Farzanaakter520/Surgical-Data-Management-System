"use client";

import { AuthGuard } from "@/components/utility-components/auth-guard";
import { HospitalList } from "./list/hospital.list";

export default function PatientsPage() {
  return (
    <AuthGuard>
      <HospitalScreen />
    </AuthGuard>
  );
}

const HospitalScreen = () => {
  return (
    <>
      <HospitalList />
    </>
  );
};
