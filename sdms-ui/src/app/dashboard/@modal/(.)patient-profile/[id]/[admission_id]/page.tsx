"use client"

import React, { Suspense, use } from "react";
import ModalPortal from "@/components/utility-components/portal-modal";
import { useRouter } from "next/navigation";
import GetPatientInfoWithId from "@/app/dashboard/patient-profile/getPatientInfoWithId";


function LoadingFallback() {
  return (
    <div className="flex items-center justify-center p-10">
      <div className="text-muted-foreground animate-pulse text-sm">
        Loading photo...
      </div>
    </div>
  );
}

interface PortalModalProps {
  params: Promise<{ id: number;admission_id: number }>; 
}

export default function PortalModalProps({ params }: PortalModalProps) {
  const { id, admission_id } = use(params);
  const router = useRouter();
  const handleClose = () => router.back();


  return (
    <ModalPortal title={`Photo ${id}`} isOpen={true} onClose={handleClose}>
      <Suspense fallback={<LoadingFallback />}>
        <div className="text-center">
          <h2 className="text-xl font-bold mb-2"> ID: {id}</h2>
          {id && (
                    <GetPatientInfoWithId patient_id={id} admission_id={admission_id} />
                  )}
        </div>
      </Suspense>
    </ModalPortal>
  );
}
