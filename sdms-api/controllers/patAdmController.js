const DBCRUDService = require('../services/DBCRUDService');
const checkValidations = require('../validations/pat_adm_Validations');
const { getCommonFields } = require('../services/shared/commonFieldService');
const ResponseHandler = require('../utils/responseHandler');

// Instantiate CommonService for the specific stored procedure
const admService = new DBCRUDService('sdms_db', 'proc_pat_adm_crud');

exports.getById = async (req, res) => {
    const commonFields = getCommonFields(req);
    const data = { ...req.body, ...commonFields };

    try {
        // const validationError = checkValidations.validateGetById(data);
        // if (validationError) {
        //     return ResponseHandler.error(res, validationError);
        // }

        const result = await admService.getById(data);
        res.json(result);
    } catch (error) {
        return ResponseHandler.error(res, error.message);
    }
};

exports.getList = async (req, res) => {
    const commonFields = getCommonFields(req);
    const data = { ...req.body, ...commonFields };

    try {
        const result = await admService.getList(data);
        res.json(result);
    } catch (error) {
        return ResponseHandler.error(res, error.message);
    }
};

exports.create = async (req, res) => {
    const commonFields = getCommonFields(req);
    const data = { ...req.body, ...commonFields };

    // const validationError = checkValidations.validateCreate(data);
    // if (validationError) {
    //     return ResponseHandler.error(res, validationError);
    // }

    try {
        const result = await admService.create(data);
        res.json(result);
    } catch (error) {
        return ResponseHandler.error(res, error.message);
    }
};

exports.update = async (req, res) => {
    const commonFields = getCommonFields(req);
    const data = { id: req.params.id, ...req.body, ...commonFields };

    try {
        const validationError = checkValidations.validateUpdate(data);
        if (validationError) {
            return ResponseHandler.error(res, validationError);
        }

        const result = await admService.update(data);
        res.json(result);
    } catch (error) {
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

        const result = await admService.delete(data);
        res.json(result);
    } catch (error) {
        return ResponseHandler.error(res, error.message);
    }
};
