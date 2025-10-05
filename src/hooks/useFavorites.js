import { useCallback, useEffect, useMemo, useState } from "react";
import { useAuthContext } from "../context/AuthContext";
import { fetchFavorites, toggleFavoriteAnime } from "../utils/api";

const useFavorites = () => {
  const { user, status } = useAuthContext();
  const [favorites, setFavorites] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadFavorites = useCallback(async () => {
    if (!user) {
      setFavorites([]);
      return [];
    }
    setIsLoading(true);
    setError(null);
    try {
      const items = await fetchFavorites();
      setFavorites(items);
      return items;
    } catch (err) {
      console.error("Failed to load favorites", err);
      setError(err.response?.data?.message ?? "Unable to load favorites");
      setFavorites([]);
      return [];
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (status === "authenticated") {
      loadFavorites();
    }
    if (status === "anonymous") {
      setFavorites([]);
    }
  }, [status, loadFavorites]);

  const toggle = useCallback(
    async (slug) => {
      if (!user) {
        throw new Error("Login required to manage favorites");
      }
      setError(null);
      try {
        await toggleFavoriteAnime(slug);
        return await loadFavorites();
      } catch (err) {
        setError(err.response?.data?.message ?? "Unable to update favorites");
        throw err;
      }
    },
    [user, loadFavorites]
  );

  const isFavorite = useCallback((slug) => favorites.some((anime) => anime.slug === slug), [favorites]);
  const favoriteSlugs = useMemo(() => favorites.map((anime) => anime.slug), [favorites]);

  return { favorites, favoriteSlugs, toggle, isFavorite, isLoading, error, reload: loadFavorites };
};

export default useFavorites;