import { Router } from "express";
import { authController } from "../controllers/auth.controller.js";

const router = Router();

// export our router to be mounted by the parent application
export default router;

router.get("/google", authController.googleAuth);
router.get("/google/callback", authController.googleAuthCallback);

