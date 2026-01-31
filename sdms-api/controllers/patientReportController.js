// const DBCRUDService = require('../services/DBCRUDService');
// const ResponseHandler = require('../utils/responseHandler');
// const PDFDocument = require('pdfkit');

// // DBCRUDService instance for proc_patient_data
// const patientService = new DBCRUDService('sdms_db', 'proc_patient_data');

// exports.getPatientReport = async (req, res) => {
//     const { patient_id, action_mode } = req.body;

//     try {
//         if (!patient_id && !action_mode) {
//             if (!patient_id) {
//                 return ResponseHandler.error(res, "patient_id is required");
//             }
//         }

//         // Fetch patient data from DB
//         const patientResult = await patientService.getList(req.body);

//         if (!patientResult || !patientResult.data) {
//             return ResponseHandler.error(res, "No data found for this patient_id");
//         }

//         res.json(patientResult);

//     } catch (error) {
//         return ResponseHandler.error(res, error.message);
//     }
// };

// exports.generateDischargeSummary = async (req, res) => {
//     const { patient_id } = req.body;

//     try {
//         if (!patient_id) {
//             return ResponseHandler.error(res, "patient_id is required");
//         }

//         // Fetch patient + admission data
//         const patientResult = await patientService.getById({ patient_id });

//         if (!patientResult || !patientResult.data) {
//             return ResponseHandler.error(res, "No data found for this patient_id");
//         }

//         const patientData = patientResult.data;
//         const patientInfo = patientData.patient_info;
//         const admission = patientData.admission;

//         // PDF creation
//         const doc = new PDFDocument();
//         const filename = `discharge-summary-${admission.admission_id}.pdf`;

//         res.setHeader('Content-disposition', `attachment; filename="${filename}"`);
//         res.setHeader('Content-type', 'application/pdf');

//         doc.pipe(res);

//         doc.fontSize(20).text("Discharge Summary", { align: 'center' });
//         doc.moveDown();

//         doc.fontSize(12).text(`Patient Name: ${patientInfo.name}`);
//         doc.text(`Age: ${patientInfo.age}`);
//         doc.text(`Gender: ${patientInfo.gender}`);
//         doc.text(`Mobile Number: ${patientInfo.mobile_number}`);
//         doc.text(`Admission ID: ${admission.admission_id}`);
//         doc.text(`Admission Date: ${admission.admission_date}`);
//         doc.text(`Discharge Date: ${admission.discharge_date}`);
//         doc.text(`Hospital: ${admission.hospital.name}`);
//         doc.text(`Status: ${admission.status}`);
//         doc.moveDown();

//         // Optional: Surgery details
//         if (patientData.surgery && patientData.surgery.length > 0) {
//             doc.fontSize(14).text("Surgeries:", { underline: true });
//             patientData.surgery.forEach((s) => {
//                 doc.fontSize(12).text(`- Operation ID: ${s.operation_id}, Date: ${s.operation_date}, Surgeon: ${s.surgeon}`);
//             });
//             doc.moveDown();
//         }

//         // Optional: Investigations
//         if (patientData.investigations && patientData.investigations.length > 0) {
//             doc.fontSize(14).text("Investigations:", { underline: true });
//             patientData.investigations.forEach((i) => {
//                 doc.fontSize(12).text(`- ${i.investigation_name} (${i.investigation_date}): ${i.investigation_report_result}`);
//             });
//             doc.moveDown();
//         }

//         doc.end();

//     } catch (error) {
//         return ResponseHandler.error(res, error.message);
//     }
// };

const DBCRUDService = require('../services/DBCRUDService');
const ResponseHandler = require('../utils/responseHandler');
const PDFDocument = require('pdfkit');

// DBCRUDService instance for proc_patient_data
const patientService = new DBCRUDService('sdms_db', 'proc_patient_data');

