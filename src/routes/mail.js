import { Router } from "express";
import { mailController } from "../controllers/mail.controller.js";
import verifyAuth from "../middlewares/verifyAuth.js";
import isAdmin from "../middlewares/isAdmin.js";
const router = Router();

router.get("/get", verifyAuth, mailController.getMailTemplates);
router.post("/create", verifyAuth, mailController.createMailTemplate);
router.post("/update", verifyAuth, isAdmin, mailController.updateMailTemplate);

export default router;
