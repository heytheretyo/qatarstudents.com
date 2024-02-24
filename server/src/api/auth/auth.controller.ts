import { Response, Request, NextFunction } from "express";
import prisma from "../../utils/db";
import axios, { AxiosError } from "axios";
import bcrypt from "bcrypt";
import { TokensResponseInterface } from "../../interfaces/TokenResponse";
import {
  LoginInput,
  LoginQuerySchema,
  RefreshInput,
  RegisterInput,
  RegisterQuerySchema,
} from "./auth.schemas";
import MessageResponse from "../../interfaces/MessageResponse";
import { generateTokens, verifyRefreshToken } from "../../utils/jwt";
import {
  addRefreshTokenToWhitelist,
  deleteRefreshToken,
  findRefreshTokenById,
} from "./auth.service";
import { sendRefreshToken } from "../../utils/sendRefreshToken";
import cuid from "cuid";
import { hashToken } from "../../utils/hashToken";
import { config } from "../../utils/config";

export async function register(
  req: Request<{}, TokensResponseInterface, RegisterInput, RegisterQuerySchema>,
  res: Response<TokensResponseInterface | MessageResponse>,
  next: NextFunction
) {
  try {
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
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        username: username,
        email: email as string,
        password: hashedPassword,
      },
    });

    const jti = cuid();
    const { accessToken, refreshToken } = generateTokens(user, jti);

    await addRefreshTokenToWhitelist({ jti, refreshToken, userId: user.id });

    sendRefreshToken(res, refreshToken);
    res.json({
      access_token: accessToken,
    });
  } catch (error) {
    next(error);
  }
}

export async function login(
  req: Request<{}, TokensResponseInterface, LoginInput, LoginQuerySchema>,
  res: Response<TokensResponseInterface | MessageResponse>,
  next: NextFunction
) {
  try {
    const { username, password } = req.body;

    const existingUser = await prisma.user.findUnique({
      where: { username: username as string },
    });

    if (!existingUser) {
      return res.status(401).json({
        message: "username or password is invalid",
      } as any);
    }

    if (existingUser.password == null) {
      return res.status(401).json({
        message:
          "this account is connected via google, reset password to add password",
      } as any);
    }

    const validPassword = await bcrypt.compare(password, existingUser.password);
    if (!validPassword) {
      return res
        .status(401)
        .json({ message: "username or password is invalid" } as any);
    }

    const jti = cuid();
    const { accessToken, refreshToken } = generateTokens(existingUser, jti);

    await addRefreshTokenToWhitelist({
      jti,
      refreshToken,
      userId: existingUser.id,
    });

    sendRefreshToken(res, refreshToken);
    res.json({
      access_token: accessToken,
    });
  } catch (error) {
    next(error);
  }
}

export async function refreshTokens(
  req: Request<{}, TokensResponseInterface, RefreshInput>,
  res: Response<TokensResponseInterface | MessageResponse>,
  next: NextFunction
) {
  try {
    const refreshToken = req.body.refresh_token || req.cookies?.refresh_token;
    if (!refreshToken) {
      res.status(400);
      throw new Error("Missing refresh token.");
    }
    const payload = verifyRefreshToken(refreshToken) as {
      userId: string;
      jti: string;
    };

    const savedRefreshToken = await findRefreshTokenById(payload.jti);
    if (!savedRefreshToken || savedRefreshToken.revoked === true) {
      res.status(401);
      throw new Error("unauthorized");
    }

    const hashedToken = hashToken(refreshToken);
    if (hashedToken !== savedRefreshToken.hashedToken) {
      res.status(401);
      throw new Error("unauthorized");
    }
    const user = await prisma.user.findUnique({
      where: {
        id: payload.userId,
      },
    });

    if (!user) {
      res.status(401);
      throw new Error("unauthorized");
    }

    await deleteRefreshToken(savedRefreshToken.id);
    const jti = cuid();
    const { accessToken, refreshToken: newRefreshToken } = generateTokens(
      user,
      jti
    );
    await addRefreshTokenToWhitelist({
      jti,
      refreshToken: newRefreshToken,
      userId: user.id,
    });

    res.json({
      access_token: accessToken,
    });
  } catch (error) {
    if (
      error instanceof Error &&
      (error.name === "TokenExpiredError" || error.name === "JsonWebTokenError")
    ) {
      res.status(401);
    }
    next(error);
  }
}

