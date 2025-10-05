import { getDb } from "../db/database.js";
import { AppError } from "../utils/errors.js";
import { remember } from "../utils/cache.js";

export const projectAnime = (anime, episodes) => {
  const related = anime.related ?? [];
  const animeEpisodes = episodes.filter((episode) => episode.animeId === anime.id);
  const firstEpisode = animeEpisodes.find((episode) => episode.number === 1) ?? animeEpisodes[0];
  return {
    id: anime.id,
    slug: anime.slug,
    title: anime.title,
    synopsis: anime.synopsis,
    rating: anime.rating,
    maturity: anime.maturity,
    studio: anime.studio,
    status: anime.status,
    releaseYear: anime.releaseYear,
    genres: anime.genres,
    tags: anime.tags,
    banner: anime.banner,
    thumbnail: anime.thumbnail,
    heroVideo: anime.heroVideo,
    isFeatured: anime.isFeatured,
    isPopular: anime.isPopular,
    isTrending: anime.isTrending,
    trendingRank: anime.trendingRank,
    episodeCount: animeEpisodes.length,
    firstEpisodeNumber: firstEpisode?.number ?? 1,
    related,
  };
};

const cloneCollection = (items) => items.map((item) => ({ ...item }));

export const getHomepageSections = async ({ refresh = false } = {}) => {
  const cacheKey = "homepage_sections";
  const factory = async () => {
    const db = getDb();
    const { anime, episodes, stats, promos } = db.data;
    const serialized = anime.map((entry) => projectAnime(entry, episodes));
    const featured = serialized.filter((item) => item.isFeatured).slice(0, 5);
    const trending = serialized
      .filter((item) => item.isTrending)
      .sort((a, b) => (a.trendingRank ?? 999) - (b.trendingRank ?? 999))
      .slice(0, 8);
    const popular = serialized
      .filter((item) => item.isPopular)
      .sort((a, b) => b.rating - a.rating)
      .slice(0, 9);
    const latest = serialized.slice().sort((a, b) => b.releaseYear - a.releaseYear).slice(0, 8);
    return {
      featured,
      trending,
      popular,
      latest,
      promos: cloneCollection(promos ?? []),
      stats: cloneCollection(stats ?? []),
    };
  };

  if (refresh) {
    return factory();
  }
  return remember(cacheKey, factory, 120);
};

export const getAnimeList = ({ search, genre, page = 1, limit = 24 }) => {
  const db = getDb();
  const { anime, episodes } = db.data;
  const serialized = anime.map((entry) => projectAnime(entry, episodes));
  let filtered = serialized;
  if (search) {
    const query = search.toLowerCase();
    filtered = filtered.filter(
      (item) =>
        item.title.toLowerCase().includes(query) ||
        item.synopsis.toLowerCase().includes(query) ||
        item.genres.some((genreItem) => genreItem.toLowerCase().includes(query))
    );
  }
  if (genre) {
    filtered = filtered.filter((item) => item.genres.includes(genre));
  }
  const total = filtered.length;
  const pageNumber = Number(page) || 1;
  const pageSize = Number(limit) || 24;
  const start = (pageNumber - 1) * pageSize;
  const items = filtered.slice(start, start + pageSize);
  return {
    items,
    total,
    page: pageNumber,
    pageSize,
  };
};

export const getAnimeBySlug = (slug) => {
  const db = getDb();
  const record = db.data.anime.find((entry) => entry.slug === slug);
  if (!record) {
    throw new AppError("Anime not found", 404);
  }
  return projectAnime(record, db.data.episodes);
};

export const getEpisodesBySlug = (slug, { page = 1, pageSize = 12 }) => {
  const db = getDb();
  const anime = db.data.anime.find((entry) => entry.slug === slug);
  if (!anime) {
    throw new AppError("Anime not found", 404);
  }
  const episodes = db.data.episodes
    .filter((episode) => episode.animeId === anime.id)
    .sort((a, b) => a.number - b.number);
  const pageNumber = Number(page) || 1;
  const size = Number(pageSize) || 12;
  const start = (pageNumber - 1) * size;
  const items = episodes.slice(start, start + size);
  return {
    episodes: items,
    total: episodes.length,
    page: pageNumber,
    pageSize: size,
    hasNext: start + size < episodes.length,
    hasPrev: start > 0,
  };
};

export const getRelatedAnime = (slug) => {
  const db = getDb();
  const base = db.data.anime.find((entry) => entry.slug === slug);
  if (!base) {
    throw new AppError("Anime not found", 404);
  }
  const episodes = db.data.episodes;
  const serialized = db.data.anime
    .filter((entry) => entry.slug !== slug)
    .filter((entry) => base.related?.includes(entry.slug) || entry.genres.some((genre) => base.genres.includes(genre)))
    .map((entry) => projectAnime(entry, episodes))
    .slice(0, 8);
  return serialized;
};

export const getGenres = () => {
  const db = getDb();
  return db.data.genres ?? [];
};