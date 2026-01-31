
export interface Patient {
  id: number;
  admission_id: number;
  hospital_id: number;
  patient_name: string;
  name: string;
  age: number;
  gender: string;
  mobile_number: string;
  address_line_one: string;
  dt: string;
  is_active: number;
  marital_status: string;
  occupation: string;
  patient_generated_uid: string;
  religion: string;
  remarks: string;
  insert_by: string;
  insert_date: string;
  update_by: string | null;
  update_date: string | null;
}
export interface AdmissionData {
  id: number;
  adm_status: string;
  date_of_adm: string;
  hospital_id?: number;
  hospital_name: string;
  insert_by: string;
  insert_date: string;
  is_active: number;
  referral_source_name: string;
  remarks: string;
  update_by: string | null;
  update_date: string | null;
  outcome: string;
  created_at: string;
  updated_at: string | null;
  patient_id: number;
  admission_id: number;
  advice_on_discharge: string;
  discharge_date_time: string;
}


export type SurgicalData = {
  id: number;
  patient_id?: number;
  admission_id?: number;
  operation_name?: string;
  operation_date?: string;
  procedure_notes?: string;
  challenges_during_surgery?: string;
  complications?: string;
  post_operative_recovery?: string;
  nature_of_anesthesia?: string;
  post_operative_recovery_notes?: string;
  remarks?: string;
  [key: string]: any;
}

export type PreOpsData = {
  id: number;
  patient_id?: number;
  admission_id?: number;
  co_morbidities_id?: string[];
  diagnosis_id?: string[];
  drug_history?: string[];
  dt?: string;
  insert_date?: string;
  surgical_history?: string;
  remarks?: string | null;
   investigations?: Record<string, string>;
  [key: string]: any;
}


export interface ReleaseData {
  id: number;
  outcome: string;
  created_at: string;
  updated_at: string | null;
  patient_id: number;
  hospital_id: number;
  admission_id: number;
  advice_on_discharge: string;
  discharge_date_time: string;
}

export interface PatientFilesListProps {
  patient_id: number;
  admission_id?: number;
}

// export interface ProfileData {
//   patient_basic?: Partial<Patient> | null;
//   admission_data?: Partial<AdmissionData> | null;
//   pre_ops_data?: PreOpsData[] | null;
//   post_ops_data?: SurgicalData[] | null;
//   release_data?: ReleaseData | null;
//   [key: string]: any;
// }
