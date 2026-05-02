"use client"

import React, { use } from 'react';
import ModalPortal from "@/components/utility-components/portal-modal";
import { useRouter } from "next/navigation";
import GetPatientInfoWithId from "@/app/dashboard/patient-profile/getPatientInfoWithId";

interface PortalModalProps {
  params: Promise<{
    id: string;
    admission_id: string;
  }>;
}

export default function PortalModalProps({ params }: PortalModalProps) {
  const { id, admission_id } = use(params);
  const patientId = Number(id);
  const admissionId = Number(admission_id);
  const router = useRouter();
  const handleClose = () => router.back();

  if (!Number.isFinite(patientId) || !Number.isFinite(admissionId)) return null;


  return (
    <ModalPortal title={`Photo ${patientId}`} isOpen={true} onClose={handleClose}>
      <div className="text-center">
        <h2 className="text-xl font-bold mb-2"> ID: {patientId}</h2>
        <GetPatientInfoWithId patient_id={patientId} admission_id={admissionId} />
      </div>
    </ModalPortal>
  );
}
