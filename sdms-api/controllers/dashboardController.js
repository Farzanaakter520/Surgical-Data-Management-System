// controllers/dashboardController.js
const db = require("../services/shared/database");
const { getCommonFields } = require("../services/shared/commonFieldService");
const ResponseHandler = require("../utils/responseHandler");

// Generic method to fetch dashboard data
exports.getData = async (req, res) => {
  const commonFields = getCommonFields(req);
  const data = { ...req.body, ...commonFields };

  try {
    const actionMode = String(data.action_mode || "").toLowerCase();

    if (actionMode === "recent_surgery_patient") {
      const result = await db.query(
        `SELECT
           p.id AS patient_id,
           p.name AS patient_name,
           p.mobile_number AS mobile,
           p.age AS age,
           o.operation_name AS surgery_name,
           sd.operation_date_time AS surgery_date,
           h.name AS hospital_name,
           a.id AS admission_id
         FROM sdms_db.surgical_data sd
         INNER JOIN sdms_db.patients p
           ON p.id = sd.patient_id
         LEFT JOIN sdms_db.operations o
           ON o.id = sd.operation_id
         LEFT JOIN sdms_db.hospitals h
           ON h.id = sd.hospital_id
         LEFT JOIN LATERAL (
           SELECT pa.id
           FROM sdms_db.patient_admissions pa
           WHERE pa.patient_id = p.id
           ORDER BY pa.date_of_adm DESC, pa.id DESC
           LIMIT 1
         ) a ON TRUE
         ORDER BY sd.operation_date_time DESC NULLS LAST, sd.id DESC
         LIMIT COALESCE(NULLIF($1::text, '')::int, 100)`,
        [data.limit || null]
      );

      return ResponseHandler.success(res, result.rows);
    }

    return ResponseHandler.error(
      res,
      `Unsupported dashboard action_mode: ${actionMode || "(empty)"}`
    );
  } catch (error) {
    return ResponseHandler.error(res, error.message);
  }
};
