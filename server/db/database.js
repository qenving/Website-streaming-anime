import { Low } from "lowdb";
import { JSONFile } from "lowdb/node";
import { mkdirSync } from "fs";
import path from "path";
import env from "../config/env.js";

const defaultData = {
  users: [],
  refreshTokens: [],
  anime: [],
  episodes: [],
  genres: [],
  posts: [],
  comments: [],
  favorites: [],
  promos: [],
  stats: [],
  plans: [],
  benefits: [],
};

let dbInstance;

export const initDb = async () => {
  if (dbInstance) {
    return dbInstance;
  }

  const dbPath = path.resolve(process.cwd(), env.database.file);
  mkdirSync(path.dirname(dbPath), { recursive: true });
  const adapter = new JSONFile(dbPath);
  const db = new Low(adapter, defaultData);

  await db.read();
  db.data ||= { ...defaultData };
  await db.write();

  dbInstance = db;
  return dbInstance;
};

export const getDb = () => {
  if (!dbInstance) {
    throw new Error("Database accessed before initialization");
  }
  return dbInstance;
};

export const resetDb = async () => {
  const db = await initDb();
  db.data = { ...defaultData };
  await db.write();
  return db;
};

export const defaultDbShape = defaultData;