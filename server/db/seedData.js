import { nanoid } from "nanoid";

const createEpisodes = (animeId, slug, total, arcLabel) =>
  Array.from({ length: total }).map((_, index) => {
    const number = index + 1;
    return {
      id: nanoid(),
      animeId,
      slug,
      number,
      title: `${arcLabel} Episode ${number}`,
      synopsis:
        "Alliances shift and mysteries deepen as the crew pushes further into the unknown edges of the NeonWave universe.",
      duration: 22 + ((index * 3) % 6),
      airDate: new Date(2024, index % 12, (index % 28) + 1).toISOString(),
      thumbnail: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80",
      createdAt: new Date().toISOString(),
    };
  });

const baseAnime = [
  {
    slug: "astral-odyssey",
    title: "Astral Odyssey",
    synopsis:
      "Pilot Nova Arashi leads an unlikely crew across a neon galaxy to recover lost star relics before a cosmic fracture tears reality apart.",
    rating: 4.9,
    maturity: "13+",
    studio: "Studio Parallax",
    status: "Airing",
    releaseYear: 2025,
    genres: ["Sci-Fi", "Adventure", "Drama"],
    tags: ["Space Opera", "AI Companion", "Heist"],
    banner: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1600&q=80",
    thumbnail: "https://images.unsplash.com/photo-1523475472560-d2df97ec485c?auto=format&fit=crop&w=600&q=80",
    heroVideo: "https://storage.googleapis.com/coverr-main/mp4/Mt_Baker.mp4",
    isFeatured: true,
    isPopular: true,
    isTrending: true,
    trendingRank: 1,
    arcLabel: "Fragments of the Void",
    related: ["neon-blitz", "chrono-samurai", "mythic-arena"],
  },
  {
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
    banner: "https://images.unsplash.com/photo-1526498460520-4c246339dccb?auto=format&fit=crop&w=1600&q=80",
    thumbnail: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80",
    heroVideo: "https://storage.googleapis.com/coverr-main/mp4/Mt_Baker.mp4",
    isFeatured: true,
    isPopular: true,
    isTrending: true,
    trendingRank: 2,
    arcLabel: "City of Mirrors",
    related: ["astral-odyssey", "quantum-tide"],
  },
  {
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
    banner: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1600&q=80",
    thumbnail: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=600&q=80",
    heroVideo: "https://storage.googleapis.com/coverr-main/mp4/Mt_Baker.mp4",
    isFeatured: false,
    isPopular: true,
    isTrending: true,
    trendingRank: 3,
    arcLabel: "Sundered Timelines",
    related: ["astral-odyssey", "mythic-arena"],
  },
  {
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
    banner: "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&w=1600&q=80",
    thumbnail: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=600&q=80",
    heroVideo: "https://storage.googleapis.com/coverr-main/mp4/Mt_Baker.mp4",
    isFeatured: false,
    isPopular: true,
    isTrending: false,
    trendingRank: 5,
    arcLabel: "Trial of Champions",
    related: ["chrono-samurai", "mecha-nocturne"],
  },
  {
    slug: "celestial-garden",
    title: "Celestial Garden",
    synopsis:
      "An apprentice astrologer cultivates cosmic flora that bloom with emotions, reshaping the fate of her floating city.",
    rating: 4.6,
    maturity: "10+",
    studio: "Lumen Atelier",
    status: "Airing",
    releaseYear: 2025,
    genres: ["Slice of Life", "Fantasy", "Romance"],
    tags: ["Cozy", "Magic", "Slow Burn"],
    banner: "https://images.unsplash.com/photo-1526312426976-f4d754fa9bd6?auto=format&fit=crop&w=1600&q=80",
    thumbnail: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=600&q=80",
    heroVideo: "https://storage.googleapis.com/coverr-main/mp4/Mt_Baker.mp4",
    isFeatured: false,
    isPopular: true,
    isTrending: true,
    trendingRank: 4,
    arcLabel: "Bloom of Constellations",
    related: ["astral-odyssey", "mythic-arena"],
  },
  {
    slug: "quantum-tide",
    title: "Quantum Tide",
    synopsis:
      "A team of chrono-physicists dive into memory oceans to mend paradoxes crashing onto the shores of reality.",
    rating: 4.4,
    maturity: "13+",
    studio: "Epoch Labs",
    status: "Hiatus",
    releaseYear: 2022,
    genres: ["Sci-Fi", "Mystery"],
    tags: ["Parallel Worlds", "Mystery", "Thriller"],
    banner: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1600&q=80",
    thumbnail: "https://images.unsplash.com/photo-1526498460520-4c246339dccb?auto=format&fit=crop&w=600&q=80",
    heroVideo: "https://storage.googleapis.com/coverr-main/mp4/Mt_Baker.mp4",
    isFeatured: false,
    isPopular: false,
    isTrending: true,
    trendingRank: 6,
    arcLabel: "Paradox Drift",
    related: ["neon-blitz", "astral-odyssey"],
  },
];

