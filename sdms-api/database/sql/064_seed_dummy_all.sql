-- Comprehensive dummy data seed for SDMS test environments.
-- Run on a clean database or as an idempotent refresh for the seeded rows below.

BEGIN;

TRUNCATE TABLE
  iam.t_refresh_tokens,
  iam.t_users,
  sdms_db.followup_schedules,
  sdms_db.patient_followup_procedures,
  sdms_db.patient_followups,
  sdms_db.discharge_followup_procedures,
  sdms_db.patient_discharges,
  sdms_db.post_op_documents,
  sdms_db.surgical_data,
  sdms_db.pre_surgical_data,
  sdms_db.patient_drug_history,
  sdms_db.patient_preop_surgical_history,
  sdms_db.patient_investigations,
  sdms_db.patient_co_morbidities,
  sdms_db.patient_clinical_diagnoses,
  sdms_db.patient_admissions,
  sdms_db.patient_timeline_events,
  sdms_db.sessions,
  sdms_db.patients,
  sdms_db.doctors,
  sdms_db.hospitals,
  sdms_db.follow_up_types,
  sdms_db.drugs,
  sdms_db.drug_types,
  sdms_db.operations,
  sdms_db.investigations,
  sdms_db.co_morbidities,
  sdms_db.clinical_diagnoses,
  sdms_db.specialties,
  sdms_db.designations,
  sdms_db.occupations,
  sdms_db.referrals,
  sdms_db.option_items,
  sdms_db.option_groups
RESTART IDENTITY CASCADE;

INSERT INTO sdms_db.option_groups (id, group_key, group_name, created_at)
VALUES
  (1, 'patient_status', 'Patient Status', NOW()),
  (2, 'visit_status', 'Visit Status', NOW())
ON CONFLICT (id) DO UPDATE SET
  group_key = EXCLUDED.group_key,
  group_name = EXCLUDED.group_name;

INSERT INTO sdms_db.option_items (id, option_group_id, item_key, item_value, item_label, sort_order, is_active, created_at)
VALUES
  (1, 1, 'admitted', 'admitted', 'Admitted', 1, TRUE, NOW()),
  (2, 1, 'discharged', 'discharged', 'Discharged', 2, TRUE, NOW()),
  (3, 1, 'followup', 'followup', 'Follow Up', 3, TRUE, NOW()),
  (4, 1, 'closed', 'closed', 'Closed', 4, TRUE, NOW()),
  (5, 2, 'scheduled', 'scheduled', 'Scheduled', 1, TRUE, NOW()),
  (6, 2, 'completed', 'completed', 'Completed', 2, TRUE, NOW())
ON CONFLICT (id) DO UPDATE SET
  option_group_id = EXCLUDED.option_group_id,
  item_key = EXCLUDED.item_key,
  item_value = EXCLUDED.item_value,
  item_label = EXCLUDED.item_label,
  sort_order = EXCLUDED.sort_order,
  is_active = EXCLUDED.is_active;

INSERT INTO iam.t_users (id, user_id, first_name, last_name, email, password_hash, cell_phone_number, country, is_active, created_at, updated_at)
VALUES
  (1, 'USR-0001', 'Admin', 'User', 'admin@sdms.test', '$2a$10$YGXTVpl8i.wI8DUtCOGAPuidyoS6cCfnkEnVzo4SC5gMtGJBCaWkC', '01790000001', 'Bangladesh', TRUE, NOW(), NOW()),
  (2, 'USR-0002', 'Rashid', 'Khan', 'rashid.khan@sdms.test', '$2a$10$YGXTVpl8i.wI8DUtCOGAPuidyoS6cCfnkEnVzo4SC5gMtGJBCaWkC', '01790000002', 'Bangladesh', TRUE, NOW(), NOW()),
  (3, 'USR-0003', 'Nabila', 'Sultana', 'nabila.sultana@sdms.test', '$2a$10$YGXTVpl8i.wI8DUtCOGAPuidyoS6cCfnkEnVzo4SC5gMtGJBCaWkC', '01790000003', 'Bangladesh', TRUE, NOW(), NOW())
ON CONFLICT (id) DO UPDATE SET
  user_id = EXCLUDED.user_id,
  first_name = EXCLUDED.first_name,
  last_name = EXCLUDED.last_name,
  email = EXCLUDED.email,
  password_hash = EXCLUDED.password_hash,
  cell_phone_number = EXCLUDED.cell_phone_number,
  country = EXCLUDED.country,
  is_active = EXCLUDED.is_active,
  updated_at = NOW();

