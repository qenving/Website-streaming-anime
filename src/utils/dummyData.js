const createEpisodes = (slug, total = 12, arcName = "") =>
  Array.from({ length: total }).map((_, index) => {
    const number = index + 1;
    return {
      id: `${slug}-ep-${number}`,
      number,
      title: arcName ? `${arcName} - Episode ${number}` : `Episode ${number}`,
      synopsis:
        "The journey intensifies as alliances shift, secrets surface, and the next phase of the saga unfolds.",
      duration: 24 + ((index * 3) % 6),
      airDate: new Date(2024, index % 12, (index % 28) + 1).toISOString(),
      thumbnail:
        "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=900&q=80",
    };
  });

export const animeLibrary = [
  {
    id: "astral-odyssey",
    slug: "astral-odyssey",
    title: "Astral Odyssey",
    synopsis:
      "Pilot Nova Arashi leads an unlikely crew across a neon galaxy to recover lost star relics and prevent a cosmic fracture.",
    rating: 4.9,
    maturity: "13+",
    studio: "Studio Parallax",
    status: "Airing",
    releaseYear: 2025,
    genres: ["Sci-Fi", "Adventure", "Drama"],
    tags: ["Space Opera", "AI Companion", "Heist"],
    banner:
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1600&q=80",
    thumbnail:
      "https://images.unsplash.com/photo-1523475472560-d2df97ec485c?auto=format&fit=crop&w=600&q=80",
    heroVideo:
      "https://storage.googleapis.com/coverr-main/mp4/Mt_Baker.mp4",
    isFeatured: true,
    isPopular: true,
    isTrending: true,
    trendingRank: 1,
    episodes: createEpisodes("astral-odyssey", 12, "Fragments of the Void"),
    related: ["neon-blitz", "mecha-nocturne", "chrono-samurai"],
  },
  {
    id: "neon-blitz",
    slug: "neon-blitz",
    title: "Neon Blitz",
    synopsis:
      "Data courier Aira runs covert missions through a cyber-metropolis where memories are a currency and shadows have firewalls.",
    rating: 4.7,
    maturity: "16+",
    studio: "Pulse District",
    status: "Completed",
    releaseYear: 2024,
    genres: ["Action", "Cyberpunk", "Thriller"],
    tags: ["Underground", "Synthwave", "Hacking"],
    banner:
      "https://images.unsplash.com/photo-1526498460520-4c246339dccb?auto=format&fit=crop&w=1600&q=80",
    thumbnail:
      "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80",
    heroVideo:
      "https://storage.googleapis.com/coverr-main/mp4/Mt_Baker.mp4",
    isFeatured: true,
    isPopular: true,
    isTrending: true,
    trendingRank: 2,
    episodes: createEpisodes("neon-blitz", 10, "City of Mirrors"),
    related: ["astral-odyssey", "quantum-idols"],
  },
  {
    id: "chrono-samurai",
    slug: "chrono-samurai",
    title: "Chrono Samurai",
    synopsis:
      "Blademaster Sora slips through fractured timelines to rewrite history before a tyrant digitizes destiny itself.",
    rating: 4.8,
    maturity: "13+",
    studio: "Eternal Forge",
    status: "Airing",
    releaseYear: 2025,
    genres: ["Action", "Fantasy", "Historical"],
    tags: ["Time Travel", "Feudal", "Katana"],
    banner:
      "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1600&q=80",
    thumbnail:
      "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=600&q=80",
    heroVideo:
      "https://storage.googleapis.com/coverr-main/mp4/Mt_Baker.mp4",
    isFeatured: false,
    isPopular: true,
    isTrending: true,
    trendingRank: 3,
    episodes: createEpisodes("chrono-samurai", 24, "Sundered Timelines"),
    related: ["astral-odyssey", "mythic-arena"],
  },
  {
    id: "mythic-arena",
    slug: "mythic-arena",
    title: "Mythic Arena",
    synopsis:
      "Chosen fighters channel mythic beasts in a battle royale that determines which dimension survives the season.",
    rating: 4.5,
    maturity: "13+",
    studio: "Obsidian Gate",
    status: "Returning",
    releaseYear: 2023,
    genres: ["Fantasy", "Action", "Tournament"],
    tags: ["Battle Royale", "Elemental", "Team Tactics"],
    banner:
      "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&w=1600&q=80",
    thumbnail:
      "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=600&q=80",
    heroVideo:
      "https://storage.googleapis.com/coverr-main/mp4/Mt_Baker.mp4",
    isFeatured: false,
    isPopular: true,
    isTrending: false,
    trendingRank: 5,
    episodes: createEpisodes("mythic-arena", 18, "Trial of Champions"),
    related: ["chrono-samurai", "mecha-nocturne"],
  },
  {
    id: "celestial-garden",
    slug: "celestial-garden",
    title: "Celestial Garden",
    synopsis:
      "An apprentice astrologer cultivates cosmic flora that bloom with emotions, reshaping the fate of her floating city.",
    rating: 4.6,
    maturity: "10+",
    studio: "Lunar Petal",
    status: "Airing",
    releaseYear: 2024,
    genres: ["Slice of Life", "Fantasy", "Romance"],
    tags: ["Wholesome", "Found Family", "Sky Islands"],
    banner:
      "https://images.unsplash.com/photo-1472214103451-9374bd1c798e?auto=format&fit=crop&w=1600&q=80",
    thumbnail:
      "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=600&q=80",
    heroVideo:
      "https://storage.googleapis.com/coverr-main/mp4/Mt_Baker.mp4",
    isFeatured: true,
    isPopular: false,
    isTrending: true,
    trendingRank: 4,
    episodes: createEpisodes("celestial-garden", 12, "Bloom Season"),
    related: ["shimmer-voyagers", "quantum-idols"],
  },
  {
    id: "mecha-nocturne",
    slug: "mecha-nocturne",
    title: "Mecha Nocturne",
    synopsis:
      "Nightshift pilots sync with bio-mechanical titans to defend their arcology when the sunless tides crash in.",
    rating: 4.4,
    maturity: "16+",
    studio: "Titan Forge",
    status: "Completed",
    releaseYear: 2022,
    genres: ["Mecha", "Drama", "Sci-Fi"],
    tags: ["Synth", "High Stakes", "Found Family"],
    banner:
      "https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&w=1600&q=80",
    thumbnail:
      "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=600&q=80",
    heroVideo:
      "https://storage.googleapis.com/coverr-main/mp4/Mt_Baker.mp4",
    isFeatured: false,
    isPopular: true,
    isTrending: false,
    trendingRank: 6,
    episodes: createEpisodes("mecha-nocturne", 26, "The Midnight Shift"),
    related: ["astral-odyssey", "neon-blitz"],
  },
  {
    id: "shimmer-voyagers",
    slug: "shimmer-voyagers",
    title: "Shimmer Voyagers",
    synopsis:
      "A trio of dream-cartographers sail bioluminescent seas, mapping the subconscious for a sleeping civilization.",
    rating: 4.2,
    maturity: "10+",
    studio: "Azure Atlas",
    status: "Airing",
    releaseYear: 2025,
    genres: ["Adventure", "Mystery", "Slice of Life"],
    tags: ["Exploration", "Dreamscape", "Slow Burn"],
    banner:
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1600&q=80",
    thumbnail:
      "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&w=600&q=80",
    heroVideo:
      "https://storage.googleapis.com/coverr-main/mp4/Mt_Baker.mp4",
    isFeatured: false,
    isPopular: false,
    isTrending: true,
    trendingRank: 5,
    episodes: createEpisodes("shimmer-voyagers", 13, "Cartographer's Hymn"),
    related: ["celestial-garden", "quantum-idols"],
  },
  {
    id: "quantum-idols",
    slug: "quantum-idols",
    title: "Quantum Idols",
    synopsis:
      "Idol trainees master harmonics that bend reality, battling rival agencies in a glittering multiverse tournament.",
    rating: 4.3,
    maturity: "13+",
    studio: "Starlight Fabric",
    status: "Returning",
    releaseYear: 2023,
    genres: ["Music", "Sci-Fi", "Drama"],
    tags: ["Idols", "Multiverse", "Rival Schools"],
    banner:
      "https://images.unsplash.com/photo-1525182008055-f88b95ff7980?auto=format&fit=crop&w=1600&q=80",
    thumbnail:
      "https://images.unsplash.com/photo-1525182008055-f88b95ff7980?auto=format&fit=crop&w=600&q=80",
    heroVideo:
      "https://storage.googleapis.com/coverr-main/mp4/Mt_Baker.mp4",
    isFeatured: false,
    isPopular: true,
    isTrending: false,
    trendingRank: 7,
    episodes: createEpisodes("quantum-idols", 20, "Stage Beyond"),
    related: ["neon-blitz", "celestial-garden"],
  },
];

