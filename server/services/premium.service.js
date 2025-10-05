import { getDb } from "../db/database.js";

export const getPremiumContent = () => {
  const db = getDb();
  return {
    plans: db.data.plans ?? [],
    benefits: db.data.benefits ?? [],
    promos: db.data.promos ?? [],
  };
};