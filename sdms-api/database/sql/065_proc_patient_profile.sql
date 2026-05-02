-- Missing stored procedure used by patientProfileController in legacy flow

CREATE OR REPLACE PROCEDURE sdms_db.proc_patient_profile(
  IN p_payload JSONB,
  IN p_meta JSONB,
  OUT result JSONB
)
LANGUAGE plpgsql
AS $$
DECLARE
  v_action TEXT := LOWER(COALESCE(p_payload->>'action_mode', ''));
  v_patient_id BIGINT := NULLIF(COALESCE(p_payload->>'patient_id', ''), '')::BIGINT;
  v_admission_id BIGINT := NULLIF(COALESCE(p_payload->>'admission_id', ''), '')::BIGINT;
  v_effective_admission_id BIGINT;

  v_patient_basic JSONB;
  v_admission_data JSONB;
  v_release_data JSONB;
  v_post_ops_data JSONB;
  v_pre_ops_data JSONB;

  v_co_morbidities JSONB;
  v_diagnosis JSONB;
  v_drug_history JSONB;
  v_investigations JSONB;
  v_surgical_history TEXT;
BEGIN
  IF v_action NOT IN ('get_profile', 'get_profile_by_patient_id') THEN
    result := jsonb_build_object(
      'success', false,
      'msg', 'Unsupported action_mode',
      'data', NULL
    );
    RETURN;
  END IF;

  IF v_patient_id IS NULL OR v_patient_id <= 0 THEN
    result := jsonb_build_object(
      'success', false,
      'msg', 'patient_id is required',
      'data', NULL
    );
    RETURN;
  END IF;

  IF v_admission_id IS NULL THEN
    SELECT pa.id
    INTO v_effective_admission_id
    FROM sdms_db.patient_admissions pa
    WHERE pa.patient_id = v_patient_id
    ORDER BY pa.date_of_adm DESC NULLS LAST, pa.id DESC
    LIMIT 1;
  ELSE
    v_effective_admission_id := v_admission_id;
  END IF;

  SELECT jsonb_build_object(
    'id', p.id,
    'name', p.name,
    'age', p.age,
    'gender', p.gender,
    'mobile_number', p.mobile_number,
    'address_line_one', p.address_line_one,
    'marital_status', p.marital_status,
    'patient_generated_uid', p.patient_generated_uid,
    'religion', p.religion,
    'is_active', p.is_active,
    'insert_by', p.insert_by,
    'insert_date', p.insert_date,
    'admission_id', v_effective_admission_id,
    'hospital_id', pa.hospital_id
  )
  INTO v_patient_basic
  FROM sdms_db.patients p
  LEFT JOIN sdms_db.patient_admissions pa
    ON pa.id = v_effective_admission_id
  WHERE p.id = v_patient_id
  LIMIT 1;

  IF v_patient_basic IS NULL THEN
    result := jsonb_build_object(
      'success', false,
      'msg', 'Patient not found',
      'data', NULL
    );
    RETURN;
  END IF;

  SELECT to_jsonb(x)
  INTO v_admission_data
  FROM (
    SELECT
      pa.id,
      pa.id AS admission_id,
      pa.patient_id,
      pa.hospital_id,
      h.name AS hospital_name,
      pa.date_of_adm,
      pa.admission_status AS adm_status,
      pa.referral_source_id,
      r.name AS referral_source_name,
      pa.remarks,
      pa.insert_by,
      pa.insert_date,
      pa.is_active,
      pa.created_at,
      pa.updated_at
    FROM sdms_db.patient_admissions pa
    LEFT JOIN sdms_db.hospitals h ON h.id = pa.hospital_id
    LEFT JOIN sdms_db.referrals r ON r.id = pa.referral_source_id
    WHERE pa.patient_id = v_patient_id
      AND (v_effective_admission_id IS NULL OR pa.id = v_effective_admission_id)
    ORDER BY pa.date_of_adm DESC NULLS LAST, pa.id DESC
    LIMIT 1
  ) x;

  SELECT COALESCE(jsonb_agg(to_jsonb(x) ORDER BY x.discharge_date_time DESC NULLS LAST, x.id DESC), '[]'::jsonb)
  INTO v_release_data
  FROM (
    SELECT
      pd.id,
      pd.patient_id,
      pd.hospital_id,
      pd.admission_id,
      pd.discharge_date_time,
      pd.advice_on_discharge,
      pd.outcome,
      pd.created_at,
      pd.updated_at
    FROM sdms_db.patient_discharges pd
    WHERE pd.patient_id = v_patient_id
      AND (v_effective_admission_id IS NULL OR pd.admission_id = v_effective_admission_id)
  ) x;

  SELECT COALESCE(jsonb_agg(to_jsonb(x) ORDER BY x.operation_date DESC NULLS LAST, x.id DESC), '[]'::jsonb)
  INTO v_post_ops_data
  FROM (
    SELECT
      sd.id,
      sd.patient_id,
      sd.operation_date_time AS operation_date,
      o.operation_name,
      sd.procedure_notes,
      sd.challenges_during_surgery,
      sd.complications,
      sd.nature_of_anaesthesia AS nature_of_anesthesia,
      sd.post_operative_recovery_status AS post_operative_recovery,
      sd.post_op_recovery_notes AS post_operative_recovery_notes
    FROM sdms_db.surgical_data sd
    LEFT JOIN sdms_db.operations o ON o.id = sd.operation_id
    WHERE sd.patient_id = v_patient_id
  ) x;

  SELECT COALESCE(jsonb_agg(cm.name ORDER BY cm.name), '[]'::jsonb)
  INTO v_co_morbidities
  FROM (
    SELECT DISTINCT cm.name
    FROM sdms_db.patient_co_morbidities pcm
    INNER JOIN sdms_db.co_morbidities cm ON cm.id = pcm.co_morbidity_id
    WHERE pcm.patient_id = v_patient_id
      AND (v_effective_admission_id IS NULL OR pcm.admission_id = v_effective_admission_id)
  ) cm;

  SELECT COALESCE(jsonb_agg(cd.name ORDER BY cd.name), '[]'::jsonb)
  INTO v_diagnosis
  FROM (
    SELECT DISTINCT cd.name
    FROM sdms_db.patient_clinical_diagnoses pcd
    INNER JOIN sdms_db.clinical_diagnoses cd ON cd.id = pcd.clinical_diag_id
    WHERE pcd.patient_id = v_patient_id
      AND (v_effective_admission_id IS NULL OR pcd.admission_id = v_effective_admission_id)
  ) cd;

  SELECT COALESCE(jsonb_agg(d.name ORDER BY d.name), '[]'::jsonb)
  INTO v_drug_history
  FROM (
    SELECT DISTINCT d.name
    FROM sdms_db.patient_drug_history pdh
    INNER JOIN sdms_db.drugs d ON d.id = pdh.drug_id
    WHERE pdh.patient_id = v_patient_id
      AND (v_effective_admission_id IS NULL OR pdh.admission_id = v_effective_admission_id)
  ) d;

  SELECT COALESCE(jsonb_object_agg(x.investigation_name, COALESCE(x.investigation_report_result, 'N/A')), '{}'::jsonb)
  INTO v_investigations
  FROM (
    SELECT i.investigation_name, pi.investigation_report_result
    FROM sdms_db.patient_investigations pi
    INNER JOIN sdms_db.investigations i ON i.id = pi.investigation_id
    WHERE pi.patient_id = v_patient_id
      AND (v_effective_admission_id IS NULL OR pi.admission_id = v_effective_admission_id)
  ) x;

  SELECT ppsh.history_notes
  INTO v_surgical_history
  FROM sdms_db.patient_preop_surgical_history ppsh
  WHERE ppsh.patient_id = v_patient_id
    AND (v_effective_admission_id IS NULL OR ppsh.admission_id = v_effective_admission_id)
  ORDER BY ppsh.updated_at DESC NULLS LAST, ppsh.id DESC
  LIMIT 1;

  v_pre_ops_data := jsonb_build_array(
    jsonb_build_object(
      'id', COALESCE(v_effective_admission_id, v_patient_id),
      'patient_id', v_patient_id,
      'admission_id', v_effective_admission_id,
      'co_morbidities_id', COALESCE(v_co_morbidities, '[]'::jsonb),
      'diagnosis_id', COALESCE(v_diagnosis, '[]'::jsonb),
      'drug_history', COALESCE(v_drug_history, '[]'::jsonb),
      'surgical_history', v_surgical_history,
      'remarks', v_patient_basic->>'remarks',
      'investigations', COALESCE(v_investigations, '{}'::jsonb)
    )
  );

  result := jsonb_build_object(
    'success', true,
    'msg', 'Patient profile fetched',
    'data', jsonb_build_object(
      'patient_basic', v_patient_basic,
      'admission_data', v_admission_data,
      'release_data', COALESCE(v_release_data, '[]'::jsonb),
      'post_ops_data', COALESCE(v_post_ops_data, '[]'::jsonb),
      'pre_ops_data', COALESCE(v_pre_ops_data, '[]'::jsonb)
    )
  );

EXCEPTION WHEN OTHERS THEN
  result := jsonb_build_object(
    'success', false,
    'msg', SQLERRM,
    'data', NULL
  );
END;
$$;