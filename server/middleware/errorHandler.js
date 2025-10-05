import env from "../config/env.js";
import logger from "../config/logger.js";
import { AppError } from "../utils/errors.js";

export const notFoundHandler = (req, res, next) => {
  next(new AppError(`Route ${req.originalUrl} not found`, 404));
};

export const errorHandler = (err, req, res, next) => {
  const statusCode = err instanceof AppError ? err.statusCode : 500;
  const payload = {
    status: "error",
    message: err.message ?? "Internal server error",
  };

  if (err.details) {
    payload.details = err.details;
  }

  if (statusCode >= 500 || env.nodeEnv !== "production") {
    logger.error({ err, url: req.originalUrl, method: req.method }, "Request failed");
  }

  res.status(statusCode).json(payload);
};