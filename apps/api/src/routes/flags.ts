import { Router } from "express";
import { prisma } from "../lib/prisma.js";
import { adminRequired, authRequired } from "../middleware/auth.js";

export const flagsRouter = Router();

flagsRouter.get("/", async (_req, res) => {
  const flags = await prisma.featureFlag.findMany({ orderBy: { key: "asc" } });
  res.json(flags);
});

flagsRouter.patch("/:key", authRequired, adminRequired, async (req, res) => {
  const flag = await prisma.featureFlag.update({
    where: { key: req.params.key },
    data: { enabled: Boolean(req.body.enabled), description: req.body.description }
  });
  res.json(flag);
});
