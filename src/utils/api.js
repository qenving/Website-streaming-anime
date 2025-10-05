import httpClient from "./httpClient";

export const fetchHomepageSections = async (options = {}) => {
  const { data } = await httpClient.get("/anime/home", { params: options });
  return data;
};

export const fetchAnimeBySlug = async (slug) => {
  if (!slug) return null;
  const { data } = await httpClient.get(`/anime/${slug}`);
  return data;
};

export const fetchRelatedAnime = async (slug) => {
  if (!slug) return [];
  const { data } = await httpClient.get(`/anime/${slug}/related`);
  return data;
};

export const fetchEpisodes = async (slug, page = 1, pageSize = 12) => {
  if (!slug) return null;
  const { data } = await httpClient.get(`/anime/${slug}/episodes`, {
    params: { page, pageSize },
  });
  return data;
};

export const searchAnime = async ({ query, genre, page = 1, limit = 24 } = {}) => {
  const { data } = await httpClient.get("/anime", {
    params: {
      search: query,
      genre,
      page,
      limit,
    },
  });
  return data;
};

export const fetchGenres = async () => {
  const { data } = await httpClient.get("/anime/genres");
  return data.genres ?? [];
};

export const fetchAnimeCollection = async ({ genre, search, page = 1, limit = 24 } = {}) => {
  const { data } = await httpClient.get("/anime", {
    params: {
      genre,
      search,
      page,
      limit,
    },
  });
  return data;
};

export const fetchPremiumContent = async () => {
  const { data } = await httpClient.get("/premium/content");
  return data;
};

export const fetchSiteContent = async (key) => {
  if (!key) return null;
  const { data } = await httpClient.get(`/content/${key}`);
  return data;
};

export const fetchAboutContent = () => fetchSiteContent("about");

export const fetchFooterContent = () => fetchSiteContent("footer");

export const fetchCommunityPosts = async () => {
  const { data } = await httpClient.get("/community/posts");
  return data.posts ?? [];
};

export const createCommunityPost = async (payload) => {
  const { data } = await httpClient.post("/community/posts", payload);
  return data.post;
};

export const toggleCommunityPostLike = async (postId) => {
  const { data } = await httpClient.post(`/community/posts/${postId}/like`);
  return data.post;
};

export const addCommunityComment = async (postId, message) => {
  const { data } = await httpClient.post(`/community/posts/${postId}/comments`, { message });
  return data.post;
};

export const registerRequest = async (payload) => {
  const { data } = await httpClient.post("/auth/register", payload);
  return data;
};

export const loginRequest = async (payload) => {
  const { data } = await httpClient.post("/auth/login", payload);
  return data;
};

export const refreshSession = async () => {
  const { data } = await httpClient.post("/auth/refresh");
  return data;
};

export const logoutRequest = async () => {
  await httpClient.post("/auth/logout");
  return true;
};

export const fetchCurrentUser = async () => {
  const { data } = await httpClient.get("/auth/me");
  return data.user;
};

export const upgradeAccount = async () => {
  const { data } = await httpClient.post("/auth/upgrade");
  return data.user;
};

export const fetchFavorites = async () => {
  const { data } = await httpClient.get("/users/me/favorites");
  return data.favorites ?? [];
};

export const toggleFavoriteAnime = async (slug) => {
  const { data } = await httpClient.post(`/users/me/favorites/${slug}`);
  return data;
};

export const fetchDashboard = async () => {
  const { data } = await httpClient.get("/users/me/dashboard");
  return data;
};

export const fetchAniDbRandom = async ({ refresh = false } = {}) => {
  const { data } = await httpClient.get("/anidb/random", {
    params: refresh ? { refresh } : undefined,
  });
  return data.items ?? [];
};

export const fetchAniDbAnime = async (id, { refresh = false } = {}) => {
  if (!id) return null;
  const { data } = await httpClient.get(`/anidb/anime/${id}`, {
    params: refresh ? { refresh } : undefined,
  });
  return data.anime ?? null;
};