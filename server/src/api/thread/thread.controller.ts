import { Prisma, Reaction, Reply, Thread } from "@prisma/client";
import prisma from "../../utils/db";
import { NextFunction, Request, Response } from "express";
import MessageResponse from "../../interfaces/MessageResponse";
import { ThreadInput } from "./thread.schema";
import { ParamsWithId } from "../../interfaces/ParamsWithId";

type TargetType = "thread" | "reply";

type ReactionCreateInput<T extends TargetType> = T extends TargetType
  ? Reaction & { [K in `${T}Id`]: string }
  : Reaction;

export async function createThread(
  req: Request<{}, Thread, ThreadInput>,
  res: Response<MessageResponse | Thread>
) {
  const { title, content, tags } = req.body;
  const user = req.user;

  try {
    const creatorExists = await prisma.user.findUnique({
      where: { id: user?.id },
    });

    if (!creatorExists) {
      return res.status(400).json({ message: "invalid creator id" });
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
      .json({ message: "ohno, internal server error. our fault." });
  }
}

export async function deleteThread(
  req: Request,
  res: Response<MessageResponse | Thread>
) {
  const { id: threadId } = req.params;
  const user = req.user;

  try {
    const thread = await prisma.thread.findUnique({
      where: { id: threadId },
      include: {
        creator: true,
      },
    });

    if (!thread) {
      return res.status(404).json({ message: "thread not found" });
    }

    if (thread?.creator?.id !== user.id) {
      return res
        .status(403)
        .json({ message: "you are not authorized to delete this thread" });
    }

    await prisma.thread.delete({
      where: { id: threadId },
    });

    return res.status(204).send();
  } catch (error) {
    console.error("Error during thread deletion:", error);

    return res
      .status(500)
      .json({ message: "ohno, internal server error. our fault." });
  }
}

export async function replyThread(
  req: Request,
  res: Response<MessageResponse | Reply>
) {
  const { id: threadId } = req.params;
  const { content } = req.body;
  const user = req.user;

  try {
    const thread = await prisma.thread.findUnique({
      where: { id: threadId },
    });

    if (!thread) {
      return res.status(404).json({ message: "thread does not exist" });
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
      .json({ message: "ohno, internal server error. our fault." });
  }
}

export async function reactThread(
  req: Request,
  res: Response<Reaction | MessageResponse>
) {
  const { targetType, targetId, reactionEmoji } = req.body;
  const user = req.user;

  try {
    if (!["thread", "reply"].includes(targetType)) {
      return res
        .status(400)
        .json({ message: "invalid targetType. must be 'thread' or 'reply'" });
    }

    const target = await findTarget(targetType, targetId);

    if (!target) {
      return res
        .status(404)
        .json({ message: `${targetType.capitalize()} not found` });
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
    console.error("error during reaction creation:", error);

    return res
      .status(500)
      .json({ message: "ohno, internal server error. our fault." });
  }
}

export async function getThread(
  req: Request<ParamsWithId, Thread, {}>,
  res: Response<Thread | MessageResponse>
) {
  try {
    const thread = await prisma.thread.findUnique({
      where: {
        id: req.params.id,
      },
    });

    if (!thread) {
      return res.status(404).json({ message: "thread not found" });
    }

    return res.json(thread);
  } catch (error) {
    console.error("error during reply creation:", error);

    return res
      .status(500)
      .json({ message: "ohno, internal server error. our fault." });
  }
}

export async function getTrendingThreads(
  req: Request,
  res: Response<Thread[] | MessageResponse>
) {
  try {
    const thread = await prisma.thread.findMany();

    return res.json(thread);
  } catch (error) {
    console.error("error during reply creation:", error);

    return res
      .status(500)
      .json({ message: "ohno, internal server error. our fault." });
  }
}

async function findTarget(
  targetType: TargetType,
  targetId: string
): Promise<any | null> {
  const target = await (prisma[targetType] as any).findUnique({
    where: { id: targetId },
  } as Prisma.ThreadFindUniqueArgs | Prisma.ReplyFindUniqueArgs);

  return target;
}