export const buildAnimeSeed = () => {
  const createdAt = new Date().toISOString();
  const anime = baseAnime.map((item) => ({
    ...item,
    id: nanoid(),
    createdAt,
    updatedAt: createdAt,
  }));
  const episodes = anime.flatMap((entry) => createEpisodes(entry.id, entry.slug, 12, entry.arcLabel));
  const genres = Array.from(new Set(anime.flatMap((entry) => entry.genres))).sort();
  return { anime, episodes, genres };
};

export const homepagePromos = [
  {
    id: nanoid(),
    title: "Unlock 7-Day Prime Trial",
    copy: "Experience ad-free simulcasts and download episodes for offline hype.",
    action: "Start Trial",
  },
  {
    id: nanoid(),
    title: "Limited Neon Blitz Figures",
    copy: "Preorder the Nova and Aira duo statues with luminous stands.",
    action: "Preorder Now",
  },
];

export const homepageStats = [
  { id: nanoid(), label: "Simulcasts", value: "45+" },
  { id: nanoid(), label: "Premium Members", value: "120k" },
  { id: nanoid(), label: "Community Posts", value: "32k" },
];

export const premiumPlans = [
  {
    id: "free",
    name: "Free Explorer",
    priceMonthly: 0,
    priceYearly: 0,
    features: [
      "HD streaming with limited ads",
      "Community hub access",
      "Up to 3 favorites saved",
    ],
    highlight: false,
  },
  {
    id: "monthly",
    name: "Prime Monthly",
    priceMonthly: 7.99,
    priceYearly: 79.99,
    features: [
      "Ad-free simulcasts",
      "Offline playlists",
      "Watch party hosting",
      "Priority support",
    ],
    highlight: true,
  },
  {
    id: "annual",
    name: "Prime Annual",
    priceMonthly: 0,
    priceYearly: 84.99,
    features: [
      "Two months free",
      "Exclusive merch drops",
      "VIP community badge",
      "Neon Archive access",
    ],
    highlight: false,
  },
];

export const premiumBenefits = [
  {
    title: "Simulcast Speed",
    description: "Replays drop in minutes thanks to edge delivery tuned for anime marathons.",
  },
  {
    title: "Community Power",
    description: "Host watch parties, polls, and collaborative playlists with zero setup.",
  },
  {
    title: "Living Library",
    description: "Dive into vault episodes, director commentaries, and lore codex drops before anyone else.",
  },
];

export const communitySeed = [
  {
    id: nanoid(),
    title: "Episode 8 blew my mind!",
    message: "The reveal in Astral Odyssey episode 8 was the payoff I was waiting for. Who else caught the stardust glyph hidden in the nebula shot?",
    tags: ["astral-odyssey", "theorycraft"],
    likes: 42,
    userId: null,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
  },
  {
    id: nanoid(),
    title: "Neon Blitz soundtrack drop?",
    message: "Rumor says the producers are releasing the mixtape this Friday. Track 4 already lives rent free in my head.",
    tags: ["neon-blitz", "music"],
    likes: 25,
    userId: null,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 36).toISOString(),
  },
  {
    id: nanoid(),
    title: "Why Celestial Garden feels so cozy",
    message: "It nails the heartbeats-before-sunrise vibe. The color palettes alone are pure serotonin.",
    tags: ["celestial-garden", "comfort-watch"],
    likes: 18,
    userId: null,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(),
  },
];

export const commentSeed = (posts) => [
  {
    id: nanoid(),
    postId: posts[0]?.id,
    userId: null,
    message: "Absolutely! The glyph matches the relic pattern from episode 2.",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 10).toISOString(),
  },
];