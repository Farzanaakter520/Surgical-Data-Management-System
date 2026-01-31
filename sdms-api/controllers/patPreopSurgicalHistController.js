const DBCRUDService = require('../services/DBCRUDService');
const checkValidations = require('../validations/pat_PreopSurgicalHistValidations');
const { getCommonFields } = require('../services/shared/commonFieldService');
const ResponseHandler = require('../utils/responseHandler');

// Instantiate CommonService for the specific stored procedure
const opsService = new DBCRUDService('sdms_db', 'proc_pat_preop_surgical_hist_crud'); // SP নাম অনুযায়ী পরিবর্তন করুন

exports.getById = async (req, res) => {
    const commonFields = getCommonFields(req);
    const data = { ...req.body, ...commonFields };
    try {
        const result = await opsService.getById(data);
        res.json(result);
    } catch (error) {
        return ResponseHandler.error(res, error.message);
    }
};

exports.getList = async (req, res) => {
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
    try {
        const result = await opsService.create(data);
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
        const result = await opsService.update(data);
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
        const result = await opsService.delete(data);
        res.json(result);
    } catch (error) {
        return ResponseHandler.error(res, error.message);
    }
};
