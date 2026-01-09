import { Router } from "express";
import { getTechNews } from "../controllers/news.controller.js";

const router = Router();

router.get("/tech", getTechNews);

export default router;
