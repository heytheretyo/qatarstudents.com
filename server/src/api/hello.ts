import express from "express";

const router = express.Router();

type Response = string;

router.get<{}, Response>("/", (req, res) => {
  res.json("hello world");
});

export default router;
