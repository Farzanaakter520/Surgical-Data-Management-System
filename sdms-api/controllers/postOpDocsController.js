// controllers/postOpDocsController.js

const DBCRUDService = require("../services/DBCRUDService");
const { uploadToDrive, downloadFromDrive } = require("../services/driveService");
const checkValidations = require("../validations/postOpDocsValidations");
const { getCommonFields } = require("../services/shared/commonFieldService");
const ResponseHandler = require("../utils/responseHandler");

// Initialize service for PostgreSQL procedure
const opsService = new DBCRUDService("sdms_db", "proc_post_op_docs_crud");

exports.handle = async (req, res) => {
    // Merge body + common fields
    const data = { ...req.body, ...getCommonFields(req) };

    // Normalize action_mode
    let action = (data.action_mode || '').trim().toLowerCase();
    if (!action) return ResponseHandler.error(res, "action_mode is required");

    // Map controller-friendly actions to procedure-friendly actions
    const actionMap = {
        upload: 'insert',          // Upload → insert in procedure
        update: 'update',
        delete: 'delete',
        getbyid: 'getById',
        getlist: 'getList',
        'download-all': 'getList',
        'download-single': 'getById'
    };

    const procAction = actionMap[action];
    if (!procAction) {
        console.log("Received action_mode from client:", data.action_mode); // Debug
        return ResponseHandler.error(res, `Invalid action_mode: ${data.action_mode}`);
    }

    try {
        switch (action) {

            // ===================== UPLOAD (Multiple Files) =====================
            case 'upload':
                const validationError = checkValidations.validateCreate(data);
                if (validationError) return ResponseHandler.error(res, validationError);

                // Ensure multiple files are sent
                if (!req.files || req.files.length === 0)
                    return ResponseHandler.error(res, "At least one file is required");

                const uploadedFiles = [];
                for (const file of req.files) {
                    const fileData = await uploadToDrive(
                        file.path,
                        file.originalname,
                        file.mimetype,
                        "PostOpDocs"
                    );

                    const singleData = {
                        ...data,
                        drive_file_id: fileData.id,
                        file_name: fileData.name,
                        file_type: file.mimetype.split("/")[1],
                        action_mode: 'insert'
                    };

                    const result = await opsService.create(singleData);
                    uploadedFiles.push(result);
                }

                return res.json({
                    success: true,
                    message: `${uploadedFiles.length} files uploaded successfully`,
                    results: uploadedFiles
                });


            // ===================== DOWNLOAD ALL =====================
            case 'download-all':
                if (!data.patient_id || !data.admission_id)
                    return ResponseHandler.error(res, "patient_id and admission_id are required");

                data.action_mode = procAction;
                const resultAll = await opsService.getList({
                    patient_id: data.patient_id,
                    admission_id: data.admission_id
                });
                return res.json(resultAll);



            // ===================== DOWNLOAD SINGLE =====================
            case 'download-single':
                if (!data.patient_id || !data.admission_id || !data.file_id)
                    return ResponseHandler.error(res, "patient_id, admission_id and file_id are required");

                data.action_mode = procAction;
                const doc = await opsService.getById({ id: data.file_id });

                if (!doc.data || !doc.data.drive_file_id)
                    return ResponseHandler.error(res, "File not found");

                res.setHeader("Content-Disposition", `attachment; filename="${doc.data.file_name}"`);
                return await downloadFromDrive(doc.data.drive_file_id, res);

            // ===================== DELETE =====================
            case 'delete':
                if (!data.patient_id || !data.admission_id || !data.file_id)
                    return ResponseHandler.error(res, "patient_id, admission_id and file_id are required");

                data.action_mode = procAction;
                const resultDelete = await opsService.delete({ id: data.file_id });
                return res.json(resultDelete);

            // ===================== GET BY ID =====================
            case 'getbyid':
                if (!data.patient_id || !data.admission_id || !data.file_id)
                    return ResponseHandler.error(res, "patient_id, admission_id and file_id are required");

                data.action_mode = procAction;
                const resultGetById = await opsService.getById({ id: data.file_id });
                return res.json(resultGetById);

            // ===================== GET LIST =====================
            case 'getlist':
                data.action_mode = procAction;
                const resultList = await opsService.getList({});
                return res.json(resultList);

            // ===================== UPDATE =====================
            case 'update':
                if (!data.patient_id || !data.admission_id || !data.file_id)
                    return ResponseHandler.error(res, "patient_id, admission_id and file_id are required");

                data.action_mode = procAction;
                const resultUpdate = await opsService.update({ id: data.file_id, ...data });
                return res.json(resultUpdate);

            // ===================== DEFAULT =====================
            default:
                return ResponseHandler.error(res, "Invalid action_mode");
        }

    } catch (err) {
        // Catch procedure errors or file upload errors
        ResponseHandler.error(res, err.message);
    }
};





