import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { AnimeCard, LoadingSpinner, SearchBar, SectionHeading } from "../components";
import SEO from "../components/SEO";
import useFavorites from "../hooks/useFavorites";
import { fetchAniDbRandom, searchAnime } from "../utils/apiPlaceholders";

const SITE_URL = import.meta.env.VITE_SITE_URL || "https://neonwave.app";

const SearchPage = () => {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const initialQuery = params.get("q") ?? "";
  const [searchTerm, setSearchTerm] = useState(initialQuery);
  const [submittedQuery, setSubmittedQuery] = useState(initialQuery);
  const [favoriteError, setFavoriteError] = useState("");
  const { toggle, isFavorite } = useFavorites();

  useEffect(() => {
    setSearchTerm(initialQuery);
    setSubmittedQuery(initialQuery);
  }, [initialQuery]);

  const {
    data,
    isFetching,
    isError,
    error,
  } = useQuery({
    queryKey: ["search", submittedQuery],
    queryFn: () => searchAnime({ query: submittedQuery }),
    enabled: Boolean(submittedQuery && submittedQuery.trim().length > 0),
    keepPreviousData: true,
  });

  const results = data?.items ?? [];
  const total = data?.total ?? 0;

  const {
    data: aniDbRecommendations,
    isFetching: aniDbFetching,
    isError: aniDbError,
    error: aniDbErrorDetails,
  } = useQuery({
    queryKey: ["anidb", submittedQuery],
    queryFn: () => fetchAniDbRandom({ refresh: true }),
    enabled: Boolean(submittedQuery && submittedQuery.trim().length > 0),
    staleTime: 1000 * 60 * 10,
  });

  const aniDbItems = useMemo(() => {
    if (!aniDbRecommendations) return [];
    return aniDbRecommendations.map((item) => {
      const titles = item.titles ?? [];
      const english = titles.find((title) => title.language === "en");
      const main = titles.find((title) => title.type === "main");
      const fallbackTitle = titles[0]?.title ?? `AniDB #${item.id}`;
      const title = english?.title ?? main?.title ?? fallbackTitle;
      const synopsis = (item.description ?? "").replace(/\s+/g, " ").trim();
      const tags = (item.tags ?? [])
        .map((tag) => tag.name)
        .filter(Boolean)
        .slice(0, 5);
      const resources = Array.isArray(item.resources) ? item.resources : [];
      const externalUrl = resources
        .flatMap((resource) => (Array.isArray(resource.externalEntity) ? resource.externalEntity : []))
        .find((entity) => entity?.url)?.url;
      return {
        id: item.id,
        title,
        synopsis,
        tags,
        url: externalUrl ?? item.url ?? `https://anidb.net/anime/${item.id}`,
        image: item.picture ?? null,
        episodeCount: item.episodeCount,
        startDate: item.startDate,
      };
    });
  }, [aniDbRecommendations]);

  const handleSearch = (value) => {
    const next = value.trim();
    setSearchTerm(next);
    setSubmittedQuery(next);
    navigate(next ? `/search?q=${encodeURIComponent(next)}` : "/search");
  };

  const handleToggleFavorite = (slug) => {
    toggle(slug).catch((err) => {
      const message = err.response?.data?.message ?? "Login to save favorites.";
      setFavoriteError(message);
      setTimeout(() => setFavoriteError(""), 3000);
    });
  };

  const showEmptyState = useMemo(
    () => !isFetching && submittedQuery && results.length === 0 && !isError,
    [isFetching, submittedQuery, results.length, isError]
  );

  return (
    <div className="container space-y-12 pb-16 pt-8">
      <SEO
        title={submittedQuery ? `${submittedQuery} | Search Anime on NeonWave` : "Search Anime | NeonWave"}
        description="Query the NeonWave catalog backed by the Express API. Filter by title, genre, or tag with millisecond caching."
        url={`${SITE_URL}/search${submittedQuery ? `?q=${encodeURIComponent(submittedQuery)}` : ""}`}
        keywords={submittedQuery ? [submittedQuery, "anime search", "neonwave"] : ["anime search", "neonwave"]}
        noIndex={!submittedQuery}
      />
      <SectionHeading title="Search the Library" eyebrow="Live catalog">
        Results stream directly from the NeonWave API with React Query caching layered on top for instant repeats.
      </SectionHeading>
      <SearchBar
        onSearch={handleSearch}
        placeholder="Search anime, tags, or studios"
        defaultValue={searchTerm}
        className="max-w-2xl"
        onChange={setSearchTerm}
      />
      {submittedQuery && (
        <p className="text-xs uppercase tracking-wide text-slate-500 dark:text-gray-400">
          {isFetching ? "Searching..." : `${total} result${total === 1 ? "" : "s"} found`}
        </p>
      )}
      {isError && (
        <p className="text-sm text-red-500 dark:text-red-400">{error?.response?.data?.message ?? "Search failed"}</p>
      )}
      {favoriteError && (
        <p className="text-sm text-red-500 dark:text-red-400">{favoriteError}</p>
      )}
      {isFetching ? (
        <LoadingSpinner label="Scanning catalog" />
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {results.map((anime) => (
            <AnimeCard
              key={anime.id}
              anime={anime}
              onToggleFavorite={handleToggleFavorite}
              isFavorite={isFavorite(anime.slug)}
            />
          ))}
        </div>
      )}
      {showEmptyState && (
        <p className="text-sm text-slate-600 dark:text-gray-400">No matches yet. Try another title or combine tags for sharper results.</p>
      )}
      {submittedQuery && (aniDbItems.length > 0 || aniDbFetching || aniDbError) && (
        <div className="space-y-4">
          <SectionHeading title="Fresh from AniDB" eyebrow="External feed">
            Explore live recommendations pulled directly from AniDB while you refine your NeonWave catalog.
          </SectionHeading>
          {aniDbError && (
            <p className="text-sm text-red-500 dark:text-red-400">
              {aniDbErrorDetails?.response?.data?.message ?? aniDbErrorDetails?.message ?? "Could not reach AniDB right now."}
            </p>
          )}
          {aniDbFetching && aniDbItems.length === 0 ? (
            <LoadingSpinner label="Syncing with AniDB" />
          ) : aniDbItems.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2">
              {aniDbItems.map((item) => (
                <article
                  key={item.id}
                  className="flex flex-col gap-4 rounded-3xl border border-slate-200/60 bg-white/60 p-6 shadow-lg transition dark:border-white/10 dark:bg-white/5 sm:flex-row"
                >
                  {item.image && (
                    <img
                      src={item.image}
                      alt={item.title}
                      loading="lazy"
                      className="h-28 w-28 flex-shrink-0 rounded-2xl object-cover shadow-md sm:h-32 sm:w-32"
                    />
                  )}
                  <div className="flex flex-1 flex-col gap-3">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{item.title}</h3>
                        <p className="text-xs uppercase tracking-wide text-slate-500 dark:text-gray-400">
                          {item.tags.length > 0 ? item.tags.join(" • ") : "AniDB Recommendation"}
                        </p>
                      </div>
                      <span className="rounded-full bg-highlight/10 px-3 py-1 text-xs font-semibold text-highlight">
                        {item.episodeCount ?? "?"} eps
                      </span>
                    </div>
                    <p className="line-clamp-3 text-sm text-slate-600 dark:text-gray-300">{item.synopsis}</p>
                    <div className="flex items-center justify-between gap-2 text-xs text-slate-500 dark:text-gray-400">
                      <span>{item.startDate ? new Date(item.startDate).toLocaleDateString() : "TBA"}</span>
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noreferrer"
                        className="font-semibold uppercase tracking-wide text-highlight transition hover:text-highlight/90"
                      >
                        View on AniDB
                      </a>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
};

export default SearchPage;
