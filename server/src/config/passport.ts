import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import prisma from "../utils/db";
import type { Express } from "express";
import { User } from "@prisma/client";

export function configure(app: Express) {
  const serverUrl = process.env.SERVER_URL as string;
  app.use(passport.initialize());
  app.use(passport.session());

  passport.use(
    new GoogleStrategy(
      {
        // authorizationURL: serverUrl + "api/v1/auth/google",
        clientID: process.env.GOOGLE_CLIENT_ID as string,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
        callbackURL: process.env.GOOGLE_CLIENT_REDIRECT as string,
        passReqToCallback: true,
        scope: ["email", "profile"],
        state: true,
      },
      async (req, _accessToken, _refreshToken, profile, done) => {
        try {
          const { id, displayName, emails } = profile;
          const email = emails ? emails[0].value : null;

          console.log("adding user");

          if (req.isAuthenticated()) {
            const authenticatedUser = req.user as User;

            if (!authenticatedUser.googleId) {
              const updatedUser = await prisma.user.update({
                where: { id: authenticatedUser.id },
                data: { googleId: id },
              });

              return done(null, updatedUser);
            }

            return done(null, authenticatedUser);
          }

          const existingUser = await prisma.user.findUnique({
            where: { email: email as string },
          });

          if (existingUser) {
            return done(null, false, {
              message:
                "email already associated with an account, login please.",
            });
          }

          console.log("adding user");

          const user = await prisma.user.create({
            data: {
              username: displayName,
              email: email as string,
              googleId: id,
            },
          });

          return done(null, user);
        } catch (error: any) {
          console.log(error);
          return done(error, false, error.message);
        }
      }
    )
  );

  passport.serializeUser((user: any, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id: string, done) => {
    try {
      const user = await prisma.user.findFirst({ where: { id } });

      done(null, user);
    } catch (error) {
      done(error);
    }
  });
}

export default passport;
