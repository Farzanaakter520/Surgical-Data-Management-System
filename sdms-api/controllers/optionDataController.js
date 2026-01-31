const DBCRUDService = require('../services/DBCRUDService');
const { getCommonFields } = require('../services/shared/commonFieldService');
const ResponseHandler = require('../utils/responseHandler');

// Instantiate DBCRUDService for the specific stored procedure
const optionService = new DBCRUDService('sdms_db', 'proc_option_data_manager');

// 🔹 Get Option Data
exports.getOptionData = async (req, res) => {
    const commonFields = getCommonFields(req);
    const data = { ...req.body, ...commonFields }; 

    try {
        const result = await optionService.getById(data); 
        res.json(result);
    } catch (error) {
        return ResponseHandler.error(res, error.message);
    }
};
