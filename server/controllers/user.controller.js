import { asyncHandler } from "../middleware/asyncHandler.js";
import { getUserDashboard, getUserFavorites, toggleFavorite } from "../services/user.service.js";
import { AppError } from "../utils/errors.js";

export const favorites = asyncHandler(async (req, res) => {
  if (!req.user) {
    throw new AppError("Authentication required", 401);
  }
  const data = getUserFavorites(req.user.id);
  res.json(data);
});

export const toggle = asyncHandler(async (req, res) => {
  if (!req.user) {
    throw new AppError("Authentication required", 401);
  }
  const { slug } = req.params;
  if (!slug) {
    throw new AppError("Anime slug required", 400);
  }
  const result = await toggleFavorite(req.user.id, slug);
  res.json(result);
});

export const dashboard = asyncHandler(async (req, res) => {
  if (!req.user) {
    throw new AppError("Authentication required", 401);
  }
  const data = getUserDashboard(req.user.id);
  res.json(data);
});