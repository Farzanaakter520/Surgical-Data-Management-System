// components/patient/PatientBasicCard.tsx
"use client";

import { useParams, useRouter } from "next/navigation";

type PatientInfoRowProps = {
  label: string;
  value: string | number | undefined;
  className?: string;
};

 function PatientInfoRow({ label, value , className }: PatientInfoRowProps) {
  if (!value) return null; 

  return (
    <div className={`flex items-center ${className || ""}`}>
      <span className="font-thin">{label}:</span>
      <span className="font-semibold ml-2">{value}</span>
    </div>
  );
}

 function PatientDetails({ patient }: { patient: any }) {
  // console.log(patient)
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <PatientInfoRow label="Patient ID" value={patient.patient_id} />
      <PatientInfoRow label="Admission ID" value={patient.admission_id} />
      <PatientInfoRow label="Age" value={patient.age} />
      <PatientInfoRow label="Gender" value={patient.gender} />
      <PatientInfoRow label="Mobile" value={patient.mobile_number} />
      <PatientInfoRow label="Address" value={patient.address_line_one} />      
      <PatientInfoRow label="Hospital Name" className="flex items-center col-span-2" value={patient.hospital_name} />
      <PatientInfoRow label="Admission Date" value={patient.admission_date} />   
    </div>
  );
}



export  function PatientBasicCard({ patient }: any) {
  const router = useRouter();
  const params = useParams();


  return (
    <div className="bg-slate-200  w-full mx-auto shadow-lg rounded-2xl pt-1 p-2 sm:p-4 mb-2">

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-2 gap-4">
        <h3 className="text-1xl sm:text-1xl font-bold text-gray-800">{patient.patient_name}</h3>

      </div>


      <div >
        <PatientDetails patient={patient} />        
      </div>
    </div>
  );
}