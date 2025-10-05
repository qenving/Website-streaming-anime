const LoadingSpinner = ({ label = "Loading" }) => (
  <div className="flex flex-col items-center gap-3 py-12 text-slate-600 dark:text-gray-300">
    <div className="flex gap-2">
      <span className="h-2 w-2 animate-ping rounded-full bg-highlight" />
      <span className="h-2 w-2 animate-ping rounded-full bg-highlight" style={{ animationDelay: "0.15s" }} />
      <span className="h-2 w-2 animate-ping rounded-full bg-highlight" style={{ animationDelay: "0.3s" }} />
    </div>
    <p className="text-sm uppercase tracking-[0.3em]">{label}</p>
  </div>
);

export default LoadingSpinner;
