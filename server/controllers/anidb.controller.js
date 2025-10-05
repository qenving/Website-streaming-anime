import { asyncHandler } from "../middleware/asyncHandler.js";
import { aniDbIdParamsSchema, aniDbQuerySchema } from "../schemas/anidb.schema.js";
import { fetchAniDbAnime, fetchAniDbRandom } from "../services/anidb.service.js";

export const random = asyncHandler(async (req, res) => {
  const query = aniDbQuerySchema.parse(req.query);
  const items = await fetchAniDbRandom({ refresh: query.refresh });
  res.json({ items });
});

export const show = asyncHandler(async (req, res) => {
  const params = aniDbIdParamsSchema.parse(req.params);
  const query = aniDbQuerySchema.parse(req.query);
  const anime = await fetchAniDbAnime({ id: params.id, refresh: query.refresh });
  res.json({ anime });
});
