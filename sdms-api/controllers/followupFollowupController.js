const DBCRUDService = require("../services/DBCRUDService");
const { getCommonFields } = require("../services/shared/commonFieldService");
const ResponseHandler = require("../utils/responseHandler");

// Instantiate Service for follow-up & follow-up schedule procedure
const followupService = new DBCRUDService(
  "sdms_db",
  "proc_followup_followup_schedule"
);

exports.handleFollowupSchedule = async (req, res) => {
  const commonFields = getCommonFields(req);
  const data = { ...req.body, ...commonFields };

  try {
    const result = await followupService.create(data); // call the procedure

    res.json(result);
  } catch (error) {
    return ResponseHandler.error(res, error.message);
  }
};
