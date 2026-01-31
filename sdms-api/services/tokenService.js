const jwt = require('jsonwebtoken');

const generateAccessToken = (user) => {
  return jwt.sign(
    { userId: user.id, email: user.email , tokenVersion: user.token_version},
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: process.env.ACCESS_TOKEN_EXPIRATION } // short life
  );
};

const generateRefreshToken = (user) => {
  return jwt.sign(
    { userId: user.id, email: user.email, tokenVersion: user.token_version },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: process.env.REFERSH_TOKEN_EXPIRATION } // longer life
  );
};

// secret can be either  REFRESH_TOKEN_SECRET or ACCESS_TOKEN_SECRET

const verifyToken = (token, secret) => {
  return jwt.verify(token, secret);
};

// function verifyAccessToken(token) {
//   return jwt.verify(token, process.env.JWT_SECRET);
// }

// function verifyRefreshToken(token) {
//   return jwt.verify(token, process.env.JWT_REFRESH_SECRET);
// }

module.exports = { generateAccessToken,generateRefreshToken,verifyToken};

//module.exports = { generateAccessToken, verifyAccessToken, verifyRefreshToken };
