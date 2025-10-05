import { nanoid } from "nanoid";
import { getDb } from "../db/database.js";
import { AppError } from "../utils/errors.js";
import { projectAnime } from "./anime.service.js";

const ensureUser = (db, userId) => {
  const user = db.data.users.find((entry) => entry.id === userId);
  if (!user) {
    throw new AppError("User not found", 404);
  }
  return user;
};

export const getUserFavorites = (userId) => {
  const db = getDb();
  const user = ensureUser(db, userId);
  const favorites = db.data.favorites
    .filter((entry) => entry.userId === userId)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  const animeMap = new Map(db.data.anime.map((item) => [item.id, item]));
  const serialized = favorites
    .map((favorite) => {
      const anime = animeMap.get(favorite.animeId);
      if (!anime) return null;
      return projectAnime(anime, db.data.episodes);
    })
    .filter(Boolean);
  return {
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      isPremium: user.isPremium,
      role: user.role,
    },
    favorites: serialized,
  };
};

export const toggleFavorite = async (userId, slug) => {
  const db = getDb();
  const user = ensureUser(db, userId);
  const anime = db.data.anime.find((entry) => entry.slug === slug);
  if (!anime) {
    throw new AppError("Anime not found", 404);
  }
  const existing = db.data.favorites.find((entry) => entry.userId === userId && entry.animeId === anime.id);
  if (existing) {
    db.data.favorites = db.data.favorites.filter((entry) => entry.id !== existing.id);
    await db.write();
    return { favorited: false };
  }
  if (!user.isPremium) {
    const currentNonPremiumFavorites = db.data.favorites.filter((entry) => entry.userId === userId).length;
    if (currentNonPremiumFavorites >= 3) {
      throw new AppError("Upgrade to Prime to save more than 3 favorites", 402);
    }
  }
  db.data.favorites.push({
    id: nanoid(),
    userId,
    animeId: anime.id,
    createdAt: new Date().toISOString(),
  });
  await db.write();
  return { favorited: true };
};

export const getUserDashboard = (userId) => {
  const db = getDb();
  const userSafe = ensureUser(db, userId);
  const favorites = getUserFavorites(userId).favorites;
  return {
    profile: {
      id: userSafe.id,
      name: userSafe.name,
      email: userSafe.email,
      isPremium: userSafe.isPremium,
      role: userSafe.role,
      createdAt: userSafe.createdAt,
    },
    favorites,
  };
};