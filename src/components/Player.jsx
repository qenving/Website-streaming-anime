import { Play } from "lucide-react";

const extensionToMime = {
  mp4: "video/mp4",
  m4v: "video/mp4",
  webm: "video/webm",
  ogv: "video/ogg",
  mov: "video/quicktime",
  mkv: "video/x-matroska",
  m3u8: "application/x-mpegURL",
};

const normalizeSources = (sources = []) => {
  const list = Array.isArray(sources) ? sources : [sources];
  const seen = new Set();

  return list
    .map((entry) => {
      if (!entry) return null;
      if (typeof entry === "string") {
        return { src: entry };
      }
      if (entry.src) {
        return {
          src: entry.src,
          type: entry.type,
          label: entry.label ?? entry.name ?? entry.quality,
        };
      }
      return null;
    })
    .filter((entry) => {
      if (!entry?.src) return false;
      if (seen.has(entry.src)) return false;
      seen.add(entry.src);
      const extension = entry.src.split("?")[0].split("#")[0].split(".").pop()?.toLowerCase();
      if (!entry.type && extension) {
        entry.type = extensionToMime[extension] ?? undefined;
      }
      return true;
    });
};

const Player = ({
  title,
  videoSrc,
  sources = [],
  poster,
  onPlay,
  showControls = true,
}) => {
  const normalizedSources = normalizeSources([
    ...(Array.isArray(sources) ? sources : sources ? [sources] : []),
    ...(Array.isArray(videoSrc) ? videoSrc : videoSrc ? [videoSrc] : []),
  ]);

  const hasStreams = normalizedSources.length > 0;
  const fallbackSrc = normalizedSources[0]?.src;

  return (
    <div className="relative overflow-hidden rounded-3xl border border-white/5 bg-black/40 shadow-glow">
      {hasStreams ? (
        <div className="flex flex-col">
          <video
            key={fallbackSrc ?? "placeholder"}
            poster={poster}
            controls={showControls}
            controlsList="nodownload"
            preload="metadata"
            className="aspect-video w-full rounded-3xl object-cover"
            onPlay={onPlay}
          >
            {normalizedSources.map((source) => (
              <source key={source.src} src={source.src} type={source.type} />
            ))}
            Your browser does not support the provided video formats.
          </video>
          {normalizedSources.length > 1 && (
            <div className="flex flex-wrap gap-2 px-5 py-4 text-xs uppercase tracking-[0.2em] text-white/70">
              {normalizedSources.map((source) => (
                <span
                  key={`${source.src}-chip`}
                  className="rounded-full border border-white/10 bg-white/5 px-3 py-1"
                >
                  {source.label ?? source.type ?? "Stream"}
                </span>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="flex aspect-video w-full flex-col items-center justify-center gap-4 bg-gradient-to-br from-highlight/20 via-midnight-500/60 to-midnight">
          <button
            type="button"
            onClick={onPlay}
            className="inline-flex items-center gap-3 rounded-full bg-highlight px-6 py-3 text-sm font-semibold uppercase tracking-[0.25em] text-white transition hover:bg-highlight/90"
          >
            <Play size={18} /> Start Streaming Soon
          </button>
          <p className="text-sm text-gray-400">
            Connect your streaming provider to deliver multi-format playback for {title}.
          </p>
        </div>
      )}
    </div>
  );
};

export default Player;
