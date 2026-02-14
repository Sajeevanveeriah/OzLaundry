import crypto from "crypto";
import { env } from "./env.js";

export function signQrPayload(orderId: string): string {
  const sig = crypto.createHmac("sha256", env.qrSecret).update(orderId).digest("hex");
  return `${orderId}.${sig}`;
}

export function verifyQrPayload(payload: string): { valid: boolean; orderId?: string } {
  const [orderId, sig] = payload.split(".");
  if (!orderId || !sig) return { valid: false };
  const expected = crypto.createHmac("sha256", env.qrSecret).update(orderId).digest("hex");
  return { valid: sig === expected, orderId };
}
