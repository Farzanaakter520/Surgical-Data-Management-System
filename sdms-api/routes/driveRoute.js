const router = require("express").Router();
const multer = require("multer");
const path = require("path");
const driveCtrl = require("../controllers/driveController");

// ✅ Multer config: allow image + video + PDF
const upload = multer({
  dest: path.join(__dirname, "..", "uploads"),
  limits: { fileSize: 1024 * 1024 * 1024 }, // 1 GB max
  fileFilter: (req, file, cb) => {
    const allowedExt = /mp4|mov|avi|mkv|pdf|jpg|jpeg|png|gif/;
    const allowedMime = [
      "application/pdf",
      "video/mp4",
      "video/quicktime",   // mov
      "video/x-msvideo",   // avi
      "video/x-matroska",  // mkv
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/gif",
    ];

    const extname = allowedExt.test(path.extname(file.originalname).toLowerCase());
    const mimetype =
      allowedMime.includes(file.mimetype) || file.mimetype.startsWith("image/");

    console.log("📂 Uploading file:", file.originalname, "| MIME:", file.mimetype);

    if (extname && mimetype) return cb(null, true);
    cb(new Error("Only video, PDF, and image files are allowed"));
  },
});

const routepath = "fileupload/fileuploadapi";

// ✅ Routes
router.post(`/${routepath}/upload`, upload.array("files"), driveCtrl.uploadMultiple);
router.post(`/${routepath}/download`, driveCtrl.downloadSingleFile);
router.post(`/${routepath}/preview`, driveCtrl.previewFile);

module.exports = router;