INSERT INTO iam.t_refresh_tokens (id, user_id, token, expires_at, created_at)
VALUES
  (1, 1, 'refresh-token-admin-001', NOW() + INTERVAL '30 days', NOW()),
  (2, 2, 'refresh-token-rashid-002', NOW() + INTERVAL '30 days', NOW())
ON CONFLICT (id) DO UPDATE SET
  user_id = EXCLUDED.user_id,
  token = EXCLUDED.token,
  expires_at = EXCLUDED.expires_at;

INSERT INTO sdms_db.referrals (id, name, created_at, updated_at)
VALUES
  (1, 'Self', NOW(), NOW()),
  (2, 'OPD', NOW(), NOW()),
  (3, 'Emergency', NOW(), NOW()),
  (4, 'Camp', NOW(), NOW())
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  updated_at = NOW();

INSERT INTO sdms_db.occupations (id, name, created_at, updated_at)
VALUES
  (1, 'Teacher', NOW(), NOW()),
  (2, 'Farmer', NOW(), NOW()),
  (3, 'Housewife', NOW(), NOW()),
  (4, 'Business', NOW(), NOW()),
  (5, 'Service', NOW(), NOW()),
  (6, 'Student', NOW(), NOW())
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  updated_at = NOW();

INSERT INTO sdms_db.designations (id, name, created_at, updated_at)
VALUES
  (1, 'General Surgeon', NOW(), NOW()),
  (2, 'Physician', NOW(), NOW()),
  (3, 'Anesthesiologist', NOW(), NOW())
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  updated_at = NOW();

INSERT INTO sdms_db.specialties (id, name, created_at, updated_at)
VALUES
  (1, 'General Surgery', NOW(), NOW()),
  (2, 'Orthopedics', NOW(), NOW()),
  (3, 'Gynecology', NOW(), NOW())
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  updated_at = NOW();

INSERT INTO sdms_db.hospitals (
  id,
  name,
  email,
  address_line_1,
  address_line_2,
  contact_number,
  alternative_contact_number,
  website,
  is_active,
  created_at,
  updated_at
)
VALUES
  (1, 'City Care Hospital', 'info@citycarehospital.test', '12 Lake Road', 'Ward 5', '01700000001', '01800000001', 'https://citycarehospital.test', TRUE, NOW(), NOW()),
  (2, 'Green Valley Clinic', 'contact@greenvalleyclinic.test', '48 Green Road', 'Block B', '01700000002', '01800000002', 'https://greenvalleyclinic.test', TRUE, NOW(), NOW()),
  (3, 'Sunrise Medical Center', 'hello@sunrisemedical.test', '99 Sunrise Avenue', 'Suite 10', '01700000003', '01800000003', 'https://sunrisemedical.test', TRUE, NOW(), NOW()),
  (4, 'Metro General Hospital', 'admin@metrogeneral.test', '221 Metro Street', 'Floor 3', '01700000004', '01800000004', 'https://metrogeneral.test', TRUE, NOW(), NOW()),
  (5, 'Northside Clinic', 'team@northsideclinic.test', '7 Northside Lane', 'Near Station', '01700000005', '01800000005', 'https://northsideclinic.test', TRUE, NOW(), NOW()),
  (6, 'Riverside Hospital', 'support@riversidehospital.test', '300 Riverside Drive', 'Block A', '01700000006', '01800000006', 'https://riversidehospital.test', TRUE, NOW(), NOW()),
  (7, 'Lifeline Diagnostics Hospital', 'info@lifelinehospital.test', '18 Health Park', 'Building C', '01700000007', '01800000007', 'https://lifelinehospital.test', TRUE, NOW(), NOW()),
  (8, 'Harmony Womens Hospital', 'contact@harmonywomens.test', '61 Harmony Boulevard', 'Level 2', '01700000008', '01800000008', 'https://harmonywomens.test', TRUE, NOW(), NOW())
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  email = EXCLUDED.email,
  address_line_1 = EXCLUDED.address_line_1,
  address_line_2 = EXCLUDED.address_line_2,
  contact_number = EXCLUDED.contact_number,
  alternative_contact_number = EXCLUDED.alternative_contact_number,
  website = EXCLUDED.website,
  is_active = EXCLUDED.is_active,
  updated_at = NOW();

