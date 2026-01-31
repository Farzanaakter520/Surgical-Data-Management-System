const bcrypt = require('bcryptjs');

const BCRYPT_SALT_ROUNDS = 12;
// ✅ Get Client IP
function getClientIP(req) {
  return req.headers['x-forwarded-for'] || req.connection.remoteAddress;
}

// ✅ Validate Required Fields
function validateRequiredFields(params, requiredFields) {
  for (const field of requiredFields) {
    if (!params[field]) {
      return `${field} is required`;
    }
  }
  return null;
}

const sendSuccess = (res, msg, data = null, status = 200) => {
  return res.status(status).json({ success: true, msg, data });
};

const sendError = (res, msg, data = null, status = 400) => {
  return res.status(status).json({ success: false, msg, data });
};

// Encrypt Password
const encryptPassword = async (password) => {
  const salt = await bcrypt.genSalt(BCRYPT_SALT_ROUNDS);
  return bcrypt.hash(password, salt);
};

// Compare Password
const comparePassword = async (password, hashed) => {
  return bcrypt.compare(password, hashed);
};

const getFormattedTimestamp =()=> {
    const now = new Date();

    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    const milliseconds = String(now.getMilliseconds()).padStart(3, '0'); // Always 3 digits

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}:${milliseconds}`;
}

module.exports = {
  getClientIP,sendSuccess,sendError,encryptPassword,comparePassword,
  validateRequiredFields,getFormattedTimestamp,
  };

