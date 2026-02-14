import { z } from "zod";

export const orderStages = [
  "Scheduled",
  "PickedUp",
  "Received",
  "Washing",
  "Drying",
  "Ironing",
  "Folding",
  "QualityCheck",
  "OutForDelivery",
  "Delivered"
] as const;

export type OrderStage = (typeof orderStages)[number];

export const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().min(2)
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6)
});

export const createOrderSchema = z.object({
  pickupAt: z.string(),
  notes: z.string().optional()
});

export const updateOrderStageSchema = z.object({
  stage: z.enum(orderStages),
  actor: z.string().default("admin")
});

export const featureFlagSchema = z.object({
  key: z.string(),
  enabled: z.boolean(),
  description: z.string().optional()
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type CreateOrderInput = z.infer<typeof createOrderSchema>;
export type UpdateOrderStageInput = z.infer<typeof updateOrderStageSchema>;
export type FeatureFlagInput = z.infer<typeof featureFlagSchema>;
