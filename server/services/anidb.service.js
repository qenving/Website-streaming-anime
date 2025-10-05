import AniDb from "anidbjs";
import env from "../config/env.js";
import { AppError } from "../utils/errors.js";
import { remember } from "../utils/cache.js";

let client;

const ensureClient = () => {
  if (!env.anidb.enabled) {
    throw new AppError("AniDB integration is disabled", 503);
  }
  if (!env.anidb.client || !env.anidb.clientVersion) {
    throw new AppError("AniDB client credentials are missing", 503);
  }
  if (!client) {
    client = new AniDb(
      { client: env.anidb.client, version: env.anidb.clientVersion },
      { timeout: 8000 }
    );
  }
  return client;
};

const mapAnime = (anime) => ({
  id: anime.id,
  type: anime.type,
  episodeCount: anime.episodeCount,
  startDate: anime.startDate,
  endDate: anime.endDate,
  titles: anime.titles,
  description: anime.description,
  picture: anime.picture,
  ratings: anime.ratings,
  related: anime.related,
  similar: anime.similar,
  recommendations: anime.recommendations,
  url: anime.url,
  creators: anime.creators,
  resources: anime.resources,
  tags: anime.tags,
  characters: anime.characters,
  episodes: anime.episodes,
});

export const fetchAniDbAnime = async ({ id, refresh = false }) => {
  if (!id) {
    throw new AppError("AniDB id is required", 400);
  }
  const numericId = Number(id);
  if (Number.isNaN(numericId)) {
    throw new AppError("AniDB id must be numeric", 400);
  }
  const cacheKey = `anidb_anime_${numericId}`;
  const factory = async () => {
    try {
      const result = await ensureClient().anime(numericId);
      return mapAnime(result);
    } catch (error) {
      throw new AppError("AniDB request failed", 502, error);
    }
  };
  if (refresh) {
    return factory();
  }
  return remember(cacheKey, factory, env.anidb.cacheTtlSeconds);
};

export const fetchAniDbRandom = async ({ refresh = false } = {}) => {
  const cacheKey = "anidb_random_recommendations";
  const factory = async () => {
    try {
      const result = await ensureClient().randomRecommendation();
      return result.map(mapAnime);
    } catch (error) {
      throw new AppError("AniDB random recommendations failed", 502, error);
    }
  };
  if (refresh) {
    return factory();
  }
  return remember(cacheKey, factory, env.anidb.cacheTtlSeconds);
};

export const clearAniDbClient = () => {
  client = undefined;
};