INSERT INTO sdms_db.doctors (
  id,
  name,
  email,
  address_line_1,
  contact_number,
  designation_id,
  specialty_id,
  hospital_id,
  is_active,
  created_at,
  updated_at
)
VALUES
  (1, 'Dr. Ahsan Rahman', 'ahsan.rahman@sdms.test', '12 Doctor Lane', '01730000001', 1, 1, 1, TRUE, NOW(), NOW()),
  (2, 'Dr. Farhana Sultana', 'farhana.sultana@sdms.test', '48 Doctor Lane', '01730000002', 2, 3, 2, TRUE, NOW(), NOW()),
  (3, 'Dr. Imran Hossain', 'imran.hossain@sdms.test', '99 Doctor Lane', '01730000003', 3, 2, 3, TRUE, NOW(), NOW())
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  email = EXCLUDED.email,
  address_line_1 = EXCLUDED.address_line_1,
  contact_number = EXCLUDED.contact_number,
  designation_id = EXCLUDED.designation_id,
  specialty_id = EXCLUDED.specialty_id,
  hospital_id = EXCLUDED.hospital_id,
  is_active = EXCLUDED.is_active,
  updated_at = NOW();

INSERT INTO sdms_db.clinical_diagnoses (id, name, created_at, updated_at)
VALUES
  (1, 'Appendicitis', NOW(), NOW()),
  (2, 'Gallstones', NOW(), NOW()),
  (3, 'Hernia', NOW(), NOW()),
  (4, 'Fibroid Uterus', NOW(), NOW())
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  updated_at = NOW();

INSERT INTO sdms_db.co_morbidities (id, name, created_at, updated_at)
VALUES
  (1, 'Diabetes Mellitus', NOW(), NOW()),
  (2, 'Hypertension', NOW(), NOW()),
  (3, 'Asthma', NOW(), NOW()),
  (4, 'Hypothyroidism', NOW(), NOW())
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  updated_at = NOW();

INSERT INTO sdms_db.investigations (id, investigation_name, created_at, updated_at)
VALUES
  (1, 'CBC', NOW(), NOW()),
  (2, 'Ultrasound Abdomen', NOW(), NOW()),
  (3, 'X-Ray Chest', NOW(), NOW()),
  (4, 'ECG', NOW(), NOW()),
  (5, 'Blood Sugar', NOW(), NOW())
ON CONFLICT (id) DO UPDATE SET
  investigation_name = EXCLUDED.investigation_name,
  updated_at = NOW();

INSERT INTO sdms_db.operations (id, operation_name, created_at, updated_at)
VALUES
  (1, 'Appendectomy', NOW(), NOW()),
  (2, 'Cholecystectomy', NOW(), NOW()),
  (3, 'Hernia Repair', NOW(), NOW()),
  (4, 'Fibroid Removal', NOW(), NOW()),
  (5, 'Laparoscopy', NOW(), NOW()),
  (6, 'Wound Dressing', NOW(), NOW())
ON CONFLICT (id) DO UPDATE SET
  operation_name = EXCLUDED.operation_name,
  updated_at = NOW();

INSERT INTO sdms_db.drug_types (id, name, created_at, updated_at)
VALUES
  (1, 'Tablet', NOW(), NOW()),
  (2, 'Capsule', NOW(), NOW()),
  (3, 'Injection', NOW(), NOW())
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  updated_at = NOW();

INSERT INTO sdms_db.drugs (id, name, drug_type_id, created_at, updated_at)
VALUES
  (1, 'Paracetamol', 1, NOW(), NOW()),
  (2, 'Amoxicillin', 2, NOW(), NOW()),
  (3, 'Ceftriaxone', 3, NOW(), NOW()),
  (4, 'Omeprazole', 1, NOW(), NOW()),
  (5, 'Diclofenac', 1, NOW(), NOW()),
  (6, 'Metformin', 1, NOW(), NOW())
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  drug_type_id = EXCLUDED.drug_type_id,
  updated_at = NOW();

INSERT INTO sdms_db.follow_up_types (id, name, created_at, updated_at)
VALUES
  (1, 'OPD Follow Up', NOW(), NOW()),
  (2, 'Tele Follow Up', NOW(), NOW()),
  (3, 'Home Visit', NOW(), NOW())
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  updated_at = NOW();

