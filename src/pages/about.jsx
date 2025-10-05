import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { LoadingSpinner, SectionHeading } from "../components";
import SEO from "../components/SEO";
import { fetchAboutContent } from "../utils/apiPlaceholders";

const SITE_URL = import.meta.env.VITE_SITE_URL || "https://neonwave.app";

const AboutPage = () => {
  const {
    data: content,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["content", "about"],
    queryFn: fetchAboutContent,
  });

  if (isLoading) {
    return (
      <div className="container flex items-center justify-center py-24">
        <LoadingSpinner label="Loading about content" />
      </div>
    );
  }

  if (isError || !content) {
    return (
      <div className="container py-24 text-center text-sm text-red-500 dark:text-red-400">
        {error?.response?.data?.message ?? "Unable to load about information"}
      </div>
    );
  }

  const { mission, hero, highlights = [], faqs = [] } = content;

  return (
    <div className="container space-y-12 pb-16 pt-8">
      <SEO
        title="About NeonWave | Anime Streaming Crafted by Fans"
        description={
          mission ??
          "Learn the story behind NeonWave. Built for night owls, community storytellers, and anime binge crews with API-ready architecture."
        }
        url={`${SITE_URL}/about`}
        keywords={["about neonwave", "anime streaming platform", "neonwave story"]}
      />
      <SectionHeading title="About NeonWave" eyebrow="Our story">
        {hero ||
          "NeonWave is a frontend concept inspired by late-night watch parties, synthwave playlists, and community-driven fandom. Connect your APIs to turn it into a production-ready platform."}
      </SectionHeading>

      {mission && (
        <section className="rounded-3xl border border-highlight/40 bg-highlight/10 p-8 text-slate-900 shadow-neon transition dark:border-highlight/30 dark:bg-highlight/10 dark:text-white">
          <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">Our mission</h2>
          <p className="mt-3 text-sm text-slate-700 dark:text-white/80">{mission}</p>
        </section>
      )}

      {highlights.length > 0 && (
        <section className="grid gap-6 md:grid-cols-3">
          {highlights.map((item) => (
            <div
              key={item.title}
              className="rounded-3xl border border-slate-200 bg-white p-6 text-slate-900 transition dark:border-white/10 dark:bg-white/5 dark:text-white"
            >
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{item.title}</h3>
              <p className="mt-2 text-sm text-slate-600 dark:text-gray-300">{item.description}</p>
            </div>
          ))}
        </section>
      )}

      {faqs.length > 0 && (
        <section className="rounded-3xl border border-slate-200 bg-white p-8 text-slate-900 transition dark:border-white/10 dark:bg-white/5 dark:text-white">
          <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">Frequently asked</h2>
          <div className="mt-6 space-y-6">
            {faqs.map((faq) => (
              <div key={faq.question}>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{faq.question}</h3>
                <p className="mt-2 text-sm text-slate-600 dark:text-gray-300">{faq.answer}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      <section className="rounded-3xl border border-slate-200 bg-white p-8 text-slate-900 transition dark:border-white/10 dark:bg-white/5 dark:text-white">
        <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">Credits & integrations</h2>
        <ul className="mt-4 space-y-3 text-sm text-slate-600 dark:text-gray-300">
          <li>Design & Frontend: Tailwind CSS, Framer Motion, and Lucide icons.</li>
          <li>Typography: Poppins and Inter from Google Fonts.</li>
          <li>Metadata: AniDB live sync with SQLite normalization.</li>
          <li>Streaming: Bring your own CDN or embed providers like Doodstream & MixDrop.</li>
        </ul>
        <p className="mt-4 text-sm text-slate-600 dark:text-gray-300">
          Want to collaborate or plug in your streaming API?
          <Link to="/community" className="text-highlight"> Join the community</Link> or email
          <a href="mailto:partners@neonwave.app" className="ml-1 text-highlight">
            partners@neonwave.app
          </a>
          .
        </p>
      </section>
    </div>
  );
};

export default AboutPage;
