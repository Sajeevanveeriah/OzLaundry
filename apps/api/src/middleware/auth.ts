import type { NextFunction, Request, Response } from "express";
import { verifyToken } from "../lib/auth.js";

declare global {
  namespace Express {
    interface Request {
      user?: { userId: string; role: "ADMIN" | "CUSTOMER"; email: string };
    }
  }
}

export function authRequired(req: Request, res: Response, next: NextFunction) {
  const cookieToken = req.cookies?.auth_token;
  const authHeader = req.headers.authorization?.startsWith("Bearer ")
    ? req.headers.authorization.slice(7)
    : undefined;
  const token = cookieToken || authHeader;
  if (!token) return res.status(401).json({ message: "Unauthorized" });
  try {
    req.user = verifyToken(token);
    next();
  } catch {
    res.status(401).json({ message: "Invalid token" });
  }
}

export function adminRequired(req: Request, res: Response, next: NextFunction) {
  if (req.user?.role !== "ADMIN") {
    return res.status(403).json({ message: "Admin only" });
  }
  next();
}
