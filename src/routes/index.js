import { Router } from "express";
const apiRouter = Router();
import userRouter from "./user.js";
import authRouter from "./auth.js";
import participantsRouter from "./participant.js";

const mountRoutes = (app) => {
  app.use("/api/v1", apiRouter);
  apiRouter.use("/auth", authRouter);
  apiRouter.use("/user", userRouter);
  apiRouter.use("/participants", participantsRouter);

  //handle undefined routes
  app.all("*", (req, res) => {
    res.status(404).json({ message: "route not found" });
  });

  //error handling middleware
  app.use((err, req, res, next) => {
    console.log(err.message);
    res.status(500).json({ message: "server broke !!" });
  });
};

export default mountRoutes;