INSERT INTO sdms_db.patients (
  id,
  patient_generated_uid,
  name,
  age,
  gender,
  religion,
  occupation_id,
  marital_status,
  mobile_number,
  address_line_one,
  referral_source_id,
  is_active,
  device_id,
  loc_id,
  insert_by,
  insert_date,
  created_at,
  updated_at
)
VALUES
  (1, 'PAT-0001', 'Rahim Uddin', 45, 'Male', 'Islam', 1, 'Married', '01710000001', 'House 12, Road 1, Dhaka', 2, TRUE, 'seed-device', 'seed-loc', 'seed', NOW(), NOW(), NOW()),
  (2, 'PAT-0002', 'Nusrat Jahan', 34, 'Female', 'Islam', 3, 'Married', '01710000002', 'House 8, Road 2, Dhaka', 1, TRUE, 'seed-device', 'seed-loc', 'seed', NOW(), NOW(), NOW()),
  (3, 'PAT-0003', 'Arif Hossain', 52, 'Male', 'Islam', 4, 'Married', '01710000003', 'House 19, Road 3, Chattogram', 3, TRUE, 'seed-device', 'seed-loc', 'seed', NOW(), NOW(), NOW()),
  (4, 'PAT-0004', 'Sumi Akter', 29, 'Female', 'Islam', 2, 'Single', '01710000004', 'House 44, Road 4, Sylhet', 2, TRUE, 'seed-device', 'seed-loc', 'seed', NOW(), NOW(), NOW()),
  (5, 'PAT-0005', 'Kabir Ahmed', 61, 'Male', 'Islam', 5, 'Married', '01710000005', 'House 7, Road 5, Khulna', 4, TRUE, 'seed-device', 'seed-loc', 'seed', NOW(), NOW(), NOW()),
  (6, 'PAT-0006', 'Mst Rokeya', 41, 'Female', 'Islam', 3, 'Married', '01710000006', 'House 22, Road 6, Rajshahi', 1, TRUE, 'seed-device', 'seed-loc', 'seed', NOW(), NOW(), NOW())
ON CONFLICT (id) DO UPDATE SET
  patient_generated_uid = EXCLUDED.patient_generated_uid,
  name = EXCLUDED.name,
  age = EXCLUDED.age,
  gender = EXCLUDED.gender,
  religion = EXCLUDED.religion,
  occupation_id = EXCLUDED.occupation_id,
  marital_status = EXCLUDED.marital_status,
  mobile_number = EXCLUDED.mobile_number,
  address_line_one = EXCLUDED.address_line_one,
  referral_source_id = EXCLUDED.referral_source_id,
  is_active = EXCLUDED.is_active,
  device_id = EXCLUDED.device_id,
  loc_id = EXCLUDED.loc_id,
  insert_by = EXCLUDED.insert_by,
  insert_date = EXCLUDED.insert_date,
  updated_at = NOW();

INSERT INTO sdms_db.patient_admissions (
  id,
  patient_id,
  hospital_id,
  date_of_adm,
  referral_source_id,
  remarks,
  admission_status,
  device_id,
  loc_id,
  insert_by,
  insert_date,
  created_at,
  updated_at
)
VALUES
  (1, 1, 1, '2026-04-01 09:30:00+00', 2, 'Severe abdominal pain', 'discharged', 'seed-device', 'seed-loc', 'seed', NOW(), NOW(), NOW()),
  (2, 2, 2, '2026-04-03 10:00:00+00', 1, 'Right upper quadrant pain', 'discharged', 'seed-device', 'seed-loc', 'seed', NOW(), NOW(), NOW()),
  (3, 3, 3, '2026-04-05 11:15:00+00', 3, 'Groin swelling', 'discharged', 'seed-device', 'seed-loc', 'seed', NOW(), NOW(), NOW()),
  (4, 4, 4, '2026-04-08 08:45:00+00', 2, 'Pelvic pain and bleeding', 'discharged', 'seed-device', 'seed-loc', 'seed', NOW(), NOW(), NOW()),
  (5, 5, 5, '2026-04-10 12:00:00+00', 4, 'Observation and medication', 'admitted', 'seed-device', 'seed-loc', 'seed', NOW(), NOW(), NOW()),
  (6, 6, 6, '2026-04-11 14:00:00+00', 1, 'Pre-op assessment', 'admitted', 'seed-device', 'seed-loc', 'seed', NOW(), NOW(), NOW())
ON CONFLICT (id) DO UPDATE SET
  patient_id = EXCLUDED.patient_id,
  hospital_id = EXCLUDED.hospital_id,
  date_of_adm = EXCLUDED.date_of_adm,
  referral_source_id = EXCLUDED.referral_source_id,
  remarks = EXCLUDED.remarks,
  admission_status = EXCLUDED.admission_status,
  updated_at = NOW();

