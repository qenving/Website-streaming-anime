import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import sitemap from "vite-plugin-sitemap";
import { ViteImageOptimizer } from "vite-plugin-image-optimizer";
import { VitePWA } from "vite-plugin-pwa";
const SITE_URL = process.env.VITE_SITE_URL || "https://neonwave.app";

const staticRoutes = ["/genres", "/premium", "/community", "/about", "/search", "/profile", "/login", "/register"];

export default defineConfig({
  plugins: [
    react(),
    sitemap({
      hostname: SITE_URL,
      dynamicRoutes: staticRoutes, // Only include static routes for now
      readable: true,
    }),
    ViteImageOptimizer(),
    VitePWA({
      registerType: "autoUpdate",
      manifest: {
        name: "NeonWave Anime",
        short_name: "NeonWave",
        start_url: "/",
        display: "standalone",
        background_color: "#0a0f1f",
        theme_color: "#0a0f1f",
        icons: [
          { src: "/vite.svg", sizes: "512x512", type: "image/svg+xml" }
        ],
      },
    }),
  ],
});
