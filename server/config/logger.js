import pino from "pino";
import env from "./env.js";

const logger = pino({
  level: process.env.LOG_LEVEL ?? (env.nodeEnv === "development" ? "debug" : "info"),
  transport:
    env.nodeEnv === "development"
      ? {
          target: "pino-pretty",
          options: {
            colorize: true,
            translateTime: "SYS:standard",
            ignore: "pid,hostname",
          },
        }
      : undefined,
});

export default logger;