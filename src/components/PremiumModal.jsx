import { AnimatePresence, motion } from "framer-motion";
import { Check, Sparkles, X } from "lucide-react";

const PremiumModal = ({ isOpen, onClose, onConfirm, plan }) => (
  <AnimatePresence>
    {isOpen && (
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          initial={{ scale: 0.92, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          className="w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-8 text-slate-900 shadow-neon transition dark:border-highlight/30 dark:bg-midnight-700/80 dark:text-white"
        >
          <button
            type="button"
            onClick={onClose}
            className="absolute right-6 top-6 inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 transition hover:border-highlight hover:text-highlight dark:border-white/10 dark:bg-white/5 dark:text-white"
            aria-label="Close modal"
          >
            <X size={18} />
          </button>
          <div className="flex flex-col items-center gap-3 text-center text-slate-900 dark:text-white">
            <span className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-highlight/20 text-highlight shadow-glow">
              <Sparkles size={28} />
            </span>
            <h3 className="text-2xl font-semibold">Upgrade to {plan?.name ?? "NeonWave Prime"}</h3>
            <p className="text-sm text-slate-600 dark:text-gray-300">
              Unlock simulcasts, immersive audio, and premium community perks crafted for marathons that never sleep.
            </p>
          </div>
          <ul className="mt-6 space-y-3 text-sm text-slate-700 dark:text-gray-200">
            {(plan?.features ?? []).map((feature) => (
              <li key={feature} className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-white p-3 dark:border-white/10 dark:bg-white/5">
                <span className="mt-0.5 inline-flex h-6 w-6 items-center justify-center rounded-full bg-highlight/20 text-highlight">
                  <Check size={16} />
                </span>
                {feature}
              </li>
            ))}
          </ul>
          <div className="mt-8 flex flex-col items-center gap-2 text-center text-slate-900 dark:text-white">
            {plan?.priceMonthly ? (
              <>
                <p className="text-sm uppercase tracking-[0.3em] text-highlight/80">Just ${plan.priceMonthly.toFixed(2)} / month</p>
                <p className="text-xs text-slate-500 dark:text-gray-400">Billed {plan.priceYearly ? `or $${plan.priceYearly.toFixed(2)} yearly` : "monthly"}</p>
              </>
            ) : (
              <p className="text-sm text-slate-500 dark:text-gray-400">Create your own billing logic when integrating APIs.</p>
            )}
            <button
              type="button"
              onClick={() => {
                onConfirm?.(plan);
                onClose?.();
              }}
              className="mt-4 inline-flex items-center justify-center rounded-full bg-highlight px-10 py-3 text-xs font-semibold uppercase tracking-[0.3em] text-white transition hover:bg-highlight/90"
            >
              Start My Upgrade Flow
            </button>
          </div>
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>
);

export default PremiumModal;
