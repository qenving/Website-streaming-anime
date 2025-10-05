import { ChevronLeft, ChevronRight } from "lucide-react";

const Pagination = ({ current = 1, total = 1, onChange }) => {
  const hasPrev = current > 1;
  const hasNext = current < total;

  return (
    <div className="flex items-center justify-between gap-4 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 transition dark:border-white/5 dark:bg-white/5 dark:text-gray-300">
      <button
        type="button"
        disabled={!hasPrev}
        onClick={() => hasPrev && onChange?.(current - 1)}
        className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-3 py-1.5 text-xs font-semibold uppercase tracking-wide transition disabled:cursor-not-allowed disabled:opacity-40 hover:border-highlight hover:text-highlight dark:border-white/10"
      >
        <ChevronLeft size={16} /> Prev
      </button>
      <span className="text-xs uppercase tracking-wide text-slate-500 dark:text-gray-400">
        Page {current} of {total}
      </span>
      <button
        type="button"
        disabled={!hasNext}
        onClick={() => hasNext && onChange?.(current + 1)}
        className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-3 py-1.5 text-xs font-semibold uppercase tracking-wide transition disabled:cursor-not-allowed disabled:opacity-40 hover:border-highlight hover:text-highlight dark:border-white/10"
      >
        Next <ChevronRight size={16} />
      </button>
    </div>
  );
};

export default Pagination;
