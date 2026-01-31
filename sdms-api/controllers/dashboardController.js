// controllers/dashboardController.js
const DBCRUDService = require("../services/DBCRUDService");
const { getCommonFields } = require("../services/shared/commonFieldService");
const ResponseHandler = require("../utils/responseHandler");

// Instantiate CommonService for the specific stored procedure
const dashboardService = new DBCRUDService("sdms_db", "proc_dashboard");

// Generic method to fetch dashboard data
exports.getData = async (req, res) => {
  const commonFields = getCommonFields(req);
  const data = { ...req.body, ...commonFields };

  try {
    // এখানে req.body এর ভিতরে action_mode আসবে
    // যেমন: { "action_mode": "last_five_patient" }
    const result = await dashboardService.getList(data);
    res.json(result);
  } catch (error) {
    return ResponseHandler.error(res, error.message);
  }
};
