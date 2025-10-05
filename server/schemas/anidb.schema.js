import { z } from "zod";

export const aniDbIdParamsSchema = z.object({
  id: z.string().regex(/^\d+$/, "AniDB id must be numeric"),
});

export const aniDbQuerySchema = z.object({
  refresh: z
    .union([z.literal("true"), z.literal("false"), z.string()])
    .optional()
    .transform((value) => {
      if (value === undefined) return false;
      if (typeof value === "string") {
        return value === "true" || value === "1" || value.toLowerCase() === "yes";
      }
      return Boolean(value);
    }),
});
