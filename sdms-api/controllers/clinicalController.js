const DBCRUDService = require('../services/DBCRUDService');
const checkValidations = require('../validations/clinicalValidations');
const { getCommonFields } = require('../services/shared/commonFieldService');
const ResponseHandler = require('../utils/responseHandler');

// Instantiate DBCRUDService for clinical diagnosis
const clinicalService = new DBCRUDService('sdms_db', 'proc_clinical_diagnosis_crud');

exports.getById = async (req, res) => {
    const commonFields = getCommonFields(req);
    const data = { id: req.params.id, ...req.body, ...commonFields };
    try {
        // const validationError = checkValidations.validateGetById(data);
        // if (validationError) return ResponseHandler.error(res, validationError);

        const result = await clinicalService.getById(data);
        res.json(result);
    } catch (error) {
        return ResponseHandler.error(res, error.message);
    }
};

exports.getList = async (req, res) => {
    const commonFields = getCommonFields(req);
    const data = { ...req.body, ...commonFields };
    try {
        const result = await clinicalService.getList(data);
        res.json(result);
    } catch (error) {
        return ResponseHandler.error(res, error.message);
    }
};

exports.create = async (req, res) => {
    const commonFields = getCommonFields(req);
    const data = { ...req.body, ...commonFields };
    try {
        // const validationError = checkValidations.validateCreate(data);
        // if (validationError) return ResponseHandler.error(res, validationError);

        const result = await clinicalService.create(data);
        res.json(result);
    } catch (error) {
        return ResponseHandler.error(res, error.message);
    }
};

exports.update = async (req, res) => {
    const commonFields = getCommonFields(req);
    const data = { id: req.params.id, ...req.body, ...commonFields };
    try {
        // const validationError = checkValidations.validateUpdate(data);
        // if (validationError) return ResponseHandler.error(res, validationError);

        const result = await clinicalService.update(data);
        res.json(result);
    } catch (error) {
        return ResponseHandler.error(res, error.message);
    }
};

exports.delete = async (req, res) => {
    const commonFields = getCommonFields(req);
    const data = { id: req.params.id, ...req.body, ...commonFields };
    try {
        // const validationError = checkValidations.validateDelete(data);
        // if (validationError) return ResponseHandler.error(res, validationError);

        const result = await clinicalService.delete(data);
        res.json(result);
    } catch (error) {
        return ResponseHandler.error(res, error.message);
    }
};

exports.deactivate = async (req, res) => {
    const commonFields = getCommonFields(req);
    const data = { id: req.params.id, ...req.body, ...commonFields };
    try {
        const result = await clinicalService.deactivate(data);
        res.json(result);
    } catch (error) {
        return ResponseHandler.error(res, error.message);
    }
};
