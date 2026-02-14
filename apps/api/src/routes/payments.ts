import { Router } from "express";
import Stripe from "stripe";
import { env } from "../lib/env.js";

export const paymentsRouter = Router();

paymentsRouter.post("/checkout", async (req, res) => {
  if (!env.featurePayments) return res.status(403).json({ message: "Payments disabled by feature flag" });
  if (!env.stripeSecret) return res.status(503).json({ message: "Stripe not configured" });

  const stripe = new Stripe(env.stripeSecret);
  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    line_items: [{ price_data: { currency: "usd", product_data: { name: "Laundry Plan" }, unit_amount: 1999 }, quantity: 1 }],
    success_url: req.body.successUrl,
    cancel_url: req.body.cancelUrl
  });

  res.json({ url: session.url });
});
