import * as z from "zod";

export const threadSchema = z.object({
  title: z.string().max(30, "title can't reach above 30 characters"),
  content: z.string().max(250, "content can't reach above 30 characters"),
  tags: z.string().array(),
});

export const replySchema = z.object({
  content: z.string().max(50, "content can't reach above 30 characters"),
});

export const reactSchema = z.object({
  emoji: z.string().max(1, "emoji has to be one character"),
});

export type ThreadInput = z.infer<typeof threadSchema>;