INSERT INTO sdms_db.patient_clinical_diagnoses (id, patient_id, admission_id, clinical_diag_id, notes, created_at)
VALUES
  (1, 1, 1, 1, 'Acute appendicitis confirmed clinically.', NOW()),
  (2, 2, 2, 2, 'Symptomatic gallstones.', NOW()),
  (3, 3, 3, 3, 'Reducible inguinal hernia.', NOW()),
  (4, 4, 4, 4, 'Fibroid uterus with bleeding.', NOW()),
  (5, 5, 5, 1, 'Abdominal pain under observation.', NOW()),
  (6, 6, 6, 3, 'Possible hernia, awaiting surgery.', NOW())
ON CONFLICT (id) DO UPDATE SET
  patient_id = EXCLUDED.patient_id,
  admission_id = EXCLUDED.admission_id,
  clinical_diag_id = EXCLUDED.clinical_diag_id,
  notes = EXCLUDED.notes;

INSERT INTO sdms_db.patient_co_morbidities (id, patient_id, admission_id, co_morbidity_id, notes, created_at)
VALUES
  (1, 1, 1, 1, 'Mild diabetes controlled.', NOW()),
  (2, 2, 2, 2, 'Hypertension on medication.', NOW()),
  (3, 3, 3, 3, 'Asthma history.', NOW()),
  (4, 4, 4, 4, 'Hypothyroidism stable.', NOW())
ON CONFLICT (id) DO UPDATE SET
  patient_id = EXCLUDED.patient_id,
  admission_id = EXCLUDED.admission_id,
  co_morbidity_id = EXCLUDED.co_morbidity_id,
  notes = EXCLUDED.notes;

INSERT INTO sdms_db.patient_investigations (id, patient_id, admission_id, hospital_id, investigation_id, investigation_report_result, created_at)
VALUES
  (1, 1, 1, 1, 1, 'CBC shows mild leukocytosis.', NOW()),
  (2, 1, 1, 1, 2, 'USG suggests inflamed appendix.', NOW()),
  (3, 2, 2, 2, 2, 'Gallbladder stones visualized.', NOW()),
  (4, 3, 3, 3, 3, 'Chest x-ray normal.', NOW()),
  (5, 4, 4, 4, 4, 'ECG normal sinus rhythm.', NOW()),
  (6, 5, 5, 5, 5, 'Blood sugar slightly elevated.', NOW())
ON CONFLICT (id) DO UPDATE SET
  patient_id = EXCLUDED.patient_id,
  admission_id = EXCLUDED.admission_id,
  hospital_id = EXCLUDED.hospital_id,
  investigation_id = EXCLUDED.investigation_id,
  investigation_report_result = EXCLUDED.investigation_report_result;

INSERT INTO sdms_db.patient_preop_surgical_history (id, patient_id, admission_id, operation_id, has_previous_history, history_notes, created_at, updated_at)
VALUES
  (1, 1, 1, 1, FALSE, 'No previous abdominal surgery.', NOW(), NOW()),
  (2, 2, 2, 2, FALSE, 'No previous surgery.', NOW(), NOW()),
  (3, 3, 3, 3, TRUE, 'Past minor groin repair.', NOW(), NOW()),
  (4, 4, 4, 4, FALSE, 'No previous pelvic surgery.', NOW(), NOW())
ON CONFLICT (id) DO UPDATE SET
  patient_id = EXCLUDED.patient_id,
  admission_id = EXCLUDED.admission_id,
  operation_id = EXCLUDED.operation_id,
  has_previous_history = EXCLUDED.has_previous_history,
  history_notes = EXCLUDED.history_notes,
  updated_at = NOW();

INSERT INTO sdms_db.patient_drug_history (id, patient_id, admission_id, drug_id, drug_type_id, notes, created_at)
VALUES
  (1, 1, 1, 1, 1, 'Paracetamol for pain.', NOW()),
  (2, 1, 1, 4, 1, 'Omeprazole for gastric protection.', NOW()),
  (3, 2, 2, 2, 2, 'Amoxicillin course before surgery.', NOW()),
  (4, 3, 3, 3, 3, 'Ceftriaxone prophylaxis.', NOW()),
  (5, 4, 4, 5, 1, 'Diclofenac for pain control.', NOW()),
  (6, 5, 5, 6, 1, 'Metformin continued.', NOW())
ON CONFLICT (id) DO UPDATE SET
  patient_id = EXCLUDED.patient_id,
  admission_id = EXCLUDED.admission_id,
  drug_id = EXCLUDED.drug_id,
  drug_type_id = EXCLUDED.drug_type_id,
  notes = EXCLUDED.notes;

