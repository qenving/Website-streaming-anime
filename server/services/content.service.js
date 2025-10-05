import { getDb } from "../db/database.js";
import { AppError } from "../utils/errors.js";

const parsePayload = (payload) => {
  try {
    return payload ? JSON.parse(payload) : null;
  } catch {
    throw new AppError("Failed to parse site content", 500);
  }
};

export const getSiteContent = (key) => {
  if (!key) {
    throw new AppError("Content key is required", 400);
  }

  const db = getDb();
  const row = db
    .prepare("SELECT payload FROM site_content WHERE key = ?")
    .get(key);

  if (!row) {
    throw new AppError("Content not found", 404);
  }

  return parsePayload(row.payload);
};

export const getAboutContent = () => getSiteContent("about");

export const getFooterContent = () => getSiteContent("footer");
