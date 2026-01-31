const { uploadToDrive, downloadFromDrive } = require("../services/driveService");
const DBCRUDService = require("../services/DBCRUDService");
const { google } = require("googleapis");

// Initialize PostOpDocs DB service
const opsService = new DBCRUDService("sdms_db", "proc_post_op_docs_crud");

exports.uploadMultiple = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: "No files uploaded" });
    }

    const folderName = "PATIENT"; 
    const results = [];

    for (const file of req.files) {
      // 1️⃣ Upload to Drive
      const fileData = await uploadToDrive(
        file.path,
        file.originalname,
        file.mimetype,
        folderName
      );

      // 2️⃣ Prepare DB data
      const singleData = {
        ...req.body,
        drive_file_id: fileData.id,
        file_name: fileData.name,
        file_type: file.mimetype.split("/")[1],
        action_mode: 'insert'
      };

      // 3️⃣ Insert into DB
      const dbResult = await opsService.create(singleData);

      results.push({
        fileId: fileData.id,
        name: fileData.name,
        webViewLink: fileData.webViewLink,
        dbInsert: dbResult, // DB insert result
      });
    }

    return res.json({
      success: true,
      message: `${results.length} files uploaded & saved to DB successfully`,
      data: results,
    });

  } catch (err) {
    console.error("Drive upload or DB insert error:", err?.message || err);
    return res.status(500).json({ error: "Upload failed", details: err.message });
  }
};

// Existing download function
exports.downloadSingleFile = async (req, res) => {
  try {
    const { drive_file_id, file_name } = req.body;
    if (!drive_file_id || !file_name) {
      return res.status(400).json({ success: false, msg: "File ID and name required" });
    }

    res.setHeader("Content-Disposition", `attachment; filename="${file_name}"`);
    await downloadFromDrive(drive_file_id, res);
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, msg: "Download failed" });
  }
};

// ✅ New preview function
exports.previewFile = async (req, res) => {
  try {
    const { drive_file_id } = req.body;
    if (!drive_file_id) {
      return res.status(400).json({ success: false, msg: "File ID required" });
    }

    // Optional: set Content-Type based on file type if known
    res.setHeader("Content-Disposition", `inline; filename="preview_file"`);
    await downloadFromDrive(drive_file_id, res); // stream directly to browser
  } catch (err) {
    console.error("Preview failed:", err);
    res.status(500).json({ success: false, msg: "Preview failed" });
  }
};










// const { uploadToDrive } = require("../services/driveService");
// const DBCRUDService = require("../services/DBCRUDService");
// const { downloadFromDrive } = require("../services/driveService");
// const { google } = require("googleapis");



// // Initialize PostOpDocs DB service
// const opsService = new DBCRUDService("sdms_db", "proc_post_op_docs_crud");

// exports.uploadMultiple = async (req, res) => {
//   try {
//     if (!req.files || req.files.length === 0) {
//       return res.status(400).json({ error: "No files uploaded" });
//     }

//     const folderName = "PATIENT"; 
//     const results = [];

//     for (const file of req.files) {
//       // 1️⃣ Upload to Drive
//       const fileData = await uploadToDrive(
//         file.path,
//         file.originalname,
//         file.mimetype,
//         folderName
//       );

//       // 2️⃣ Prepare DB data
//       const singleData = {
//         ...req.body,
//         drive_file_id: fileData.id,
//         file_name: fileData.name,
//         file_type: file.mimetype.split("/")[1],
//         action_mode: 'insert'
//       };

//       // 3️⃣ Insert into DB
//       const dbResult = await opsService.create(singleData);

//       results.push({
//         fileId: fileData.id,
//         name: fileData.name,
//         webViewLink: fileData.webViewLink,
//         dbInsert: dbResult, // DB insert result
//       });
//     }

//     return res.json({
//       success: true,
//       message: `${results.length} files uploaded & saved to DB successfully`,
//       data: results,
//     });

//   } catch (err) {
//     console.error("Drive upload or DB insert error:", err?.message || err);
//     return res.status(500).json({ error: "Upload failed", details: err.message });
//   }
// };

// exports.downloadSingleFile = async (req, res) => {
//   try {
//     const { drive_file_id, file_name } = req.body;
//     if (!drive_file_id || !file_name) {
//       return res.status(400).json({ success: false, msg: "File ID and name required" });
//     }

//     res.setHeader("Content-Disposition", `attachment; filename="${file_name}"`);
//     await downloadFromDrive(drive_file_id, res);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ success: false, msg: "Download failed" });
//   }
// };