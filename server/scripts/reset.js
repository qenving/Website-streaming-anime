import logger from "../config/logger.js";
import { resetDb } from "../db/database.js";

const run = async () => {
  await resetDb();
  logger.info("Database reset to empty state");
};

run().catch((error) => {
  logger.error({ error }, "Failed to reset database");
  process.exit(1);
});