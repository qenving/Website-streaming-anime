import { asyncHandler } from "../middleware/asyncHandler.js";
import { getPremiumContent } from "../services/premium.service.js";

export const premiumContent = asyncHandler(async (req, res) => {
  const content = getPremiumContent();
  res.json(content);
});