const DBCRUDService = require('../services/DBCRUDService');
const checkValidations = require('../validations/hospitalValidations');
const { getCommonFields } = require('../services/shared/commonFieldService');
const ResponseHandler = require('../utils/responseHandler');

// Instantiate DBCRUDService for hospitals
const hospitalService = new DBCRUDService('sdms_db', 'proc_hospitals_crud');

exports.getById = async (req, res) => {
    const commonFields = getCommonFields(req);
    const data = { ...req.body, id: req.params.id, ...commonFields }; // safer order
    try {
        const validationError = checkValidations.validateGetById(data);
        if (validationError) 
            return ResponseHandler.error(res, validationError.join(", "));

        const result = await hospitalService.getById(data);
        res.json(result);
    } catch (error) {
        return ResponseHandler.error(res, error.message);
    }
};

exports.getList = async (req, res) => {
    const commonFields = getCommonFields(req);
    const data = { ...req.body, ...commonFields };
    try {
        const result = await hospitalService.getList(data);
        res.json(result);
    } catch (error) {
        return ResponseHandler.error(res, error.message);
    }
};

exports.create = async (req, res) => {
    const commonFields = getCommonFields(req);
    const data = { ...req.body, ...commonFields };
    try {
        const validationError = checkValidations.validateCreate(data);
        if (validationError) 
            return ResponseHandler.error(res, validationError.join(", "));

        const result = await hospitalService.create(data);
        res.json(result);
    } catch (error) {
        return ResponseHandler.error(res, error.message);
    }
};

exports.update = async (req, res) => {
    const commonFields = getCommonFields(req);
    const data = { ...req.body, ...commonFields }; // req.body.id expected

    try {
        const result = await hospitalService.update(data); // no validation
        res.json(result);
    } catch (error) {
        return ResponseHandler.error(res, error.message);
    }
};

exports.delete = async (req, res) => {
    const commonFields = getCommonFields(req);
    const data = { ...req.body, ...commonFields }; // req.body.id expected

    try {
        const result = await hospitalService.delete(data); // no validation
        res.json(result);
    } catch (error) {
        return ResponseHandler.error(res, error.message);
    }
};

exports.deactivate = async (req, res) => {
    const commonFields = getCommonFields(req);
    const data = { ...req.body, id: req.params.id, ...commonFields }; // safer order
    try {
        // Validation added for deactivate
        const validationError = checkValidations.validateGetById(data);
        if (validationError) 
            return ResponseHandler.error(res, validationError.join(", "));

        const result = await hospitalService.deactivate(data);
        res.json(result);
    } catch (error) {
        return ResponseHandler.error(res, error.message);
    }
};
