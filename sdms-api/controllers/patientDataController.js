// controllers/patientDataController.js

const DBCRUDService = require('../services/DBCRUDService');
const { getCommonFields } = require('../services/shared/commonFieldService');
const ResponseHandler = require('../utils/responseHandler');

const patientDataService = new DBCRUDService('sdms_db', 'proc_patient_data');

// Single patient fetch (patient_data / patient_report)
exports.getById = async (req, res) => {
    const commonFields = getCommonFields(req);
    const data = {
        ...req.body,   
        ...commonFields
    };

    try {
        const result = await patientDataService.getById(data);
        res.json(result);   
    } catch (error) {
        return ResponseHandler.error(res, error.message);
    }
};

exports.getList = async (req, res) => {
    const commonFields = getCommonFields(req);
    const data = {
        ...req.body,   
        ...commonFields
    };

    try {
        const result = await patientDataService.getList(data);
        res.json(result);   
    } catch (error) {
        return ResponseHandler.error(res, error.message);
    }
};
