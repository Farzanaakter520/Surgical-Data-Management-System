-- Helpful indexes

CREATE INDEX IF NOT EXISTS idx_refresh_tokens_user_id
  ON iam.t_refresh_tokens(user_id);

CREATE INDEX IF NOT EXISTS idx_patients_mobile_number
  ON sdms_db.patients(mobile_number);

CREATE INDEX IF NOT EXISTS idx_patient_admissions_patient_id
  ON sdms_db.patient_admissions(patient_id);

CREATE INDEX IF NOT EXISTS idx_patient_investigations_admission_id
  ON sdms_db.patient_investigations(admission_id);

CREATE INDEX IF NOT EXISTS idx_post_op_documents_admission_id
  ON sdms_db.post_op_documents(admission_id);

CREATE INDEX IF NOT EXISTS idx_patient_discharges_admission_id
  ON sdms_db.patient_discharges(admission_id);

CREATE INDEX IF NOT EXISTS idx_patient_followups_admission_id
  ON sdms_db.patient_followups(admission_id);

CREATE INDEX IF NOT EXISTS idx_followup_schedules_patient_id
  ON sdms_db.followup_schedules(patient_id);

CREATE INDEX IF NOT EXISTS idx_followup_schedules_scheduled_date
  ON sdms_db.followup_schedules(scheduled_date);

CREATE INDEX IF NOT EXISTS idx_sessions_session_id
  ON sdms_db.sessions(session_id);

CREATE INDEX IF NOT EXISTS idx_sessions_expires_at
  ON sdms_db.sessions(expires_at);

CREATE INDEX IF NOT EXISTS idx_timeline_patient_id_event_time
  ON sdms_db.patient_timeline_events(patient_id, event_time DESC);
