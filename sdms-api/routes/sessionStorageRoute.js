const express = require('express');
const router = express.Router();
const sessionStorageController = require('../controllers/sessionStorageController');

//const { authMiddleware } = require('../middlewares/authMiddleware');

// 👉👉 using middleware
// router.post('/expertprofiles/getById', authMiddleware, expertProfilesController.getById);

const path = 'sessionstorage'

router.post(`/${path}/getsession`, sessionStorageController.getById);
router.post(`/${path}/createsession`, sessionStorageController.create);
router.post(`/${path}/deletesession`, sessionStorageController.delete);

module.exports = router;