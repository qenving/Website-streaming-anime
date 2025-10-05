import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { AnimeCard, ProfileCard, SectionHeading } from "../components";
import SEO from "../components/SEO";
import { useAuthContext } from "../context/AuthContext";
import useFavorites from "../hooks/useFavorites";
import { fetchDashboard } from "../utils/apiPlaceholders";

const SITE_URL = import.meta.env.VITE_SITE_URL || "https://neonwave.app";

const ProfilePage = () => {
  const { user, isPremium, status, logout } = useAuthContext();
  const { favorites, toggle, isFavorite, isLoading: favoritesLoading, error: favoritesError } = useFavorites();

  const { data: dashboard, isLoading: dashboardLoading } = useQuery({
    queryKey: ["dashboard"],
    queryFn: fetchDashboard,
    enabled: status === "authenticated",
  });

  if (status !== "authenticated" || !user) {
    return (
      <div className="container flex flex-col items-center gap-6 py-24 text-center text-slate-900 transition dark:text-white">
        <SEO
          title="Guest Profile | NeonWave"
          description="Login or register to sync anime favorites, premium flags, and community posts on NeonWave."
          url={`${SITE_URL}/profile`}
          keywords={["neonwave profile", "anime favorites", "guest mode"]}
          noIndex
        />
        <h1 className="text-3xl font-semibold">You are in guest mode</h1>
        <p className="max-w-xl text-sm text-slate-600 transition dark:text-gray-300">
          Sign in to unlock server-side favorites, community history, and premium perks. Demo accounts persist across refreshes thanks to JWT cookies.
        </p>
        <div className="flex gap-3">
          <Link
            to="/login"
            className="rounded-full bg-highlight px-6 py-3 text-xs font-semibold uppercase tracking-[0.3em] text-white transition hover:bg-highlight/90"
          >
            Login
          </Link>
          <Link
            to="/register"
            className="rounded-full border border-slate-200 px-6 py-3 text-xs font-semibold uppercase tracking-[0.3em] text-slate-700 transition hover:border-highlight hover:text-highlight dark:border-white/10 dark:text-gray-200"
          >
            Register
          </Link>
        </div>
      </div>
    );
  }

  const planLabel = (dashboard?.profile?.isPremium ?? isPremium) ? "Premium" : "Free";

  return (
    <div className="container space-y-12 pb-16 pt-8">
      <SEO
        title={`${user.name ?? "Profile"} | NeonWave`}
        description="Manage your NeonWave profile, review premium status, and jump back into your saved anime list."
        url={`${SITE_URL}/profile`}
        keywords={["neonwave profile", "anime dashboard", "watchlist"]}
      />
      <SectionHeading title="Your Dashboard" eyebrow="Profile" />
      <ProfileCard user={dashboard?.profile ?? user} planLabel={planLabel} onLogout={logout} />
      <section>
        <SectionHeading title="Favorites" eyebrow="Saved list" />
        {favoritesError && <p className="text-sm text-red-500 dark:text-red-400">{favoritesError}</p>}
        {favoritesLoading || dashboardLoading ? (
          <p className="text-sm text-slate-600 dark:text-gray-400">Loading favorites...</p>
        ) : favorites.length ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {favorites.map((anime) => (
              <AnimeCard
                key={anime.id}
                anime={anime}
                onToggleFavorite={toggle}
                isFavorite={isFavorite(anime.slug)}
              />
            ))}
          </div>
        ) : (
          <p className="text-sm text-slate-600 transition dark:text-gray-400">
            You have not saved anything yet. Tap the heart icon on any anime to pin it here.
          </p>
        )}
      </section>
    </div>
  );
};

export default ProfilePage;
