import { getDb } from "../db/database.js";
import { AppError } from "../utils/errors.js";
import { loadAnimeIndex } from "./anime.service.js";

const fetchUser = (userId) => {
  const db = getDb();
  const user = db
    .prepare("SELECT id, name, email, is_premium, role, created_at, updated_at FROM users WHERE id = ?")
    .get(userId);
  if (!user) {
    throw new AppError("User not found", 404);
  }
  return user;
};

export const getUserFavorites = (userId) => {
  const db = getDb();
  const user = fetchUser(userId);
  const favorites = db
    .prepare("SELECT anime_id, created_at FROM favorites WHERE user_id = ? ORDER BY created_at DESC")
    .all(userId);
  const { animeById } = loadAnimeIndex();
  const serialized = favorites
    .map((entry) => animeById.get(entry.anime_id))
    .filter(Boolean);
  return {
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      isPremium: Boolean(user.is_premium),
      role: user.role,
    },
    favorites: serialized,
  };
};

export const toggleFavorite = (userId, slug) => {
  const db = getDb();
  const user = fetchUser(userId);
  const { animeBySlug } = loadAnimeIndex();
  const anime = animeBySlug.get(slug);
  if (!anime) {
    throw new AppError("Anime not found", 404);
  }

  const existing = db
    .prepare("SELECT user_id FROM favorites WHERE user_id = ? AND anime_id = ?")
    .get(userId, anime.id);
  if (existing) {
    db.prepare("DELETE FROM favorites WHERE user_id = ? AND anime_id = ?").run(userId, anime.id);
    return { favorited: false };
  }

  if (!user.is_premium) {
    const count = db.prepare("SELECT COUNT(*) AS total FROM favorites WHERE user_id = ?").get(userId)?.total ?? 0;
    if (count >= 3) {
      throw new AppError("Upgrade to Prime to save more than 3 favorites", 402);
    }
  }

  db
    .prepare("INSERT INTO favorites (user_id, anime_id, created_at) VALUES (?, ?, ?)")
    .run(userId, anime.id, new Date().toISOString());
  return { favorited: true };
};

export const getUserDashboard = (userId) => {
  const user = fetchUser(userId);
  const favorites = getUserFavorites(userId).favorites;
  return {
    profile: {
      id: user.id,
      name: user.name,
      email: user.email,
      isPremium: Boolean(user.is_premium),
      role: user.role,
      createdAt: user.created_at,
    },
    favorites,
  };
};
