import { motion } from "framer-motion";
import { Heart, Play, Star } from "lucide-react";
import { Link } from "react-router-dom";

const AnimeCard = ({ anime, onToggleFavorite, isFavorite = false }) => {
  if (!anime) return null;
  const firstEpisodeNumber = anime.firstEpisodeNumber ?? 1;

  return (
    <motion.article
      whileHover={{ y: -6 }}
      className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-glow transition-all dark:border-white/5 dark:bg-white/5"
    >
      <div className="relative">
        <Link to={`/anime/${anime.slug}`} className="block overflow-hidden">
          <img
            src={anime.thumbnail}
            alt={anime.title}
            loading="lazy"
            className="h-48 w-full object-cover transition duration-500 ease-out hover:scale-105 sm:h-56"
          />
        </Link>
        <button
          type="button"
          onClick={() => onToggleFavorite?.(anime.slug)}
          className={`absolute right-4 top-4 inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 shadow transition hover:border-highlight hover:text-highlight dark:border-white/10 dark:bg-black/40 dark:text-white/70 ${
            isFavorite ? "text-highlight" : ""
          }`}
          aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
        >
          <Heart size={18} fill={isFavorite ? "currentColor" : "none"} />
        </button>
        <div className="absolute left-4 top-4 rounded-full bg-slate-900/90 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white dark:bg-black/60 dark:text-white/80">
          {anime.releaseYear}
        </div>
      </div>
      <div className="flex flex-col gap-3 p-4">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{anime.title}</h3>
            <p className="text-xs uppercase tracking-wide text-slate-600 dark:text-gray-400">
              {anime.genres?.slice(0, 3).join(" / ")}
            </p>
          </div>
          <span className="inline-flex items-center gap-1 rounded-full bg-highlight/10 px-2 py-1 text-xs font-semibold text-highlight">
            <Star size={14} /> {anime.rating}
          </span>
        </div>
        <p className="line-clamp-2 text-sm text-slate-600 dark:text-gray-300">{anime.synopsis}</p>
        <div className="flex items-center justify-between">
          <Link
            to={`/watch/${anime.slug}/${firstEpisodeNumber}`}
            className="inline-flex items-center gap-2 rounded-full bg-highlight px-4 py-2 text-xs font-semibold uppercase tracking-wide text-white transition hover:bg-highlight/90"
          >
            <Play size={14} /> Watch
          </Link>
          <Link
            to={`/anime/${anime.slug}`}
            className="text-xs font-semibold uppercase tracking-wide text-slate-600 transition hover:text-highlight dark:text-gray-300"
          >
            Details
          </Link>
        </div>
      </div>
    </motion.article>
  );
};

export default AnimeCard;