INSERT INTO sdms_db.pre_surgical_data (id, patient_id, hospital_id, complications, notes, created_at, updated_at)
VALUES
  (1, 1, 1, 'Nil major complication before surgery.', 'Stable for surgery.', NOW(), NOW()),
  (2, 2, 2, 'Mild dehydration.', 'IV fluids started.', NOW(), NOW()),
  (3, 3, 3, 'Cough on admission.', 'Anesthesia cleared.', NOW(), NOW()),
  (4, 4, 4, 'Anaemia detected.', 'Blood arranged if required.', NOW(), NOW()),
  (5, 5, 5, 'Elevated sugar levels.', 'Endocrine review requested.', NOW(), NOW()),
  (6, 6, 6, 'Awaiting final clearance.', 'Routine prep done.', NOW(), NOW())
ON CONFLICT (id) DO UPDATE SET
  patient_id = EXCLUDED.patient_id,
  hospital_id = EXCLUDED.hospital_id,
  complications = EXCLUDED.complications,
  notes = EXCLUDED.notes,
  updated_at = NOW();

INSERT INTO sdms_db.surgical_data (
  id,
  patient_id,
  hospital_id,
  operation_id,
  operation_date_time,
  nature_of_anaesthesia,
  procedure_notes,
  challenges_during_surgery,
  post_operative_recovery_status,
  complications,
  post_op_recovery_notes,
  created_at,
  updated_at
)
VALUES
  (1, 1, 1, 1, '2026-04-02 11:00:00+00', 'General', 'Appendix removed successfully.', 'None', 'Stable', 'None', 'Observation in recovery ward.', NOW(), NOW()),
  (2, 2, 2, 2, '2026-04-04 13:30:00+00', 'General', 'Gallbladder removed laparoscopically.', 'Minor bleeding controlled.', 'Stable', 'None', 'Mobilizing well.', NOW(), NOW()),
  (3, 3, 3, 3, '2026-04-06 10:45:00+00', 'Spinal', 'Hernia repair completed.', 'Adhesions noted.', 'Improving', 'None', 'Pain controlled.', NOW(), NOW()),
  (4, 4, 4, 4, '2026-04-09 09:20:00+00', 'General', 'Fibroid removal completed.', 'None', 'Stable', 'None', 'Recovery normal.', NOW(), NOW()),
  (5, 5, 5, 5, '2026-04-12 15:10:00+00', 'General', 'Diagnostic laparoscopy.', 'None', 'Good', 'None', 'Short stay observation.', NOW(), NOW())
ON CONFLICT (id) DO UPDATE SET
  patient_id = EXCLUDED.patient_id,
  hospital_id = EXCLUDED.hospital_id,
  operation_id = EXCLUDED.operation_id,
  operation_date_time = EXCLUDED.operation_date_time,
  nature_of_anaesthesia = EXCLUDED.nature_of_anaesthesia,
  procedure_notes = EXCLUDED.procedure_notes,
  challenges_during_surgery = EXCLUDED.challenges_during_surgery,
  post_operative_recovery_status = EXCLUDED.post_operative_recovery_status,
  complications = EXCLUDED.complications,
  post_op_recovery_notes = EXCLUDED.post_op_recovery_notes,
  updated_at = NOW();

INSERT INTO sdms_db.post_op_documents (id, patient_id, hospital_id, admission_id, file_name, file_type, document_type, drive_file_id, remarks, created_at, updated_at)
VALUES
  (1, 1, 1, 1, 'appendectomy-discharge.pdf', 'application/pdf', 'Discharge Summary', 'drive-file-001', 'Seed document', NOW(), NOW()),
  (2, 2, 2, 2, 'cholecystectomy-lab.pdf', 'application/pdf', 'Lab Report', 'drive-file-002', 'Seed document', NOW(), NOW()),
  (3, 3, 3, 3, 'hernia-followup.pdf', 'application/pdf', 'Follow Up Note', 'drive-file-003', 'Seed document', NOW(), NOW()),
  (4, 4, 4, 4, 'fibroid-op-note.pdf', 'application/pdf', 'Operation Note', 'drive-file-004', 'Seed document', NOW(), NOW())
