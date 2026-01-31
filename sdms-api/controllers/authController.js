const bcrypt = require("bcrypt");
const {
  generateAccessToken,
  generateRefreshToken,
  verifyToken,
} = require("../services/tokenService");
const userModel = require("../models/userModel");
const {
  validateSignup,
  validateLogin,
} = require("../validations/userValidations");
const {
  encryptPassword,
  comparePassword,
  sendError,
  sendSuccess,
} = require("../utils/utilsFunctions");

exports.signup = async (req, res) => {
  try {
    const errors = validateSignup(req.body);
    if (errors) return sendError(res, errors.join(", "));

    const existingUser = await userModel.findUserByEmail(req.body.email);
    if (existingUser) return sendError(res, "Email already exists");

    const password_hash = await encryptPassword(req.body.password);
    const user_id = `USER${Date.now()}`;

    const user = await userModel.createUser({
      ...req.body,
      password_hash,
      user_id,
    });
    sendSuccess(res, "User created successfully", user, 201);
  } catch (err) {
    console.error(err);
    sendError(res, "Server error", null, 500);
  }
};

exports.login = async (req, res) => {
  try {
    const errors = validateLogin(req.body);
    if (errors) return sendError(res, errors.join(", "));

    const user = await userModel.findUserByEmail(req.body.email);
    if (!user) return sendError(res, "Invalid email or password");

    const match = await comparePassword(req.body.password, user.password_hash);
    if (!match) return sendError(res, "Invalid email or password");

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
    await userModel.saveRefreshToken(user.id, refreshToken, expiresAt);

    sendSuccess(res, "Login successful", {
      token: accessToken,
      user: {
        id: user.id,
        user_id: user.user_id,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        cell_phone_number: user.cell_phone_number,
        country: user.country,
      },
    });
  } catch (err) {
    console.error(err);
    sendError(res, "Server error", null, 500);
  }
};

exports.refreshToken = async (req, res) => {
  try {
    const { token } = req.body;
    if (!token) return sendError(res, "Refresh token is required");

    const savedToken = await userModel.findRefreshToken(token);
    if (!savedToken) return sendError(res, "Invalid refresh token", null, 401);

    const user = await userModel.findUserById(savedToken.user_id); // ✅ use user_id, not user_email
    if (!user) return sendError(res, "User not found", null, 404);

    const newAccessToken = generateAccessToken(user);
    sendSuccess(res, "Access token refreshed", { accessToken: newAccessToken });
  } catch (err) {
    console.error(err);
    sendError(res, "Server error", null, 500);
  }
};

exports.changePassword = async (req, res) => {
  try {
    // const userId = req.user.id;
    const { email, old_password, new_password } = req.body;

    if (!old_password || !new_password)
      return sendError(res, "old Password and new Password required");

    const new_password_hash = await encryptPassword(new_password);

    const user = await userModel.findUserByEmail(email);

    if (!user) return sendError(res, "user not found");

    const ok = await comparePassword(old_password, user.password_hash);

    if (!ok) return sendError(res, "old password incorrect");

    if (new_password.length < 6)
      return sendError(res, "password length must be >= 6");

    await userModel.updateUserPassword(email, new_password_hash);
    sendSuccess(res, "password updated");
  } catch (err) {
    console.error(err);
    sendError(res, "server error");
  }
};

exports.logout = async (req, res) => {
  try {
    // 1. Get access token from header
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    if (!token) return sendError(res, "Access token is required");

    // 2. Verify access token
    let decoded;
    try {
      decoded = verifyToken(token, process.env.ACCESS_TOKEN_SECRET);
    } catch (err) {
      return sendError(res, "Invalid or expired access token");
    }

    // 3. Delete ALL refresh tokens for this user
    await userModel.deleteRefreshTokensByUserId(decoded.userId);

    sendSuccess(res, "Logged out from all devices successfully");
  } catch (err) {
    console.error(err);
    sendError(res, "Server error", null, 500);
  }
};