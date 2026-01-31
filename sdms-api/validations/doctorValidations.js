// // doctorValidations.js

// exports.validateCreate = (data) => {
//     const errors = [];

//     // Doctors Required Fields
//     if (!data.name) errors.push('name is required');
//     if (!data.email) errors.push('email is required');
//     if (!data.address_line_1) errors.push('address_line_1 is required');
//     if (!data.contact_number) errors.push('contact_number is required');

//     return errors.length > 0 ? errors : null;
// };

// exports.validateUpdate = (data) => {
//     const errors = [];
//     if (!data.id) errors.push('id is required for update');
//     return errors.length > 0 ? errors : null;
// };

// exports.validateDelete = (data) => {
//     const errors = [];
//     if (!data.id) errors.push('id is required for deletion');
//     return errors.length > 0 ? errors : null;
// };

// exports.validateGetById = (data) => {
//     const errors = [];
//     if (!data.id) errors.push('id is required');
//     return errors.length > 0 ? errors : null;
// };
exports.validateCreate = (data = {}) => {
    const errors = [];
    const mode = (data.action_mode || "").toLowerCase();

    if (!mode) {
        errors.push("action_mode is required");
        return errors;
    }

    if (mode === "insert" || mode === "create") {
        const requiredFields = ["name", "specialization", "hospital_id"];
        requiredFields.forEach((field) => {
            if (!data[field]) errors.push(`${field} is required`);
        });
    } 
    else if (mode === "update") {
        if (!data.id) errors.push("id is required for update");
    } 
    else if (mode === "delete") {
        if (!data.id) errors.push("id is required for deletion");
    } 
    else if (mode === "getbyid") {
        if (!data.id) errors.push("id is required");
    }
    else {
        errors.push(`Unknown action_mode: ${mode}`);
    }

    return errors.length > 0 ? errors : null;
};
