import express from "express";

import MessageResponse from "../interfaces/MessageResponse";
import authRoutes from "./auth/auth.routes";
import threadRoutes from "./thread/thread.router";

const router = express.Router();

router.get<{}, MessageResponse>("/", (req, res) => {
  res.json({
    message: "welcome to the api of qatarstudents.com",
  });
});

router.use("/auth", authRoutes);
router.use("/thread", threadRoutes);

export default router;
