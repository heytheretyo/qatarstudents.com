import * as z from "zod";

export const registerSchema = z.object({
  email: z
    .string({
      required_error: "email is required",
    })
    .email("invalid email or password"),
  username: z
    .string({
      required_error: "username is required",
    })
    .max(15, "username must be 15 characters or less"),
  password: z
    .string({ required_error: "password is required" })
    .min(8, "password must be at least 6 characters long"),
});

export const registerQuerySchema = z.object({
  refreshTokenInCookie: z.enum(["true", "false"]).default("false"),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type RegisterQuerySchema = z.infer<typeof registerQuerySchema>;

export const loginSchema = z.object({
  username: z.string({
    required_error: "username is required",
  }),
  password: z
    .string({ required_error: "password is required" })
    .min(8, "invalid username or password"),
});

export const loginQuerySchema = z.object({
  refreshTokenInCookie: z.enum(["true", "false"]).default("false"),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type LoginQuerySchema = z.infer<typeof loginQuerySchema>;

export const refreshTokenSchema = z.object({
  refresh_token: z.string().optional(),
});

export type RefreshInput = z.infer<typeof refreshTokenSchema>;
