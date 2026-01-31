const DBCRUDService = require('../services/DBCRUDService');
const checkValidations = require('../validations/referral_Validations');
const { getCommonFields } = require('../services/shared/commonFieldService');
const ResponseHandler = require('../utils/responseHandler');

// Instantiate DBCRUDService for referral master
const sessionStorageService = new DBCRUDService('sdms_db', 'proc_sessions_crud');

exports.getById = async (req, res) => {
    const commonFields = getCommonFields(req);
    const data = { id: req.params.id, ...req.body, ...commonFields };
    try {
        // const validationError = checkValidations.validateGetById(data);
        // if (validationError) return ResponseHandler.error(res, validationError);

        const result = await sessionStorageService.getById(data);
        res.json(result);
    } catch (error) {
        return ResponseHandler.error(res, error.message);
    }
};

exports.getList = async (req, res) => {
    const commonFields = getCommonFields(req);
    const data = { ...req.body, ...commonFields };
    try {
        const result = await sessionStorageService.getList(data);
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

        const result = await sessionStorageService.create(data);
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

        const result = await sessionStorageService.update(data);
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

        const result = await sessionStorageService.delete(data);
        res.json(result);
    } catch (error) {
        return ResponseHandler.error(res, error.message);
    }
};

// exports.deactivate = async (req, res) => {
//     const commonFields = getCommonFields(req);
//     const data = { id: req.params.id, ...req.body, ...commonFields };
//     try {
//         const result = await sessionStorageService.deactivate(data);
//         res.json(result);
//     } catch (error) {
//         return ResponseHandler.error(res, error.message);
//     }
// };
