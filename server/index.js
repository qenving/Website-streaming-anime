import app from "./app.js";
import env from "./config/env.js";
import logger from "./config/logger.js";
import { initDb } from "./db/database.js";

const start = async () => {
  try {
    await initDb();
    const server = app.listen(env.port, () => {
      logger.info(`Server listening on port ${env.port}`);
    });

    const shutdown = (signal) => {
      logger.info(`${signal} received. Closing server.`);
      server.close(() => {
        logger.info("HTTP server closed.");
        process.exit(0);
      });
    };

    process.on("SIGINT", () => shutdown("SIGINT"));
    process.on("SIGTERM", () => shutdown("SIGTERM"));
  } catch (error) {
    logger.error({ error }, "Failed to start server");
    process.exit(1);
  }
};

start();