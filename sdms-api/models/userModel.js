const db = require('../services/shared/database');

const createUser = async (user) => {
  const result = await db.pool.query(
    `INSERT INTO iam.t_users (user_id, first_name, last_name, email, password_hash, cell_phone_number, country)
     VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *`,
    [user.user_id, user.first_name, user.last_name, user.email, user.password_hash, user.cell_phone_number, user.country]
  );
  return result.rows[0];
};

const findUserByEmail = async (email) => {
  const result = await db.pool.query(
    `SELECT * FROM iam.t_users WHERE email = $1`,
    [email]
  );
  return result.rows[0];
};

const saveRefreshToken = async (userId, token, expiresAt) => {
  const result = await db.pool.query(
    `INSERT INTO iam.t_refresh_tokens (user_id, token, expires_at) VALUES ($1,$2,$3) RETURNING *`,
    [userId, token, expiresAt]
  );
  return result.rows[0];
};

const findRefreshToken = async (token) => {
  const result = await db.pool.query(
    `SELECT * FROM iam.t_refresh_tokens WHERE token = $1`,
    [token]
  );
  return result.rows[0];
};

const deleteRefreshToken = async (token) => {
  await db.pool.query(
    `DELETE FROM iam.t_refresh_tokens WHERE token = $1`,
    [token]
  );
};
const findUserById = async (id) => {
  const result = await db.pool.query(
    `SELECT * FROM iam.t_users WHERE id = $1`,
    [id]
  );
  return result.rows[0];
};

const deleteRefreshTokensByUserId = async (userId) => {
  await db.pool.query(
    `DELETE FROM iam.t_refresh_tokens WHERE user_id = $1`,
    [userId]
  );
};
async function incrementTokenVersion(userId) {
  const result = await pool.query(
    `UPDATE users SET token_version = token_version + 1 WHERE id = $1 RETURNING token_version`,
    [userId]
  );
  return result.rows[0].token_version;
}

const updateUserPassword = async (email, newPassword) => {
  await db.pool.query(
    `UPDATE iam.t_users SET password_hash = $1 WHERE email = $2`,
    [newPassword, email]
  );
};

module.exports = {
  createUser,
  findUserByEmail,
  findUserById,
  saveRefreshToken,
  findRefreshToken,
  incrementTokenVersion,
  updateUserPassword,
  deleteRefreshToken,deleteRefreshTokensByUserId,findUserById
};