import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const defaultFlags = [
  ["ironing", true, "Enable ironing services"],
  ["folding", true, "Enable folding services"],
  ["detergentSelection", true, "Allow detergent selection"],
  ["realtimeTracking", true, "Realtime order updates"],
  ["qrScan", true, "Enable QR scan workflows"],
  ["subscriptions", true, "Enable subscription plans"],
  ["payments", false, "Enable Stripe checkout"],
] as const;

async function main() {
  const adminHash = await bcrypt.hash("Admin123!", 10);
  const userHash = await bcrypt.hash("Customer123!", 10);

  const admin = await prisma.user.upsert({
    where: { email: "admin@ozlaundry.local" },
    update: {},
    create: { email: "admin@ozlaundry.local", name: "Admin", passwordHash: adminHash, role: "ADMIN" }
  });

  const customer = await prisma.user.upsert({
    where: { email: "user@ozlaundry.local" },
    update: {},
    create: { email: "user@ozlaundry.local", name: "Sample Customer", passwordHash: userHash, role: "CUSTOMER" }
  });

  const order = await prisma.order.create({
    data: {
      userId: customer.id,
      stage: "Scheduled",
      pickupAt: new Date(Date.now() + 86400000),
      notes: "Sample seeded order",
      statusLogs: { create: { stage: "Scheduled", actor: "system" } }
    }
  });

  await Promise.all(defaultFlags.map(([key, enabled, description]) =>
    prisma.featureFlag.upsert({ where: { key }, update: { enabled, description }, create: { key, enabled, description } })
  ));

  console.log({ admin: admin.email, customer: customer.email, orderId: order.id });
}

main().finally(() => prisma.$disconnect());
