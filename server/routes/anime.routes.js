import { Router } from "express";
import { episodes, genres, homepage, list, related, show } from "../controllers/anime.controller.js";
import { optionalAuth } from "../middleware/auth.js";

const router = Router();

router.get("/home", optionalAuth, homepage);
router.get("/genres", genres);
router.get("/", optionalAuth, list);
router.get("/:slug", optionalAuth, show);
router.get("/:slug/episodes", optionalAuth, episodes);
router.get("/:slug/related", optionalAuth, related);

export default router;