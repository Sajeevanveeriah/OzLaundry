import dotenv from "dotenv";

dotenv.config();

export const env = {
  port: Number(process.env.PORT ?? 4000),
  databaseUrl: process.env.DATABASE_URL ?? "",
  jwtSecret: process.env.JWT_SECRET ?? "change-me",
  corsOrigins: (process.env.CORS_ORIGINS ?? "http://localhost:5173").split(",").map((s) => s.trim()),
  cookieDomain: process.env.COOKIE_DOMAIN,
  qrSecret: process.env.QR_HMAC_SECRET ?? "change-me-qr",
  stripeSecret: process.env.STRIPE_SECRET_KEY,
  stripeWebhookSecret: process.env.STRIPE_WEBHOOK_SECRET,
  stripeStarterPriceId: process.env.STRIPE_STARTER_PRICE_ID,
  stripeFamilyPriceId: process.env.STRIPE_FAMILY_PRICE_ID,
  stripePremiumPriceId: process.env.STRIPE_PREMIUM_PRICE_ID,
  featurePayments: (process.env.FEATURE_PAYMENTS ?? "false") === "true"
};
