import Database from "better-sqlite3";
import fs from "fs";
import path from "path";
import env from "../config/env.js";

let dbInstance;

const resolveDbFile = () => {
  const configured = env.database.file ?? "server/db/data.sqlite";
  const normalized = configured.endsWith(".json") ? configured.replace(/\.json$/, ".sqlite") : configured;
  const absolute = path.resolve(process.cwd(), normalized);
  fs.mkdirSync(path.dirname(absolute), { recursive: true });
  return absolute;
};

const runMigrations = (db) => {
  db.exec(`
    PRAGMA foreign_keys = ON;
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT 'user',
      is_premium INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS refresh_tokens (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      token_hash TEXT NOT NULL,
      expires_at INTEGER NOT NULL,
      created_at TEXT NOT NULL,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS anime (
      id TEXT PRIMARY KEY,
      slug TEXT NOT NULL UNIQUE,
      title TEXT NOT NULL,
      synopsis TEXT NOT NULL,
      rating REAL NOT NULL DEFAULT 0,
      maturity TEXT,
      studio TEXT,
      status TEXT,
      release_year INTEGER,
      hero_sources TEXT,
      hero_video TEXT,
      banner TEXT,
      thumbnail TEXT,
      is_featured INTEGER NOT NULL DEFAULT 0,
      is_popular INTEGER NOT NULL DEFAULT 0,
      is_trending INTEGER NOT NULL DEFAULT 0,
      trending_rank INTEGER,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS anime_genres (
      anime_id TEXT NOT NULL,
      genre TEXT NOT NULL,
      FOREIGN KEY (anime_id) REFERENCES anime(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS anime_tags (
      anime_id TEXT NOT NULL,
      tag TEXT NOT NULL,
      FOREIGN KEY (anime_id) REFERENCES anime(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS anime_relations (
      anime_id TEXT NOT NULL,
      related_anime_id TEXT NOT NULL,
      FOREIGN KEY (anime_id) REFERENCES anime(id) ON DELETE CASCADE,
      FOREIGN KEY (related_anime_id) REFERENCES anime(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS episodes (
      id TEXT PRIMARY KEY,
      anime_id TEXT NOT NULL,
      number INTEGER NOT NULL,
      title TEXT NOT NULL,
      synopsis TEXT,
      duration INTEGER,
      video_sources TEXT,
      video_url TEXT,
      thumbnail TEXT,
      air_date TEXT,
      created_at TEXT NOT NULL,
      FOREIGN KEY (anime_id) REFERENCES anime(id) ON DELETE CASCADE
    );

    CREATE INDEX IF NOT EXISTS idx_episodes_anime ON episodes(anime_id);

    CREATE TABLE IF NOT EXISTS promos (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      copy TEXT NOT NULL,
      action TEXT
    );

    CREATE TABLE IF NOT EXISTS homepage_stats (
      id TEXT PRIMARY KEY,
      label TEXT NOT NULL,
      value TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS plans (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      price_monthly REAL NOT NULL,
      price_yearly REAL NOT NULL,
      highlight INTEGER NOT NULL DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS plan_features (
      id TEXT PRIMARY KEY,
      plan_id TEXT NOT NULL,
      feature TEXT NOT NULL,
      FOREIGN KEY (plan_id) REFERENCES plans(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS benefits (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      description TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS site_content (
      key TEXT PRIMARY KEY,
      payload TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS community_posts (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      title TEXT NOT NULL,
      message TEXT NOT NULL,
      tags TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS community_post_likes (
      post_id TEXT NOT NULL,
      user_id TEXT NOT NULL,
      created_at TEXT NOT NULL,
      PRIMARY KEY (post_id, user_id),
      FOREIGN KEY (post_id) REFERENCES community_posts(id) ON DELETE CASCADE,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS community_comments (
      id TEXT PRIMARY KEY,
      post_id TEXT NOT NULL,
      user_id TEXT NOT NULL,
      message TEXT NOT NULL,
      created_at TEXT NOT NULL,
      FOREIGN KEY (post_id) REFERENCES community_posts(id) ON DELETE CASCADE,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS favorites (
      user_id TEXT NOT NULL,
      anime_id TEXT NOT NULL,
      created_at TEXT NOT NULL,
      PRIMARY KEY (user_id, anime_id),
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (anime_id) REFERENCES anime(id) ON DELETE CASCADE
    );
  `);

  const ensureColumn = (table, column, definition) => {
    const info = db.prepare(`PRAGMA table_info(${table})`).all();
    const exists = info.some((row) => row.name === column);
    if (!exists) {
      db.exec(`ALTER TABLE ${table} ADD COLUMN ${definition}`);
    }
  };

  ensureColumn("anime", "hero_sources", "hero_sources TEXT");
  ensureColumn("episodes", "video_sources", "video_sources TEXT");
};

export const initDb = () => {
  if (dbInstance) {
    return dbInstance;
  }

  const file = resolveDbFile();
  const db = new Database(file);
  db.pragma("journal_mode = WAL");
  db.pragma("foreign_keys = ON");
  runMigrations(db);
  dbInstance = db;
  return dbInstance;
};

export const getDb = () => {
  if (!dbInstance) {
    throw new Error("Database accessed before initialization");
  }
  return dbInstance;
};

export const resetDb = () => {
  const db = initDb();
  const tables = [
    "refresh_tokens",
    "favorites",
    "community_post_likes",
    "community_comments",
    "community_posts",
    "plan_features",
    "plans",
    "benefits",
    "site_content",
    "homepage_stats",
    "promos",
    "episodes",
    "anime_relations",
    "anime_tags",
    "anime_genres",
    "anime",
    "users"
  ];
  tables.forEach((table) => {
    db.prepare(`DELETE FROM ${table}`).run();
  });
  return db;
};

export const closeDb = () => {
  if (dbInstance) {
    dbInstance.close();
    dbInstance = undefined;
  }
};

export default {
  initDb,
  getDb,
  resetDb,
  closeDb,
};
