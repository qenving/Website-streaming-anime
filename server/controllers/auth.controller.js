import env from "../config/env.js";
import { asyncHandler } from "../middleware/asyncHandler.js";
import { registerSchema, loginSchema, refreshSchema } from "../schemas/auth.schema.js";
import {
  getProfile,
  loginUser,
  logoutUser,
  refreshAuthTokens,
  registerUser,
  upgradeUserPlan,
} from "../services/auth.service.js";
import { AppError } from "../utils/errors.js";

const ACCESS_TOKEN_TTL = 15 * 60 * 1000; // 15 minutes
const REFRESH_TOKEN_TTL = 7 * 24 * 60 * 60 * 1000; // 7 days

const baseCookieOptions = (maxAge) => ({
  httpOnly: true,
  secure: env.nodeEnv === "production",
  sameSite: env.nodeEnv === "production" ? "none" : "lax",
  maxAge,
  path: "/",
});

const setAuthCookies = (res, tokens) => {
  res.cookie("accessToken", tokens.accessToken, baseCookieOptions(ACCESS_TOKEN_TTL));
  res.cookie("refreshToken", tokens.refreshToken, baseCookieOptions(REFRESH_TOKEN_TTL));
};

export const register = asyncHandler(async (req, res) => {
  const payload = registerSchema.parse(req.body);
  const { user, tokens } = await registerUser(payload);
  setAuthCookies(res, tokens);
  res.status(201).json({ user, accessToken: tokens.accessToken });
});

export const login = asyncHandler(async (req, res) => {
  const payload = loginSchema.parse(req.body);
  const { user, tokens } = await loginUser(payload);
  setAuthCookies(res, tokens);
  res.json({ user, accessToken: tokens.accessToken });
});

export const refresh = asyncHandler(async (req, res) => {
  const bodyToken = req.body?.refreshToken;
  const cookieToken = req.cookies?.refreshToken;
  const token = bodyToken ?? cookieToken;
  if (!token) {
    throw new AppError("Refresh token missing", 401);
  }
  refreshSchema.parse({ refreshToken: token });
  const { user, tokens } = await refreshAuthTokens(token);
  setAuthCookies(res, tokens);
  res.json({ user, accessToken: tokens.accessToken });
});

export const logout = asyncHandler(async (req, res) => {
  if (!req.user) {
    throw new AppError("Not authenticated", 401);
  }
  await logoutUser(req.user.id);
  res.clearCookie("accessToken");
  res.clearCookie("refreshToken");
  res.status(204).send();
});

export const me = asyncHandler(async (req, res) => {
  if (!req.user) {
    throw new AppError("Not authenticated", 401);
  }
  const user = getProfile(req.user.id);
  res.json({ user });
});

export const upgrade = asyncHandler(async (req, res) => {
  if (!req.user) {
    throw new AppError("Not authenticated", 401);
  }
  const user = await upgradeUserPlan(req.user.id);
  res.json({ user });
});