// controllers/patientDataController.js

const db = require('../services/shared/database');
const { getCommonFields } = require('../services/shared/commonFieldService');
const ResponseHandler = require('../utils/responseHandler');

const mapPatientListRow = (row) => ({
        patient_id: row.patient_id,
        patient_name: row.patient_name,
        mobile_number: row.mobile_number,
        age: row.age,
        surgery_name: row.surgery_name,
        surgery_date: row.surgery_date,
        hospital_name: row.hospital_name,
        admission_id: row.admission_id,
        followup_date: row.followup_date,
        followup_start_time: row.followup_start_time,
});

const buildPatientListQuery = (actionMode, data) => {
        if (actionMode === 'date_to_date_pending_followup') {
                return {
                        text: `
                                SELECT
                                    p.id AS patient_id,
                                    p.name AS patient_name,
                                    p.mobile_number AS mobile_number,
                                    p.age AS age,
                                    o.operation_name AS surgery_name,
                                    ls.operation_date_time AS surgery_date,
                                    fs.scheduled_date AS followup_date,
                                    fs.start_time AS followup_start_time,
                                    h.name AS hospital_name,
                                    pa.id AS admission_id
                                FROM sdms_db.followup_schedules fs
                                INNER JOIN sdms_db.patients p
                                    ON p.id = fs.patient_id
                                LEFT JOIN sdms_db.patient_admissions pa
                                    ON pa.id = fs.admission_id
                                LEFT JOIN LATERAL (
                                    SELECT sd.operation_date_time, sd.operation_id, sd.hospital_id
                                    FROM sdms_db.surgical_data sd
                                    WHERE sd.patient_id = p.id
                                    ORDER BY sd.operation_date_time DESC NULLS LAST, sd.id DESC
                                    LIMIT 1
                                ) ls ON TRUE
                                LEFT JOIN sdms_db.operations o
                                    ON o.id = ls.operation_id
                                LEFT JOIN sdms_db.hospitals h
                                    ON h.id = COALESCE(fs.hospital_id, pa.hospital_id, ls.hospital_id)
                                WHERE fs.scheduled_date BETWEEN COALESCE(NULLIF($1::text, '')::date, fs.scheduled_date)
                                    AND COALESCE(NULLIF($2::text, '')::date, fs.scheduled_date)
                                    AND COALESCE(LOWER(fs.visit_status), 'pending') IN ('pending', 'scheduled', 'open')
                                ORDER BY fs.scheduled_date DESC, fs.start_time DESC NULLS LAST, fs.id DESC
                                LIMIT COALESCE(NULLIF($3::text, '')::int, 100)`,
                        values: [data.start_date || null, data.end_date || null, data.limit || null],
                };
        }

        return {
                text: `
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
                        SELECT
                            p.id AS patient_id,
                            p.name AS patient_name,
                            p.mobile_number AS mobile_number,
                            p.age AS age,
                            o.operation_name AS surgery_name,
                            ls.operation_date_time AS surgery_date,
                            h.name AS hospital_name,
                            la.id AS admission_id
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
                        ORDER BY la.date_of_adm DESC NULLS LAST, la.id DESC
                        LIMIT COALESCE(NULLIF($1::text, '')::int, 100)`,
                values: [data.limit || null],
        };
};

exports.getById = async (req, res) => {
        const commonFields = getCommonFields(req);
        const data = { ...req.body, ...commonFields };

        try {
                const patientId = data.patient_id ? Number(data.patient_id) : null;

                if (!patientId) {
                        return ResponseHandler.error(res, 'patient_id is required');
                }

                const result = await db.query(
                        `SELECT
                            p.id AS patient_id,
                            p.name AS patient_name,
                            p.age,
                            p.gender,
                            p.marital_status,
                            p.mobile_number,
                            p.address_line_one,
                            occ.name AS occupation_name,
                            pa.id AS admission_id,
                            pa.date_of_adm,
                            h.name AS hospital_name,
                            pd.discharge_date_time,
                            pd.advice_on_discharge,
                            pd.outcome,
                            o.operation_name AS surgery_name,
                            sd.operation_date_time AS surgery_date,
                            sd.post_operative_recovery_status
                        FROM sdms_db.patients p
                        LEFT JOIN sdms_db.occupations occ
                            ON occ.id = p.occupation_id
                        LEFT JOIN LATERAL (
                            SELECT pa.id, pa.hospital_id, pa.date_of_adm
                            FROM sdms_db.patient_admissions pa
                            WHERE pa.patient_id = p.id
                            ORDER BY pa.date_of_adm DESC NULLS LAST, pa.id DESC
                            LIMIT 1
                        ) pa ON TRUE
                        LEFT JOIN sdms_db.hospitals h
                            ON h.id = pa.hospital_id
                        LEFT JOIN LATERAL (
                            SELECT pd.discharge_date_time, pd.advice_on_discharge, pd.outcome
                            FROM sdms_db.patient_discharges pd
                            WHERE pd.admission_id = pa.id
                            ORDER BY pd.discharge_date_time DESC NULLS LAST, pd.id DESC
                            LIMIT 1
                        ) pd ON TRUE
                        LEFT JOIN LATERAL (
                            SELECT sd.operation_date_time, sd.operation_id, sd.post_operative_recovery_status
                            FROM sdms_db.surgical_data sd
                            WHERE sd.patient_id = p.id
                            ORDER BY sd.operation_date_time DESC NULLS LAST, sd.id DESC
                            LIMIT 1
                        ) sd ON TRUE
                        LEFT JOIN sdms_db.operations o
                            ON o.id = sd.operation_id
                        WHERE p.id = $1
                        LIMIT 1`,
                        [patientId]
                );

                return ResponseHandler.success(res, result.rows[0] || null);
        } catch (error) {
                return ResponseHandler.error(res, error.message);
        }
};

exports.getList = async (req, res) => {
        const commonFields = getCommonFields(req);
        const data = { ...req.body, ...commonFields };

        try {
                const actionMode = String(data.action_mode || '').toLowerCase();
                const { text, values } = buildPatientListQuery(actionMode, data);
                const result = await db.query(text, values);

                return ResponseHandler.success(res, result.rows.map(mapPatientListRow));
        } catch (error) {
                return ResponseHandler.error(res, error.message);
        }
};
