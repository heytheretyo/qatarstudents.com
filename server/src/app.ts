import express from "express";
import morgan from "morgan";
import helmet from "helmet";
import cors from "cors";
import bodyparser from "body-parser";
import * as middlewares from "./middlewares";
import api from "./api";
import MessageResponse from "./interfaces/MessageResponse";
import cookieParser from "cookie-parser";

require("dotenv").config();

const app = express();

app.use(bodyparser.urlencoded({ extended: false }));
app.use(bodyparser.json());

app.use(morgan("dev"));
app.use(helmet());
app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
    methods: ["POST", "PUT", "GET", "OPTIONS", "HEAD"],
  })
);

app.get<{}, MessageResponse>("/", (req, res) => {
  res.json({
    message: "welcome to the qatarstudents.com site!",
  });
});

app.use("/api/v1", api);

app.use(middlewares.notFound);
app.use(middlewares.errorHandler);
app.use(middlewares.deserializeUser);

export default app;
