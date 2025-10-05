import { Router } from "express";
import { about, footer, show } from "../controllers/content.controller.js";

const router = Router();

router.get("/about", about);
router.get("/footer", footer);
router.get("/:key", show);

export default router;
