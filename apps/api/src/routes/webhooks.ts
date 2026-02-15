import { Router, Request, Response } from "express";
import Stripe from "stripe";
import { env } from "../lib/env.js";
import { prisma } from "../lib/prisma.js";
import { SUBSCRIPTION_PLANS } from "./subscriptions.js";

export const webhooksRouter = Router();

// Stripe webhook handler
webhooksRouter.post("/stripe", async (req: Request, res: Response) => {
  if (!env.stripeSecret || !env.stripeWebhookSecret) {
    return res.status(503).json({ message: "Stripe not configured" });
  }

  const stripe = new Stripe(env.stripeSecret);
  const sig = req.headers["stripe-signature"];

  if (!sig) {
    return res.status(400).json({ message: "No signature" });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      env.stripeWebhookSecret
    );
  } catch (err: any) {
    console.error("Webhook signature verification failed:", err.message);
    return res.status(400).json({ message: `Webhook Error: ${err.message}` });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed":
        await handleCheckoutCompleted(event.data.object as Stripe.Checkout.Session);
        break;

      case "customer.subscription.created":
        await handleSubscriptionCreated(event.data.object as Stripe.Subscription);
        break;

      case "customer.subscription.updated":
        await handleSubscriptionUpdated(event.data.object as Stripe.Subscription);
        break;

      case "customer.subscription.deleted":
        await handleSubscriptionDeleted(event.data.object as Stripe.Subscription);
        break;

      case "invoice.payment_succeeded":
        await handlePaymentSucceeded(event.data.object as Stripe.Invoice);
        break;

      case "invoice.payment_failed":
        await handlePaymentFailed(event.data.object as Stripe.Invoice);
        break;

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    res.json({ received: true });
  } catch (error) {
    console.error("Error processing webhook:", error);
    res.status(500).json({ message: "Webhook processing failed" });
  }
});

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  console.log("Checkout completed:", session.id);

  if (session.mode !== "subscription") {
    return;
  }

  const userId = session.metadata?.userId;
  const plan = session.metadata?.plan;

  if (!userId || !plan) {
    console.error("Missing userId or plan in session metadata");
    return;
  }

  // Check if subscription already exists
  const existing = await prisma.subscription.findUnique({
    where: { userId }
  });

  if (existing) {
    console.log("Subscription already exists for user:", userId);
    return;
  }

  const planConfig = SUBSCRIPTION_PLANS[plan as keyof typeof SUBSCRIPTION_PLANS];
  if (!planConfig) {
    console.error("Invalid plan:", plan);
    return;
  }

  // Create subscription in database
  await prisma.subscription.create({
    data: {
      userId,
      plan: plan as any,
      status: "ACTIVE",
      stripeCustomerId: session.customer as string,
      stripeSubscriptionId: session.subscription as string,
      stripePriceId: planConfig.stripePriceId,
      currentPeriodStart: new Date(),
      currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
      weightLimitLbs: planConfig.weightLimitLbs,
      pickupsPerMonth: planConfig.pickupsPerMonth,
      pickupsUsed: 0,
      lastResetAt: new Date()
    }
  });

  console.log("Subscription created for user:", userId);
}

async function handleSubscriptionCreated(subscription: Stripe.Subscription) {
  console.log("Subscription created:", subscription.id);

  // Usually handled by checkout.session.completed
  // But we can update if needed
  const existingSub = await prisma.subscription.findFirst({
    where: { stripeSubscriptionId: subscription.id }
  });

  if (existingSub) {
    await prisma.subscription.update({
      where: { id: existingSub.id },
      data: {
        currentPeriodStart: new Date(subscription.current_period_start * 1000),
        currentPeriodEnd: new Date(subscription.current_period_end * 1000),
        status: subscription.status === "active" ? "ACTIVE" : subscription.status === "paused" ? "PAUSED" : "CANCELLED"
      }
    });
  }
}

async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
  console.log("Subscription updated:", subscription.id);

  const existingSub = await prisma.subscription.findFirst({
    where: { stripeSubscriptionId: subscription.id }
  });

  if (!existingSub) {
    console.error("Subscription not found:", subscription.id);
    return;
  }

  const updateData: any = {
    currentPeriodStart: new Date(subscription.current_period_start * 1000),
    currentPeriodEnd: new Date(subscription.current_period_end * 1000)
  };

  if (subscription.status === "active") {
    updateData.status = "ACTIVE";
  } else if (subscription.status === "paused") {
    updateData.status = "PAUSED";
  } else if (subscription.status === "canceled") {
    updateData.status = "CANCELLED";
  } else if (subscription.status === "past_due") {
    updateData.status = "PAST_DUE";
  }

  if (subscription.cancel_at_period_end) {
    updateData.cancelAtPeriodEnd = true;
  }

  await prisma.subscription.update({
    where: { id: existingSub.id },
    data: updateData
  });
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  console.log("Subscription deleted:", subscription.id);

  const existingSub = await prisma.subscription.findFirst({
    where: { stripeSubscriptionId: subscription.id }
  });

  if (!existingSub) {
    console.error("Subscription not found:", subscription.id);
    return;
  }

  await prisma.subscription.update({
    where: { id: existingSub.id },
    data: {
      status: "CANCELLED"
    }
  });
}

async function handlePaymentSucceeded(invoice: Stripe.Invoice) {
  console.log("Payment succeeded:", invoice.id);

  if (!invoice.subscription) {
    return;
  }

  const existingSub = await prisma.subscription.findFirst({
    where: { stripeSubscriptionId: invoice.subscription as string }
  });

  if (!existingSub) {
    return;
  }

  // Update subscription status
  await prisma.subscription.update({
    where: { id: existingSub.id },
    data: {
      status: "ACTIVE"
    }
  });
}

async function handlePaymentFailed(invoice: Stripe.Invoice) {
  console.log("Payment failed:", invoice.id);

  if (!invoice.subscription) {
    return;
  }

  const existingSub = await prisma.subscription.findFirst({
    where: { stripeSubscriptionId: invoice.subscription as string }
  });

  if (!existingSub) {
    return;
  }

  // Update subscription status
  await prisma.subscription.update({
    where: { id: existingSub.id },
    data: {
      status: "PAST_DUE"
    }
  });
}
