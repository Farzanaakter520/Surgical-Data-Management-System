const Utils = require('../../utils/utils');
const getCommonFields = (req) => {
    return {
        device_id: Utils.getClientIP(req),
        loc_id: req.headers['x-loc-id'] || 'loc',
        insert_by: req.user?.id || 'sys',
        insert_date: new Date(),
    };
};

module.exports = { getCommonFields };