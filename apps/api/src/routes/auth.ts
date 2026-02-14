import { Router } from "express";
import bcrypt from "bcryptjs";
import { loginSchema, registerSchema } from "@ozlaundry/shared";
import { prisma } from "../lib/prisma.js";
import { setAuthCookie, signToken } from "../lib/auth.js";
import { authRequired } from "../middleware/auth.js";

export const authRouter = Router();

authRouter.post("/register", async (req, res) => {
  const parsed = registerSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json(parsed.error.flatten());
  const exists = await prisma.user.findUnique({ where: { email: parsed.data.email } });
  if (exists) return res.status(409).json({ message: "Email already exists" });
  const passwordHash = await bcrypt.hash(parsed.data.password, 10);
  const user = await prisma.user.create({
    data: { email: parsed.data.email, name: parsed.data.name, passwordHash, role: "CUSTOMER" }
  });
  const token = signToken({ userId: user.id, role: user.role, email: user.email });
  setAuthCookie(res, token);
  res.json({ token, user: { id: user.id, email: user.email, role: user.role, name: user.name } });
});

authRouter.post("/login", async (req, res) => {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json(parsed.error.flatten());
  const user = await prisma.user.findUnique({ where: { email: parsed.data.email } });
  if (!user || !(await bcrypt.compare(parsed.data.password, user.passwordHash))) {
    return res.status(401).json({ message: "Invalid credentials" });
  }
  const token = signToken({ userId: user.id, role: user.role, email: user.email });
  setAuthCookie(res, token);
  res.json({ token, user: { id: user.id, email: user.email, role: user.role, name: user.name } });
});

authRouter.post("/logout", (_req, res) => {
  res.clearCookie("auth_token");
  res.json({ ok: true });
});

authRouter.get("/me", authRequired, async (req, res) => {
  const user = await prisma.user.findUnique({ where: { id: req.user!.userId } });
  if (!user) return res.status(404).json({ message: "User not found" });
  res.json({ id: user.id, email: user.email, role: user.role, name: user.name });
});
