const bcrypt = require('bcryptjs');

class Utils {
    static getClientIP(req) {
        return req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    }

    static validateRequiredFields(params, requiredFields)  {
        for (const field of requiredFields) {
          if (!params[field]) {
            return `${field} is required`;
          }
        }
        return null;
      }
      // Generic  response handler
      // Refactored sendResponse method with support for optional parameters
      
      //sendResponse(res, 200, 'success', 'User registered successfully', { userId: newUser.id });
      // sendResponse(res, 200, 'success', null, { userId: newUser.id });
      // sendResponse(res, 400, 'error', 'Invalid credentials');
      //sendResponse(res, 200, 'success', null, { userId: newUser.id });

       static sendResponse (res, statusCode, type, message = null, data = null) {
        const response = {
          status: statusCode,
          type: type,
        };
      
        if (message) {
          response.message = message;
        } else if (type === 'success' && statusCode === 200) {
          response.message = 'Operation successful';
        } else if (type === 'error') {
          response.message = 'Something went wrong';
        }
      
        if (data) {
          response.data = data;
        }
      
        res.status(statusCode).json(response);
      };
   }

module.exports = Utils;
