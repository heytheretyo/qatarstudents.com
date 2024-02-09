import express from "express";

import MessageResponse from "../interfaces/MessageResponse";
import hello from "./hello";

const router = express.Router();

router.get<{}, MessageResponse>("/", (req, res) => {
  res.json({
    message: "welcome to the api of qatarstudents.com",
  });
});

router.use("/home", hello);

export default router;
