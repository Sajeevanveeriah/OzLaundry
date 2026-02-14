import jwt from "jsonwebtoken";
import type { Response } from "express";
import { env } from "./env.js";

export type AuthPayload = { userId: string; role: "ADMIN" | "CUSTOMER"; email: string };

export function signToken(payload: AuthPayload): string {
  return jwt.sign(payload, env.jwtSecret, { expiresIn: "7d" });
}

export function verifyToken(token: string): AuthPayload {
  return jwt.verify(token, env.jwtSecret) as AuthPayload;
}

export function setAuthCookie(res: Response, token: string) {
  res.cookie("auth_token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    domain: env.cookieDomain || undefined,
    maxAge: 1000 * 60 * 60 * 24 * 7
  });
}
