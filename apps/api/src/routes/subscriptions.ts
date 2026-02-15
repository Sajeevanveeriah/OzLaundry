import { Router } from "express";
import Stripe from "stripe";
import { env } from "../lib/env.js";
import { prisma } from "../lib/prisma.js";
import { authenticateJWT } from "../middleware/auth.js";

export const subscriptionsRouter = Router();

// Subscription plan configurations
const SUBSCRIPTION_PLANS = {
  STARTER: {
    name: "Starter Plan",
    price: 19.99,
    weightLimitLbs: 15,
    pickupsPerMonth: 2,
    stripePriceId: env.stripeStarterPriceId || "",
    features: [
      "Up to 15 lbs per pickup",
      "2 pickups per month",
      "Standard washing & drying",
      "Folding service included",
      "Real-time tracking",
      "Unique QR code access"
    ]
  },
  FAMILY: {
    name: "Family Plan",
    price: 49.99,
    weightLimitLbs: 40,
    pickupsPerMonth: 4,
    stripePriceId: env.stripeFamilyPriceId || "",
    features: [
      "Up to 40 lbs per pickup",
      "Weekly pickups (4 per month)",
      "Premium detergents",
      "Ironing & folding included",
      "Real-time tracking",
      "QR code access",
      "Priority support",
      "Custom washing preferences"
    ]
  },
  PREMIUM: {
    name: "Premium Plan",
    price: 89.99,
    weightLimitLbs: 999999, // Unlimited
    pickupsPerMonth: 8,
    stripePriceId: env.stripePremiumPriceId || "",
    features: [
      "Unlimited weight per pickup",
      "Twice weekly pickups (8 per month)",
      "Luxury detergents",
      "Full ironing service",
      "Delicate item care",
      "Real-time tracking",
      "QR code access",
      "24/7 priority support",
      "Custom preferences",
      "Same-day service availability"
    ]
  }
} as const;

// Get current user's subscription
subscriptionsRouter.get("/me", authenticateJWT, async (req, res) => {
  try {
    const subscription = await prisma.subscription.findUnique({
      where: { userId: req.user!.id }
    });

    if (!subscription) {
      return res.json({ subscription: null });
    }

    const planConfig = SUBSCRIPTION_PLANS[subscription.plan];

    res.json({
      subscription: {
        ...subscription,
        planDetails: planConfig
      }
    });
  } catch (error) {
    console.error("Error fetching subscription:", error);
    res.status(500).json({ message: "Failed to fetch subscription" });
  }
});

