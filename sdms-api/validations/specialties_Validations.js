// patAssessmentValidator.js

exports.validateCreate = (data) => {
    const errors = [];

    // Specialties Required Fields
if (!data.name) errors.push('name is required');

    return errors.length > 0 ? errors : null;
};

exports.validateUpdate = (data) => {
    const errors = [];
    if (!data.assess_id) errors.push('assess_id is required for update');
    return errors.length > 0 ? errors : null;
};

exports.validateDelete = (data) => {
    const errors = [];
    if (!data.assess_id) errors.push('assess_id is required for deletion');
    return errors.length > 0 ? errors : null;
};

exports.validateGetById = (data) => {
    const errors = [];
    if (!data.assess_id) errors.push('assess_id is required');
    return errors.length > 0 ? errors : null;
};
