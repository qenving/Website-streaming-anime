import { z } from "zod";

export const animeSlugSchema = z.object({
  slug: z.string().min(1),
});

export const listAnimeQuerySchema = z.object({
  search: z.string().optional(),
  genre: z.string().optional(),
  page: z.string().optional(),
  limit: z.string().optional(),
});

export const episodeQuerySchema = z.object({
  page: z.string().optional(),
  pageSize: z.string().optional(),
});

export const sectionQuerySchema = z.object({
  refresh: z.coerce.boolean().optional(),
});