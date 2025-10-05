import { nanoid } from "nanoid";
import logger from "../config/logger.js";
import { initDb, resetDb } from "./database.js";
import {
  buildAnimeSeed,
  commentSeed,
  communitySeed,
  homepagePromos,
  homepageStats,
  premiumBenefits,
  premiumPlans,
} from "./seedData.js";
import { hashPassword } from "../utils/password.js";
import { loadAniDbSeed } from "../services/anidbSeed.service.js";

const slugify = (value) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+/, "")
    .replace(/-+$/, "");

export const seedDatabase = async () => {
  const db = initDb();
  resetDb();

  const timestamp = new Date().toISOString();

  const adminPassword = process.env.SEED_ADMIN_PASSWORD ?? "AdminPass123!";
  const demoPassword = process.env.SEED_DEMO_PASSWORD ?? "DemoPass123!";

  const adminId = nanoid();
  const demoId = nanoid();

  const adminUser = {
    id: adminId,
    name: "Nova Admin",
    email: "admin@neonwave.app",
    passwordHash: await hashPassword(adminPassword),
    role: "admin",
    is_premium: 1,
    created_at: timestamp,
    updated_at: timestamp,
  };

  const demoUser = {
    id: demoId,
    name: "Echo Demo",
    email: "demo@neonwave.app",
    passwordHash: await hashPassword(demoPassword),
    role: "user",
    is_premium: 0,
    created_at: timestamp,
    updated_at: timestamp,
  };

  const baseSeed = buildAnimeSeed();
  const anidbSeed = await loadAniDbSeed();

  const usedSlugs = new Set();
  const animeRecords = [];
  const genresRecords = [];
  const tagsRecords = [];
  const relationRecords = [];
  const episodeRecords = [];

  const registerAnime = (anime, episodes) => {
    let slug = slugify(anime.slug ?? anime.title ?? nanoid());
    if (!slug) {
      slug = nanoid();
    }
    const baseSlug = slug;
    let counter = 1;
    while (usedSlugs.has(slug)) {
      slug = `${baseSlug}-${counter++}`;
    }
    usedSlugs.add(slug);

    const record = {
      id: anime.id ?? nanoid(),
      slug,
      title: anime.title,
      synopsis: anime.synopsis,
      rating: anime.rating ?? 0,
      maturity: anime.maturity ?? "13+",
      studio: anime.studio ?? "Unknown Studio",
      status: anime.status ?? "Airing",
      release_year: anime.releaseYear ?? new Date().getFullYear(),
      hero_video: anime.heroVideo ?? null,
      banner: anime.banner ?? anime.thumbnail ?? null,
      thumbnail: anime.thumbnail ?? anime.banner ?? null,
      is_featured: anime.isFeatured ? 1 : 0,
      is_popular: anime.isPopular ? 1 : 0,
      is_trending: anime.isTrending ? 1 : 0,
      trending_rank: anime.trendingRank ?? null,
      created_at: anime.createdAt ?? timestamp,
      updated_at: anime.updatedAt ?? timestamp,
      tags: anime.tags ?? [],
      genres: anime.genres ?? [],
      related: anime.related ?? [],
    };

    animeRecords.push(record);

    Array.from(new Set(record.genres)).forEach((genre) => {
      genresRecords.push({ anime_id: record.id, genre });
    });
    Array.from(new Set(record.tags)).forEach((tag) => {
      tagsRecords.push({ anime_id: record.id, tag });
    });
    record.related.forEach((relatedSlug) => {
      relationRecords.push({ source_slug: record.slug, target_slug: relatedSlug });
    });

    episodes.forEach((episode) => {
      episodeRecords.push({
        id: episode.id ?? nanoid(),
        anime_id: record.id,
        number: episode.number ?? episode.episodeNumber ?? 1,
        title: episode.title ?? episode.name ?? `Episode ${episode.number ?? 1}`,
        synopsis:
          episode.synopsis ??
          episode.summary ??
          "Catch the latest adventure straight from the NeonWave data stream.",
        duration: episode.duration ?? episode.length ?? null,
        video_url: episode.videoUrl ?? episode.video_url ?? record.hero_video,
        thumbnail: episode.thumbnail ?? record.thumbnail,
        air_date: episode.airDate ?? episode.air_date ?? timestamp,
        created_at: episode.createdAt ?? timestamp,
      });
    });

    return record;
  };

  baseSeed.anime.forEach((anime) => {
    registerAnime(anime, baseSeed.episodes.filter((episode) => episode.animeId === anime.id));
  });

  anidbSeed.anime.forEach((anime) => {
    registerAnime(anime, anidbSeed.episodes.filter((episode) => episode.animeId === anime.id));
  });

  const insertUser = db.prepare(
    `INSERT INTO users (id, name, email, password_hash, role, is_premium, created_at, updated_at)
     VALUES (@id, @name, @email, @passwordHash, @role, @is_premium, @created_at, @updated_at)`
  );
  const insertAnime = db.prepare(
    `INSERT INTO anime (id, slug, title, synopsis, rating, maturity, studio, status, release_year, hero_video, banner, thumbnail, is_featured, is_popular, is_trending, trending_rank, created_at, updated_at)
     VALUES (@id, @slug, @title, @synopsis, @rating, @maturity, @studio, @status, @release_year, @hero_video, @banner, @thumbnail, @is_featured, @is_popular, @is_trending, @trending_rank, @created_at, @updated_at)`
  );
  const insertGenre = db.prepare(
    `INSERT INTO anime_genres (anime_id, genre) VALUES (@anime_id, @genre)`
  );
  const insertTag = db.prepare(`INSERT INTO anime_tags (anime_id, tag) VALUES (@anime_id, @tag)`);
  const insertRelation = db.prepare(
    `INSERT INTO anime_relations (anime_id, related_anime_id) VALUES (?, ?)`
  );
  const insertEpisode = db.prepare(
    `INSERT INTO episodes (id, anime_id, number, title, synopsis, duration, video_url, thumbnail, air_date, created_at)
     VALUES (@id, @anime_id, @number, @title, @synopsis, @duration, @video_url, @thumbnail, @air_date, @created_at)`
  );
  const insertPromo = db.prepare(
    `INSERT INTO promos (id, title, copy, action) VALUES (@id, @title, @copy, @action)`
  );
  const insertStat = db.prepare(
    `INSERT INTO homepage_stats (id, label, value) VALUES (@id, @label, @value)`
  );
  const insertPlan = db.prepare(
    `INSERT INTO plans (id, name, price_monthly, price_yearly, highlight) VALUES (@id, @name, @priceMonthly, @priceYearly, @highlight)`
  );
  const insertPlanFeature = db.prepare(
    `INSERT INTO plan_features (id, plan_id, feature) VALUES (@id, @plan_id, @feature)`
  );
  const insertBenefit = db.prepare(
    `INSERT INTO benefits (id, title, description) VALUES (@id, @title, @description)`
  );
  const insertPost = db.prepare(
    `INSERT INTO community_posts (id, user_id, title, message, tags, created_at, updated_at)
     VALUES (@id, @userId, @title, @message, @tags, @createdAt, @updatedAt)`
  );
  const insertLike = db.prepare(
    `INSERT INTO community_post_likes (post_id, user_id, created_at) VALUES (?, ?, ?)`
  );
  const insertComment = db.prepare(
    `INSERT INTO community_comments (id, post_id, user_id, message, created_at) VALUES (@id, @postId, @userId, @message, @createdAt)`
  );
  const insertFavorite = db.prepare(
    `INSERT INTO favorites (user_id, anime_id, created_at) VALUES (?, ?, ?)`
  );

  const relationLookup = new Map(animeRecords.map((anime) => [anime.slug, anime.id]));

  const transaction = db.transaction(() => {
    insertUser.run(adminUser);
    insertUser.run(demoUser);

    animeRecords.forEach((anime) => {
      insertAnime.run(anime);
    });
    genresRecords.forEach((genre) => insertGenre.run(genre));
    tagsRecords.forEach((tag) => insertTag.run(tag));
    relationRecords.forEach((relation) => {
      const sourceId = relationLookup.get(relation.source_slug);
      const targetId = relationLookup.get(relation.target_slug);
      if (sourceId && targetId && sourceId !== targetId) {
        insertRelation.run(sourceId, targetId);
      }
    });
    episodeRecords.forEach((episode) => insertEpisode.run(episode));

    homepagePromos.forEach((promo) => insertPromo.run(promo));
    homepageStats.forEach((stat) => insertStat.run(stat));

    premiumPlans.forEach((plan) => {
      insertPlan.run({
        id: plan.id,
        name: plan.name,
        priceMonthly: plan.priceMonthly,
        priceYearly: plan.priceYearly,
        highlight: plan.highlight ? 1 : 0,
      });
      (plan.features ?? []).forEach((feature) =>
        insertPlanFeature.run({ id: nanoid(), plan_id: plan.id, feature })
      );
    });

    premiumBenefits.forEach((benefit) => insertBenefit.run({ ...benefit, id: benefit.id ?? nanoid() }));

    const posts = communitySeed.map((post, index) => {
      const owner = index === 0 ? demoId : adminId;
      const tags = JSON.stringify(post.tags ?? []);
      const createdAt = post.createdAt ?? timestamp;
      const likedBy = post.likedBy ?? (index === 0 ? [adminId] : []);
      const record = {
        id: post.id ?? nanoid(),
        userId: owner,
        title: post.title,
        message: post.message,
        tags,
        createdAt,
        updatedAt: timestamp,
      };
      insertPost.run(record);
      likedBy.forEach((user) => insertLike.run(record.id, user, createdAt));
      return record;
    });

    commentSeed(posts).forEach((comment) => {
      insertComment.run({
        id: comment.id ?? nanoid(),
        postId: comment.postId,
        userId: comment.userId ?? adminId,
        message: comment.message,
        createdAt: comment.createdAt ?? timestamp,
      });
    });

    const favoriteCandidates = animeRecords.slice(0, 5).map((anime) => anime.id);
    favoriteCandidates.forEach((animeId, index) => {
      if (animeId) {
        insertFavorite.run(demoId, animeId, new Date(Date.now() - index * 3600 * 1000).toISOString());
      }
    });
  });

  transaction();

  logger.info(
    {
      animeCount: animeRecords.length,
      episodeCount: episodeRecords.length,
      userCount: 2,
      anidbImported: anidbSeed.anime.length,
    },
    "Database seeded successfully"
  );
};