exports.getPatientReport = async (req, res) => {
    try {
        const { patient_id } = req.body;

        // ❌ Removed required validation for patient_id

        const params = {
            action_mode: 'patient_report',
            patient_id: patient_id || null
        };

        console.log("🟢 Sending params to DB:", params);

        const patientResult = await patientService.getList(params);

        console.log("🟢 DB Response:", patientResult);

        // ❌ Removed: no data error
        const patientData = patientResult?.data || {};

        // Create PDF
        const doc = new PDFDocument({ margin: 50 });
        const filename = `patient-report-${patient_id || 'unknown'}.pdf`;

        res.setHeader('Content-Disposition', `inline; filename="${filename}"`);
        res.setHeader('Content-Type', 'application/pdf');
        doc.pipe(res);

        doc.fontSize(20).text("Patient Report", { align: 'center', underline: true });
        doc.moveDown();

        doc.fontSize(12).text(`Patient ID: ${patientData['Patient ID'] || ''}`);
        doc.text(`Admission ID: ${patientData['Admission_id'] || ''}`);
        doc.text(`Name: ${patientData['Name'] || ''}`);
        doc.text(`Age: ${patientData['Age'] || ''}`);
        doc.text(`Gender: ${patientData['Gender'] || ''}`);
        doc.text(`Marital Status: ${patientData['Marital Status'] || ''}`);
        doc.text(`Occupation: ${patientData['Occupation'] || ''}`);
        doc.text(`Mobile No: ${patientData['Mobile No'] || ''}`);
        doc.text(`Address: ${patientData['Address Line'] || ''}`);
        doc.text(`Date Of Admission: ${patientData['Date Of Admission'] || ''}`);
        doc.text(`Date of Operation: ${patientData['Date of operation'] || ''}`);
        doc.text(`Date of Discharge: ${patientData['Date of Discharge'] || ''}`);
        doc.text(`Pre-op Diagnosis: ${patientData['Pre-op Diagnosis'] || ''}`);
        doc.text(`Proposed OT: ${patientData['Proposed OT'] || ''}`);
        doc.text(`Pre-op Investigations: ${patientData['Pre-op investigations'] || ''}`);
        doc.text(`Co-morbidities: ${patientData['Co-morbidities'] || ''}`);
        doc.text(`Post-operative recovery: ${patientData['Post-operative recovery'] || ''}`);
        doc.text(`Advice on discharge: ${patientData['Advice on discharge'] || ''}`);
        doc.text(`Outcome: ${patientData['Outcome'] || ''}`);
        doc.moveDown();

        doc.end();

    } catch (error) {
        console.error("❌ Error generating PDF:", error);
        return ResponseHandler.error(res, error.message);
    }
};




exports.generateDischargeSummary = async (req, res) => {
    const { patient_id } = req.body;

    try {
        // ❌ Removed required validation for patient_id

        const patientResult = await patientService.getById({ patient_id });

        // ❌ Removed: no data required check
        const patientData = patientResult?.data || {};

        const patientInfo = patientData.patient_info || {};
        const admission = patientData.admission || {};

        const doc = new PDFDocument();
        const filename = `discharge-summary-${admission.admission_id || 'unknown'}.pdf`;

        res.setHeader('Content-disposition', `attachment; filename="${filename}"`);
        res.setHeader('Content-type', 'application/pdf');

        doc.pipe(res);

        doc.fontSize(20).text("Discharge Summary", { align: 'center' });
        doc.moveDown();

        doc.fontSize(12).text(`Patient Name: ${patientInfo.name || ''}`);
        doc.text(`Age: ${patientInfo.age || ''}`);
        doc.text(`Gender: ${patientInfo.gender || ''}`);
        doc.text(`Mobile Number: ${patientInfo.mobile_number || ''}`);
        doc.text(`Admission ID: ${admission.admission_id || ''}`);
        doc.text(`Admission Date: ${admission.admission_date || ''}`);
        doc.text(`Discharge Date: ${admission.discharge_date || ''}`);
        doc.text(`Hospital: ${(admission.hospital && admission.hospital.name) || ''}`);
        doc.text(`Status: ${admission.status || ''}`);
        doc.moveDown();

        if (patientData.surgery && patientData.surgery.length > 0) {
            doc.fontSize(14).text("Surgeries:", { underline: true });
            patientData.surgery.forEach((s) => {
                doc.fontSize(12).text(`- Operation ID: ${s.operation_id || ''}, Date: ${s.operation_date || ''}, Surgeon: ${s.surgeon || ''}`);
            });
            doc.moveDown();
        }

        if (patientData.investigations && patientData.investigations.length > 0) {
            doc.fontSize(14).text("Investigations:", { underline: true });
            patientData.investigations.forEach((i) => {
                doc.fontSize(12).text(`- ${i.investigation_name || ''} (${i.investigation_date || ''}): ${i.investigation_report_result || ''}`);
            });
            doc.moveDown();
        }

        doc.end();

    } catch (error) {
        return ResponseHandler.error(res, error.message);
    }
};
