import { NextFunction, Request, Response } from "express";

import ErrorResponse from "./interfaces/ErrorResponse";

export function notFound(req: Request, res: Response, next: NextFunction) {
  res.status(404);
  const error = new Error(`You have reached an invalid route.`);
  next(error);
}

export function errorHandler(
  err: Error,
  req: Request,
  res: Response<ErrorResponse>,
  next: NextFunction
) {
  const statusCode = res.statusCode !== 200 ? res.statusCode : 500;
  res.status(statusCode);
  res.json({
    message: err.message,
    stack: process.env.NODE_ENV === "production" ? "🥞" : err.stack,
  });
}

export function isAuthenticated(
  req: Request,
  res: Response<ErrorResponse>,
  next: NextFunction
) {
  if (req.session.user) {
    next();
  } else {
    res.status(401).json({ error: "unauthorized to enter" } as any);
  }
}
