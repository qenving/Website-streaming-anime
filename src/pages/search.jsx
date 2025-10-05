import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { AnimeCard, LoadingSpinner, SearchBar, SectionHeading } from "../components";
import SEO from "../components/SEO";
import useFavorites from "../hooks/useFavorites";
import { searchAnime } from "../utils/apiPlaceholders";

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
    </div>
  );
};

export default SearchPage;
