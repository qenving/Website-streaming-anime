import { Award, Flame, LogOut, Shield } from "lucide-react";

const ProfileCard = ({ user, planLabel, onLogout }) => (
  <section className="rounded-3xl border border-slate-200 bg-white p-6 text-slate-900 shadow-glow transition dark:border-white/10 dark:bg-white/5 dark:text-white">
    <div className="flex items-start justify-between gap-4">
      <div>
        <h2 className="text-xl font-semibold text-slate-900 dark:text-white">{user?.name ?? "Guest"}</h2>
        <p className="text-sm text-slate-600 dark:text-gray-300">{user?.email ?? "guest@neonwave.app"}</p>
      </div>
      <span className="inline-flex items-center gap-2 rounded-full bg-highlight/20 px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-highlight">
        <Shield size={14} /> {planLabel}
      </span>
    </div>
    <div className="mt-6 grid gap-4 md:grid-cols-3">
      <div className="rounded-2xl border border-slate-200 bg-white p-4 text-sm text-slate-600 transition dark:border-white/10 dark:bg-white/5 dark:text-gray-300">
        <Award className="mb-2 text-highlight" size={18} />
        <p>Premium perks unlock simulcasts, offline queues, and invite-only events.</p>
      </div>
      <div className="rounded-2xl border border-slate-200 bg-white p-4 text-sm text-slate-600 transition dark:border-white/10 dark:bg-white/5 dark:text-gray-300">
        <Flame className="mb-2 text-highlight" size={18} />
        <p>Build streaks by logging in daily - bonus avatars arrive soon.</p>
      </div>
      <div className="rounded-2xl border border-slate-200 bg-white p-4 text-sm text-slate-600 transition dark:border-white/10 dark:bg-white/5 dark:text-gray-300">
        <p className="font-semibold text-slate-900 dark:text-white">Need to switch profiles?</p>
        <button
          type="button"
          onClick={onLogout}
          className="mt-3 inline-flex items-center gap-2 rounded-full border border-slate-200 px-4 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-slate-700 transition hover:border-highlight hover:text-highlight dark:border-white/10 dark:text-gray-200"
        >
          <LogOut size={16} /> Logout
        </button>
      </div>
    </div>
  </section>
);

export default ProfileCard;
