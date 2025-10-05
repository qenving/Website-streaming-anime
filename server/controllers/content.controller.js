import { asyncHandler } from "../middleware/asyncHandler.js";
import { getAboutContent, getFooterContent, getSiteContent } from "../services/content.service.js";

export const about = asyncHandler(async (req, res) => {
  const content = getAboutContent();
  res.json(content);
});

export const footer = asyncHandler(async (req, res) => {
  const content = getFooterContent();
  res.json(content);
});

export const show = asyncHandler(async (req, res) => {
  const content = getSiteContent(req.params.key);
  res.json(content);
});
