import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { env } from "./lib/env.js";
import { authRouter } from "./routes/auth.js";
import { healthRouter } from "./routes/health.js";
import { ordersRouter } from "./routes/orders.js";
import { flagsRouter } from "./routes/flags.js";
import { paymentsRouter } from "./routes/payments.js";
import { subscriptionsRouter } from "./routes/subscriptions.js";
import { complaintsRouter } from "./routes/complaints.js";
import { addOnsRouter } from "./routes/addons.js";
import { webhooksRouter } from "./routes/webhooks.js";

export const app = express();

// Stripe webhook needs raw body - must be before express.json()
app.use("/api/webhooks", express.raw({ type: "application/json" }), webhooksRouter);

app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin(origin, cb) {
    if (!origin || env.corsOrigins.includes(origin)) return cb(null, true);
    cb(new Error("CORS blocked"));
  },
  credentials: true
}));

app.use(healthRouter);
app.use("/api/auth", authRouter);
app.use("/api/orders", ordersRouter);
app.use("/api/flags", flagsRouter);
app.use("/api/payments", paymentsRouter);
app.use("/api/subscriptions", subscriptionsRouter);
app.use("/api/complaints", complaintsRouter);
app.use("/api/addons", addOnsRouter);
