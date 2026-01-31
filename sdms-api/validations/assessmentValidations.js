// patAssessmentValidator.js

exports.validateCreate = (data) => {
    const errors = [];

    // Master Table Required Fields
    if (!data.intake_id) errors.push('intake_id is required');
    if (!data.assess_id) errors.push('assess_id is required');
    if (!data.patient_id) errors.push('patient_id is required');
    if (!data.expert_id) errors.push('expert_id is required');
    if (!data.asses_status || !['pn', 'ip', 'co', 'ca'].includes(data.asses_status))
        errors.push('asses_status must be one of: pn, ip, co, ca');
    if (!data.asses_category) errors.push('asses_category is required');

    // Optional validations
    if (data.summary && typeof data.summary !== 'string') errors.push('summary must be a string');
    if (data.recommendations && typeof data.recommendations !== 'string') errors.push('recommendations must be a string');

    // Detail Rows
    if (!Array.isArray(data.assessment_details) || data.assessment_details.length === 0) {
        errors.push('At least one assessment detail is required');
    } else {
        data.assessment_details.forEach((item, index) => {
            if (!item.assesment_type_id) errors.push(`Detail row ${index + 1}: assesment_type_id is required`);
            if (!item.q_id) errors.push(`Detail row ${index + 1}: q_id is required`);
        });
    }

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
