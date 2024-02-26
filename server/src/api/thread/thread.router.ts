import { Router } from "express";
import { paramsWithIdSchema } from "../../interfaces/ParamsWithId";
import { requireUser, validateRequest } from "../../middlewares";
import { reactSchema, replySchema, threadSchema } from "./thread.schema";
import {
  createThread,
  deleteThread,
  getThread,
  getTrendingThreads,
  reactThread,
  replyThread,
} from "./thread.controller";

const router = Router();

router.get("/", requireUser, getThread);

router.post(
  "/",
  [requireUser, validateRequest({ body: threadSchema })],
  createThread
);

router.get("/all", requireUser, getTrendingThreads);

router.get("/:id", [
  requireUser,
  validateRequest({ params: paramsWithIdSchema }),
  getThread,
]);

router.delete(
  "/:id",
  [requireUser, validateRequest({ params: paramsWithIdSchema })],
  deleteThread
);

router.post(
  "/:id/reply",
  [requireUser, validateRequest({ body: replySchema })],
  replyThread
);

router.post(
  "/:id/react",
  [requireUser, validateRequest({ body: reactSchema })],
  reactThread
);

export default router;
