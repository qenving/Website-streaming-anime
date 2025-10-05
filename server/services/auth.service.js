import bcrypt from "bcryptjs";
import { nanoid } from "nanoid";
import { getDb } from "../db/database.js";
import { AppError } from "../utils/errors.js";
import { signAccessToken, signRefreshToken, verifyRefreshToken } from "../utils/jwt.js";
import { hashPassword, verifyPassword } from "../utils/password.js";

const mapUser = (row) => {
  if (!row) return null;
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    role: row.role,
    isPremium: Boolean(row.is_premium),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
};

const storeRefreshToken = async (db, userId, token, expiresAt) => {
  const tokenHash = await bcrypt.hash(token, 10);
  db.prepare("DELETE FROM refresh_tokens WHERE user_id = ?").run(userId);
  db
    .prepare(
      `INSERT INTO refresh_tokens (id, user_id, token_hash, expires_at, created_at)
       VALUES (?, ?, ?, ?, ?)`
    )
    .run(nanoid(), userId, tokenHash, expiresAt, new Date().toISOString());
};

const removeRefreshToken = (db, userId) => {
  db.prepare("DELETE FROM refresh_tokens WHERE user_id = ?").run(userId);
};

export const registerUser = async ({ name, email, password }) => {
  const db = getDb();
  const normalizedEmail = email.toLowerCase();
  const existing = db.prepare("SELECT id FROM users WHERE email = ?").get(normalizedEmail);
  if (existing) {
    throw new AppError("Email already registered", 409);
  }

  const timestamp = new Date().toISOString();
  const id = nanoid();
  const passwordHash = await hashPassword(password);

  db
    .prepare(
      `INSERT INTO users (id, name, email, password_hash, role, is_premium, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
    )
    .run(id, name, normalizedEmail, passwordHash, "user", 0, timestamp, timestamp);

  const accessToken = signAccessToken({ sub: id, role: "user" });
  const refreshToken = signRefreshToken({ sub: id });
  const decodedRefresh = verifyRefreshToken(refreshToken);
  await storeRefreshToken(db, id, refreshToken, decodedRefresh.exp * 1000);

  return {
    user: mapUser({
      id,
      name,
      email: normalizedEmail,
      role: "user",
      is_premium: 0,
      created_at: timestamp,
      updated_at: timestamp,
    }),
    tokens: { accessToken, refreshToken },
  };
};

export const loginUser = async ({ email, password }) => {
  const db = getDb();
  const normalizedEmail = email.toLowerCase();
  const user = db.prepare("SELECT * FROM users WHERE email = ?").get(normalizedEmail);
  if (!user) {
    throw new AppError("Invalid credentials", 401);
  }
  const isValid = await verifyPassword(password, user.password_hash);
  if (!isValid) {
    throw new AppError("Invalid credentials", 401);
  }

  const accessToken = signAccessToken({ sub: user.id, role: user.role });
  const refreshToken = signRefreshToken({ sub: user.id });
  const decodedRefresh = verifyRefreshToken(refreshToken);
  await storeRefreshToken(db, user.id, refreshToken, decodedRefresh.exp * 1000);

  return {
    user: mapUser(user),
    tokens: { accessToken, refreshToken },
  };
};

export const refreshAuthTokens = async (refreshToken) => {
  if (!refreshToken) {
    throw new AppError("Refresh token missing", 401);
  }
  const decoded = verifyRefreshToken(refreshToken);
  const db = getDb();
  const record = db.prepare("SELECT * FROM refresh_tokens WHERE user_id = ?").get(decoded.sub);
  if (!record) {
    throw new AppError("Refresh token invalidated", 401);
  }
  const match = await bcrypt.compare(refreshToken, record.token_hash);
  if (!match) {
    throw new AppError("Refresh token invalidated", 401);
  }
  const user = db.prepare("SELECT * FROM users WHERE id = ?").get(decoded.sub);
  if (!user) {
    throw new AppError("User no longer exists", 401);
  }
  const accessToken = signAccessToken({ sub: user.id, role: user.role });
  const newRefreshToken = signRefreshToken({ sub: user.id });
  const refreshDecoded = verifyRefreshToken(newRefreshToken);
  await storeRefreshToken(db, user.id, newRefreshToken, refreshDecoded.exp * 1000);

  return {
    user: mapUser(user),
    tokens: { accessToken, refreshToken: newRefreshToken },
  };
};

export const logoutUser = async (userId) => {
  const db = getDb();
  removeRefreshToken(db, userId);
};

export const getProfile = (userId) => {
  const db = getDb();
  const user = db.prepare("SELECT * FROM users WHERE id = ?").get(userId);
  if (!user) {
    throw new AppError("User not found", 404);
  }
  return mapUser(user);
};

export const upgradeUserPlan = (userId) => {
  const db = getDb();
  const timestamp = new Date().toISOString();
  const result = db
    .prepare("UPDATE users SET is_premium = 1, updated_at = ? WHERE id = ?")
    .run(timestamp, userId);
  if (result.changes === 0) {
    throw new AppError("User not found", 404);
  }
  const user = db.prepare("SELECT * FROM users WHERE id = ?").get(userId);
  return mapUser(user);
};