ON CONFLICT (id) DO UPDATE SET
  patient_id = EXCLUDED.patient_id,
  hospital_id = EXCLUDED.hospital_id,
  admission_id = EXCLUDED.admission_id,
  file_name = EXCLUDED.file_name,
  file_type = EXCLUDED.file_type,
  document_type = EXCLUDED.document_type,
  drive_file_id = EXCLUDED.drive_file_id,
  remarks = EXCLUDED.remarks,
  updated_at = NOW();

INSERT INTO sdms_db.patient_discharges (
  id,
  patient_id,
  admission_id,
  hospital_id,
  discharge_date_time,
  advice_on_discharge,
  follow_up_required,
  outcome,
  created_at,
  updated_at
)
VALUES
  (1, 1, 1, 1, '2026-04-06 14:00:00+00', 'Take rest and return in two weeks.', TRUE, 'Recovered', NOW(), NOW()),
  (2, 2, 2, 2, '2026-04-07 16:10:00+00', 'Low fat diet and follow up.', TRUE, 'Improving', NOW(), NOW()),
  (3, 3, 3, 3, '2026-04-09 12:30:00+00', 'Avoid heavy lifting.', FALSE, 'Stable', NOW(), NOW()),
  (4, 4, 4, 4, '2026-04-12 18:00:00+00', 'Review in outpatient clinic.', FALSE, 'Recovered', NOW(), NOW())
ON CONFLICT (id) DO UPDATE SET
  patient_id = EXCLUDED.patient_id,
  admission_id = EXCLUDED.admission_id,
  hospital_id = EXCLUDED.hospital_id,
  discharge_date_time = EXCLUDED.discharge_date_time,
  advice_on_discharge = EXCLUDED.advice_on_discharge,
  follow_up_required = EXCLUDED.follow_up_required,
  outcome = EXCLUDED.outcome,
  updated_at = NOW();

INSERT INTO sdms_db.discharge_followup_procedures (id, discharge_id, operation_id)
VALUES
  (1, 1, 5),
  (2, 2, 6)
ON CONFLICT (id) DO UPDATE SET
  discharge_id = EXCLUDED.discharge_id,
  operation_id = EXCLUDED.operation_id;

INSERT INTO sdms_db.patient_followups (
  id,
  patient_id,
  admission_id,
  hospital_id,
  status,
  notes,
  follow_up_schedule_required,
  created_at,
  updated_at
)
VALUES
  (1, 1, 1, 1, 'scheduled', 'Post op review pending.', TRUE, NOW(), NOW()),
  (2, 2, 2, 2, 'scheduled', 'Diet and wound review pending.', TRUE, NOW(), NOW())
ON CONFLICT (id) DO UPDATE SET
  patient_id = EXCLUDED.patient_id,
  admission_id = EXCLUDED.admission_id,
  hospital_id = EXCLUDED.hospital_id,
  status = EXCLUDED.status,
  notes = EXCLUDED.notes,
  follow_up_schedule_required = EXCLUDED.follow_up_schedule_required,
  updated_at = NOW();

INSERT INTO sdms_db.patient_followup_procedures (id, followup_id, operation_id)
VALUES
  (1, 1, 5),
  (2, 2, 6)
ON CONFLICT (id) DO UPDATE SET
  followup_id = EXCLUDED.followup_id,
  operation_id = EXCLUDED.operation_id;

INSERT INTO sdms_db.followup_schedules (
  id,
  patient_id,
  admission_id,
  hospital_id,
  followup_id,
  discharge_id,
  doctor_id,
  scheduled_date,
  start_time,
  end_time,
  follow_up_type_id,
  notes,
  visit_status,
  created_at,
  updated_at
)
VALUES
  (1, 1, 1, 1, 1, 1, 1, '2026-04-20', '10:00:00', '10:30:00', 1, 'First post-discharge review.', 'scheduled', NOW(), NOW()),
  (2, 2, 2, 2, 2, 2, 2, '2026-04-22', '11:00:00', '11:30:00', 2, 'Diet and wound check.', 'scheduled', NOW(), NOW())
ON CONFLICT (id) DO UPDATE SET
  patient_id = EXCLUDED.patient_id,
  admission_id = EXCLUDED.admission_id,
  hospital_id = EXCLUDED.hospital_id,
  followup_id = EXCLUDED.followup_id,
  discharge_id = EXCLUDED.discharge_id,
  doctor_id = EXCLUDED.doctor_id,
  scheduled_date = EXCLUDED.scheduled_date,
  start_time = EXCLUDED.start_time,
  end_time = EXCLUDED.end_time,
  follow_up_type_id = EXCLUDED.follow_up_type_id,
  notes = EXCLUDED.notes,
  visit_status = EXCLUDED.visit_status,
  updated_at = NOW();

