// controllers/quickActionsController.js
const DBCRUDService = require("../services/DBCRUDService");
const { getCommonFields } = require("../services/shared/commonFieldService");
const ResponseHandler = require("../utils/responseHandler");

// Instantiate DBCRUDService for the quick actions procedure
const admissionToPostopService = new DBCRUDService("sdms_db", "proc_admission_to_post_op");

exports.create = async (req, res) => {
  const commonFields = getCommonFields(req);
  const data = { ...req.body, ...commonFields };  //keys duplicate

  // const data = {
  //   registration: registrationData,
  //   user: req.body.user || commonFields.insert_by || null,
  // };

  // debug for transaction
 // console.log("Data sent to SP:", JSON.stringify(data, null, 2));

  try {
    const result = await admissionToPostopService.create(data);
    res.json(result);
  } catch (error) {
    return ResponseHandler.error(res, error.message);
  }
};
