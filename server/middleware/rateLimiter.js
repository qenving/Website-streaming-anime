import rateLimit from "express-rate-limit";
import env from "../config/env.js";

const limiter = rateLimit({
  windowMs: env.security.rateLimitWindowMs,
  max: env.security.rateLimitMax,
  standardHeaders: true,
  legacyHeaders: false,
});

export default limiter;