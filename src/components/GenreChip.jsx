const GenreChip = ({ label, isActive = false, onClick }) => (
  <button
    type="button"
    onClick={() => onClick?.(label)}
    className={`rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-wide transition hover:-translate-y-0.5 hover:border-highlight hover:text-highlight ${
      isActive
        ? "border-highlight bg-highlight/10 text-highlight shadow-neon"
        : "border-slate-200 bg-white text-slate-700 dark:border-white/10 dark:bg-white/5 dark:text-gray-300"
    }`}
  >
    {label}
  </button>
);

export default GenreChip;
