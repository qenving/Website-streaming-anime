import { Link } from "react-router-dom";
import SEO from "../components/SEO";

const SITE_URL = import.meta.env.VITE_SITE_URL || "https://neonwave.app";

const NotFoundPage = () => (
  <div className="container flex min-h-[60vh] flex-col items-center justify-center gap-6 text-center text-slate-900 transition dark:text-white">
    <SEO
      title="Page Not Found | NeonWave"
      description="The page you were looking for drifted into the void. Return home to discover trending anime on NeonWave."
      url={`${SITE_URL}/404`}
      noIndex
    />
    <div className="relative">
      <div className="absolute inset-0 -z-10 animate-float rounded-full bg-highlight/20 blur-3xl" />
      <div className="flex h-32 w-32 items-center justify-center rounded-full border border-slate-200 bg-white text-3xl font-semibold shadow-sm dark:border-white/10 dark:bg-white/5">
        404
      </div>
    </div>
    <h1 className="text-3xl font-semibold">Lost in the void</h1>
    <p className="max-w-md text-sm text-slate-600 transition dark:text-gray-300">
      Our mascot Astral-chan could not find that route. Warp back to the homepage and keep exploring the neon multiverse.
    </p>
    <Link
      to="/"
      className="rounded-full bg-highlight px-6 py-3 text-xs font-semibold uppercase tracking-[0.3em] text-white transition hover:bg-highlight/90"
    >
      Return Home
    </Link>
  </div>
);

export default NotFoundPage;
