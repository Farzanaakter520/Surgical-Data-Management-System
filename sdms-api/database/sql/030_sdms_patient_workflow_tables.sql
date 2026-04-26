-- SDMS patient/workflow tables

CREATE TABLE IF NOT EXISTS sdms_db.patients (
  id BIGSERIAL PRIMARY KEY,
  patient_generated_uid VARCHAR(64) NOT NULL UNIQUE,
  name VARCHAR(200) NOT NULL,
  age INT NOT NULL CHECK (age >= 0 AND age <= 130),
  gender VARCHAR(20) NOT NULL,
  religion VARCHAR(60) NOT NULL,
  occupation_id BIGINT REFERENCES sdms_db.occupations(id),
  marital_status VARCHAR(40),
  mobile_number VARCHAR(32) NOT NULL,
  address_line_one TEXT NOT NULL,
  referral_source_id BIGINT REFERENCES sdms_db.referrals(id),
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  device_id VARCHAR(128),
  loc_id VARCHAR(64),
  insert_by VARCHAR(100),
  insert_date TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS sdms_db.patient_admissions (
  id BIGSERIAL PRIMARY KEY,
  patient_id BIGINT NOT NULL REFERENCES sdms_db.patients(id) ON DELETE CASCADE,
  hospital_id BIGINT NOT NULL REFERENCES sdms_db.hospitals(id),
  date_of_adm TIMESTAMPTZ NOT NULL,
  referral_source_id BIGINT REFERENCES sdms_db.referrals(id),
  remarks TEXT,
  admission_status VARCHAR(30) DEFAULT 'admitted',
  device_id VARCHAR(128),
  loc_id VARCHAR(64),
  insert_by VARCHAR(100),
  insert_date TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS sdms_db.patient_clinical_diagnoses (
  id BIGSERIAL PRIMARY KEY,
  patient_id BIGINT NOT NULL REFERENCES sdms_db.patients(id) ON DELETE CASCADE,
  admission_id BIGINT NOT NULL REFERENCES sdms_db.patient_admissions(id) ON DELETE CASCADE,
  clinical_diag_id BIGINT NOT NULL REFERENCES sdms_db.clinical_diagnoses(id),
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (admission_id, clinical_diag_id)
);

CREATE TABLE IF NOT EXISTS sdms_db.patient_co_morbidities (
  id BIGSERIAL PRIMARY KEY,
  patient_id BIGINT NOT NULL REFERENCES sdms_db.patients(id) ON DELETE CASCADE,
  admission_id BIGINT NOT NULL REFERENCES sdms_db.patient_admissions(id) ON DELETE CASCADE,
  co_morbidity_id BIGINT NOT NULL REFERENCES sdms_db.co_morbidities(id),
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (admission_id, co_morbidity_id)
);

CREATE TABLE IF NOT EXISTS sdms_db.patient_investigations (
  id BIGSERIAL PRIMARY KEY,
  patient_id BIGINT NOT NULL REFERENCES sdms_db.patients(id) ON DELETE CASCADE,
  admission_id BIGINT NOT NULL REFERENCES sdms_db.patient_admissions(id) ON DELETE CASCADE,
  hospital_id BIGINT REFERENCES sdms_db.hospitals(id),
  investigation_id BIGINT NOT NULL REFERENCES sdms_db.investigations(id),
  investigation_report_result TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS sdms_db.patient_preop_surgical_history (
  id BIGSERIAL PRIMARY KEY,
  patient_id BIGINT NOT NULL REFERENCES sdms_db.patients(id) ON DELETE CASCADE,
  admission_id BIGINT NOT NULL REFERENCES sdms_db.patient_admissions(id) ON DELETE CASCADE,
  operation_id BIGINT REFERENCES sdms_db.operations(id),
  has_previous_history BOOLEAN NOT NULL DEFAULT FALSE,
  history_notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS sdms_db.patient_drug_history (
  id BIGSERIAL PRIMARY KEY,
  patient_id BIGINT NOT NULL REFERENCES sdms_db.patients(id) ON DELETE CASCADE,
  admission_id BIGINT NOT NULL REFERENCES sdms_db.patient_admissions(id) ON DELETE CASCADE,
  drug_id BIGINT NOT NULL REFERENCES sdms_db.drugs(id),
  drug_type_id BIGINT REFERENCES sdms_db.drug_types(id),
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (admission_id, drug_id)
);

CREATE TABLE IF NOT EXISTS sdms_db.pre_surgical_data (
  id BIGSERIAL PRIMARY KEY,
  patient_id BIGINT NOT NULL REFERENCES sdms_db.patients(id) ON DELETE CASCADE,
  hospital_id BIGINT NOT NULL REFERENCES sdms_db.hospitals(id),
  complications TEXT NOT NULL,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS sdms_db.surgical_data (
  id BIGSERIAL PRIMARY KEY,
  patient_id BIGINT NOT NULL REFERENCES sdms_db.patients(id) ON DELETE CASCADE,
  hospital_id BIGINT NOT NULL REFERENCES sdms_db.hospitals(id),
  operation_id BIGINT NOT NULL REFERENCES sdms_db.operations(id),
  operation_date_time TIMESTAMPTZ,
  nature_of_anaesthesia VARCHAR(120),
  procedure_notes TEXT,
  challenges_during_surgery TEXT,
  post_operative_recovery_status VARCHAR(120),
  complications VARCHAR(120),
  post_op_recovery_notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS sdms_db.post_op_documents (
  id BIGSERIAL PRIMARY KEY,
  patient_id BIGINT REFERENCES sdms_db.patients(id) ON DELETE CASCADE,
  hospital_id BIGINT NOT NULL REFERENCES sdms_db.hospitals(id),
  admission_id BIGINT NOT NULL REFERENCES sdms_db.patient_admissions(id) ON DELETE CASCADE,
  file_name TEXT,
  file_type VARCHAR(100),
  document_type VARCHAR(120),
  drive_file_id VARCHAR(255),
  remarks TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS sdms_db.patient_discharges (
  id BIGSERIAL PRIMARY KEY,
  patient_id BIGINT NOT NULL REFERENCES sdms_db.patients(id) ON DELETE CASCADE,
  admission_id BIGINT NOT NULL REFERENCES sdms_db.patient_admissions(id) ON DELETE CASCADE,
  hospital_id BIGINT NOT NULL REFERENCES sdms_db.hospitals(id),
  discharge_date_time TIMESTAMPTZ,
  advice_on_discharge TEXT,
  follow_up_required BOOLEAN NOT NULL DEFAULT FALSE,
  outcome VARCHAR(60) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS sdms_db.discharge_followup_procedures (
  id BIGSERIAL PRIMARY KEY,
  discharge_id BIGINT NOT NULL REFERENCES sdms_db.patient_discharges(id) ON DELETE CASCADE,
  operation_id BIGINT NOT NULL REFERENCES sdms_db.operations(id),
  UNIQUE (discharge_id, operation_id)
);

CREATE TABLE IF NOT EXISTS sdms_db.patient_followups (
  id BIGSERIAL PRIMARY KEY,
  patient_id BIGINT NOT NULL REFERENCES sdms_db.patients(id) ON DELETE CASCADE,
  admission_id BIGINT NOT NULL REFERENCES sdms_db.patient_admissions(id) ON DELETE CASCADE,
  hospital_id BIGINT NOT NULL REFERENCES sdms_db.hospitals(id),
  status VARCHAR(60) NOT NULL,
  notes TEXT,
  follow_up_schedule_required BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS sdms_db.patient_followup_procedures (
  id BIGSERIAL PRIMARY KEY,
  followup_id BIGINT NOT NULL REFERENCES sdms_db.patient_followups(id) ON DELETE CASCADE,
  operation_id BIGINT NOT NULL REFERENCES sdms_db.operations(id),
  UNIQUE (followup_id, operation_id)
);

CREATE TABLE IF NOT EXISTS sdms_db.followup_schedules (
  id BIGSERIAL PRIMARY KEY,
  patient_id BIGINT REFERENCES sdms_db.patients(id) ON DELETE CASCADE,
  admission_id BIGINT REFERENCES sdms_db.patient_admissions(id) ON DELETE CASCADE,
  hospital_id BIGINT REFERENCES sdms_db.hospitals(id),
  followup_id BIGINT REFERENCES sdms_db.patient_followups(id) ON DELETE CASCADE,
  discharge_id BIGINT REFERENCES sdms_db.patient_discharges(id) ON DELETE CASCADE,
  doctor_id BIGINT NOT NULL REFERENCES sdms_db.doctors(id),
  scheduled_date DATE NOT NULL,
  start_time TIME,
  end_time TIME,
  follow_up_type_id BIGINT REFERENCES sdms_db.follow_up_types(id),
  notes TEXT,
  visit_status VARCHAR(60),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CHECK (end_time IS NULL OR start_time IS NULL OR end_time > start_time)
);
