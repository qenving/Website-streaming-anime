import { useEffect, useMemo, useRef, useState } from "react";
import { MessageCirclePlus, Play } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { AnimeCard, LoadingSpinner, Player, SectionHeading } from "../../../components";
import SEO from "../../../components/SEO";
import { useAuthContext } from "../../../context/AuthContext";
import useFavorites from "../../../hooks/useFavorites";
import { fetchAnimeBySlug, fetchEpisodes, fetchRelatedAnime } from "../../../utils/apiPlaceholders";

const SITE_URL = import.meta.env.VITE_SITE_URL || "https://neonwave.app";

const WatchEpisodePage = () => {
  const { anime: slug, episode } = useParams();
  const episodeNumber = Number(episode) || 1;
  const { user } = useAuthContext();
  const { toggle, isFavorite } = useFavorites();
  const playerRef = useRef(null);
  const [isPlayerVisible, setIsPlayerVisible] = useState(false);
  const [favoriteError, setFavoriteError] = useState("");

  const { data: anime, isLoading: animeLoading } = useQuery({
    queryKey: ["anime", slug],
    queryFn: () => fetchAnimeBySlug(slug),
    enabled: Boolean(slug),
  });

  const { data: episodesData, isLoading: episodesLoading } = useQuery({
    queryKey: ["episodes", slug],
    queryFn: () => fetchEpisodes(slug, 1, 200),
    enabled: Boolean(slug),
  });

  const { data: recommendations = [] } = useQuery({
    queryKey: ["recommendations", slug],
    queryFn: () => fetchRelatedAnime(slug),
    enabled: Boolean(slug),
  });

  useEffect(() => {
    if (!playerRef.current) return undefined;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsPlayerVisible(true);
        observer.disconnect();
      }
    }, { threshold: 0.25 });
    observer.observe(playerRef.current);
    return () => observer.disconnect();
  }, []);

  const episodes = episodesData?.episodes ?? [];

  const currentEpisode = useMemo(() => {
    if (!episodes.length) return undefined;
    return episodes.find((item) => item.number === episodeNumber) ?? episodes[0];
  }, [episodes, episodeNumber]);

  const navEpisodes = useMemo(() => {
    if (!episodes.length || !currentEpisode) return { prev: null, next: null };
    const index = episodes.findIndex((item) => item.number === currentEpisode.number);
    return {
      prev: index > 0 ? episodes[index - 1] : null,
      next: index >= 0 && index < episodes.length - 1 ? episodes[index + 1] : null,
    };
  }, [episodes, currentEpisode]);

  const schema = useMemo(() => {
    if (!anime || !currentEpisode) return undefined;
    return {
      "@context": "https://schema.org",
      "@type": "TVEpisode",
      name: `${anime.title} - Episode ${currentEpisode.number}`,
      episodeNumber: currentEpisode.number,
      partOfSeries: {
        "@type": "TVSeries",
        name: anime.title,
      },
      description: currentEpisode.synopsis,
      image: anime.banner,
      url: `${SITE_URL}/watch/${anime.slug}/${currentEpisode.number}`,
    };
  }, [anime, currentEpisode]);

  const handleFavorite = () => {
    if (!anime) return;
    toggle(anime.slug).catch((err) => {
      const message = err.response?.data?.message ?? "Login to save favorites.";
      setFavoriteError(message);
      setTimeout(() => setFavoriteError(""), 3000);
    });
  };

  if (animeLoading || episodesLoading || !anime || !currentEpisode) {
    return (
      <div className="container py-24">
        <LoadingSpinner label="Loading stream" />
      </div>
    );
  }

  return (
    <div className="container space-y-12 pb-16 pt-8">
      <SEO
        title={`${anime.title} Episode ${currentEpisode.number} | NeonWave`}
        description={currentEpisode.synopsis}
        image={anime.banner}
        url={`${SITE_URL}/watch/${anime.slug}/${currentEpisode.number}`}
        keywords={[anime.title, ...(anime.genres ?? [])]}
        schema={schema}
      />
      <header className="space-y-4 text-slate-900 transition dark:text-white">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-highlight/80">{anime.title}</p>
        <h1 className="text-3xl font-semibold text-slate-900 dark:text-white">
          Episode {currentEpisode.number}: {currentEpisode.title}
        </h1>
        <p className="max-w-3xl text-sm text-slate-600 dark:text-gray-300">{currentEpisode.synopsis}</p>
        <div className="flex flex-wrap gap-3 text-xs uppercase tracking-wide text-slate-600 dark:text-gray-400">
          <span className="rounded-full border border-slate-200 px-3 py-1 dark:border-white/10">Duration {currentEpisode.duration} min</span>
          <span className="rounded-full border border-slate-200 px-3 py-1 dark:border-white/10">Aired {new Date(currentEpisode.airDate).toLocaleDateString()}</span>
          <button
            type="button"
            onClick={handleFavorite}
            className={`rounded-full border px-3 py-1 transition ${
              isFavorite(anime.slug)
                ? "border-highlight text-highlight"
                : "border-slate-200 text-slate-700 hover:border-highlight hover:text-highlight dark:border-white/10 dark:text-gray-200"
            }`}
          >
            {isFavorite(anime.slug) ? "In Favorites" : "Add to Favorites"}
          </button>
        </div>
        {favoriteError && <p className="text-xs font-semibold text-red-500 dark:text-red-400">{favoriteError}</p>}
      </header>

      <div ref={playerRef}>
        <Player title={anime.title} videoSrc={isPlayerVisible ? anime.heroVideo : undefined} poster={anime.banner} />
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4 text-slate-700 transition dark:text-gray-300">
        <div className="flex gap-3">
          {navEpisodes.prev ? (
            <Link
              to={`/watch/${slug}/${navEpisodes.prev.number}`}
              className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-4 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-slate-700 transition hover:border-highlight hover:text-highlight dark:border-white/10 dark:text-gray-200"
            >
              Prev Episode {navEpisodes.prev.number}
            </Link>
          ) : (
            <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-4 py-2 text-xs uppercase tracking-[0.25em] text-slate-500 dark:border-white/5 dark:text-gray-500">
              Start of Season
            </span>
          )}
          {navEpisodes.next ? (
            <Link
              to={`/watch/${slug}/${navEpisodes.next.number}`}
              className="inline-flex items-center gap-2 rounded-full bg-highlight px-4 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-white transition hover:bg-highlight/90"
            >
              Next Episode {navEpisodes.next.number}
            </Link>
          ) : (
            <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-4 py-2 text-xs uppercase tracking-[0.25em] text-slate-500 dark:border-white/5 dark:text-gray-500">
              Awaiting new release
            </span>
          )}
        </div>
        <Link
          to={`/anime/${slug}`}
          className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-4 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-slate-700 transition hover:border-highlight hover:text-highlight dark:border-white/10 dark:text-gray-200"
        >
          <Play size={14} /> Episode Guide
        </Link>
      </div>

      <section className="grid gap-8 lg:grid-cols-[2fr_1fr]">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 text-slate-900 transition dark:border-white/10 dark:bg-white/5 dark:text-white">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Comment Feed</h2>
          <p className="mt-2 text-sm text-slate-600 dark:text-gray-400">
            Wire this panel to the community API or your chat service to enable real-time episode reactions and polls.
          </p>
          <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-100/70 p-4 transition dark:border-white/10 dark:bg-black/30">
            <div className="flex items-center gap-3 text-sm text-slate-700 dark:text-gray-300">
              <MessageCirclePlus size={18} className="text-highlight" />
              {user ? `Signed in as ${user.name}` : "Guest mode active"}
            </div>
            <textarea
              disabled
              rows={4}
              className="mt-4 w-full rounded-2xl border border-dashed border-slate-300 bg-transparent p-4 text-sm text-slate-600 dark:border-white/20 dark:text-gray-400"
              placeholder="Connect your backend to enable rich chat, polls, and synced emotes."
            />
            <button
              type="button"
              disabled
              className="mt-4 inline-flex cursor-not-allowed items-center gap-2 rounded-full bg-highlight/40 px-5 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-white/80 dark:text-white/60"
            >
              Commenting Disabled in Demo
            </button>
          </div>
        </div>
        <div className="space-y-6">
          <SectionHeading title="You may also like" eyebrow="Smart Queue" />
          <div className="grid gap-4">
            {recommendations.map((item) => (
              <AnimeCard
                key={item.id}
                anime={item}
                onToggleFavorite={() => toggleFavoriteSlug(item.slug)}
                isFavorite={isFavorite(item.slug)}
              />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default WatchEpisodePage;
