import { nanoid } from "nanoid";
import { getDb } from "../db/database.js";
import { AppError } from "../utils/errors.js";
import { signAccessToken, signRefreshToken, verifyRefreshToken } from "../utils/jwt.js";
import { hashPassword, verifyPassword } from "../utils/password.js";
import bcrypt from "bcryptjs";

const serializeUser = (user) => {
  if (!user) return null;
  const { passwordHash, ...safe } = user;
  return safe;
};

const storeRefreshToken = async (db, userId, token, expiresAt) => {
  const tokenHash = await bcrypt.hash(token, 10);
  db.data.refreshTokens = db.data.refreshTokens.filter((entry) => entry.userId !== userId);
  db.data.refreshTokens.push({
    id: nanoid(),
    userId,
    tokenHash,
    expiresAt,
    createdAt: new Date().toISOString(),
  });
  await db.write();
};

const removeRefreshToken = async (db, userId) => {
  db.data.refreshTokens = db.data.refreshTokens.filter((entry) => entry.userId !== userId);
  await db.write();
};

export const registerUser = async ({ name, email, password }) => {
  const db = getDb();
  const existing = db.data.users.find((user) => user.email === email.toLowerCase());
  if (existing) {
    throw new AppError("Email already registered", 409);
  }
  const timestamp = new Date().toISOString();
  const user = {
    id: nanoid(),
    name,
    email: email.toLowerCase(),
    passwordHash: await hashPassword(password),
    role: "user",
    isPremium: false,
    createdAt: timestamp,
    updatedAt: timestamp,
  };
  db.data.users.push(user);
  await db.write();
  const accessToken = signAccessToken({ sub: user.id, role: user.role });
  const refreshToken = signRefreshToken({ sub: user.id });
  const decodedRefresh = verifyRefreshToken(refreshToken);
  await storeRefreshToken(db, user.id, refreshToken, decodedRefresh.exp * 1000);
  return {
    user: serializeUser(user),
    tokens: { accessToken, refreshToken },
  };
};

export const loginUser = async ({ email, password }) => {
  const db = getDb();
  const user = db.data.users.find((entry) => entry.email === email.toLowerCase());
  if (!user) {
    throw new AppError("Invalid credentials", 401);
  }
  const isValid = await verifyPassword(password, user.passwordHash);
  if (!isValid) {
    throw new AppError("Invalid credentials", 401);
  }
  const accessToken = signAccessToken({ sub: user.id, role: user.role });
  const refreshToken = signRefreshToken({ sub: user.id });
  const decodedRefresh = verifyRefreshToken(refreshToken);
  await storeRefreshToken(db, user.id, refreshToken, decodedRefresh.exp * 1000);
  return {
    user: serializeUser(user),
    tokens: { accessToken, refreshToken },
  };
};

export const refreshAuthTokens = async (refreshToken) => {
  if (!refreshToken) {
    throw new AppError("Refresh token missing", 401);
  }
  const decoded = verifyRefreshToken(refreshToken);
  const db = getDb();
  const record = db.data.refreshTokens.find((entry) => entry.userId === decoded.sub);
  if (!record) {
    throw new AppError("Refresh token invalidated", 401);
  }
  const match = await bcrypt.compare(refreshToken, record.tokenHash);
  if (!match) {
    throw new AppError("Refresh token invalidated", 401);
  }
  const user = db.data.users.find((entry) => entry.id === decoded.sub);
  if (!user) {
    throw new AppError("User no longer exists", 401);
  }
  const accessToken = signAccessToken({ sub: user.id, role: user.role });
  const newRefreshToken = signRefreshToken({ sub: user.id });
  const refreshDecoded = verifyRefreshToken(newRefreshToken);
  await storeRefreshToken(db, user.id, newRefreshToken, refreshDecoded.exp * 1000);
  return {
    user: serializeUser(user),
    tokens: { accessToken, refreshToken: newRefreshToken },
  };
};

export const logoutUser = async (userId) => {
  const db = getDb();
  await removeRefreshToken(db, userId);
};

export const getProfile = (userId) => {
  const db = getDb();
  const user = db.data.users.find((entry) => entry.id === userId);
  if (!user) {
    throw new AppError("User not found", 404);
  }
  return serializeUser(user);
};

export const upgradeUserPlan = async (userId) => {
  const db = getDb();
  const user = db.data.users.find((entry) => entry.id === userId);
  if (!user) {
    throw new AppError("User not found", 404);
  }
  user.isPremium = true;
  user.updatedAt = new Date().toISOString();
  await db.write();
  return serializeUser(user);
};