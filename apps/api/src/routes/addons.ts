import { Router } from "express";
import { prisma } from "../lib/prisma.js";
import { authenticateJWT } from "../middleware/auth.js";

export const addOnsRouter = Router();

// Get all available add-ons
addOnsRouter.get("/", async (req, res) => {
  try {
    const addOns = await prisma.addOn.findMany({
      where: { enabled: true },
      orderBy: { name: "asc" }
    });

    res.json({ addOns });
  } catch (error) {
    console.error("Error fetching add-ons:", error);
    res.status(500).json({ message: "Failed to fetch add-ons" });
  }
});

// Admin: Get all add-ons (including disabled)
addOnsRouter.get("/admin/all", authenticateJWT, async (req, res) => {
  try {
    if (req.user!.role !== "ADMIN") {
      return res.status(403).json({ message: "Forbidden" });
    }

    const addOns = await prisma.addOn.findMany({
      orderBy: { name: "asc" }
    });

    res.json({ addOns });
  } catch (error) {
    console.error("Error fetching add-ons:", error);
    res.status(500).json({ message: "Failed to fetch add-ons" });
  }
});

// Admin: Create add-on
addOnsRouter.post("/admin/create", authenticateJWT, async (req, res) => {
  try {
    if (req.user!.role !== "ADMIN") {
      return res.status(403).json({ message: "Forbidden" });
    }

    const { name, description, price, enabled } = req.body;

    if (!name || !description || price === undefined) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const addOn = await prisma.addOn.create({
      data: {
        name,
        description,
        price: parseFloat(price),
        enabled: enabled !== undefined ? enabled : true
      }
    });

    res.status(201).json({ addOn });
  } catch (error) {
    console.error("Error creating add-on:", error);
    res.status(500).json({ message: "Failed to create add-on" });
  }
});

// Admin: Update add-on
addOnsRouter.patch("/admin/:id", authenticateJWT, async (req, res) => {
  try {
    if (req.user!.role !== "ADMIN") {
      return res.status(403).json({ message: "Forbidden" });
    }

    const { name, description, price, enabled } = req.body;

    const updateData: any = {};
    if (name !== undefined) updateData.name = name;
    if (description !== undefined) updateData.description = description;
    if (price !== undefined) updateData.price = parseFloat(price);
    if (enabled !== undefined) updateData.enabled = enabled;

    const addOn = await prisma.addOn.update({
      where: { id: req.params.id },
      data: updateData
    });

    res.json({ addOn });
  } catch (error) {
    console.error("Error updating add-on:", error);
    res.status(500).json({ message: "Failed to update add-on" });
  }
});

// Admin: Delete add-on
addOnsRouter.delete("/admin/:id", authenticateJWT, async (req, res) => {
  try {
    if (req.user!.role !== "ADMIN") {
      return res.status(403).json({ message: "Forbidden" });
    }

    await prisma.addOn.delete({
      where: { id: req.params.id }
    });

    res.json({ message: "Add-on deleted successfully" });
  } catch (error) {
    console.error("Error deleting add-on:", error);
    res.status(500).json({ message: "Failed to delete add-on" });
  }
});

// Calculate total price for add-ons
addOnsRouter.post("/calculate-price", async (req, res) => {
  try {
    const { addOnIds } = req.body;

    if (!Array.isArray(addOnIds)) {
      return res.status(400).json({ message: "addOnIds must be an array" });
    }

    const addOns = await prisma.addOn.findMany({
      where: {
        id: { in: addOnIds },
        enabled: true
      }
    });

    const totalPrice = addOns.reduce((sum, addOn) => sum + addOn.price, 0);

    res.json({
      addOns,
      totalPrice: totalPrice.toFixed(2)
    });
  } catch (error) {
    console.error("Error calculating price:", error);
    res.status(500).json({ message: "Failed to calculate price" });
  }
});
