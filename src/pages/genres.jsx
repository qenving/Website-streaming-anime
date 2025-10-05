import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { AnimeCard, GenreChip, LoadingSpinner, SearchBar, SectionHeading } from "../components";
import SEO from "../components/SEO";
import useFavorites from "../hooks/useFavorites";
import { fetchAnimeCollection, fetchGenres } from "../utils/apiPlaceholders";

const SITE_URL = import.meta.env.VITE_SITE_URL || "https://neonwave.app";

const GenresPage = () => {
  const [selectedGenre, setSelectedGenre] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [favoriteError, setFavoriteError] = useState("");
  const { toggle, isFavorite } = useFavorites();

  const { data: genresData, isLoading: genresLoading } = useQuery({
    queryKey: ["genres"],
    queryFn: fetchGenres,
  });

  const genres = useMemo(() => ["All", ...(genresData ?? [])], [genresData]);

  const {
    data,
    isFetching,
    isError,
    error,
  } = useQuery({
    queryKey: ["anime-list", selectedGenre, searchTerm],
    queryFn: async () => {
      const genreFilter = selectedGenre === "All" ? undefined : selectedGenre;
      return fetchAnimeCollection({
        genre: genreFilter,
        search: searchTerm || undefined,
        limit: 48,
      });
    },
    keepPreviousData: true,
  });

  const animeList = data?.items ?? [];
  const total = data?.total ?? animeList.length;

  const handleGenreChange = (genre) => {
    const nextGenre = genre === selectedGenre ? "All" : genre;
    setSelectedGenre(nextGenre);
  };

  const handleSearch = (value) => {
    setSearchTerm(value.trim());
  };

  const handleToggleFavorite = (slug) => {
    toggle(slug).catch((err) => {
      const message = err.response?.data?.message ?? "Login to save favorites.";
      setFavoriteError(message);
      setTimeout(() => setFavoriteError(""), 3000);
    });
  };

  if (genresLoading && genres.length === 0) {
    return (
      <div className="container py-24">
        <LoadingSpinner label="Loading genres" />
      </div>
    );
  }

  const showEmptyState = !isFetching && !isError && animeList.length === 0;

  return (
    <div className="container space-y-12 pb-16 pt-8">
      <SEO
        title="Browse Anime by Genre | NeonWave"
        description="Explore the NeonWave catalog by genre with live API filtering. Pair queries with React Query caching for instant pivots."
        url={`${SITE_URL}/genres`}
        keywords={["anime genres", "shonen", "isekai", "anime filter", "neonwave"]}
      />
      <SectionHeading title="Browse by Genre" eyebrow="Curated catalog">
        Filter the library server-side with a single tap. All responses stream from the Express API and cache automatically.
      </SectionHeading>
      <div className="flex flex-wrap gap-3">
        {genres.map((genre) => (
          <GenreChip key={genre} label={genre} isActive={genre === selectedGenre} onClick={handleGenreChange} />
        ))}
      </div>
      <SearchBar
        onSearch={handleSearch}
        placeholder="Search within selected genre"
        className="max-w-xl"
        defaultValue={searchTerm}
        onChange={setSearchTerm}
      />
      {(selectedGenre !== "All" || searchTerm) && (
        <p className="text-xs uppercase tracking-wide text-slate-500 dark:text-gray-400">
          {isFetching ? "Updating results" : `${total} title${total === 1 ? "" : "s"} found`}
        </p>
      )}
      {isError && (
        <p className="text-sm text-red-500 dark:text-red-400">{error?.response?.data?.message ?? "Unable to load anime"}</p>
      )}
      {favoriteError && (
        <p className="text-sm text-red-500 dark:text-red-400">{favoriteError}</p>
      )}
      {isFetching ? (
        <LoadingSpinner label="Applying filters" />
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {animeList.map((anime) => (
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
        <p className="text-sm text-slate-600 dark:text-gray-400">No anime found for that combo. Try another genre or reset filters.</p>
      )}
    </div>
  );
};

export default GenresPage;
