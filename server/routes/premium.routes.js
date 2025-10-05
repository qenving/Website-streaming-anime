import { Router } from "express";
import { premiumContent } from "../controllers/premium.controller.js";

const router = Router();

router.get("/content", premiumContent);

export default router;