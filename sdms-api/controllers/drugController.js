const DBCRUDService = require('../services/DBCRUDService');
const checkValidations = require('../validations/drugValidations');
const { getCommonFields } = require('../services/shared/commonFieldService');
const ResponseHandler = require('../utils/responseHandler');

// Service instance for drug master CRUD
const drugService = new DBCRUDService('sdms_db', 'proc_drug_master_crud');

// ========================== Get By Id ==========================
exports.getById = async (req, res) => {
    const commonFields = getCommonFields(req);
    const data = { id: req.params.id, ...req.body, ...commonFields };

    try {
        const validationError = checkValidations.validateGetById(data);
        if (validationError) {
            return ResponseHandler.error(res, validationError);
        }

        const result = await drugService.getById(data);
        res.json(result);
    } catch (error) {
        return ResponseHandler.error(res, error.message);
    }
};

// ========================== Get List ==========================
exports.getList = async (req, res) => {
    const commonFields = getCommonFields(req);
    const data = { ...req.body, ...commonFields };

    try {
        const result = await drugService.getList(data);
        res.json(result);
    } catch (error) {
        return ResponseHandler.error(res, error.message);
    }
};

// ========================== Create ==========================
exports.create = async (req, res) => {
    const commonFields = getCommonFields(req);
    const data = { ...req.body, ...commonFields };

    try {
        // const validationError = checkValidations.validateCreate(data);
        // if (validationError) {
        //     return ResponseHandler.error(res, validationError);
        // }

        const result = await drugService.create(data);
        res.json(result);
    } catch (error) {
        return ResponseHandler.error(res, error.message);
    }
};

// ========================== Update ==========================
exports.update = async (req, res) => {
    const commonFields = getCommonFields(req);
    const data = { id: req.params.id, ...req.body, ...commonFields };

    try {
        const validationError = checkValidations.validateUpdate(data);
        if (validationError) {
            return ResponseHandler.error(res, validationError);
        }

        const result = await drugService.update(data);
        res.json(result);
    } catch (error) {
        return ResponseHandler.error(res, error.message);
    }
};

// ========================== Delete ==========================
exports.delete = async (req, res) => {
    const commonFields = getCommonFields(req);
    const data = { id: req.params.id, ...req.body, ...commonFields };

    try {
        const validationError = checkValidations.validateDelete(data);
        if (validationError) {
            return ResponseHandler.error(res, validationError);
        }

        const result = await drugService.delete(data);
        res.json(result);
    } catch (error) {
        return ResponseHandler.error(res, error.message);
    }
};
