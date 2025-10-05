import NodeCache from "node-cache";
import env from "../config/env.js";

const cache = new NodeCache({ stdTTL: env.cacheTtlSeconds, checkperiod: env.cacheTtlSeconds * 0.5 });

export const remember = async (key, factory, ttl = env.cacheTtlSeconds) => {
  if (cache.has(key)) {
    return cache.get(key);
  }
  const value = await factory();
  cache.set(key, value, ttl);
  return value;
};

export const clearCache = (pattern) => {
  if (!pattern) {
    cache.flushAll();
    return;
  }
  const keys = cache.keys().filter((key) => key.startsWith(pattern));
  keys.forEach((key) => cache.del(key));
};

export default cache;