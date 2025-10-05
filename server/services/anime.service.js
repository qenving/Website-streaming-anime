import { getDb } from "../db/database.js";
import { AppError } from "../utils/errors.js";
import { remember } from "../utils/cache.js";

const extensionToMime = {
  mp4: "video/mp4",
  m4v: "video/mp4",
  webm: "video/webm",
  ogv: "video/ogg",
  mov: "video/quicktime",
  mkv: "video/x-matroska",
  m3u8: "application/x-mpegURL",
};

const guessMimeType = (src, provided) => {
  if (provided) return provided;
  if (!src) return undefined;
  const clean = src.split("?")[0].split("#")[0];
  const extension = clean.includes(".") ? clean.split(".").pop()?.toLowerCase() : "";
  return extensionToMime[extension] ?? undefined;
};

const parseSourcePayload = (payload) => {
  if (!payload) return [];
  if (Array.isArray(payload)) return payload;
  if (typeof payload === "string") {
    try {
      const parsed = JSON.parse(payload);
      return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
      return [];
    }
  }
  return [];
};

const normalizeSourceList = (payload, fallback) => {
  const raw = parseSourcePayload(payload);
  const normalized = [];
  const seen = new Set();

  const addEntry = (entry) => {
    if (!entry) return;
    const src = typeof entry === "string" ? entry : entry.src ?? entry.url ?? entry.href;
    if (!src || seen.has(src)) return;
    seen.add(src);
    normalized.push({
      src,
      type: guessMimeType(src, typeof entry === "object" ? entry.type : undefined),
      label:
        typeof entry === "object"
          ? entry.label ?? entry.name ?? entry.quality ?? undefined
          : undefined,
    });
  };

  raw.forEach((entry) => addEntry(entry));
  if (!normalized.length && fallback) {
    addEntry({ src: fallback });
  }
  return normalized;
};

const buildAnimeIndex = () => {
  const db = getDb();
  const animeRows = db.prepare("SELECT * FROM anime").all();
  const genreRows = db.prepare("SELECT anime_id, genre FROM anime_genres").all();
  const tagRows = db.prepare("SELECT anime_id, tag FROM anime_tags").all();
  const relationRows = db.prepare("SELECT anime_id, related_anime_id FROM anime_relations").all();
  const episodeRows = db
    .prepare("SELECT * FROM episodes ORDER BY anime_id ASC, number ASC")
    .all();

  const genresByAnime = new Map();
  genreRows.forEach((row) => {
    const collection = genresByAnime.get(row.anime_id) ?? [];
    collection.push(row.genre);
    genresByAnime.set(row.anime_id, collection);
  });

  const tagsByAnime = new Map();
  tagRows.forEach((row) => {
    const collection = tagsByAnime.get(row.anime_id) ?? [];
    collection.push(row.tag);
    tagsByAnime.set(row.anime_id, collection);
  });

  const idToSlug = new Map(animeRows.map((row) => [row.id, row.slug]));
  const relationsByAnime = new Map();
  relationRows.forEach((row) => {
    const targetSlug = idToSlug.get(row.related_anime_id);
    if (!targetSlug) return;
    const collection = relationsByAnime.get(row.anime_id) ?? [];
    if (!collection.includes(targetSlug)) {
      collection.push(targetSlug);
    }
    relationsByAnime.set(row.anime_id, collection);
  });

  const episodesByAnime = new Map();
  episodeRows.forEach((row) => {
    const sources = normalizeSourceList(row.video_sources, row.video_url);
    const primarySource = sources[0]?.src ?? row.video_url ?? null;
    const collection = episodesByAnime.get(row.anime_id) ?? [];
    collection.push({
      id: row.id,
      animeId: row.anime_id,
      number: row.number,
      title: row.title,
      synopsis: row.synopsis,
      duration: row.duration,
      videoUrl: primarySource,
      videoSources: sources,
      thumbnail: row.thumbnail,
      airDate: row.air_date,
      createdAt: row.created_at,
    });
    episodesByAnime.set(row.anime_id, collection);
  });

  const animeById = new Map();
  const animeSerialized = animeRows.map((row) => {
    const animeEpisodes = episodesByAnime.get(row.id) ?? [];
    const firstEpisode = animeEpisodes.find((episode) => episode.number === 1) ?? animeEpisodes[0];
    const heroSources = normalizeSourceList(row.hero_sources, row.hero_video);
    const heroVideo = heroSources[0]?.src ?? row.hero_video ?? null;
    if (heroVideo && animeEpisodes.length) {
      animeEpisodes.forEach((episode) => {
        if (!episode.videoUrl) {
          episode.videoSources = normalizeSourceList(episode.videoSources, heroVideo);
          episode.videoUrl = episode.videoSources[0]?.src ?? heroVideo;
        }
      });
    }
    const serialized = {
      id: row.id,
      slug: row.slug,
      title: row.title,
      synopsis: row.synopsis,
      rating: row.rating,
      maturity: row.maturity,
      studio: row.studio,
      status: row.status,
      releaseYear: row.release_year,
      genres: Array.from(new Set(genresByAnime.get(row.id) ?? [])),
      tags: Array.from(new Set(tagsByAnime.get(row.id) ?? [])),
      banner: row.banner,
      thumbnail: row.thumbnail,
      heroVideo,
      heroSources,
      isFeatured: Boolean(row.is_featured),
      isPopular: Boolean(row.is_popular),
      isTrending: Boolean(row.is_trending),
      trendingRank: row.trending_rank,
      episodeCount: animeEpisodes.length,
      firstEpisodeNumber: firstEpisode?.number ?? 1,
      related: relationsByAnime.get(row.id) ?? [],
    };
    animeById.set(row.id, serialized);
    return serialized;
  });

  const animeBySlug = new Map(animeSerialized.map((entry) => [entry.slug, entry]));
  const episodesBySlug = new Map(
    animeRows.map((row) => [row.slug, (episodesByAnime.get(row.id) ?? []).slice()])
  );

  return { anime: animeSerialized, animeBySlug, animeById, episodesBySlug };
};

