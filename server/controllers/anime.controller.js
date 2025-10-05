import { asyncHandler } from "../middleware/asyncHandler.js";
import { validateQuery } from "../middleware/validation.js";
import { animeSlugSchema, episodeQuerySchema, listAnimeQuerySchema, sectionQuerySchema } from "../schemas/anime.schema.js";
import {
  getAnimeBySlug,
  getAnimeList,
  getEpisodesBySlug,
  getGenres,
  getHomepageSections,
  getRelatedAnime,
} from "../services/anime.service.js";

export const homepage = asyncHandler(async (req, res) => {
  const query = sectionQuerySchema.parse(req.query);
  const sections = await getHomepageSections({ refresh: query.refresh });
  res.json(sections);
});

export const list = asyncHandler(async (req, res) => {
  const query = listAnimeQuerySchema.parse(req.query);
  const response = getAnimeList(query);
  res.json(response);
});

export const show = asyncHandler(async (req, res) => {
  const params = animeSlugSchema.parse(req.params);
  const anime = getAnimeBySlug(params.slug);
  res.json(anime);
});

export const episodes = asyncHandler(async (req, res) => {
  const params = animeSlugSchema.parse(req.params);
  const query = episodeQuerySchema.parse(req.query);
  const response = getEpisodesBySlug(params.slug, query);
  res.json(response);
});

export const related = asyncHandler(async (req, res) => {
  const params = animeSlugSchema.parse(req.params);
  const items = getRelatedAnime(params.slug);
  res.json(items);
});

export const genres = asyncHandler(async (req, res) => {
  const items = getGenres();
  res.json({ genres: items });
});