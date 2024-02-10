import express from "express";
import morgan from "morgan";
import helmet from "helmet";
import cors from "cors";
import session from "express-session";
import passport from "passport";
import bodyparser from "body-parser";
import * as middlewares from "./middlewares";
import api from "./api";
import MessageResponse from "./interfaces/MessageResponse";
import { configure as passportConfigure } from "./config/passport";

require("dotenv").config();

const app = express();

app.use(bodyparser.urlencoded({ extended: false }));
app.use(bodyparser.json());

app.use(morgan("dev"));
app.use(helmet());
app.use(cors());
app.use(express.json());

app.use(
  session({
    secret: process.env.SESSION_SECRET as string,
    resave: false,
    saveUninitialized: false,
  })
);

passportConfigure(app);

app.get<{}, MessageResponse>("/", (req, res) => {
  res.json({
    message: "welcome to the qatarstudents.com site!",
  });
});

app.get("/google", passport.authenticate("google", { session: false }));

app.use("/api/v1", api);

app.use(middlewares.notFound);
app.use(middlewares.errorHandler);

export default app;
