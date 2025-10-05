import { nanoid } from "nanoid";
import logger from "../config/logger.js";
import { initDb, resetDb } from "../db/database.js";
import {
  buildAnimeSeed,
  commentSeed,
  communitySeed,
  homepagePromos,
  homepageStats,
  premiumBenefits,
  premiumPlans,
} from "../db/seedData.js";
import { hashPassword } from "../utils/password.js";

export const seedDatabase = async () => {
  await initDb();
  const db = await resetDb();
  const timestamp = new Date().toISOString();

  const adminPassword = process.env.SEED_ADMIN_PASSWORD ?? "AdminPass123!";
  const demoPassword = process.env.SEED_DEMO_PASSWORD ?? "DemoPass123!";

  const adminId = nanoid();
  const demoId = nanoid();

  const users = [
    {
      id: adminId,
      name: "Nova Admin",
      email: "admin@neonwave.app",
      passwordHash: await hashPassword(adminPassword),
      role: "admin",
      isPremium: true,
      createdAt: timestamp,
      updatedAt: timestamp,
    },
    {
      id: demoId,
      name: "Echo Demo",
      email: "demo@neonwave.app",
      passwordHash: await hashPassword(demoPassword),
      role: "user",
      isPremium: false,
      createdAt: timestamp,
      updatedAt: timestamp,
    },
  ];

  const { anime, episodes, genres } = buildAnimeSeed();

  const posts = communitySeed.map((post, index) => {
    const owner = index === 0 ? demoId : adminId;
    const author = users.find((user) => user.id === owner);
    return {
      ...post,
      userId: owner,
      author: author?.name ?? "NeonWave Fan",
      likedBy: index === 0 ? [adminId] : [],
      createdAt: post.createdAt ?? timestamp,
      updatedAt: timestamp,
    };
  });

  const comments = commentSeed(posts).map((comment) => ({
    ...comment,
    id: comment.id ?? nanoid(),
    userId: adminId,
    author: users.find((user) => user.id === adminId)?.name ?? "Nova Admin",
    createdAt: comment.createdAt ?? timestamp,
  }));

  if (posts[0]) {
    posts[0].comments = comments.filter((comment) => comment.postId === posts[0].id);
  }

  const favorites = [
    {
      id: nanoid(),
      userId: demoId,
      animeId: anime[0]?.id,
      createdAt: timestamp,
    },
    {
      id: nanoid(),
      userId: demoId,
      animeId: anime[1]?.id,
      createdAt: timestamp,
    },
  ].filter((entry) => Boolean(entry.animeId));

  db.data.users = users;
  db.data.refreshTokens = [];
  db.data.anime = anime;
  db.data.episodes = episodes;
  db.data.genres = genres;
  db.data.posts = posts;
  db.data.comments = comments;
  db.data.favorites = favorites;
  db.data.promos = homepagePromos;
  db.data.stats = homepageStats;
  db.data.plans = premiumPlans;
  db.data.benefits = premiumBenefits;

  await db.write();
  logger.info("Database seeded successfully");
};
