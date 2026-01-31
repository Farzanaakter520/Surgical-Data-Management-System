const DBCRUDService = require('../services/DBCRUDService');
const checkValidations = require('../validations/patCoMorbiditiesValidations');
const { getCommonFields } = require('../services/shared/commonFieldService');
const ResponseHandler = require('../utils/responseHandler');

// Instantiate DBCRUDService for t_pat_co_morbidities
const coMorbiditiesService = new DBCRUDService('sdms_db', 'proc_pat_co_morbidities_crud');

exports.getById = async (req, res) => {
    const commonFields = getCommonFields(req);
    const data = { ...req.body, ...commonFields };
    try {
        const result = await coMorbiditiesService.getById(data);
        res.json(result);
    } catch (error) {
        return ResponseHandler.error(res, error.message);
    }
};

exports.getList = async (req, res) => {
    const commonFields = getCommonFields(req);
    const data = { ...req.body, ...commonFields };
    try {
        const result = await coMorbiditiesService.getList(data);
        res.json(result);
    } catch (error) {
        return ResponseHandler.error(res, error.message);
    }
};

exports.create = async (req, res) => {
    const commonFields = getCommonFields(req);
    const data = { ...req.body, ...commonFields };
    // Optional validation if available
    // const validationError = checkValidations.validateCreate(data);
    // if (validationError) return ResponseHandler.error(res, validationError);

    try {
        const result = await coMorbiditiesService.create(data);
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
        if (validationError) return ResponseHandler.error(res, validationError);

        const result = await coMorbiditiesService.update(data);
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
        if (validationError) return ResponseHandler.error(res, validationError);

        const result = await coMorbiditiesService.delete(data);
        res.json(result);
    } catch (error) {
        return ResponseHandler.error(res, error.message);
    }
};
