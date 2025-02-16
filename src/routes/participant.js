import { Router } from "express";
const router = Router();
// controllers
import { participantController } from "../controllers/participant.controller.js";
// middlewares
import verifyAuth from "../middlewares/verifyAuth.js";
import isAdmin from "../middlewares/isAdmin.js";

// routes ------------------------------------

//to be used in admin panel
router.get("/", verifyAuth, participantController.getParticipants);
router.get("/togglestatus", verifyAuth, isAdmin, participantController.toggleApproveStatus);

//to be used on registration page
router.post("/register", participantController.registerParticipant);

export default router;