INSERT INTO sdms_db.patient_timeline_events (id, patient_id, admission_id, event_type, event_payload, event_time, created_at)
VALUES
  (1, 1, 1, 'admission_created', '{"status":"admitted"}'::jsonb, '2026-04-01 09:30:00+00', NOW()),
  (2, 1, 1, 'surgery_completed', '{"operation":"Appendectomy"}'::jsonb, '2026-04-02 11:00:00+00', NOW()),
  (3, 1, 1, 'discharged', '{"outcome":"Recovered"}'::jsonb, '2026-04-06 14:00:00+00', NOW()),
  (4, 2, 2, 'admission_created', '{"status":"admitted"}'::jsonb, '2026-04-03 10:00:00+00', NOW()),
  (5, 2, 2, 'followup_scheduled', '{"scheduled_date":"2026-04-22"}'::jsonb, '2026-04-07 16:10:00+00', NOW()),
  (6, 3, 3, 'surgery_completed', '{"operation":"Hernia Repair"}'::jsonb, '2026-04-06 10:45:00+00', NOW())
ON CONFLICT (id) DO UPDATE SET
  patient_id = EXCLUDED.patient_id,
  admission_id = EXCLUDED.admission_id,
  event_type = EXCLUDED.event_type,
  event_payload = EXCLUDED.event_payload,
  event_time = EXCLUDED.event_time;

INSERT INTO sdms_db.sessions (
  id,
  session_id,
  token,
  data,
  expires_at,
  is_active,
  device_id,
  loc_id,
  insert_by,
  insert_date,
  created_at,
  updated_at
)
VALUES
  (1, '11111111-1111-1111-1111-111111111111', 'seed-session-token-001', '{"user_id":1,"role":"admin"}'::jsonb, NOW() + INTERVAL '2 days', TRUE, 'seed-device', 'seed-loc', 'seed', NOW(), NOW(), NOW()),
  (2, '22222222-2222-2222-2222-222222222222', 'seed-session-token-002', '{"user_id":2,"role":"doctor"}'::jsonb, NOW() + INTERVAL '2 days', TRUE, 'seed-device', 'seed-loc', 'seed', NOW(), NOW(), NOW())
ON CONFLICT (id) DO UPDATE SET
  session_id = EXCLUDED.session_id,
  token = EXCLUDED.token,
  data = EXCLUDED.data,
  expires_at = EXCLUDED.expires_at,
  is_active = EXCLUDED.is_active,
  device_id = EXCLUDED.device_id,
  loc_id = EXCLUDED.loc_id,
  insert_by = EXCLUDED.insert_by,
  insert_date = EXCLUDED.insert_date,
  updated_at = NOW();

DO $$
DECLARE
  tbl text;
BEGIN
  FOREACH tbl IN ARRAY ARRAY[
    'iam.t_users',
    'iam.t_refresh_tokens',
    'sdms_db.option_groups',
    'sdms_db.option_items',
    'sdms_db.referrals',
    'sdms_db.occupations',
    'sdms_db.designations',
    'sdms_db.specialties',
    'sdms_db.hospitals',
    'sdms_db.doctors',
    'sdms_db.clinical_diagnoses',
    'sdms_db.co_morbidities',
    'sdms_db.investigations',
    'sdms_db.operations',
    'sdms_db.drug_types',
    'sdms_db.drugs',
    'sdms_db.follow_up_types',
    'sdms_db.sessions',
    'sdms_db.patient_timeline_events',
    'sdms_db.patients',
    'sdms_db.patient_admissions',
    'sdms_db.patient_clinical_diagnoses',
    'sdms_db.patient_co_morbidities',
    'sdms_db.patient_investigations',
    'sdms_db.patient_preop_surgical_history',
    'sdms_db.patient_drug_history',
    'sdms_db.pre_surgical_data',
    'sdms_db.surgical_data',
    'sdms_db.post_op_documents',
    'sdms_db.patient_discharges',
    'sdms_db.discharge_followup_procedures',
    'sdms_db.patient_followups',
    'sdms_db.patient_followup_procedures',
    'sdms_db.followup_schedules'
  ] LOOP
    EXECUTE format(
      'SELECT setval(pg_get_serial_sequence(%L, %L), COALESCE((SELECT MAX(id) FROM %s), 1), true)',
      tbl,
      'id',
      tbl
    );
  END LOOP;
END $$;

COMMIT;
