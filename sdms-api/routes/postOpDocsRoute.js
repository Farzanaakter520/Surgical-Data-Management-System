// routes/postOpDocsRoute.js
const express = require('express');
const router = express.Router();
const fileUploadController = require('../controllers/postOpDocsController');
const multer = require("multer");
const upload = multer({ dest: "uploads/" });

// Single unified endpoint
router.post('/fileupload/fileuploadapi', upload.array("files", 10), fileUploadController.handle);

module.exports = router;


//backuup
/*
const express = require('express');
const router = express.Router();
const opsController = require('../controllers/postOpDocsController');

const multer = require("multer");
const upload = multer({ dest: "uploads/" });

const path = 'postOpDocs';

router.post(`/${path}/getById`, opsController.getById);
router.post(`/${path}/getList`, opsController.getList);
router.post(`/${path}/create`, upload.single("file"), opsController.create);
router.post(`/${path}/update`, opsController.update);
router.post(`/${path}/delete`, opsController.delete);
router.get(`/${path}/download/:id`, opsController.download);

module.exports = router;
*/