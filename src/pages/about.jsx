import { Link } from "react-router-dom";
import { SectionHeading } from "../components";
import SEO from "../components/SEO";
import { aboutHighlights, faqItems } from "../utils/dummyData";

const SITE_URL = import.meta.env.VITE_SITE_URL || "https://neonwave.app";

const AboutPage = () => (
  <div className="container space-y-12 pb-16 pt-8">
    <SEO
      title="About NeonWave | Anime Streaming Crafted by Fans"
      description="Learn the story behind NeonWave. Built for night owls, community storytellers, and anime binge crews with responsive design and API-ready architecture."
      url={`${SITE_URL}/about`}
      keywords={["about neonwave", "anime streaming platform", "neonwave story"]}
    />
    <SectionHeading title="About NeonWave" eyebrow="Our story">
      NeonWave is a frontend-only concept inspired by late-night watch parties, synthwave playlists, and community-driven
      fandom. Connect your APIs to turn it into a production-ready platform.
    </SectionHeading>

    <section className="grid gap-6 md:grid-cols-3">
      {aboutHighlights.map((item) => (
        <div
          key={item.title}
          className="rounded-3xl border border-slate-200 bg-white p-6 text-slate-900 transition dark:border-white/10 dark:bg-white/5 dark:text-white"
        >
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{item.title}</h3>
          <p className="mt-2 text-sm text-slate-600 dark:text-gray-300">{item.description}</p>
        </div>
      ))}
    </section>

    <section className="rounded-3xl border border-slate-200 bg-white p-8 text-slate-900 transition dark:border-white/10 dark:bg-white/5 dark:text-white">
      <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">Frequently asked</h2>
      <div className="mt-6 space-y-6">
        {faqItems.map((faq) => (
          <div key={faq.question}>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{faq.question}</h3>
            <p className="mt-2 text-sm text-slate-600 dark:text-gray-300">{faq.answer}</p>
          </div>
        ))}
      </div>
    </section>

    <section className="rounded-3xl border border-slate-200 bg-white p-8 text-slate-900 transition dark:border-white/10 dark:bg-white/5 dark:text-white">
      <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">Credits & integrations</h2>
      <ul className="mt-4 space-y-3 text-sm text-slate-600 dark:text-gray-300">
        <li>Design & Frontend: Crafted in-house with Tailwind CSS, Framer Motion, and Lucide icons.</li>
        <li>Typography: Poppins and Inter from Google Fonts.</li>
        <li>Placeholder media: Imagery via Unsplash and Coverr sample clips.</li>
      </ul>
      <p className="mt-4 text-sm text-slate-600 dark:text-gray-300">
        Want to collaborate or plug in your streaming API?
        <Link to="/community" className="text-highlight"> Join the community</Link> or email
        <a href="mailto:partners@neonwave.app" className="ml-1 text-highlight">partners@neonwave.app</a>.
      </p>
    </section>
  </div>
);

export default AboutPage;
