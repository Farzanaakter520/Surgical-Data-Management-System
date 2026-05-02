'use client';

import React, { use } from 'react';
import { useRouter } from 'next/navigation';
import ModalPortal from '@/components/utility-components/portal-modal';
import GetPatientInfoWithId from '../../getPatientInfoWithId';

interface PatientProfileModalProps {
  params: Promise<{
    id: string;
    admission_id: string;
  }>;
}

export default function PatientProfileModal({ params }: PatientProfileModalProps) {
  const router = useRouter();
  const { id, admission_id } = use(params);
  const patientId = Number(id);
  const admissionId = Number(admission_id);

  const handleClose = () => router.back();

  if (!Number.isFinite(patientId) || !Number.isFinite(admissionId)) return null;

  return (
    <ModalPortal title={`Patient ${patientId}`} isOpen={true} onClose={handleClose}>
      <GetPatientInfoWithId patient_id={patientId} admission_id={admissionId} />
    </ModalPortal>
  );
}
