-- Session and tracking tables used by sessionStorage APIs and workflow procedures

CREATE TABLE IF NOT EXISTS sdms_db.sessions (
  id BIGSERIAL PRIMARY KEY,
  session_id UUID NOT NULL UNIQUE,
  token TEXT,
  data JSONB,
  expires_at TIMESTAMPTZ NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  device_id VARCHAR(128),
  loc_id VARCHAR(64),
  insert_by VARCHAR(100),
  insert_date TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS sdms_db.patient_timeline_events (
  id BIGSERIAL PRIMARY KEY,
  patient_id BIGINT NOT NULL REFERENCES sdms_db.patients(id) ON DELETE CASCADE,
  admission_id BIGINT REFERENCES sdms_db.patient_admissions(id) ON DELETE CASCADE,
  event_type VARCHAR(80) NOT NULL,
  event_payload JSONB,
  event_time TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
