import { Router } from "express";
import { createOrderSchema, updateOrderStageSchema } from "@ozlaundry/shared";
import QRCode from "qrcode";
import { authRequired, adminRequired } from "../middleware/auth.js";
import { prisma } from "../lib/prisma.js";
import { emitOrderUpdate } from "../socket/index.js";
import { signQrPayload, verifyQrPayload } from "../lib/qr.js";

export const ordersRouter = Router();

ordersRouter.post("/", authRequired, async (req, res) => {
  const parsed = createOrderSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json(parsed.error.flatten());
  const order = await prisma.order.create({
    data: {
      userId: req.user!.userId,
      stage: "Scheduled",
      notes: parsed.data.notes,
      pickupAt: new Date(parsed.data.pickupAt),
      statusLogs: { create: { stage: "Scheduled", actor: "customer" } }
    },
    include: { statusLogs: true }
  });
  res.status(201).json(order);
});

ordersRouter.get("/", authRequired, async (req, res) => {
  const where = req.user!.role === "ADMIN" ? {} : { userId: req.user!.userId };
  const orders = await prisma.order.findMany({ where, orderBy: { createdAt: "desc" } });
  res.json(orders);
});

ordersRouter.get("/:id", authRequired, async (req, res) => {
  const order = await prisma.order.findUnique({ where: { id: req.params.id }, include: { statusLogs: true } });
  if (!order) return res.status(404).json({ message: "Not found" });
  if (req.user!.role !== "ADMIN" && order.userId !== req.user!.userId) return res.status(403).json({ message: "Forbidden" });
  const qrPayload = signQrPayload(order.id);
  const qrDataUrl = await QRCode.toDataURL(qrPayload);
  res.json({ ...order, qrPayload, qrDataUrl });
});

ordersRouter.patch("/:id/stage", authRequired, adminRequired, async (req, res) => {
  const parsed = updateOrderStageSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json(parsed.error.flatten());
  const updated = await prisma.order.update({
    where: { id: req.params.id },
    data: {
      stage: parsed.data.stage,
      statusLogs: { create: { stage: parsed.data.stage, actor: parsed.data.actor } }
    },
    include: { statusLogs: true, user: true }
  });
  emitOrderUpdate(updated.userId, { orderId: updated.id, stage: updated.stage });
  res.json(updated);
});

ordersRouter.post("/admin/scan", authRequired, adminRequired, async (req, res) => {
  const valid = verifyQrPayload(req.body.payload ?? "");
  if (!valid.valid || !valid.orderId) return res.status(400).json({ message: "Invalid QR" });
  const updated = await prisma.order.update({
    where: { id: valid.orderId },
    data: { stage: req.body.stage ?? "Received", statusLogs: { create: { stage: req.body.stage ?? "Received", actor: "admin-scan" } } }
  });
  emitOrderUpdate(updated.userId, { orderId: updated.id, stage: updated.stage });
  res.json(updated);
});
