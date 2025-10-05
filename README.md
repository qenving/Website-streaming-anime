# NeonWave Anime  Frontend Concept

NeonWave is a frontend-only streaming concept inspired by Zoro.to and Netflix. It ships as a Vite + React + Tailwind CSS project with dummy data, LocalStorage persistence, and API placeholder helpers so you can connect a real backend when ready.

## Highlights
- Fully responsive layouts for desktop, tablet, and mobile.
- Dark-first theme with a toggle, neon gradients, and motion transitions powered by Framer Motion.
- SEO-ready head management with dynamic OpenGraph and Schema.org data (react-helmet-async).
- Cached API calls via TanStack Query and optimized bundles with lazy media.
- PWA manifest, sitemap, and robots.txt generated during the build for easy CDN deployment.

## Getting Started
```
npm install
npm run dev
```
Visit `http://localhost:5173` and explore the app.

### Production build
```
npm run build
```
The build step now also copies `robots.txt`, generates `sitemap.xml`, and outputs a PWA service worker.

## Environment Variables
Create a `.env` (or `.env.local`) file to configure canonical metadata and API calls:
```
VITE_SITE_URL=https://neonwave.app
VITE_API_URL=https://api.neonwave.app
```
### Backend configuration
```
PORT=4000
CLIENT_URL=http://localhost:5173
JWT_ACCESS_SECRET=replace-me
JWT_REFRESH_SECRET=replace-me-too
DB_FILE=server/db/data.sqlite

# Optional: wire up AniDB live data
ANIDB_ENABLED=true
ANIDB_CLIENT=your-registered-client-string
ANIDB_CLIENT_VERSION=1
ANIDB_USERNAME=optional
ANIDB_PASSWORD=optional
ANIDB_CACHE_TTL=3600
```

> **Tip:** AniDB requires you to register a client string. Visit [AniDB's API documentation](https://wiki.anidb.net/HTTP_API_Definition) to create credentials. When the credentials are present the backend will hydrate catalog data with live recommendations and expose `/api/anidb/*` endpoints.

## Database & Seeding

The dummy JSON store has been replaced with a production-ready SQLite bundle powered by `better-sqlite3`. Tables cover users, refresh tokens, anime metadata, episodes, community posts, favorites, and premium plans.

To bootstrap local data run:

```
npm run db:reset
npm run db:seed
```

The seed script now fetches live AniDB recommendations (when credentials are supplied) and folds them into the NeonWave catalog alongside curated sample titles. Passwords for the built-in admin/demo accounts are configurable through `SEED_ADMIN_PASSWORD` and `SEED_DEMO_PASSWORD`.

## Project Structure
```
src/
 +- components/      // Reusable UI pieces (Navbar, AnimeCard, Player, SEO, etc.)
 +- context/         // Theme and auth providers backed by LocalStorage
 +- hooks/           // Custom hooks (useAuth, useFavorites)
 +- pages/           // Route components (dynamic folders for slug/episode)
 +- styles/          // Tailwind-powered global styles
 +- utils/           // Dummy data, storage helpers, API placeholders
scripts/
 +- postbuild.js     // Copies robots.txt into the production bundle
```

## Core Data & Persistence
- `src/utils/dummyData.js`  Featured anime, genres, premium plan definitions, community seed posts, and marketing copy.
- `src/utils/storage.js`  LocalStorage helpers for user profile, favorites, theme, and community posts.
- `src/utils/apiPlaceholders.js`  Promise-based facades that simulate network latency. Swap these with real fetch calls when you plug in an API.

## UI/UX & SEO Notes
- Theme: Neon gradients, glassmorphism accents, and smooth hover states deliver a futuristic anime vibe. Dark mode is default with a one-click light mode.
- Motion: Framer Motion powers hero carousel transitions, modals, and subtle elevation shifts to keep the interface lively without being heavy.
- Responsiveness: Flexbox and Tailwind grid utilities ensure cards, carousels, and forms adapt cleanly from widescreen to handheld.
- SEO: Pages use `<SEO />` (react-helmet-async) and structured data; sitemap/robots are generated during build.
- Performance: TanStack Query caches API responses, images are optimized at build time, and videos lazy-load via an intersection observer.

## Integration Tips
1. Replace the placeholder video source in `Player` with your CDN or DRM-enabled streams.
2. Swap `apiPlaceholders.js` with real endpoints. The calling components already await promises.
3. Connect `storage.js` to your auth provider (Supabase, Auth0, custom) to manage tokens and server-persisted favorites.
4. Extend the community page to hit a real-time backend for comments and likes.
5. Update the Google Analytics ID in `index.html` (replace `G-XXXXXXX`) or hook up your privacy-friendly analytics of choice.
6. Serve the built assets via a CDN or Nginx with `Cache-Control: public, s-maxage=604800, stale-while-revalidate=30` for HTML and API responses.

## Performance Snapshot
- `npm run build` outputs a production bundle under 2 MB (about 412 kB main chunk plus 32 kB CSS) with tree-shaken component splits.
- Lazy-loaded routes keep initial load fast while staying Lighthouse-friendly (90+ ready).

Have fun merging your data feeds with NeonWave.
