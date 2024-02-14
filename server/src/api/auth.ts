import express from "express";
import prisma from "../utils/db";
import axios from "axios";
import bcrypt from "bcrypt";
import { User } from "@prisma/client";
import { createValidator } from "express-joi-validation";
import Joi from "joi";

const router = express.Router();

type Response = string;

const validator = createValidator();

const registerSchema = Joi.object({
  username: Joi.string().required().max(15),
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
});

const loginSchema = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().required(),
});

router.post<{}, Response>(
  "/register",
  validator.body(registerSchema),
  async (req, res) => {
    const { username, password, email } = req.body;

    const existingEmail = await prisma.user.findUnique({
      where: { email: email as string },
    });
    const existingUsername = await prisma.user.findUnique({
      where: { username: username as string },
    });

    if (existingEmail) {
      return res.status(401).json({
        message: "email already associated with an account",
      } as any);
    }

    if (existingUsername) {
      return res.status(401).json({
        message: "username already associated with an account",
      } as any);
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        username: username,
        email: email as string,
        password: hashedPassword,
      },
    });

    req.session.user = user;

    return res.status(200).json(user as any);
  }
);

router.post<{}, Response>(
  "/login",
  validator.body(loginSchema),
  async (req, res) => {
    const { password, username } = req.body;

    if (!username) {
      return res.status(401).json({
        message: "invalid payload",
      } as any);
    }

    const user = await prisma.user.findUnique({
      where: { username: username as string },
    });

    if (!user) {
      return res.status(401).json({
        message: "email or password is invalid",
      } as any);
    }

    console.log(user);

    if (user.password == null) {
      return res.status(401).json({
        message:
          "this account is connected via google, reset password to add password",
      } as any);
    }

    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return res
        .status(401)
        .json({ message: "email or password is invalid" } as any);
    }

    req.session.user = user;
    return res.status(200).json(user as any);
  }
);

router.get("/logout", async (req, res) => {
  req.session.user = {};
  return res.status(200).json({ message: "user has signed out" });
});

router.get("/google", (req, res) => {
  const authURL = `https://accounts.google.com/o/oauth2/auth?response_type=code&client_id=${process.env.GOOGLE_CLIENT_ID}&redirect_uri=${process.env.GOOGLE_CLIENT_REDIRECT}&scope=profile+email`;
  res.redirect(authURL);
});

router.get<{}, Response>("/google/callback", async (req, res) => {
  const { code } = req.query;

  const tokenResponse = await axios.post(
    "https://oauth2.googleapis.com/token",
    {
      code,
      client_id: process.env.GOOGLE_CLIENT_ID,
      client_secret: process.env.GOOGLE_CLIENT_SECRET,
      redirect_uri: process.env.GOOGLE_CLIENT_REDIRECT,
      grant_type: "authorization_code",
    }
  );

  const accessToken = tokenResponse.data.access_token;

  const userResponse = await axios.get(
    "https://www.googleapis.com/oauth2/v2/userinfo",
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  const { id, name, email } = userResponse.data;

  if (req.session.user) {
    const authenticatedUser = req.session.user as User;

    if (!authenticatedUser.googleId) {
      const updatedUser = await prisma.user.update({
        where: { id: authenticatedUser.id },
        data: { googleId: id },
      });

      req.session.user = updatedUser;
      res.json(updatedUser as any);
      return;
    }

    res.json(authenticatedUser as any);
    return;
  }

  const existingUser = await prisma.user.findUnique({
    where: { email: email as string },
  });

  // sign in via google

  if (existingUser?.googleId) {
    req.session.user = existingUser;
    console.log("signed in via google");
    return res.status(200).json(existingUser as any);
  }

  if (existingUser && !existingUser?.googleId) {
    return res.status(401).json({
      message:
        "email already associated with an account. please log in if you want to connect via google.",
    } as any);
  }

  const newUser = await prisma.user.create({
    data: {
      username: name.trim().replace(/\s/g, ""),
      email: email as string,
      googleId: id,
    },
  });

  req.session.user = newUser;

  return res.status(200).json(newUser as any);
});

export default router;
