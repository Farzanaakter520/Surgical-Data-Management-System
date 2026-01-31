const DBCRUDService = require("../services/DBCRUDService");
const { getCommonFields } = require("../services/shared/commonFieldService");
const ResponseHandler = require("../utils/responseHandler");

// Instantiate Service for discharge & follow-up schedule procedure
const dischargeFollowupService = new DBCRUDService(
  "sdms_db",
  "proc_discharge_followup_schedule"
);

exports.handleDischargeFollowup = async (req, res) => {
  const commonFields = getCommonFields(req);
  const data = { ...req.body, ...commonFields };

  try {
    const result = await dischargeFollowupService.create(data); 

    res.json(result);
  } catch (error) {
    return ResponseHandler.error(res, error.message);
  }
};
