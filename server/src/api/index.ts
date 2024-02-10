import express from "express";

import MessageResponse from "../interfaces/MessageResponse";
import auth from "./auth";
import thread from "./thread";

const router = express.Router();

router.get<{}, MessageResponse>("/", (req, res) => {
  res.json({
    message: "welcome to the api of qatarstudents.com",
  });
});

router.use("/auth", auth);
router.use("/thread", thread);

export default router;