export const genreFilters = Array.from(
  new Set(animeLibrary.flatMap((anime) => anime.genres))
).sort();

export const heroCarousel = animeLibrary.filter((anime) => anime.isFeatured).slice(0, 4);

export const trendingAnime = animeLibrary
  .filter((anime) => anime.isTrending)
  .sort((a, b) => a.trendingRank - b.trendingRank);

export const popularAnime = animeLibrary.filter((anime) => anime.isPopular);

export const latestAnime = [...animeLibrary].sort((a, b) => b.releaseYear - a.releaseYear);

export const premiumPlans = [
  {
    id: "free",
    name: "Free Explorer",
    priceMonthly: 0,
    priceYearly: 0,
    cta: "Stay Free",
    features: [
      "Access to latest episodes one week after release",
      "Ad-supported streaming",
      "Favorites & watch history",
      "Community posts and reactions",
    ],
    highlight: false,
  },
  {
    id: "monthly",
    name: "NeonWave Prime",
    priceMonthly: 6.99,
    priceYearly: 69.99,
    cta: "Upgrade Monthly",
    features: [
      "Simulcast + offline playlists",
      "1080p streaming with adaptive bitrate",
      "Zero ads + cinematic audio",
      "Exclusive premiere screenings",
    ],
    highlight: true,
  },
  {
    id: "yearly",
    name: "Prime Yearly",
    priceMonthly: 0,
    priceYearly: 99.99,
    cta: "Lock Yearly",
    features: [
      "2 months free compared to monthly",
      "VIP community badge & avatar frames",
      "Access to beta features first",
      "Priority support response",
    ],
    highlight: false,
  },
];

