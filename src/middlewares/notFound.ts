import { Request, Response } from "express";
import { success } from "zod";

export function notFound(req: Request, res: Response) {
  res.status(404).json({
    message: "This route is not available!!",
    path: req.originalUrl,
    success: false,
    date: Date(),
  });
}
