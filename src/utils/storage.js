const STORAGE_KEYS = {
  THEME: "neonwave-theme",
};

const isBrowser = typeof window !== "undefined";

const getItem = (key, fallback) => {
  if (!key) return fallback;
  if (!isBrowser) {
    return fallback;
  }
  try {
    const raw = window.localStorage.getItem(key);
    return raw ?? fallback;
  } catch (error) {
    console.warn("storage: unable to access localStorage", error);
    return fallback;
  }
};

const setItem = (key, value) => {
  if (!key || !isBrowser) return value;
  try {
    window.localStorage.setItem(key, value);
  } catch (error) {
    console.warn("storage: failed to persist", error);
  }
  return value;
};

export const getThemePreference = () => getItem(STORAGE_KEYS.THEME, "dark");

export const setThemePreference = (theme) => setItem(STORAGE_KEYS.THEME, theme);
