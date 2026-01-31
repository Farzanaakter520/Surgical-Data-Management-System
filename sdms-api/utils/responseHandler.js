
class ResponseHandler {
    static success(res, data, message = 'Success', status = 200) {
        return res.status(status).json({
            success: true,
            msg:message,
            data:data
        });
    }

    static error(res, message, status = 400) {
        return res.status(status).json({
            success: false,
            msg: message || 'Internal Server Error',
            data: null
        });
    }
}

module.exports = ResponseHandler; 