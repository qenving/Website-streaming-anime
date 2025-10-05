import compression from "compression";
import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import helmet from "helmet";
import hpp from "hpp";
import env from "./config/env.js";
import logger from "./config/logger.js";
import limiter from "./middleware/rateLimiter.js";
import { sanitizeBody, sanitizeQuery } from "./middleware/sanitize.js";
import routes from "./routes/index.js";
import { errorHandler, notFoundHandler } from "./middleware/errorHandler.js";

const app = express();

app.disable("x-powered-by");
app.use(helmet());
app.use(limiter);
app.use(
  cors({
    origin: env.clientUrl,
    credentials: true,
  })
);
app.use(compression());
app.use(hpp());
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(sanitizeQuery());
app.use(sanitizeBody());

app.get("/health", (req, res) => {
  res.json({ status: "ok", uptime: process.uptime() });
});

app.use("/api", routes);

app.use(notFoundHandler);
app.use(errorHandler);

app.on("error", (error) => {
  logger.error({ error }, "Express encountered an error");
});

export default app;