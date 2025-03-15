console.log("auth");

import { Router } from "express";
import { authController } from "../controllers/auth.controller.js";
import verifyAuth from "../middlewares/verifyAuth.js";

const router = Router();

// export our router to be mounted by the parent application
export default router;

router.get("/google", authController.googleAuth);
router.get("/google/callback", authController.googleAuthCallback);
router.get("/logout", authController.logout);   
router.get("/me", verifyAuth, authController.getCurrentUser);