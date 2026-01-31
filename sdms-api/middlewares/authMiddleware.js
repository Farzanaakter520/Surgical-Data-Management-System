const jwt = require('jsonwebtoken');

exports.authMiddleware = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const refreshToken = req.cookies['jwt'];
  //console.log(authHeader,refreshToken);
  // Check if there's an access token in the Authorization header
  const token = authHeader && authHeader.split(' ')[1];
 // console.log(token);
  if (!token && !refreshToken) {
    return res.status(401).json({ message: 'Unauthorised' });
  }

  if (token) {
    // Verify the access token
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) {
        if (!refreshToken) {
          return res.status(403).json({ message: 'Invalid or expired token. Refresh token missing.' });
        }
        return handleRefreshToken(req, res, next, refreshToken);
      }
      req.user = user;
      next();
    });
  } else if (refreshToken) {
    // Handle refresh token to generate a new access token
   // console.log('inside handle refresh token');
    handleRefreshToken(req, res, next, refreshToken);
  }
};

function handleRefreshToken(req, res, next, refreshToken) {
  try {
    jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET, (err, user) => {
      if (err) return res.status(403).json({ message: 'Unauthorised' });

      // Generate a new access token
      const accessToken = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRATION });

      res.cookie('jwt', refreshToken, { httpOnly: true,secure: true, sameSite: 'strict'});
      res.set('Authorization', `Bearer ${accessToken}`);

      req.user = user;
      next();
    });
  } catch (error) {
    return res.status(400).json({ message: 'Invalid refresh token' });
  }
}
