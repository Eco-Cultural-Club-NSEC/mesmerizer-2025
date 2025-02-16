import { Router } from "express";
const router = Router();
// controllers
import { adminController } from "../controllers/admin.controller.js";
import { userController } from "../controllers/user.controller.js";
// middlewares
import verifyAuth from "../middlewares/verifyAuth.js";
import isAdmin from "../middlewares/isAdmin.js";

// routes -------------------------------------------------
router.get("/all", verifyAuth, userController.getUsers)
router.get("/me", verifyAuth, userController.getCurrentUser)
router.get("/toggleadmin", verifyAuth, isAdmin, adminController.toggleAdmin);

export default router;