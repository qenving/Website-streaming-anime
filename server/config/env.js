import dotenv from "dotenv";

const envFile = process.env.NODE_ENV === "test" ? ".env.test" : ".env";
dotenv.config({ path: envFile });

const env = {
  nodeEnv: process.env.NODE_ENV ?? "development",
  port: Number(process.env.PORT ?? 4000),
  clientUrl: process.env.CLIENT_URL ?? "http://localhost:5173",
  jwt: {
    accessSecret: process.env.JWT_ACCESS_SECRET ?? "change-me-access-secret",
    refreshSecret: process.env.JWT_REFRESH_SECRET ?? "change-me-refresh-secret",
    accessExpiresIn: process.env.JWT_ACCESS_EXPIRES_IN ?? "15m",
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN ?? "7d",
  },
  security: {
    rateLimitWindowMs: Number(process.env.RATE_LIMIT_WINDOW_MS ?? 15 * 60 * 1000),
    rateLimitMax: Number(process.env.RATE_LIMIT_MAX ?? 100),
  },
  database: {
    file: process.env.DB_FILE ?? "server/db/data.sqlite",
  },
  anidb: {
    client: process.env.ANIDB_CLIENT ?? "",
    clientVersion: process.env.ANIDB_CLIENT_VERSION ?? "1",
    username: process.env.ANIDB_USERNAME ?? "",
    password: process.env.ANIDB_PASSWORD ?? "",
    cacheTtlSeconds: Number(process.env.ANIDB_CACHE_TTL ?? 3600),
    enabled: process.env.ANIDB_ENABLED ? process.env.ANIDB_ENABLED === "true" : true,
  },
  cacheTtlSeconds: Number(process.env.CACHE_TTL_SECONDS ?? 60),
};

export default env;