//backup
/*
const DBCRUDService = require("../services/DBCRUDService");
const { uploadToDrive, downloadFromDrive } = require("../services/driveService");
const checkValidations = require("../validations/postOpDocsValidations");
const { getCommonFields } = require("../services/shared/commonFieldService");
const ResponseHandler = require("../utils/responseHandler");
const multer = require("multer");
const upload = multer({ dest: "uploads/" });

const opsService = new DBCRUDService("sdms_db", "proc_post_op_docs_crud");

// GET by ID
exports.getById = async (req, res) => {
    const data = { ...req.body, ...getCommonFields(req) };
    try { res.json(await opsService.getById(data)); } catch (err)
     { ResponseHandler.error(res, err.message); }
};

// GET list
exports.getList = async (req, res) => {
    const data = { ...req.body, ...getCommonFields(req) };
    try { res.json(await opsService.getList(data)); } catch (err) { ResponseHandler.error(res, err.message); }
};




// CREATE with file upload
exports.create = async (req, res) => {
    const data = { ...req.body, ...getCommonFields(req) };
    try {
        const validationError = checkValidations.validateCreate(data);
        if (validationError) return ResponseHandler.error(res, validationError);
        if (!req.file) return ResponseHandler.error(res, "File is required");

        const fileData = await uploadToDrive(req.file.path, req.file.originalname, req.file.mimetype, "PostOpDocs");

        data.drive_file_id = fileData.id;
        data.file_name = fileData.name;
        data.file_type = req.file.mimetype.split("/")[1];

        const result = await opsService.create(data);
        res.json(result);
    } catch (err) { ResponseHandler.error(res, err.message); }
};

// UPDATE
exports.update = async (req, res) => {
    const data = { id: req.params.id, ...req.body, ...getCommonFields(req) };
    try {
        const validationError = checkValidations.validateUpdate(data);
        if (validationError) return ResponseHandler.error(res, validationError);
        res.json(await opsService.update(data));
    } catch (err) { ResponseHandler.error(res, err.message); }
};

// DELETE
exports.delete = async (req, res) => {
    const data = { ...req.body, ...getCommonFields(req) };
    try {
        const validationError = checkValidations.validateDelete(data);
        if (validationError) return ResponseHandler.error(res, validationError);
        res.json(await opsService.delete(data));
    } catch (err) {
        ResponseHandler.error(res, err.message);
    }
};

// DOWNLOAD
exports.download = async (req, res) => {
    try {
        const doc = await opsService.getById({ id: req.params.id });
        if (!doc.data || !doc.data.drive_file_id)
            return ResponseHandler.error(res, "File not found in DB");

        res.setHeader(
            "Content-Disposition",
            `attachment; filename="${doc.data.file_name}"`
        );
        await downloadFromDrive(doc.data.drive_file_id, res);
    } catch (err) {
        ResponseHandler.error(res, err.message);
    }
};

*/