import express from "express";
import { isAuthenticated } from "../middlewares";
import prisma from "../utils/db";
import { Prisma, Reaction, User } from "@prisma/client";

type TargetType = "thread" | "reply";

type ReactionCreateInput<T extends TargetType> = T extends TargetType
  ? Reaction & { [K in `${T}Id`]: string }
  : Reaction;

const router = express.Router();

router.post("/create", isAuthenticated, async (req, res) => {
  const { title, content, tags } = req.body;
  const user = req.session.user as User;

  if (!title || !content || !tags) {
    return res.status(401).json({
      message: "invalid payload",
    } as any);
  }

  try {
    const creatorExists = await prisma.user.findUnique({
      where: { id: user?.id },
    });

    if (!creatorExists) {
      return res.status(400).json({ error: "invalid creator ID" });
    }

    const newThread = await prisma.thread.create({
      data: {
        title,
        content,
        tags: { set: tags },
        id: user.id,
      },
      include: {
        creator: true,
        reactions: true,
        replies: true,
      },
    });

    return res.status(201).json(newThread);
  } catch (error) {
    console.error("error during post creation:", error);
    return res
      .status(500)
      .json({ error: "ohno, internal server error. our fault." });
  }
});

router.delete("/:threadId/delete", isAuthenticated, async (req, res) => {
  const { threadId } = req.params;
  const user = req.session.user as User;

  if (!threadId) {
    return res.status(401).json({
      message: "invalid payload",
    } as any);
  }

  try {
    const thread = await prisma.thread.findUnique({
      where: { id: threadId },
      include: {
        creator: true,
      },
    });

    if (!thread) {
      return res.status(404).json({ error: "Thread not found" });
    }

    if (thread?.creator?.id !== user.id) {
      return res
        .status(403)
        .json({ error: "You are not authorized to delete this thread" });
    }

    await prisma.thread.delete({
      where: { id: threadId },
    });

    return res.status(204).send();
  } catch (error) {
    console.error("Error during thread deletion:", error);

    return res
      .status(500)
      .json({ error: "ohno, internal server error. our fault." });
  }
});

router.post("/:threadId/reply", isAuthenticated, async (req, res) => {
  const { threadId } = req.params;
  const { content } = req.body;
  const user = req.session.user as User;

  if (!threadId || !content) {
    return res.status(401).json({
      message: "invalid payload",
    } as any);
  }

  try {
    const thread = await prisma.thread.findUnique({
      where: { id: threadId },
    });

    if (!thread) {
      return res.status(404).json({ error: "thread does not exist" });
    }

    const newReply = await prisma.reply.create({
      data: {
        content,
        userId: user.id,
        threadId,
      },
    });

    return res.status(201).json(newReply);
  } catch (error) {
    console.error("Error during reply creation:", error);

    return res
      .status(500)
      .json({ error: "ohno, internal server error. our fault." });
  }
});

router.post("/react", isAuthenticated, async (req, res) => {
  const { targetType, targetId, reactionEmoji } = req.body;
  const user = req.session.user as User;

  if (!targetType || !targetId || !reactionEmoji) {
    return res.status(401).json({
      message: "invalid payload",
    } as any);
  }

  try {
    if (!["thread", "reply"].includes(targetType)) {
      return res
        .status(400)
        .json({ error: "Invalid targetType. Must be 'thread' or 'reply'" });
    }

    const target = await findTarget(targetType, targetId);

    if (!target) {
      return res
        .status(404)
        .json({ error: `${targetType.capitalize()} not found` });
    }

    const newReaction = await prisma.reaction.create({
      data: {
        emoji: reactionEmoji,
        userId: user.id,
        [`${targetType}Id` as const]: targetId,
      } as ReactionCreateInput<TargetType>,
    });

    return res.status(201).json(newReaction);
  } catch (error) {
    console.error("Error during reaction creation:", error);

    return res
      .status(500)
      .json({ error: "ohno, internal server error. our fault." });
  }
});

async function findTarget(
  targetType: TargetType,
  targetId: string
): Promise<any | null> {
  const target = await (prisma[targetType] as any).findUnique({
    where: { id: targetId },
  } as Prisma.ThreadFindUniqueArgs | Prisma.ReplyFindUniqueArgs);

  return target;
}

export default router;