export const premiumBenefits = [
  {
    title: "Next-Level Streaming",
    description: "Dolby-grade audio, 1080p+ visuals, and priority nodes keep your marathons buttery smooth.",
    icon: "Sparkles",
  },
  {
    title: "Living Library",
    description: "Dive into vault episodes, director commentaries, and lore codex drops before anyone else.",
    icon: "BookOpen",
  },
  {
    title: "Community Power",
    description: "Host watch parties, drop polls, and flex premium badges across the NeonWave hub.",
    icon: "Users",
  },
];

export const communitySeedPosts = [
  {
    id: "post-astral-1",
    title: "Episode 8 blew my mind!",
    author: "NovaPulse",
    message: "The reveal in Astral Odyssey episode 8 was the payoff I was waiting for. Who else caught the stardust glyph hidden in the nebula shot?",
    likes: 42,
    comments: [
      {
        id: "comment-astral-1",
        message: "Absolutely! The glyph matches the relic pattern from episode 2.",
        author: "AiraVault",
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
      },
    ],
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
    tags: ["astral-odyssey", "theorycraft"],
  },
  {
    id: "post-neon-1",
    title: "Neon Blitz soundtrack drop?",
    author: "SynthRunner",
    message: "Rumor says the producers are releasing the mixtape this Friday. Track 4 already lives rent free in my head.",
    likes: 25,
    comments: [],
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 36).toISOString(),
    tags: ["neon-blitz", "music"],
  },
  {
    id: "post-garden-1",
    title: "Why Celestial Garden feels so cozy",
    author: "StarBlossom",
    message: "It nails the heartbeats-before-sunrise vibe. The color palettes alone are pure serotonin.",
    likes: 18,
    comments: [],
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(),
    tags: ["celestial-garden", "comfort-watch"],
  },
];

export const heroAds = [
  {
    id: "ad-credit",
    title: "Unlock 7-Day Prime Trial",
    copy: "Experience ad-free simulcasts and download episodes for offline hype.",
    action: "Start Trial",
  },
  {
    id: "ad-figure",
    title: "Limited Neon Blitz Figures",
    copy: "Preorder the Nova and Aira duo statues with luminous stands.",
    action: "Preorder Now",
  },
];

export const faqItems = [
  {
    question: "Is this a real streaming platform?",
    answer: "This build is a frontend-only concept ready for API integration. Hook it to your favorite anime backend when you're ready.",
  },
  {
    question: "Can I keep my favorites between visits?",
    answer: "Yep! We store favorites, premium status, and forum posts in localStorage so they persist locally.",
  },
  {
    question: "How do I switch themes?",
    answer: "Hit the neon toggle in the header to flip between default dark and soft light themes instantly.",
  },
];

export const aboutHighlights = [
  {
    title: "Why NeonWave",
    description: "Inspired by late-night anime binges, synthwave cityscapes, and the power of community storytelling.",
  },
  {
    title: "Designed for Fans",
    description: "Feedback loops from cosplayers, night coders, and AMV editors shaped each interaction.",
  },
  {
    title: "Open for Integrations",
    description: "Drop in your streaming APIs, auth providers, or CMS of choice - the DX is ready for you.",
  },
];

export const contactLinks = [
  { name: "Support", href: "mailto:support@neonwave.app" },
  { name: "Partnerships", href: "mailto:partners@neonwave.app" },
  { name: "Press Kit", href: "https://neonwave.app/press" },
];

export const footerLinks = {
  product: [
    { label: "Premium", href: "/premium" },
    { label: "Community", href: "/community" },
    { label: "Genres", href: "/genres" },
  ],
  company: [
    { label: "About", href: "/about" },
    { label: "Careers", href: "#" },
    { label: "Support", href: "#" },
  ],
  legal: [
    { label: "Terms", href: "#" },
    { label: "Privacy", href: "#" },
    { label: "Cookies", href: "#" },
  ],
};

export const heroStats = [
  { label: "Simulcasts", value: "45+" },
  { label: "Premium Members", value: "120k" },
  { label: "Community Posts", value: "32k" },
];
