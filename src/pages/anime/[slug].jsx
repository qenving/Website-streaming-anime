import { Clock, Flame, Heart, Play } from "lucide-react";
import { useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { AnimeCard, LoadingSpinner, Pagination, Player, SectionHeading } from "../../components";
import SEO from "../../components/SEO";
import { fetchAnimeBySlug, fetchEpisodes, fetchRelatedAnime } from "../../utils/apiPlaceholders";
import useFavorites from "../../hooks/useFavorites";

const SITE_URL = import.meta.env.VITE_SITE_URL || "https://neonwave.app";

const AnimeDetailPage = () => {
  const { slug } = useParams();
  const [page, setPage] = useState(1);
  const { toggle, isFavorite } = useFavorites();
  const [favoriteError, setFavoriteError] = useState("");

  const { data: anime, isLoading } = useQuery({
    queryKey: ["anime", slug],
    queryFn: () => fetchAnimeBySlug(slug),
    enabled: Boolean(slug),
  });

  const { data: related = [] } = useQuery({
    queryKey: ["related", slug],
    queryFn: () => fetchRelatedAnime(slug),
    enabled: Boolean(slug),
  });

  const { data: episodeData } = useQuery({
    queryKey: ["episodes", slug, page],
    queryFn: () => fetchEpisodes(slug, page, 12),
    enabled: Boolean(slug),
    keepPreviousData: true,
  });

  const schema = useMemo(() => {
    if (!anime) return undefined;
    return {
      "@context": "https://schema.org",
      "@type": "TVSeries",
      name: anime.title,
      description: anime.synopsis,
      genre: anime.genres,
      image: anime.banner,
      url: `${SITE_URL}/anime/${anime.slug}`,
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: anime.rating,
        bestRating: 5,
        ratingCount: Math.max(100, Math.round(anime.rating * 120)),
      },
    };
  }, [anime]);

  if (isLoading || !anime) {
    return (
      <div className="container py-24">
        <LoadingSpinner label="Loading anime" />
      </div>
    );
  }

  const episodes = episodeData?.episodes ?? [];
  const totalPages = episodeData ? Math.max(1, Math.ceil(episodeData.total / episodeData.pageSize)) : 1;

  const handleToggleFavorite = (slugValue) => {
    toggle(slugValue).catch((err) => {
      const message = err.response?.data?.message ?? "Login to save favorites.";
      setFavoriteError(message);
      setTimeout(() => setFavoriteError(""), 3000);
    });
  };

  return (
    <div className="pb-16">
      <SEO
        title={`${anime.title} | NeonWave`}
        description={anime.synopsis}
        image={anime.banner}
        url={`${SITE_URL}/anime/${anime.slug}`}
        keywords={anime.genres}
        schema={schema}
      />
      <section className="relative mb-16 overflow-hidden border-b border-slate-200 bg-white transition dark:border-white/5 dark:bg-white/5">
        <div className="container grid gap-10 py-12 text-slate-900 transition dark:text-white lg:grid-cols-[1.8fr_1fr]">
          <div className="space-y-6">
            <span className="inline-flex items-center gap-2 rounded-full bg-highlight/20 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-highlight">
              {anime.genres.join(" / ")}
            </span>
            <h1 className="text-4xl font-semibold text-slate-900 dark:text-white">{anime.title}</h1>
            <p className="text-sm leading-relaxed text-slate-600 dark:text-gray-200">{anime.synopsis}</p>
            <div className="flex flex-wrap items-center gap-4 text-xs uppercase tracking-wide text-slate-600 dark:text-gray-300">
              <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-3 py-1 dark:border-white/10">
                <Flame size={14} /> Rating {anime.rating}
              </span>
              <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-3 py-1 dark:border-white/10">
                <Clock size={14} /> {anime.status}
              </span>
              <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-3 py-1 dark:border-white/10">
                Studio {anime.studio}
              </span>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link
                to={`/watch/${anime.slug}/${anime.firstEpisodeNumber ?? 1}`}
                className="inline-flex items-center gap-2 rounded-full bg-highlight px-6 py-3 text-xs font-semibold uppercase tracking-[0.3em] text-white transition hover:bg-highlight/90"
              >
                <Play size={16} /> Watch Now
              </Link>
              <button
                type="button"
                onClick={() => handleToggleFavorite(anime.slug)}
                className={`inline-flex items-center gap-2 rounded-full border px-6 py-3 text-xs font-semibold uppercase tracking-[0.3em] transition ${
                  isFavorite(anime.slug)
                    ? "border-highlight text-highlight"
                    : "border-slate-200 text-slate-700 hover:border-highlight hover:text-highlight dark:border-white/10 dark:text-gray-200"
                }`}
              >
                <Heart size={16} /> {isFavorite(anime.slug) ? "In Favorites" : "Add to Favorites"}
              </button>
            </div>
            {favoriteError && <p className="text-xs font-semibold text-red-500 dark:text-red-400">{favoriteError}</p>}
          </div>
          <div className="flex flex-col gap-6">
            <Player title={anime.title} poster={anime.banner} videoSrc={anime.heroVideo} sources={anime.heroSources} />
            <div className="rounded-3xl border border-slate-200 bg-white p-6 text-sm text-slate-600 transition dark:border-white/10 dark:bg-white/5 dark:text-gray-300">
              <p>
                This is a placeholder player. Connect to your media API and pass down stream URLs to unlock playback and
                analytics.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="container space-y-8">
        <SectionHeading title="Episode List" eyebrow="Binge Order" />
        <div className="grid gap-4 lg:grid-cols-2">
          {episodes.map((episode) => (
            <Link
              key={episode.id}
              to={`/watch/${anime.slug}/${episode.number}`}
              className="group flex gap-4 rounded-3xl border border-slate-200 bg-white p-4 transition hover:border-highlight/60 dark:border-white/10 dark:bg-white/5"
            >
              <img
                src={episode.thumbnail}
                alt={episode.title}
                loading="lazy"
                className="h-28 w-44 rounded-2xl object-cover"
              />
              <div className="flex flex-col justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-600 dark:text-gray-400">Episode {episode.number}</p>
                  <h3 className="text-lg font-semibold text-slate-900 transition group-hover:text-highlight dark:text-white">{episode.title}</h3>
                  <p className="mt-2 line-clamp-2 text-sm text-slate-600 dark:text-gray-300">{episode.synopsis}</p>
                </div>
                <span className="text-xs uppercase tracking-wide text-slate-500 dark:text-gray-400">Duration {episode.duration} min</span>
              </div>
            </Link>
          ))}
        </div>
        <Pagination current={episodeData?.page ?? page} total={totalPages} onChange={(value) => setPage(value)} />
      </section>

      <section className="container mt-16">
        <SectionHeading title="Related Anime" eyebrow="You may also like" />
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {related.map((item) => (
            <AnimeCard
              key={item.id}
              anime={item}
              onToggleFavorite={handleToggleFavorite}
              isFavorite={isFavorite(item.slug)}
            />
          ))}
        </div>
        {related.length === 0 && (
          <p className="mt-4 text-sm text-slate-600 dark:text-gray-400">
            More recommendations arrive once your content graph is connected.
          </p>
        )}
      </section>
    </div>
  );
};

export default AnimeDetailPage;
