import { asyncHandler } from "./asyncHandler.js";
import { verifyAccessToken } from "../utils/jwt.js";
import { AppError } from "../utils/errors.js";
import { getDb } from "../db/database.js";

const extractToken = (req) => {
  const header = req.headers.authorization;
  if (header && header.startsWith("Bearer ")) {
    return header.slice(7);
  }
  return req.cookies?.accessToken;
};

const attachUser = async (req, token) => {
  const decoded = verifyAccessToken(token);
  const db = getDb();
  const user = db.data.users.find((entry) => entry.id === decoded.sub);
  if (!user) {
    throw new AppError("User associated with token not found", 401);
  }
  req.user = {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    isPremium: user.isPremium,
  };
};

export const optionalAuth = asyncHandler(async (req, res, next) => {
  const token = extractToken(req);
  if (!token) {
    return next();
  }
  try {
    await attachUser(req, token);
  } catch (error) {
    req.user = undefined;
  }
  next();
});

export const requireAuth = asyncHandler(async (req, res, next) => {
  const token = extractToken(req);
  if (!token) {
    throw new AppError("Authentication required", 401);
  }
  await attachUser(req, token);
  next();
});

export const requireAdmin = asyncHandler(async (req, res, next) => {
  const token = extractToken(req);
  if (!token) {
    throw new AppError("Admin privileges required", 403);
  }
  await attachUser(req, token);
  if (req.user?.role !== "admin") {
    throw new AppError("Admin privileges required", 403);
  }
  next();
});