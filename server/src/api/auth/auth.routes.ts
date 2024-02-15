import { Router } from "express";
import { validateRequest } from "../../middlewares";
import {
  loginQuerySchema,
  loginSchema,
  registerQuerySchema,
  registerSchema,
  refreshTokenSchema,
} from "./auth.schemas";
import {
  googleCallback,
  login,
  logout,
  googleLogin,
  refreshTokens,
  register,
} from "./auth.controller";

const router = Router();

router.post(
  "/register",
  validateRequest({ query: registerQuerySchema, body: registerSchema }),
  register
);

router.post(
  "/login",
  validateRequest({ query: loginQuerySchema, body: loginSchema }),
  login
);

router.post(
  "/refreshToken",
  validateRequest({ query: loginQuerySchema, body: refreshTokenSchema }),
  refreshTokens
);

router.post("/logout", logout);

router.post("/google", googleLogin);

router.post("/google/callback", googleCallback);

export default router;