export async function logout(
  req: Request,
  res: Response<MessageResponse>,
  next: NextFunction
) {
  try {
    const refreshToken = req.body.refresh_token || req.cookies?.refresh_token;

    if (!refreshToken) {
      res.status(400);
      throw new Error("missing refresh token.");
    }

    const payload = verifyRefreshToken(refreshToken) as {
      userId: string;
      jti: string;
    };

    const savedRefreshToken = await findRefreshTokenById(payload.jti);

    if (!savedRefreshToken || savedRefreshToken.revoked === true) {
      res.status(401);
      throw new Error("unauthorized access");
    }

    await deleteRefreshToken(savedRefreshToken.id);

    res.json({
      message: "user has signed out",
    });
  } catch (error) {
    next(error);
  }
}

export async function googleLogin(
  _req: Request,
  res: Response<MessageResponse>,
  _next: NextFunction
) {
  const redirectUrl = config.api_base_url + "auth/google/callback";
  const googleAuthURL = `https://accounts.google.com/o/oauth2/auth?response_type=code&client_id=${config.google_client_id}&redirect_uri=${redirectUrl}&scope=profile+email`;
  console.log(googleAuthURL);
  res.redirect(googleAuthURL);
}

export async function googleCallback(
  req: Request<{}, TokensResponseInterface, RefreshInput>,
  res: Response<MessageResponse | TokensResponseInterface | string>,
  next: NextFunction
) {
  try {
    let user;
    const { refreshTokenInCookie } = req.query;
    const { code } = req.query;
    console.log(code);

    if (!code) {
      return res.status(400).json({ message: "missing authorization code." });
    }

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

    const googletoken = tokenResponse.data.access_token;

    const userResponse = await axios.get(
      "https://www.googleapis.com/oauth2/v2/userinfo",
      {
        headers: {
          Authorization: `Bearer ${googletoken}`,
        },
      }
    );

    const { id, name, email } = userResponse.data;

    user = await prisma.user.findUnique({
      where: { email: email as string },
    });

    // want to implement: when user continue with google and never had a googleId, but an acc
    // send an email if they want to with otp

    // for now user cant connect via google, there are two sign in options

    // if (existingUser && !existingUser?.googleId) {
    //   return res.status(401).json({
    //     message:
    //       "email already associated with an account. please log in if you want to connect via google.",
    //   } as any);
    // }

    // if there is an existing user with same email but no googleId
    if (user && !user.googleId) {
      return res.status(401).json({
        message: "email already associated with an account",
      } as any);
    }

    // if (user?.googleId == id) {
    //   console.log("signed in via google");
    //   return res.status(200).json(user as any);
    // }

    if (!user) {
      user = await prisma.user.create({
        data: {
          username: name.trim().replace(/\s/g, ""),
          email: email as string,
          googleId: id,
        },
      });
    }

    const jti = cuid();
    const { accessToken, refreshToken: newRefreshToken } = generateTokens(
      user,
      jti
    );

    await addRefreshTokenToWhitelist({
      jti,
      refreshToken: newRefreshToken,
      userId: user.id,
    });

    sendRefreshToken(res, newRefreshToken);
    res.json({
      access_token: accessToken,
    });
  } catch (error) {
    console.error("there was google oauth callback error:", error);

    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError;
      console.log(axiosError);
      return res.status(400).json({ message: "invalid code query" });
    }

    return res.status(500).json({ message: "internal server error" });
  }
}
