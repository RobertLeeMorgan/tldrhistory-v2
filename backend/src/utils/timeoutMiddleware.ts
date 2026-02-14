import { Request, Response, NextFunction } from "express";

export function timeoutMiddleware(ms: number) {
  return (req: Request, res: Response, next: NextFunction) => {
    const timer = setTimeout(() => {
      if (!res.writableEnded) {
        res.status(504).json({ message: "Request timed out" });
      }
    }, ms);

    res.on("finish", () => clearTimeout(timer));
    res.on("close", () => clearTimeout(timer));

    next();
  };
}