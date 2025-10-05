const SectionHeading = ({ title, eyebrow, action, children }) => (
  <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
    <div>
      {eyebrow && (
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-highlight/80">{eyebrow}</p>
      )}
      <h2 className="mt-2 text-2xl font-semibold text-slate-900 dark:text-white md:text-3xl">{title}</h2>
      {children && <p className="mt-2 max-w-2xl text-sm text-slate-600 dark:text-gray-300">{children}</p>}
    </div>
    {action}
  </div>
);

export default SectionHeading;
