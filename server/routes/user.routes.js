import { Router } from "express";
import { dashboard, favorites, toggle } from "../controllers/user.controller.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

router.get("/me/dashboard", requireAuth, dashboard);
router.get("/me/favorites", requireAuth, favorites);
router.post("/me/favorites/:slug", requireAuth, toggle);

export default router;