import { Heart, MessageCircle } from "lucide-react";

const formatTimeAgo = (timestamp) => {
  if (!timestamp) return "just now";
  const diff = Date.now() - new Date(timestamp).getTime();
  const minutes = Math.floor(diff / (1000 * 60));
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
};

const PostCard = ({ post, onLike, onComment }) => {
  if (!post) return null;
  return (
    <article className="rounded-3xl border border-slate-200 bg-white p-6 text-slate-900 transition hover:border-highlight/60 dark:border-white/5 dark:bg-white/5 dark:text-white">
      <div className="flex items-center justify-between text-xs text-slate-500 dark:text-gray-400">
        <span className="font-semibold uppercase tracking-wide text-highlight">{post.author}</span>
        <span>{formatTimeAgo(post.createdAt)}</span>
      </div>
      <h3 className="mt-3 text-lg font-semibold text-slate-900 dark:text-white">{post.title}</h3>
      <p className="mt-3 text-sm text-slate-600 dark:text-gray-300">{post.message}</p>
      <div className="mt-4 flex flex-wrap gap-2 text-xs uppercase tracking-wide text-slate-500 dark:text-gray-400">
        {(post.tags ?? []).map((tag) => (
          <span key={tag} className="rounded-full border border-slate-200 bg-white px-3 py-1 text-highlight dark:border-white/10 dark:bg-white/5">
            #{tag}
          </span>
        ))}
      </div>
      <div className="mt-6 flex items-center gap-3 text-xs">
        <button
          type="button"
          onClick={() => onLike?.(post.id)}
          className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 font-semibold uppercase tracking-[0.25em] transition hover:border-highlight hover:text-highlight ${
            post.__liked ? "border-highlight text-highlight" : "border-slate-200 text-slate-600 dark:border-white/10 dark:text-gray-300"
          }`}
        >
          <Heart size={16} fill={post.__liked ? "currentColor" : "none"} /> {post.likes}
        </button>
        <button
          type="button"
          onClick={() => onComment?.(post)}
          className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-4 py-2 font-semibold uppercase tracking-[0.25em] text-slate-600 transition hover:border-highlight hover:text-highlight dark:border-white/10 dark:text-gray-300"
        >
          <MessageCircle size={16} /> {post.comments?.length ?? 0}
        </button>
      </div>
    </article>
  );
};

export default PostCard;
