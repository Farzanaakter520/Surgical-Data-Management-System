const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { authenticate } = require('../middlewares/authMiddleware');


const path = 'auth';

router.post(`/${path}/signup`, authController.signup);
router.post(`/${path}/login`, authController.login);
// router.post(`/${path}/change-password`,authenticate, authController.changePassword);
// router.post(`/${path}/refresh-token`, authenticate, authController.refreshToken);
// router.post(`/${path}/logout`,authenticate, authController.logout);

// // example protected route
// router.post(`/${path}/profile`, authenticate, (req, res) => {
//   res.json({ msg: 'Protected profile route', user: req.user });
// });

module.exports = router;