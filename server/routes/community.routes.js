import { Router } from "express";
import { comment, create, like, list } from "../controllers/community.controller.js";
import { optionalAuth, requireAuth } from "../middleware/auth.js";

const router = Router();

router.get("/posts", optionalAuth, list);
router.post("/posts", requireAuth, create);
router.post("/posts/:postId/like", requireAuth, like);
router.post("/posts/:postId/comments", requireAuth, comment);

export default router;