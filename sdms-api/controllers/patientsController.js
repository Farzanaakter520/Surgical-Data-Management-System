const DBCRUDService = require("../services/DBCRUDService");
const checkValidations = require("../validations/patientValidations");
const { getCommonFields } = require("../services/shared/commonFieldService");
const ResponseHandler = require("../utils/responseHandler");

// Instantiate CommonService for the specific stored procedure
const opsService = new DBCRUDService("sdms_db", "proc_patients_crud");

exports.getById = async (req, res) => {
  const commonFields = getCommonFields(req);
  const data = { ...req.body, ...commonFields };
  try {
    //const validationError = checkValidations.validateGetById(data);
    // if (validationError) {
    //     return ResponseHandler.error(res,validationError)
    //  }

    // console.log(data);
    const result = await opsService.getById(data);
    res.json(result);
  } catch (error) {
    return ResponseHandler.error(res, error.message);
  }
};

exports.getList = async (req, res) => {
  // console.log(req.body);
  const commonFields = getCommonFields(req);
  const data = { ...req.body, ...commonFields };
  try {
    const result = await opsService.getList(data);
    res.json(result);
  } catch (error) {
    return ResponseHandler.error(res, error.message);
  }
};

exports.create = async (req, res) => {
  const commonFields = getCommonFields(req);
  const data = { ...req.body, ...commonFields };
  //    const validationError = checkValidations.validateCreate(data);
  // if (validationError) {
  //         return ResponseHandler.error(res,validationError)
  //      }
  try {
    const result = await opsService.create(data);
    // return ResponseHandler.success(res,validationError)
    res.json(result);
  } catch (error) {
    return ResponseHandler.error(res, error.message);
    // res.status(400).json({ error: error.message });
  }
};

exports.update = async (req, res) => {
  const commonFields = getCommonFields(req);

  // Get id from URL param
  const patientId = req.params.id;
  const data = { id: patientId, ...req.body, ...commonFields };

  // Explicitly convert age to number
  if (data.age !== undefined) data.age = Number(data.age);

  // Debugging
  console.log("UPDATE DATA:", data);
  console.log("AGE TYPE:", typeof data.age, "AGE VALUE:", data.age);
  console.log("ID TYPE:", typeof data.id, "ID VALUE:", data.id);

  // Validate
  const validationError = checkValidations.validateUpdate(data);
  if (validationError) return ResponseHandler.error(res, validationError);

  try {
    const result = await opsService.update(data);
    console.log("UPDATE RESULT:", result);
    res.json(result);
  } catch (error) {
    console.error("PROCEDURE ERROR:", error.message);
    return ResponseHandler.error(res, error.message);
  }
};


exports.delete = async (req, res) => {
  const commonFields = getCommonFields(req);
  const data = { ...req.body, ...commonFields };
  try {
    const validationError = checkValidations.validateDelete(data);
    if (validationError) {
      return ResponseHandler.error(res, validationError);
    }
    const result = await opsService.delete(data);
    res.json(result);
  } catch (error) {
    return ResponseHandler.error(res, error.message);
  }
};
