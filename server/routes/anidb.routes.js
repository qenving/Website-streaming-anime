import { Router } from "express";
import { random, show } from "../controllers/anidb.controller.js";
import { optionalAuth } from "../middleware/auth.js";

const router = Router();

router.get("/random", optionalAuth, random);
router.get("/anime/:id", optionalAuth, show);

export default router;
