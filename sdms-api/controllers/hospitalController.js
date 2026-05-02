const db = require('../services/shared/database');
const checkValidations = require('../validations/hospitalValidations');
const { getCommonFields } = require('../services/shared/commonFieldService');
const ResponseHandler = require('../utils/responseHandler');

const mapHospitalRow = (row) => ({
    ...row,
});

exports.getById = async (req, res) => {
    const commonFields = getCommonFields(req);
    const data = { ...req.body, id: req.params.id ?? req.body.id, ...commonFields };
    try {
        const hospitalId = data.id ? Number(data.id) : null;

        if (!hospitalId) {
            return ResponseHandler.error(res, 'id is required');
        }

        const result = await db.query(
            `SELECT *
             FROM sdms_db.hospitals
             WHERE id = $1
             LIMIT 1`,
            [hospitalId]
        );

        return ResponseHandler.success(res, mapHospitalRow(result.rows[0] || null));
    } catch (error) {
        return ResponseHandler.error(res, error.message);
    }
};

exports.getList = async (req, res) => {
    const commonFields = getCommonFields(req);
    const data = { ...req.body, ...commonFields };
    try {
        const result = await db.query(
            `SELECT *
             FROM sdms_db.hospitals
             ORDER BY created_at DESC, id DESC
             LIMIT COALESCE(NULLIF($1::text, '')::int, 1000)`,
            [data.limit || null]
        );

        return ResponseHandler.success(res, result.rows.map(mapHospitalRow));
    } catch (error) {
        return ResponseHandler.error(res, error.message);
    }
};

exports.create = async (req, res) => {
    const commonFields = getCommonFields(req);
    const data = { ...req.body, ...commonFields };
    try {
        const validationError = checkValidations.validateCreate(data);
        if (validationError) 
            return ResponseHandler.error(res, validationError.join(", "));

        const result = await db.query(
            `INSERT INTO sdms_db.hospitals (
                name,
                email,
                address_line_1,
                address_line_2,
                contact_number,
                alternative_contact_number,
                website,
                is_active,
                created_at,
                updated_at
             ) VALUES ($1, $2, $3, $4, $5, $6, $7, COALESCE($8::boolean, TRUE), NOW(), NOW())
             ON CONFLICT (name, contact_number)
             DO UPDATE SET
                email = EXCLUDED.email,
                address_line_1 = EXCLUDED.address_line_1,
                address_line_2 = EXCLUDED.address_line_2,
                alternative_contact_number = EXCLUDED.alternative_contact_number,
                website = EXCLUDED.website,
                is_active = EXCLUDED.is_active,
                updated_at = NOW()
             RETURNING *`,
            [
                data.name,
                data.email || null,
                data.address_line_1,
                data.address_line_2 || null,
                data.contact_number,
                data.alternative_contact_number || null,
                data.website || null,
                data.is_active,
            ]
        );

        return ResponseHandler.success(res, result.rows[0], 'Hospital created');
    } catch (error) {
        return ResponseHandler.error(res, error.message);
    }
};

exports.update = async (req, res) => {
    const commonFields = getCommonFields(req);
    const data = { ...req.body, ...commonFields };

    try {
        if (!data.id) {
            return ResponseHandler.error(res, 'id is required');
        }

        const result = await db.query(
            `UPDATE sdms_db.hospitals
             SET
                name = COALESCE(NULLIF($2, ''), name),
                email = COALESCE(NULLIF($3, ''), email),
                address_line_1 = COALESCE(NULLIF($4, ''), address_line_1),
                address_line_2 = COALESCE(NULLIF($5, ''), address_line_2),
                contact_number = COALESCE(NULLIF($6, ''), contact_number),
                alternative_contact_number = COALESCE(NULLIF($7, ''), alternative_contact_number),
                website = COALESCE(NULLIF($8, ''), website),
                is_active = COALESCE($9::boolean, is_active),
                updated_at = NOW()
             WHERE id = $1
             RETURNING *`,
            [
                data.id,
                data.name,
                data.email || null,
                data.address_line_1 || null,
                data.address_line_2 || null,
                data.contact_number || null,
                data.alternative_contact_number || null,
                data.website || null,
                data.is_active,
            ]
        );

        return ResponseHandler.success(res, result.rows[0] || null, 'Hospital updated');
    } catch (error) {
        return ResponseHandler.error(res, error.message);
    }
};

exports.delete = async (req, res) => {
    const commonFields = getCommonFields(req);
    const data = { ...req.body, ...commonFields };

    try {
        if (!data.id) {
            return ResponseHandler.error(res, 'id is required');
        }

        const result = await db.query(
            `DELETE FROM sdms_db.hospitals
             WHERE id = $1
             RETURNING *`,
            [data.id]
        );

        return ResponseHandler.success(res, result.rows[0] || null, 'Hospital deleted');
    } catch (error) {
        return ResponseHandler.error(res, error.message);
    }
};

exports.deactivate = async (req, res) => {
    const commonFields = getCommonFields(req);
    const data = { ...req.body, id: req.params.id, ...commonFields };
    try {
        if (!data.id) {
            return ResponseHandler.error(res, 'id is required');
        }

        const result = await db.query(
            `UPDATE sdms_db.hospitals
             SET is_active = FALSE,
                 updated_at = NOW()
             WHERE id = $1
             RETURNING *`,
            [data.id]
        );

        return ResponseHandler.success(res, result.rows[0] || null, 'Hospital deactivated');
    } catch (error) {
        return ResponseHandler.error(res, error.message);
    }
};
