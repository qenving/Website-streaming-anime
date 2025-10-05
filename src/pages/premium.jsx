import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { PremiumModal, SectionHeading } from "../components";
import SEO from "../components/SEO";
import { useAuthContext } from "../context/AuthContext";
import { fetchPremiumContent } from "../utils/apiPlaceholders";

const SITE_URL = import.meta.env.VITE_SITE_URL || "https://neonwave.app";

const PremiumPage = () => {
  const { data: content, isLoading, isError, error } = useQuery({
    queryKey: ["premium-content"],
    queryFn: fetchPremiumContent,
  });
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [upgradeError, setUpgradeError] = useState("");
  const { isPremium, upgrade } = useAuthContext();

  if (isLoading) {
    return (
      <div className="container py-24">
        <p className="text-center text-sm text-slate-500 dark:text-gray-400">Loading premium perks...</p>
      </div>
    );
  }

  if (isError || !content) {
    return (
      <div className="container py-24 text-center text-sm text-red-500 dark:text-red-400">
        {error?.response?.data?.message ?? "Unable to load premium content"}
      </div>
    );
  }

  const openModalForPlan = (plan) => {
    setSelectedPlan(plan);
    setIsModalOpen(true);
    setUpgradeError("");
  };

  const handleUpgrade = async (plan) => {
    if (!plan || plan.id === "free") {
      setIsModalOpen(false);
      return;
    }
    setUpgradeError("");
    try {
      await upgrade();
      setIsModalOpen(false);
    } catch (err) {
      setUpgradeError(err.response?.data?.message ?? "Upgrade failed");
    }
  };

  const quickPlan = content.plans.find((plan) => plan.id === "monthly") ?? content.plans.find((plan) => plan.id !== "free");

  return (
    <div className="container space-y-16 pb-16 pt-8">
      <SEO
        title="NeonWave Premium | Unlock Anime Marathons"
        description="Upgrade to NeonWave Premium for ad-free simulcasts, offline playlists, and exclusive community perks. Choose monthly or yearly plans tailored for true anime fans."
        image="https://cdn.neonwave.app/meta/og-banner.jpg"
        url={`${SITE_URL}/premium`}
        keywords={["anime premium", "ad-free anime", "neonwave prime", "anime membership"]}
      />
      <SectionHeading title="Upgrade to NeonWave Prime" eyebrow="Premium tiers">
        Plans and benefits stream directly from the backend. Integrate Stripe or Lemon Squeezy with the provided upgrade hook.
      </SectionHeading>

      {upgradeError && <p className="text-sm font-semibold text-red-500 dark:text-red-400">{upgradeError}</p>}

      <div className="grid gap-6 md:grid-cols-3">
        {content.plans.map((plan) => (
          <article
            key={plan.id}
            className={`rounded-3xl border p-8 transition ${
              plan.highlight
                ? "border-highlight/60 bg-highlight/20 text-slate-900 shadow-neon dark:text-white"
                : "border-slate-200 bg-white text-slate-900 dark:border-white/10 dark:bg-white/5 dark:text-white"
            }`}
          >
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold text-slate-900 dark:text-white">{plan.name}</h3>
              {plan.highlight && <span className="text-xs uppercase tracking-[0.3em] text-highlight">Recommended</span>}
            </div>
            {plan.priceMonthly ? (
              <p className="mt-4 text-3xl font-semibold text-slate-900 dark:text-white">
                ${plan.priceMonthly.toFixed(2)} <span className="text-sm text-slate-600 dark:text-gray-300">/month</span>
              </p>
            ) : (
              <p className="mt-4 text-2xl font-semibold text-slate-900 dark:text-white">Free</p>
            )}
            {plan.priceYearly > 0 && (
              <p className="text-xs uppercase tracking-wide text-slate-500 dark:text-gray-400">or ${plan.priceYearly.toFixed(2)} yearly</p>
            )}
            <ul className="mt-6 space-y-3 text-sm text-slate-600 dark:text-gray-200">
              {plan.features.map((feature) => (
                <li key={feature} className="flex items-center gap-2">
                  <span className="inline-flex h-2 w-2 rounded-full bg-highlight" /> {feature}
                </li>
              ))}
            </ul>
            <button
              type="button"
              onClick={() => openModalForPlan(plan)}
              className="mt-6 w-full rounded-full bg-highlight px-5 py-3 text-xs font-semibold uppercase tracking-[0.3em] text-white transition hover:bg-highlight/90"
            >
              {plan.id === "free" ? "Stay Free" : "Upgrade"}
            </button>
          </article>
        ))}
      </div>

      <section className="grid gap-6 md:grid-cols-3">
        {content.benefits.map((benefit) => (
          <div
            key={benefit.title}
            className="rounded-3xl border border-slate-200 bg-white p-6 text-slate-900 transition dark:border-white/10 dark:bg-white/5 dark:text-white"
          >
            <h4 className="text-lg font-semibold text-slate-900 dark:text-white">{benefit.title}</h4>
            <p className="mt-2 text-sm text-slate-600 dark:text-gray-300">{benefit.description}</p>
          </div>
        ))}
      </section>

      <section className="rounded-3xl border border-highlight/30 bg-highlight/10 p-10 text-slate-900 shadow-neon dark:text-white">
        <div className="flex flex-col items-start gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-highlight/80">Premium status</p>
            <h3 className="mt-2 text-2xl font-semibold text-slate-900 dark:text-white">{isPremium ? "You are glowing with Prime" : "You are on the Free Explorer plan"}</h3>
            <p className="mt-2 max-w-xl text-sm text-slate-700 dark:text-white/80">
              Upgrades flip the premium flag server-side. Connect billing and webhooks to sync entitlements without changing the frontend.
            </p>
          </div>
          {!isPremium && quickPlan && (
            <button
              type="button"
              onClick={() => openModalForPlan(quickPlan)}
              className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-xs font-semibold uppercase tracking-[0.3em] text-highlight transition hover:opacity-90"
            >
              Quick Upgrade
            </button>
          )}
        </div>
      </section>

      <PremiumModal
        isOpen={isModalOpen}
        plan={selectedPlan}
        onClose={() => setIsModalOpen(false)}
        onConfirm={(plan) => handleUpgrade(plan)}
      />
    </div>
  );
};

export default PremiumPage;
