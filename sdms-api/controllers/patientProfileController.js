const DBCRUDService = require("../services/DBCRUDService");
const { getCommonFields } = require("../services/shared/commonFieldService");
const ResponseHandler = require("../utils/responseHandler");

// Instantiate service for patient profile procedure
const profileService = new DBCRUDService("sdms_db", "proc_patient_profile");

// Get Patient Profile (supports both old and new logic)
exports.getProfile = async (req, res) => {
  const commonFields = getCommonFields(req);
  const data = { ...req.body, ...commonFields };

  try {
    // If admission_id is provided, fetch specific admission
    if (data.admission_id) {
      if (!data.patient_id) {
        return ResponseHandler.error(res, "patient_id is required when admission_id is provided");
      }
      data.action_mode = "get_profile"; // specific admission
    } else {
      // Only patient_id provided → fetch all admissions
      if (!data.patient_id) {
        return ResponseHandler.error(res, "patient_id is required");
      }
      data.action_mode = "get_profile_by_patient_id"; // all admissions
    }

    const result = await profileService.create(data); // execute procedure
    res.json(result);
  } catch (error) {
    return ResponseHandler.error(res, error.message);
  }
};
