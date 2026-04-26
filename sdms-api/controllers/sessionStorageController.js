const { randomUUID } = require('crypto');
const db = require('../services/shared/database');
const checkValidations = require('../validations/referral_Validations');
const { getCommonFields } = require('../services/shared/commonFieldService');
const ResponseHandler = require('../utils/responseHandler');

const tableName = 'sdms_db.sessions';

const mapRow = (row) => ({
    ...row,
    data: row?.data ?? {},
});

const normalizeTimestamp = (value) => {
    if (value === undefined || value === null || value === '') return null;

    if (typeof value === 'number' && Number.isFinite(value)) {
        return new Date(value).toISOString();
    }

    if (typeof value === 'string') {
        const trimmed = value.trim();
        if (!trimmed) return null;

        if (/^\d+$/.test(trimmed)) {
            return new Date(Number(trimmed)).toISOString();
        }

        const asDate = new Date(trimmed);
        if (!Number.isNaN(asDate.getTime())) {
            return asDate.toISOString();
        }
    }

    return null;
};

exports.getById = async (req, res) => {
    const commonFields = getCommonFields(req);
    const data = { id: req.params.id, ...req.body, ...commonFields };
    try {
        const sessionId = data.session_id || data.id || null;
        const id = data.id ? Number(data.id) : null;

        const result = await db.query(
          `SELECT * FROM ${tableName}
           WHERE ($1::bigint IS NOT NULL AND id = $1::bigint)
              OR ($2::uuid IS NOT NULL AND session_id = $2::uuid)
           ORDER BY created_at DESC
           LIMIT 1`,
          [id, sessionId]
        );

        return ResponseHandler.success(res, mapRow(result.rows[0] || null));
    } catch (error) {
        return ResponseHandler.error(res, error.message);
    }
};

exports.getList = async (req, res) => {
    const commonFields = getCommonFields(req);
    const data = { ...req.body, ...commonFields };
    try {
        const result = await db.query(
          `SELECT * FROM ${tableName}
           ORDER BY created_at DESC
           LIMIT COALESCE(NULLIF($1::text, '')::int, 1000)`,
          [data.limit || null]
        );

        return ResponseHandler.success(res, result.rows.map(mapRow));
    } catch (error) {
        return ResponseHandler.error(res, error.message);
    }
};

exports.create = async (req, res) => {
    const commonFields = getCommonFields(req);
    const data = { ...req.body, ...commonFields };
    try {
                const sessionId = data.session_id || randomUUID();
                const expiresAt = normalizeTimestamp(data.expires_at) || new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
                const insertDate = normalizeTimestamp(data.insert_date) || new Date().toISOString();

                const result = await db.query(
                    `INSERT INTO ${tableName} (
                            session_id,
                            token,
                            data,
                            expires_at,
                            is_active,
                            device_id,
                            loc_id,
                            insert_by,
                            insert_date,
                            created_at,
                            updated_at
                        ) VALUES ($1,$2,$3::jsonb,$4::timestamptz,COALESCE($5::boolean, TRUE),$6,$7,$8,$9::timestamptz,NOW(),NOW())
                        ON CONFLICT (session_id)
                        DO UPDATE SET
                            token = EXCLUDED.token,
                            data = EXCLUDED.data,
                            expires_at = EXCLUDED.expires_at,
                            is_active = EXCLUDED.is_active,
                            device_id = EXCLUDED.device_id,
                            loc_id = EXCLUDED.loc_id,
                            insert_by = EXCLUDED.insert_by,
                            insert_date = EXCLUDED.insert_date,
                            updated_at = NOW()
                        RETURNING *`,
                    [
                        sessionId,
                        data.token || null,
                        JSON.stringify(data.data || {}),
                        expiresAt,
                        data.is_active,
                        data.device_id || null,
                        data.loc_id || 'loc',
                        data.insert_by || 'system',
                        insertDate,
                    ]
                );

                return ResponseHandler.success(res, mapRow(result.rows[0]), 'Session created');
    } catch (error) {
        return ResponseHandler.error(res, error.message);
    }
};

exports.update = async (req, res) => {
    const commonFields = getCommonFields(req);
    const data = { id: req.params.id, ...req.body, ...commonFields };
    try {
                const sessionId = data.session_id || null;
                const id = data.id ? Number(data.id) : null;
                const expiresAt = normalizeTimestamp(data.expires_at);

                const result = await db.query(
                    `UPDATE ${tableName}
                     SET token = COALESCE($3, token),
                             data = COALESCE($4::jsonb, data),
                             expires_at = COALESCE($5::timestamptz, expires_at),
                             is_active = COALESCE($6::boolean, is_active),
                             device_id = COALESCE($7, device_id),
                             loc_id = COALESCE($8, loc_id),
                             updated_at = NOW()
                     WHERE ($1::bigint IS NOT NULL AND id = $1::bigint)
                            OR ($2::uuid IS NOT NULL AND session_id = $2::uuid)
                     RETURNING *`,
                    [
                        id,
                        sessionId,
                        data.token || null,
                        data.data ? JSON.stringify(data.data) : null,
                        expiresAt,
                        data.is_active,
                        data.device_id || null,
                        data.loc_id || null,
                    ]
                );

                return ResponseHandler.success(res, mapRow(result.rows[0] || null), 'Session updated');
    } catch (error) {
        return ResponseHandler.error(res, error.message);
    }
};

exports.delete = async (req, res) => {
    const commonFields = getCommonFields(req);
    const data = { id: req.params.id, ...req.body, ...commonFields };
    try {
        const sessionId = data.session_id || null;
        const id = data.id ? Number(data.id) : null;

        const result = await db.query(
          `DELETE FROM ${tableName}
           WHERE ($1::bigint IS NOT NULL AND id = $1::bigint)
              OR ($2::uuid IS NOT NULL AND session_id = $2::uuid)
           RETURNING *`,
          [id, sessionId]
        );

        return ResponseHandler.success(res, mapRow(result.rows[0] || null), 'Session deleted');
    } catch (error) {
        return ResponseHandler.error(res, error.message);
    }
};

// exports.deactivate = async (req, res) => {
//     const commonFields = getCommonFields(req);
//     const data = { id: req.params.id, ...req.body, ...commonFields };
//     try {
//         const result = await sessionStorageService.deactivate(data);
//         res.json(result);
//     } catch (error) {
//         return ResponseHandler.error(res, error.message);
//     }
// };
