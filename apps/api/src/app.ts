import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { env } from "./lib/env.js";
import { authRouter } from "./routes/auth.js";
import { healthRouter } from "./routes/health.js";
import { ordersRouter } from "./routes/orders.js";
import { flagsRouter } from "./routes/flags.js";
import { paymentsRouter } from "./routes/payments.js";

export const app = express();

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