// Create new subscription
subscriptionsRouter.post("/create", authenticateJWT, async (req, res) => {
  try {
    const { plan } = req.body;

    if (!["STARTER", "FAMILY", "PREMIUM"].includes(plan)) {
      return res.status(400).json({ message: "Invalid plan" });
    }

    // Check if user already has subscription
    const existing = await prisma.subscription.findUnique({
      where: { userId: req.user!.id }
    });

    if (existing) {
      return res.status(400).json({ message: "User already has a subscription" });
    }

    if (!env.stripeSecret) {
      return res.status(503).json({ message: "Stripe not configured" });
    }

    const stripe = new Stripe(env.stripeSecret);
    const planConfig = SUBSCRIPTION_PLANS[plan as keyof typeof SUBSCRIPTION_PLANS];

    // Get or create Stripe customer
    const user = await prisma.user.findUnique({
      where: { id: req.user!.id }
    });

    let customerId: string;

    const existingCustomers = await stripe.customers.list({
      email: user!.email,
      limit: 1
    });

    if (existingCustomers.data.length > 0) {
      customerId = existingCustomers.data[0].id;
    } else {
      const customer = await stripe.customers.create({
        email: user!.email,
        name: user!.name,
        metadata: {
          userId: req.user!.id
        }
      });
      customerId = customer.id;
    }

    // Create checkout session for subscription
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: "subscription",
      line_items: [
        {
          price: planConfig.stripePriceId,
          quantity: 1
        }
      ],
      success_url: `${req.body.successUrl}?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: req.body.cancelUrl,
      metadata: {
        userId: req.user!.id,
        plan: plan
      }
    });

    res.json({ url: session.url, sessionId: session.id });
  } catch (error) {
    console.error("Error creating subscription:", error);
    res.status(500).json({ message: "Failed to create subscription" });
  }
});

// Upgrade/Downgrade subscription
subscriptionsRouter.post("/change-plan", authenticateJWT, async (req, res) => {
  try {
    const { newPlan } = req.body;

    if (!["STARTER", "FAMILY", "PREMIUM"].includes(newPlan)) {
      return res.status(400).json({ message: "Invalid plan" });
    }

    const subscription = await prisma.subscription.findUnique({
      where: { userId: req.user!.id }
    });

    if (!subscription) {
      return res.status(404).json({ message: "No subscription found" });
    }

    if (!subscription.stripeSubscriptionId) {
      return res.status(400).json({ message: "No Stripe subscription found" });
    }

    if (!env.stripeSecret) {
      return res.status(503).json({ message: "Stripe not configured" });
    }

    const stripe = new Stripe(env.stripeSecret);
    const newPlanConfig = SUBSCRIPTION_PLANS[newPlan as keyof typeof SUBSCRIPTION_PLANS];

    // Update Stripe subscription
    const stripeSubscription = await stripe.subscriptions.retrieve(subscription.stripeSubscriptionId);

    await stripe.subscriptions.update(subscription.stripeSubscriptionId, {
      items: [
        {
          id: stripeSubscription.items.data[0].id,
          price: newPlanConfig.stripePriceId
        }
      ],
      proration_behavior: 'create_prorations'
    });

    // Update local database
    const updated = await prisma.subscription.update({
      where: { id: subscription.id },
      data: {
        plan: newPlan as any,
        weightLimitLbs: newPlanConfig.weightLimitLbs,
        pickupsPerMonth: newPlanConfig.pickupsPerMonth,
        stripePriceId: newPlanConfig.stripePriceId
      }
    });

    res.json({ subscription: updated });
  } catch (error) {
    console.error("Error changing plan:", error);
    res.status(500).json({ message: "Failed to change plan" });
  }
});

// Pause subscription
subscriptionsRouter.post("/pause", authenticateJWT, async (req, res) => {
  try {
    const subscription = await prisma.subscription.findUnique({
      where: { userId: req.user!.id }
    });

    if (!subscription) {
      return res.status(404).json({ message: "No subscription found" });
    }

    if (subscription.status === "PAUSED") {
      return res.status(400).json({ message: "Subscription already paused" });
    }

    if (!subscription.stripeSubscriptionId || !env.stripeSecret) {
      return res.status(400).json({ message: "Cannot pause subscription" });
    }

    const stripe = new Stripe(env.stripeSecret);

    // Pause Stripe subscription
    await stripe.subscriptions.update(subscription.stripeSubscriptionId, {
      pause_collection: {
        behavior: 'mark_uncollectible'
      }
    });

    // Update local database
    const updated = await prisma.subscription.update({
      where: { id: subscription.id },
      data: {
        status: "PAUSED",
        pausedAt: new Date()
      }
    });

    res.json({ subscription: updated });
  } catch (error) {
    console.error("Error pausing subscription:", error);
    res.status(500).json({ message: "Failed to pause subscription" });
  }
});

// Resume subscription
subscriptionsRouter.post("/resume", authenticateJWT, async (req, res) => {
  try {
    const subscription = await prisma.subscription.findUnique({
      where: { userId: req.user!.id }
    });

    if (!subscription) {
      return res.status(404).json({ message: "No subscription found" });
    }

    if (subscription.status !== "PAUSED") {
      return res.status(400).json({ message: "Subscription is not paused" });
    }

    if (!subscription.stripeSubscriptionId || !env.stripeSecret) {
      return res.status(400).json({ message: "Cannot resume subscription" });
    }

    const stripe = new Stripe(env.stripeSecret);

    // Resume Stripe subscription
    await stripe.subscriptions.update(subscription.stripeSubscriptionId, {
      pause_collection: null as any
    });

    // Update local database
    const updated = await prisma.subscription.update({
      where: { id: subscription.id },
      data: {
        status: "ACTIVE",
        pausedAt: null
      }
    });

    res.json({ subscription: updated });
  } catch (error) {
    console.error("Error resuming subscription:", error);
    res.status(500).json({ message: "Failed to resume subscription" });
  }
});

// Cancel subscription
subscriptionsRouter.post("/cancel", authenticateJWT, async (req, res) => {
  try {
    const { immediately } = req.body;

    const subscription = await prisma.subscription.findUnique({
      where: { userId: req.user!.id }
    });

    if (!subscription) {
      return res.status(404).json({ message: "No subscription found" });
    }

    if (!subscription.stripeSubscriptionId || !env.stripeSecret) {
      // If no Stripe subscription, just cancel locally
      await prisma.subscription.update({
        where: { id: subscription.id },
        data: {
          status: "CANCELLED",
          cancelAtPeriodEnd: true
        }
      });

      return res.json({ message: "Subscription cancelled" });
    }

    const stripe = new Stripe(env.stripeSecret);

    if (immediately) {
      // Cancel immediately
      await stripe.subscriptions.cancel(subscription.stripeSubscriptionId);

      await prisma.subscription.update({
        where: { id: subscription.id },
        data: {
          status: "CANCELLED"
        }
      });
    } else {
      // Cancel at period end
      await stripe.subscriptions.update(subscription.stripeSubscriptionId, {
        cancel_at_period_end: true
      });

      await prisma.subscription.update({
        where: { id: subscription.id },
        data: {
          cancelAtPeriodEnd: true
        }
      });
    }

    res.json({ message: "Subscription will be cancelled" });
  } catch (error) {
    console.error("Error cancelling subscription:", error);
    res.status(500).json({ message: "Failed to cancel subscription" });
  }
});

// Get available plans
subscriptionsRouter.get("/plans", async (req, res) => {
  res.json({
    plans: Object.entries(SUBSCRIPTION_PLANS).map(([key, config]) => ({
      id: key,
      ...config
    }))
  });
});

// Admin: Get all subscriptions
subscriptionsRouter.get("/admin/all", authenticateJWT, async (req, res) => {
  try {
    if (req.user!.role !== "ADMIN") {
      return res.status(403).json({ message: "Forbidden" });
    }

    const subscriptions = await prisma.subscription.findMany({
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true
          }
        }
      },
      orderBy: {
        createdAt: "desc"
      }
    });

    res.json({ subscriptions });
  } catch (error) {
    console.error("Error fetching subscriptions:", error);
    res.status(500).json({ message: "Failed to fetch subscriptions" });
  }
});

// Admin: Get subscription analytics
subscriptionsRouter.get("/admin/analytics", authenticateJWT, async (req, res) => {
  try {
    if (req.user!.role !== "ADMIN") {
      return res.status(403).json({ message: "Forbidden" });
    }

    const now = new Date();
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());

    const [
      totalActive,
      totalPaused,
      totalCancelled,
      newThisMonth,
      churnedThisMonth
    ] = await Promise.all([
      prisma.subscription.count({ where: { status: "ACTIVE" } }),
      prisma.subscription.count({ where: { status: "PAUSED" } }),
      prisma.subscription.count({ where: { status: "CANCELLED" } }),
      prisma.subscription.count({
        where: {
          createdAt: { gte: new Date(now.getFullYear(), now.getMonth(), 1) }
        }
      }),
      prisma.subscription.count({
        where: {
          status: "CANCELLED",
          updatedAt: { gte: new Date(now.getFullYear(), now.getMonth(), 1) }
        }
      })
    ]);

    // Calculate MRR
    const activeSubscriptions = await prisma.subscription.findMany({
      where: { status: "ACTIVE" }
    });

    const mrr = activeSubscriptions.reduce((sum, sub) => {
      const planConfig = SUBSCRIPTION_PLANS[sub.plan];
      return sum + planConfig.price;
    }, 0);

    // Churn rate
    const totalAtStartOfMonth = totalActive + totalPaused + churnedThisMonth;
    const churnRate = totalAtStartOfMonth > 0
      ? ((churnedThisMonth / totalAtStartOfMonth) * 100).toFixed(2)
      : "0.00";

    // Breakdown by plan
    const planBreakdown = {
      STARTER: 0,
      FAMILY: 0,
      PREMIUM: 0
    };

    activeSubscriptions.forEach(sub => {
      planBreakdown[sub.plan]++;
    });

    res.json({
      analytics: {
        totalActive,
        totalPaused,
        totalCancelled,
        newThisMonth,
        churnedThisMonth,
        mrr: mrr.toFixed(2),
        churnRate,
        planBreakdown
      }
    });
  } catch (error) {
    console.error("Error fetching analytics:", error);
    res.status(500).json({ message: "Failed to fetch analytics" });
  }
});

export { SUBSCRIPTION_PLANS };
