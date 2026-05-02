const db = require("../services/shared/database");
const { getCommonFields } = require("../services/shared/commonFieldService");
const ResponseHandler = require("../utils/responseHandler");

const toArray = (value) => (Array.isArray(value) ? value : []);

const toRecord = (rows) =>
  rows.reduce((acc, row) => {
    if (row?.investigation_name) {
      acc[row.investigation_name] = row.investigation_report_result || "N/A";
    }
    return acc;
  }, {});

// Get Patient Profile (supports both old and new logic)
exports.getProfile = async (req, res) => {
  const commonFields = getCommonFields(req);
  const data = { ...req.body, ...commonFields };

  try {
    const patientId = Number(data.patient_id);
    const requestedAdmissionId = data.admission_id ? Number(data.admission_id) : null;

    if (!Number.isFinite(patientId) || patientId <= 0) {
      return ResponseHandler.error(res, "patient_id is required");
    }

    const patientResult = await db.query(
      `SELECT
         p.id,
         p.name,
         p.age,
         p.gender,
         p.mobile_number,
         p.address_line_one,
         p.marital_status,
         p.patient_generated_uid,
         p.religion,
         p.is_active,
         p.insert_by,
         p.insert_date
       FROM sdms_db.patients p
       WHERE p.id = $1
       LIMIT 1`,
      [patientId]
    );

    const patientBasic = patientResult.rows[0];
    if (!patientBasic) {
      return ResponseHandler.error(res, "Patient not found", 404);
    }

    let admissionId = requestedAdmissionId;
    if (!admissionId) {
      const latestAdmissionResult = await db.query(
        `SELECT pa.id
         FROM sdms_db.patient_admissions pa
         WHERE pa.patient_id = $1
         ORDER BY pa.date_of_adm DESC NULLS LAST, pa.id DESC
         LIMIT 1`,
        [patientId]
      );
      admissionId = latestAdmissionResult.rows[0]?.id || null;
    }

    const admissionResult = admissionId
      ? await db.query(
          `SELECT
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
             pa.created_at,
             pa.updated_at
           FROM sdms_db.patient_admissions pa
           LEFT JOIN sdms_db.hospitals h ON h.id = pa.hospital_id
           LEFT JOIN sdms_db.referrals r ON r.id = pa.referral_source_id
           WHERE pa.id = $1 AND pa.patient_id = $2
           LIMIT 1`,
          [admissionId, patientId]
        )
      : { rows: [] };

    const admissionData = admissionResult.rows[0] || null;

    const releaseResult = admissionId
      ? await db.query(
          `SELECT
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
           WHERE pd.patient_id = $1
             AND pd.admission_id = $2
           ORDER BY pd.discharge_date_time DESC NULLS LAST, pd.id DESC`,
          [patientId, admissionId]
        )
      : { rows: [] };

    const postOpsResult = await db.query(
      `SELECT
         sd.id,
         sd.patient_id,
         sd.operation_date_time AS operation_date,
         o.operation_name,
         sd.procedure_notes,
         sd.challenges_during_surgery,
         sd.complications,
         sd.nature_of_anaesthesia AS nature_of_anesthesia,
         sd.post_operative_recovery_status AS post_operative_recovery,
         sd.post_op_recovery_notes AS post_operative_recovery_notes,
         sd.remarks
       FROM sdms_db.surgical_data sd
       LEFT JOIN sdms_db.operations o ON o.id = sd.operation_id
       WHERE sd.patient_id = $1
       ORDER BY sd.operation_date_time DESC NULLS LAST, sd.id DESC`,
      [patientId]
    );

    const [coMorbiditiesResult, diagnosisResult, drugHistoryResult, investigationResult] =
      await Promise.all([
        db.query(
          `SELECT DISTINCT cm.name
           FROM sdms_db.patient_co_morbidities pcm
           INNER JOIN sdms_db.co_morbidities cm ON cm.id = pcm.co_morbidity_id
           WHERE pcm.patient_id = $1
             AND ($2::int IS NULL OR pcm.admission_id = $2)
           ORDER BY cm.name`,
          [patientId, admissionId]
        ),
        db.query(
          `SELECT DISTINCT cd.name
           FROM sdms_db.patient_clinical_diagnoses pcd
           INNER JOIN sdms_db.clinical_diagnoses cd ON cd.id = pcd.clinical_diag_id
           WHERE pcd.patient_id = $1
             AND ($2::int IS NULL OR pcd.admission_id = $2)
           ORDER BY cd.name`,
          [patientId, admissionId]
        ),
        db.query(
          `SELECT DISTINCT d.name
           FROM sdms_db.patient_drug_history pdh
           INNER JOIN sdms_db.drugs d ON d.id = pdh.drug_id
           WHERE pdh.patient_id = $1
             AND ($2::int IS NULL OR pdh.admission_id = $2)
           ORDER BY d.name`,
          [patientId, admissionId]
        ),
        db.query(
          `SELECT i.investigation_name, pi.investigation_report_result
           FROM sdms_db.patient_investigations pi
           INNER JOIN sdms_db.investigations i ON i.id = pi.investigation_id
           WHERE pi.patient_id = $1
             AND ($2::int IS NULL OR pi.admission_id = $2)
           ORDER BY i.investigation_name`,
          [patientId, admissionId]
        ),
      ]);

    const surgicalHistoryResult = await db.query(
      `SELECT ppsh.history_notes
       FROM sdms_db.patient_preop_surgical_history ppsh
       WHERE ppsh.patient_id = $1
         AND ($2::int IS NULL OR ppsh.admission_id = $2)
       ORDER BY ppsh.updated_at DESC NULLS LAST, ppsh.id DESC
       LIMIT 1`,
      [patientId, admissionId]
    );

    const preOpsData = [
      {
        id: admissionId || patientId,
        patient_id: patientId,
        admission_id: admissionId,
        co_morbidities_id: toArray(coMorbiditiesResult.rows).map((r) => r.name),
        diagnosis_id: toArray(diagnosisResult.rows).map((r) => r.name),
        drug_history: toArray(drugHistoryResult.rows).map((r) => r.name),
        surgical_history: surgicalHistoryResult.rows[0]?.history_notes || null,
        remarks: admissionData?.remarks || null,
        investigations: toRecord(investigationResult.rows),
      },
    ];

    const payload = {
      patient_basic: {
        ...patientBasic,
        admission_id: admissionId,
        hospital_id: admissionData?.hospital_id || null,
      },
      admission_data: admissionData,
      release_data: releaseResult.rows,
      post_ops_data: postOpsResult.rows,
      pre_ops_data: preOpsData,
    };

    return ResponseHandler.success(res, payload);
  } catch (error) {
    return ResponseHandler.error(res, error.message);
  }
};
