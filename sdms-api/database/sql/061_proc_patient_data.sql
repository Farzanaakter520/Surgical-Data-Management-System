-- Missing stored procedure used by patientDataController and patientReportController

CREATE OR REPLACE PROCEDURE sdms_db.proc_patient_data(
  IN p_payload JSONB,
  IN p_meta JSONB,
  OUT result JSONB
)
LANGUAGE plpgsql
AS $$
DECLARE
  v_action TEXT := LOWER(COALESCE(p_payload->>'action_mode', ''));
  v_patient_id BIGINT := NULLIF(COALESCE(p_payload->>'patient_id', ''), '')::BIGINT;
  v_limit INT := COALESCE(NULLIF(p_payload->>'limit', '')::INT, 100);
BEGIN
  IF v_action IN ('getlist', 'patient_admitted_not_released', 'admitted_patient_list') THEN
    WITH latest_admission AS (
      SELECT DISTINCT ON (pa.patient_id)
        pa.id,
        pa.patient_id,
        pa.hospital_id,
        pa.date_of_adm,
        pa.admission_status
      FROM sdms_db.patient_admissions pa
      ORDER BY pa.patient_id, pa.date_of_adm DESC NULLS LAST, pa.id DESC
    ),
    latest_surgery AS (
      SELECT DISTINCT ON (sd.patient_id)
        sd.patient_id,
        sd.operation_id,
        sd.operation_date_time,
        sd.hospital_id
      FROM sdms_db.surgical_data sd
      ORDER BY sd.patient_id, sd.operation_date_time DESC NULLS LAST, sd.id DESC
    ),
    latest_discharge AS (
      SELECT DISTINCT ON (pd.admission_id)
        pd.admission_id
      FROM sdms_db.patient_discharges pd
      ORDER BY pd.admission_id, pd.discharge_date_time DESC NULLS LAST, pd.id DESC
    )
    SELECT COALESCE(
      jsonb_agg(
        jsonb_build_object(
          'patient_id', p.id,
          'patient_name', p.name,
          'mobile_number', p.mobile_number,
          'age', p.age,
          'surgery_name', o.operation_name,
          'surgery_date', ls.operation_date_time,
          'hospital_name', h.name,
          'admission_id', la.id
        )
        ORDER BY la.date_of_adm DESC NULLS LAST, la.id DESC
      ),
      '[]'::jsonb
    )
    INTO result
    FROM latest_admission la
    INNER JOIN sdms_db.patients p
      ON p.id = la.patient_id
    LEFT JOIN latest_surgery ls
      ON ls.patient_id = p.id
    LEFT JOIN sdms_db.operations o
      ON o.id = ls.operation_id
    LEFT JOIN sdms_db.hospitals h
      ON h.id = COALESCE(la.hospital_id, ls.hospital_id)
    LEFT JOIN latest_discharge ld
      ON ld.admission_id = la.id
    WHERE ld.admission_id IS NULL
      AND (v_patient_id IS NULL OR p.id = v_patient_id)
      AND (p_payload->>'search') IS NULL
    LIMIT v_limit;

  ELSIF v_action = 'date_to_date_pending_followup' THEN
    WITH latest_admission AS (
      SELECT DISTINCT ON (pa.patient_id)
        pa.id,
        pa.patient_id,
        pa.hospital_id,
        pa.date_of_adm
      FROM sdms_db.patient_admissions pa
      ORDER BY pa.patient_id, pa.date_of_adm DESC NULLS LAST, pa.id DESC
    ),
    latest_surgery AS (
      SELECT DISTINCT ON (sd.patient_id)
        sd.patient_id,
        sd.operation_id,
        sd.operation_date_time,
        sd.hospital_id
      FROM sdms_db.surgical_data sd
      ORDER BY sd.patient_id, sd.operation_date_time DESC NULLS LAST, sd.id DESC
    )
    SELECT COALESCE(
      jsonb_agg(
        jsonb_build_object(
          'patient_id', p.id,
          'patient_name', p.name,
          'mobile_number', p.mobile_number,
          'age', p.age,
          'followup_date', fs.scheduled_date,
          'followup_start_time', fs.start_time,
          'surgery_name', o.operation_name,
          'surgery_date', ls.operation_date_time,
          'hospital_name', h.name,
          'admission_id', la.id
        )
        ORDER BY fs.scheduled_date DESC, fs.start_time DESC NULLS LAST, fs.id DESC
      ),
      '[]'::jsonb
    )
    INTO result
    FROM sdms_db.followup_schedules fs
    INNER JOIN sdms_db.patients p
      ON p.id = fs.patient_id
    LEFT JOIN latest_admission la
      ON la.id = fs.admission_id
    LEFT JOIN latest_surgery ls
      ON ls.patient_id = p.id
    LEFT JOIN sdms_db.operations o
      ON o.id = ls.operation_id
    LEFT JOIN sdms_db.hospitals h
      ON h.id = COALESCE(fs.hospital_id, la.hospital_id, ls.hospital_id)
    WHERE fs.scheduled_date BETWEEN COALESCE(NULLIF(p_payload->>'start_date', '')::DATE, fs.scheduled_date)
      AND COALESCE(NULLIF(p_payload->>'end_date', '')::DATE, fs.scheduled_date)
      AND COALESCE(LOWER(fs.visit_status), 'pending') IN ('pending', 'scheduled', 'open');

  ELSIF v_action IN ('getbyid', 'patient_report') THEN
    WITH base_patient AS (
      SELECT
        p.id,
        p.name,
        p.age,
        p.gender,
        p.marital_status,
        p.mobile_number,
        p.address_line_one,
        occ.name AS occupation_name
      FROM sdms_db.patients p
      LEFT JOIN sdms_db.occupations occ
        ON occ.id = p.occupation_id
      WHERE p.id = v_patient_id
      LIMIT 1
    ),
    base_admission AS (
      SELECT
        pa.id,
        pa.patient_id,
        pa.hospital_id,
        pa.date_of_adm,
        pa.admission_status,
        h.name AS hospital_name
      FROM sdms_db.patient_admissions pa
      LEFT JOIN sdms_db.hospitals h
        ON h.id = pa.hospital_id
      WHERE pa.patient_id = v_patient_id
      ORDER BY pa.date_of_adm DESC NULLS LAST, pa.id DESC
      LIMIT 1
    ),
    base_discharge AS (
      SELECT
        pd.admission_id,
        pd.discharge_date_time,
        pd.advice_on_discharge,
        pd.outcome
      FROM sdms_db.patient_discharges pd
      INNER JOIN base_admission ba
        ON ba.id = pd.admission_id
      ORDER BY pd.discharge_date_time DESC NULLS LAST, pd.id DESC
      LIMIT 1
    ),
    base_surgery AS (
      SELECT
        sd.patient_id,
        sd.operation_id,
        sd.operation_date_time,
        sd.post_operative_recovery_status,
        sd.post_op_recovery_notes,
        o.operation_name
      FROM sdms_db.surgical_data sd
      LEFT JOIN sdms_db.operations o
        ON o.id = sd.operation_id
      WHERE sd.patient_id = v_patient_id
      ORDER BY sd.operation_date_time DESC NULLS LAST, sd.id DESC
    ),
    patient_report AS (
      SELECT jsonb_build_object(
        'Patient ID', bp.id,
        'Admission_id', ba.id,
        'Name', bp.name,
        'Age', bp.age,
        'Gender', bp.gender,
        'Marital Status', bp.marital_status,
        'Occupation', bp.occupation_name,
        'Mobile No', bp.mobile_number,
        'Address Line', bp.address_line_one,
        'Date Of Admission', ba.date_of_adm,
        'Date of operation', (SELECT bs.operation_date_time FROM base_surgery bs ORDER BY bs.operation_date_time DESC NULLS LAST LIMIT 1),
        'Date of Discharge', bd.discharge_date_time,
        'Pre-op Diagnosis', COALESCE((
          SELECT string_agg(DISTINCT cd.name, ', ' ORDER BY cd.name)
          FROM sdms_db.patient_clinical_diagnoses pcd
          INNER JOIN sdms_db.clinical_diagnoses cd
            ON cd.id = pcd.clinical_diag_id
          WHERE pcd.patient_id = bp.id
        ), ''),
        'Proposed OT', COALESCE((SELECT bs.operation_name FROM base_surgery bs ORDER BY bs.operation_date_time DESC NULLS LAST LIMIT 1), ''),
        'Pre-op investigations', COALESCE((
          SELECT string_agg(DISTINCT i.investigation_name, ', ' ORDER BY i.investigation_name)
          FROM sdms_db.patient_investigations pi
          INNER JOIN sdms_db.investigations i
            ON i.id = pi.investigation_id
          WHERE pi.patient_id = bp.id
        ), ''),
        'Co-morbidities', COALESCE((
          SELECT string_agg(DISTINCT cm.name, ', ' ORDER BY cm.name)
          FROM sdms_db.patient_co_morbidities pcm
          INNER JOIN sdms_db.co_morbidities cm
            ON cm.id = pcm.co_morbidity_id
          WHERE pcm.patient_id = bp.id
        ), ''),
        'Post-operative recovery', COALESCE((SELECT bs.post_operative_recovery_status FROM base_surgery bs ORDER BY bs.operation_date_time DESC NULLS LAST LIMIT 1), ''),
        'Advice on discharge', COALESCE(bd.advice_on_discharge, ''),
        'Outcome', COALESCE(bd.outcome, '')
      ) AS payload
      FROM base_patient bp
      LEFT JOIN base_admission ba ON TRUE
      LEFT JOIN base_discharge bd ON TRUE
    )
    SELECT COALESCE(payload, '{}'::jsonb)
    INTO result
    FROM patient_report;

  ELSE
    result := jsonb_build_object(
      'error', 'Unsupported action_mode',
      'action_mode', v_action
    );
  END IF;
END;
$$;