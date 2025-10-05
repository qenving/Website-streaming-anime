import { Play } from "lucide-react";

const Player = ({
  title,
  videoSrc,
  poster,
  onPlay,
  showControls = true,
}) => (
  <div className="relative overflow-hidden rounded-3xl border border-white/5 bg-black/40 shadow-glow">
    {videoSrc ? (
      <video
        src={videoSrc}
        poster={poster}
        controls={showControls}
        className="aspect-video w-full rounded-3xl object-cover"
        onPlay={onPlay}
      />
    ) : (
      <div className="flex aspect-video w-full flex-col items-center justify-center gap-4 bg-gradient-to-br from-highlight/20 via-midnight-500/60 to-midnight">
        <button
          type="button"
          onClick={onPlay}
          className="inline-flex items-center gap-3 rounded-full bg-highlight px-6 py-3 text-sm font-semibold uppercase tracking-[0.25em] text-white transition hover:bg-highlight/90"
        >
          <Play size={18} /> Start Streaming Soon
        </button>
        <p className="text-sm text-gray-400">Connect your video CDN to stream {title} instantly.</p>
      </div>
    )}
  </div>
);

export default Player;
