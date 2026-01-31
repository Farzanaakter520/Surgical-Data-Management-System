const { drive } = require("../utils/googleAuth");
const fs = require("fs");

// Create folder if not exists
async function getOrCreateFolder(folderName, parentId = "root") {
  const query = `'${parentId}' in parents and mimeType='application/vnd.google-apps.folder' and name='${folderName}' and trashed=false`;
  const res = await drive.files.list({ q: query, fields: "files(id, name)" });
  if (res.data.files.length > 0) return res.data.files[0].id;

  const folder = await drive.files.create({
    requestBody: { name: folderName, mimeType: "application/vnd.google-apps.folder", parents: [parentId] },
    fields: "id",
  });
  return folder.data.id;
}

// Upload file to personal drive
async function uploadToDrive(localPath, fileName, mimeType, folderName = null) {
  let folderId = folderName ? await getOrCreateFolder(folderName) : null;

  const fileMetadata = { name: fileName, parents: folderId ? [folderId] : undefined };
  const media = { mimeType, body: fs.createReadStream(localPath) };

  const { data } = await drive.files.create({ requestBody: fileMetadata, media, fields: "id, name, webViewLink" });

  try { fs.unlinkSync(localPath); } catch { }

  return data;
}

// Download file
async function downloadFromDrive(fileId, res) {
  const response = await drive.files.get({ fileId, alt: "media" }, { responseType: "stream" });
  return response.data.pipe(res);
}

module.exports = { uploadToDrive, downloadFromDrive };




//backup
// const drive = require("../utils/googleAuth");
// const fs = require("fs");

// /**
//  * Get or create a folder in Google Drive
//  * @param {string} folderName
//  * @param {string|null} parentId
//  * @returns {string} folderId
//  */
// async function getOrCreateFolder(folderName, parentId = null) {
//   // Check if folder exists
//   const query = `'${
//     parentId || "root"
//   }' in parents and mimeType='application/vnd.google-apps.folder' and name='${folderName}' and trashed=false`;
//   const res = await drive.files.list({
//     q: query,
//     fields: "files(id, name)",
//     spaces: "drive",
//   });

//   if (res.data.files.length > 0) {
//     // Folder exists
//     return res.data.files[0].id;
//   }

//   // Folder doesn’t exist → create it
//   const fileMetadata = {
//     name: folderName,
//     mimeType: "application/vnd.google-apps.folder",
//     parents: parentId ? [parentId] : undefined,
//   };

//   const folder = await drive.files.create({
//     requestBody: fileMetadata,
//     fields: "id",
//   });

//   return folder.data.id;
// }

// /**
//  * Upload file to Google Drive, optionally inside a named folder
//  * @param {string} localPath - temp file path
//  * @param {string} fileName - file name to save in Drive
//  * @param {string} mimeType - file mime type
//  * @param {string|null} folderName - folder name in Drive
//  * @returns {object} uploaded file info
//  */
// async function uploadToDrive(localPath, fileName, mimeType, folderName = null) {
//   let folderId = null;
//   if (folderName) {
//     folderId = await getOrCreateFolder(folderName); // automatically create folder if missing
//   }

//   const fileMetadata = {
//     name: fileName,
//     parents: folderId ? [folderId] : undefined,
//   };

//   const media = {
//     mimeType,
//     body: fs.createReadStream(localPath),
//   };

//   try {
//     const { data } = await drive.files.create({
//       requestBody: fileMetadata,
//       media,
//       fields: "id, name, webViewLink, webContentLink",
//     });

//     return data;
//   } finally {
//     // delete temp file
//     try {
//       fs.unlinkSync(localPath);
//     } catch {}
//   }
// }

// module.exports = { uploadToDrive, getOrCreateFolder };
// */
