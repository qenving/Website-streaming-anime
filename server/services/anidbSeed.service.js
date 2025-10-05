import { nanoid } from "nanoid";
import logger from "../config/logger.js";
import { fetchAniDbRandom } from "./anidb.service.js";

const sanitizeText = (value) =>
  value
    ? value
        .replace(/\r?\n+/g, "\n")
        .replace(/<br\s*\/?\s*>/gi, "\n")
        .replace(/<[^>]+>/g, "")
        .trim()
    : "";

const formatLabel = (value) =>
  value
    ? value
        .replace(/_/g, " ")
        .replace(/\s+/g, " ")
        .replace(/(^|\s)[a-z]/g, (match) => match.toUpperCase())
        .trim()
    : value;

const pickTitle = (anime) => {
  const titles = anime.titles ?? [];
  const main = titles.find((title) => title.type === "main");
  const english = titles.find((title) => title.language === "en");
  const short = titles.find((title) => title.type === "short");
  return english?.title ?? main?.title ?? short?.title ?? `AniDB ${anime.id}`;
};

export const loadAniDbSeed = async () => {
  try {
    const recommendations = await fetchAniDbRandom({ refresh: true });
    const timestamp = new Date().toISOString();
    const anime = [];
    const episodes = [];

    recommendations.forEach((entry, index) => {
      const id = `anidb-${entry.id ?? nanoid()}`;
      const title = pickTitle(entry);
      const sortedTags = (entry.tags ?? [])
        .slice()
        .sort((a, b) => (b.weight ?? 0) - (a.weight ?? 0));
      const genres = sortedTags.slice(0, 4).map((tag) => formatLabel(tag.name));
      const tagNames = sortedTags.slice(0, 10).map((tag) => formatLabel(tag.name));
      const rawScore = Number(entry.ratings?.permanent?.score ?? entry.ratings?.temporary?.score ?? 0);
      const rating = rawScore ? Math.round((rawScore / 2) * 10) / 10 : 0;
      const studio = entry.creators?.find((creator) => creator.type?.toLowerCase().includes("animation"))?.name;
      const status = entry.endDate ? "Completed" : entry.startDate ? "Airing" : "Upcoming";
      const releaseYear = entry.startDate ? Number(entry.startDate.slice(0, 4)) : new Date().getFullYear();

      anime.push({
        id,
        title,
        synopsis:
          sanitizeText(entry.description) ||
          "This title was pulled live from AniDB. Provide your own synopsis to replace this placeholder.",
        rating,
        maturity: entry.ageRestricted ? "18+" : "13+",
        studio: studio ?? "Independent Studio",
        status,
        releaseYear,
        genres: genres.filter(Boolean),
        tags: tagNames.filter(Boolean),
        banner: entry.picture ?? null,
        thumbnail: entry.picture ?? null,
        heroVideo: "https://storage.googleapis.com/coverr-main/mp4/Mt_Baker.mp4",
        isFeatured: index < 2,
        isPopular: rating >= 3.5,
        isTrending: index < 4,
        trendingRank: index + 1,
        related: [],
        createdAt: timestamp,
        updatedAt: timestamp,
      });

      const episodeList = (entry.episodes ?? [])
        .filter((episode) => !episode.type || episode.type === 1)
        .slice(0, 24);

      episodeList.forEach((episode, episodeIndex) => {
        episodes.push({
          id: `anidb-ep-${entry.id}-${episode.id ?? episodeIndex}`,
          animeId: id,
          number: Number(episode.episodeNumber ?? episodeIndex + 1) || episodeIndex + 1,
          title:
            episode.titles?.find((title) => title.language === "en")?.title ??
            episode.titles?.[0]?.title ??
            `Episode ${episodeIndex + 1}`,
          synopsis:
            sanitizeText(episode.summary) ||
            "Episode data sourced from AniDB. Add your localized synopsis for more context.",
          duration: episode.length ?? null,
          videoUrl: null,
          thumbnail: entry.picture ?? null,
          airDate: episode.airDate ?? timestamp,
          createdAt: timestamp,
        });
      });
    });

    logger.info(
      { imported: anime.length },
      "Loaded AniDB recommendations for seeding"
    );

    return { anime, episodes };
  } catch (error) {
    logger.warn({ error }, "AniDB seed fallback engaged; continuing with local seed data");
    return { anime: [], episodes: [] };
  }
};
