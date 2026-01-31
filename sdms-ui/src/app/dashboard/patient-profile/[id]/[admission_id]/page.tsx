'use client';

import React, { Suspense, use } from 'react';
import ModalPortal from '@/components/utility-components/portal-modal';
import { useRouter } from 'next/navigation';
import GetPatientInfoWithId from '../../getPatientInfoWithId';

function LoadingFallback() {
  return (
    <div className="flex items-center justify-center p-10">
      <div className="text-muted-foreground animate-pulse text-sm">
        Loading patient details...
      </div>
    </div>
  );
}

interface PatientProfileModalProps {
  params: Promise<{ id: number; admission_id: number }>; 
}

export default function PatientProfileModal({ params }: PatientProfileModalProps) {
  const { id, admission_id } = use(params); 
  const router = useRouter();

  const handleClose = () => router.back();

  if (!id || !admission_id) return null;

  return (
    <ModalPortal title={`Patient ${id}`} isOpen={true} onClose={handleClose}>
      <Suspense fallback={<LoadingFallback />}>
        {id && (
          <GetPatientInfoWithId patient_id={id} admission_id={admission_id} />
        )}
      </Suspense>
    </ModalPortal>
  );
}
