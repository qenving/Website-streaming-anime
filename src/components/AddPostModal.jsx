import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { X } from "lucide-react";

const AddPostModal = ({ isOpen, onClose, onSubmit, user }) => {
  const [form, setForm] = useState({
    title: "",
    message: "",
    tags: "",
  });

  const handleClose = () => {
    setForm({ title: "", message: "", tags: "" });
    onClose?.();
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!form.title || !form.message) return;
    const payload = {
      title: form.title,
      message: form.message,
      tags: form.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean),
      author: user?.name ?? user?.email ?? "Guest",
    };
    onSubmit?.(payload);
    handleClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.form
            onSubmit={handleSubmit}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="relative w-full max-w-xl space-y-5 rounded-3xl border border-slate-200 bg-white p-8 text-slate-900 shadow-glow transition dark:border-white/10 dark:bg-midnight-700/80 dark:text-white"
          >
            <button
              type="button"
              onClick={handleClose}
              className="absolute right-6 top-6 inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 transition hover:border-highlight hover:text-highlight dark:border-white/10 dark:bg-white/5 dark:text-white"
              aria-label="Close create post modal"
            >
              <X size={18} />
            </button>
            <h3 className="text-xl font-semibold text-slate-900 dark:text-white">Share a new discussion</h3>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wide text-slate-600 dark:text-gray-400">Title</label>
              <input
                type="text"
                value={form.title}
                onChange={(event) => setForm((prev) => ({ ...prev, title: event.target.value }))}
                className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-highlight focus:outline-none dark:border-white/10 dark:bg-white/5 dark:text-white dark:placeholder:text-gray-500"
                placeholder="Episode 9 theories"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wide text-slate-600 dark:text-gray-400">Message</label>
              <textarea
                value={form.message}
                onChange={(event) => setForm((prev) => ({ ...prev, message: event.target.value }))}
                rows={5}
                className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-highlight focus:outline-none dark:border-white/10 dark:bg-white/5 dark:text-white dark:placeholder:text-gray-500"
                placeholder="Drop your breakdown, favorite scenes, or cosplay plans"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wide text-slate-600 dark:text-gray-400">Tags</label>
              <input
                type="text"
                value={form.tags}
                onChange={(event) => setForm((prev) => ({ ...prev, tags: event.target.value }))}
                className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-highlight focus:outline-none dark:border-white/10 dark:bg-white/5 dark:text-white dark:placeholder:text-gray-500"
                placeholder="astral-odyssey, theorycraft"
              />
            </div>
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={handleClose}
                className="rounded-full border border-slate-200 px-5 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-slate-700 transition hover:border-highlight hover:text-highlight dark:border-white/10 dark:text-gray-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="rounded-full bg-highlight px-5 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-white transition hover:bg-highlight/90"
              >
                Post Now
              </button>
            </div>
          </motion.form>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AddPostModal;
