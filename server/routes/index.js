import { Router } from "express";
import animeRoutes from "./anime.routes.js";
import authRoutes from "./auth.routes.js";
import communityRoutes from "./community.routes.js";
import premiumRoutes from "./premium.routes.js";
import userRoutes from "./user.routes.js";
import aniDbRoutes from "./anidb.routes.js";

const router = Router();

router.use("/auth", authRoutes);
router.use("/anime", animeRoutes);
router.use("/community", communityRoutes);
router.use("/premium", premiumRoutes);
router.use("/users", userRoutes);
router.use("/anidb", aniDbRoutes);

export default router;