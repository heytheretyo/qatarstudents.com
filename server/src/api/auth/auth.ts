import express from "express";
import prisma from "../../utils/db";
import axios from "axios";
import { User } from "@prisma/client";

const router = express.Router();

type Response = string;

router.post<{}, Response>("/signup", async (req, res) => {
  const { username, password, email } = req.body;

  const existingUser = await prisma.user.findUnique({
    where: { email: email as string },
  });

  if (existingUser) {
    res.status(200).json({
      message: "email already associated with an account",
    } as any);
  }

  console.log("adding user");

  const user = await prisma.user.create({
    data: {
      username: username,
      email: email as string,
      password: password,
    },
  });
});

router.post<{}, Response>("/signin", (req, res) => {
  const { username, password, email } = req.body;
});

router.get("/signout", async (req, res) => {
  req.logout((err) => {
    if (err) {
      console.error(err);
    }
  });
});

router.get<{}, Response>("/refreshtoken", (req, res) => {
  res.json("hello world");
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

  console.log(userResponse.data);

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

  if (existingUser) {
    res.status(401).json({
      message: "Email already associated with an account. Please log in.",
    } as any);
    return;
  }

  const newUser = await prisma.user.create({
    data: {
      username: name.trim().replace(/\s/g, ""),
      email: email as string,
      googleId: id,
    },
  });

  req.session.user = newUser; // Store the user information in the session
  res.json(newUser as any);
});

export default router;