export const getHomepageSections = async ({ refresh = false } = {}) => {
  const cacheKey = "homepage_sections_v2";
  const factory = () => {
    const { anime } = buildAnimeIndex();
    const db = getDb();
    const promos = db.prepare("SELECT id, title, copy, action FROM promos").all();
    const stats = db.prepare("SELECT id, label, value FROM homepage_stats").all();

    const featured = anime
      .filter((item) => item.isFeatured)
      .sort((a, b) => (a.trendingRank ?? 999) - (b.trendingRank ?? 999))
      .slice(0, 5);
    const trending = anime
      .filter((item) => item.isTrending)
      .sort((a, b) => (a.trendingRank ?? 999) - (b.trendingRank ?? 999))
      .slice(0, 8);
    const popular = anime
      .filter((item) => item.isPopular)
      .sort((a, b) => b.rating - a.rating)
      .slice(0, 9);
    const latest = anime
      .slice()
      .sort((a, b) => (b.releaseYear ?? 0) - (a.releaseYear ?? 0))
      .slice(0, 8);

    return {
      featured,
      trending,
      popular,
      latest,
      promos: promos.map((item) => ({ ...item })),
      stats: stats.map((item) => ({ ...item })),
    };
  };

  if (refresh) {
    return factory();
  }
  return remember(cacheKey, factory, 120);
};

export const getAnimeList = ({ search, genre, page = 1, limit = 24 }) => {
  const { anime } = buildAnimeIndex();
  let filtered = anime;
  if (search) {
    const query = search.toLowerCase();
    filtered = filtered.filter(
      (item) =>
        item.title.toLowerCase().includes(query) ||
        item.synopsis.toLowerCase().includes(query) ||
        item.genres.some((genreItem) => genreItem.toLowerCase().includes(query)) ||
        item.tags.some((tag) => tag.toLowerCase().includes(query))
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
  const { animeBySlug } = buildAnimeIndex();
  const record = animeBySlug.get(slug);
  if (!record) {
    throw new AppError("Anime not found", 404);
  }
  return record;
};

export const getEpisodesBySlug = (slug, { page = 1, pageSize = 12 }) => {
  const { animeBySlug, episodesBySlug } = buildAnimeIndex();
  const anime = animeBySlug.get(slug);
  if (!anime) {
    throw new AppError("Anime not found", 404);
  }
  const episodes = (episodesBySlug.get(slug) ?? []).slice();
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
  const { anime, animeBySlug } = buildAnimeIndex();
  const base = animeBySlug.get(slug);
  if (!base) {
    throw new AppError("Anime not found", 404);
  }
  const genres = new Set(base.genres);
  return anime
    .filter((entry) => entry.slug !== slug)
    .filter((entry) => base.related.includes(entry.slug) || entry.genres.some((genre) => genres.has(genre)))
    .slice(0, 8);
};

export const getGenres = () => {
  const db = getDb();
  const rows = db.prepare("SELECT DISTINCT genre FROM anime_genres ORDER BY genre ASC").all();
  return rows.map((row) => row.genre);
};

export const loadAnimeIndex = () => buildAnimeIndex();
