import { Helmet } from "react-helmet-async";

const BASE_URL = import.meta.env.VITE_SITE_URL || "https://neonwave.app";
const DEFAULT_IMAGE = "https://cdn.neonwave.app/meta/og-banner.jpg";

const SEO = ({
  title = "NeonWave Anime",
  description = "Stream the latest anime with premium features, community perks, and blazing-fast performance.",
  image = DEFAULT_IMAGE,
  url = BASE_URL,
  keywords = [],
  schema,
  noIndex = false,
}) => {
  const keywordString = Array.isArray(keywords) ? keywords.join(", ") : keywords;

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      {keywordString && <meta name="keywords" content={keywordString} />}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:url" content={url} />
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content="NeonWave" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      <link rel="canonical" href={url} />
      {noIndex && <meta name="robots" content="noindex, nofollow" />}
      {schema && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      )}
    </Helmet>
  );
};

export default SEO;
