import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AddPostModal, PostCard, SectionHeading, LoadingSpinner } from "../components";
import SEO from "../components/SEO";
import { useAuthContext } from "../context/AuthContext";
import {
  addCommunityComment,
  createCommunityPost,
  fetchCommunityPosts,
  toggleCommunityPostLike,
} from "../utils/apiPlaceholders";

const SITE_URL = import.meta.env.VITE_SITE_URL || "https://neonwave.app";

const CommunityPage = () => {
  const { user } = useAuthContext();
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const {
    data: posts = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["community-posts"],
    queryFn: fetchCommunityPosts,
  });

  const updatePostInCache = (updatedPost) => {
    queryClient.setQueryData(["community-posts"], (prev) => {
      if (!prev) return prev;
      return prev.map((post) => (post.id === updatedPost.id ? updatedPost : post));
    });
  };

  const createMutation = useMutation({
    mutationFn: createCommunityPost,
    onSuccess: (post) => {
      queryClient.setQueryData(["community-posts"], (prev) => (prev ? [post, ...prev] : [post]));
    },
    onError: (mutationError) => {
      setErrorMessage(mutationError.response?.data?.message ?? "Unable to create post");
      setTimeout(() => setErrorMessage(""), 4000);
    },
  });

  const likeMutation = useMutation({
    mutationFn: toggleCommunityPostLike,
    onSuccess: updatePostInCache,
    onError: (mutationError) => {
      setErrorMessage(mutationError.response?.data?.message ?? "Unable to update like");
      setTimeout(() => setErrorMessage(""), 4000);
    },
  });

  const commentMutation = useMutation({
    mutationFn: ({ postId, message }) => addCommunityComment(postId, message),
    onSuccess: updatePostInCache,
    onError: (mutationError) => {
      setErrorMessage(mutationError.response?.data?.message ?? "Unable to add comment");
      setTimeout(() => setErrorMessage(""), 4000);
    },
  });

  const handleLike = (postId) => {
    if (!user) {
      setErrorMessage("Login to engage with the community");
      setTimeout(() => setErrorMessage(""), 3000);
      return;
    }
    likeMutation.mutate(postId);
  };

  const handleCreate = (payload) => {
    if (!user) {
      setErrorMessage("Login to publish a discussion");
      setTimeout(() => setErrorMessage(""), 3000);
      return;
    }
    createMutation.mutate(payload);
  };

  const handleComment = (post) => {
    if (!user) {
      setErrorMessage("Login to join the conversation");
      setTimeout(() => setErrorMessage(""), 3000);
      return;
    }
    const message = window.prompt("Share your reply:");
    if (!message) return;
    commentMutation.mutate({ postId: post.id, message });
  };

  const topPosts = useMemo(
    () => [...posts].sort((a, b) => b.likes - a.likes).slice(0, 3),
    [posts]
  );

  return (
    <div className="container space-y-12 pb-16 pt-8">
      <SEO
        title="NeonWave Community | Share Anime Discussions"
        description="Join the NeonWave community hub to debate episodes, drop fan theories, and plan watch parties with fellow anime fans."
        url={`${SITE_URL}/community`}
        keywords={["anime community", "neonwave forums", "anime discussions"]}
      />
      <SectionHeading title="Community Hub" eyebrow="Forum">
        Posts, likes, and comments are backed by the NeonWave API. Connect a realtime service to take the banter live.
      </SectionHeading>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <p className="text-sm text-slate-600 dark:text-gray-300">
          {user ? `Signed in as ${user.name}.` : "Guest mode: login to publish and react."}
        </p>
        <button
          type="button"
          onClick={() => (user ? setIsModalOpen(true) : setErrorMessage("Login to create a post"))}
          className="rounded-full bg-highlight px-6 py-3 text-xs font-semibold uppercase tracking-[0.3em] text-white transition hover:bg-highlight/90"
        >
          New Post
        </button>
      </div>
      {errorMessage && <p className="text-sm font-semibold text-red-500 dark:text-red-400">{errorMessage}</p>}
      {isError && (
        <p className="text-sm text-red-500 dark:text-red-400">
          {error?.response?.data?.message ?? "Unable to load community posts"}
        </p>
      )}
      {isLoading ? (
        <LoadingSpinner label="Loading community" />
      ) : (
        <div className="grid gap-8 lg:grid-cols-[2fr_1fr]">
          <div className="space-y-6">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} onLike={handleLike} onComment={handleComment} />
            ))}
          </div>
          <aside className="space-y-6">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 text-slate-900 transition dark:border-white/10 dark:bg-white/5 dark:text-white">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Top discussions</h3>
              <ul className="mt-4 space-y-3 text-sm text-slate-600 dark:text-gray-300">
                {topPosts.map((post) => (
                  <li key={post.id}>
                    <p className="font-semibold text-slate-900 dark:text-white">{post.title}</p>
                    <p className="text-xs uppercase tracking-wide text-slate-500 dark:text-gray-400">{post.likes} likes</p>
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-3xl border border-slate-200 bg-white p-6 text-sm text-slate-600 transition dark:border-white/10 dark:bg-white/5 dark:text-gray-300">
              <h4 className="text-slate-900 dark:text-white">Pro tip</h4>
              <p className="mt-2">
                The API already persists posts. Wire up WebSockets or Pusher to broadcast new discussions without a refresh.
              </p>
            </div>
          </aside>
        </div>
      )}
      <AddPostModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreate}
        user={user}
      />
    </div>
  );
};

export default CommunityPage;
