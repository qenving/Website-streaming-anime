import { z } from "zod";

export const createPostSchema = z.object({
  title: z.string().min(3).max(120),
  message: z.string().min(10).max(2000),
  tags: z.array(z.string().min(1)).max(5).optional(),
});

export const likePostSchema = z.object({
  id: z.string().min(1),
});

export const createCommentSchema = z.object({
  message: z.string().min(2).max(600),
});