import { copyFileSync, existsSync, mkdirSync } from "fs";
import { join } from "path";

const root = process.cwd();
const publicRobots = join(root, "public", "robots.txt");
const distDir = join(root, "dist");
const distRobots = join(distDir, "robots.txt");

try {
  if (!existsSync(distDir)) {
    mkdirSync(distDir, { recursive: true });
  }
  if (existsSync(publicRobots)) {
    copyFileSync(publicRobots, distRobots);
    console.log("robots.txt copied to build directory.");
  } else {
    console.warn("public/robots.txt not found. Skipping copy.");
  }
} catch (error) {
  console.error("Failed to run postbuild script", error);
  process.exitCode = 1;
}
