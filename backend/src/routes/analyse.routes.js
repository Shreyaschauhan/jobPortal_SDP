import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  analyzeResumeWithFile,
  analyzeResumeWithUrl,
} from "../controllers/analyse.controller.js";

const router = Router();

// 🔹 FILE upload (multipart)
router.post(
  "/analyze/file",
  verifyJWT,
  upload.single("resume"),
  analyzeResumeWithFile
);

// 🔹 Resume URL (JSON only)
router.post(
  "/analyze/url",
  verifyJWT,
  analyzeResumeWithUrl
);

export default router;
