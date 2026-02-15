import { Router } from "express";
import { prisma } from "../lib/prisma.js";
import { authenticateJWT } from "../middleware/auth.js";

export const complaintsRouter = Router();

// Generate unique ticket number
function generateTicketNumber(): string {
  const prefix = "TKT";
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `${prefix}-${timestamp}-${random}`;
}

// Create new complaint
complaintsRouter.post("/create", authenticateJWT, async (req, res) => {
  try {
    const { orderId, category, subject, description, photoUrls } = req.body;

    if (!category || !subject || !description) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const validCategories = ["MISSING_ITEM", "DAMAGED_GARMENT", "QUALITY_CONCERN", "LATE_DELIVERY", "BILLING_ISSUE", "OTHER"];
    if (!validCategories.includes(category)) {
      return res.status(400).json({ message: "Invalid category" });
    }

    // Verify order belongs to user if orderId provided
    if (orderId) {
      const order = await prisma.order.findFirst({
        where: {
          id: orderId,
          userId: req.user!.id
        }
      });

      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }
    }

    const ticketNumber = generateTicketNumber();

    const complaint = await prisma.complaint.create({
      data: {
        ticketNumber,
        userId: req.user!.id,
        orderId: orderId || null,
        category,
        subject,
        description,
        photoUrls: photoUrls || [],
        status: "OPEN"
      },
      include: {
        order: {
          select: {
            orderNumber: true,
            stage: true
          }
        }
      }
    });

    res.status(201).json({ complaint });
  } catch (error) {
    console.error("Error creating complaint:", error);
    res.status(500).json({ message: "Failed to create complaint" });
  }
});

// Get user's complaints
complaintsRouter.get("/my-complaints", authenticateJWT, async (req, res) => {
  try {
    const complaints = await prisma.complaint.findMany({
      where: {
        userId: req.user!.id
      },
      include: {
        order: {
          select: {
            orderNumber: true,
            stage: true
          }
        }
      },
      orderBy: {
        createdAt: "desc"
      }
    });

    res.json({ complaints });
  } catch (error) {
    console.error("Error fetching complaints:", error);
    res.status(500).json({ message: "Failed to fetch complaints" });
  }
});

// Get single complaint
complaintsRouter.get("/:id", authenticateJWT, async (req, res) => {
  try {
    const complaint = await prisma.complaint.findFirst({
      where: {
        id: req.params.id,
        userId: req.user!.id
      },
      include: {
        order: {
          select: {
            orderNumber: true,
            stage: true,
            pickupAt: true
          }
        }
      }
    });

    if (!complaint) {
      return res.status(404).json({ message: "Complaint not found" });
    }

    res.json({ complaint });
  } catch (error) {
    console.error("Error fetching complaint:", error);
    res.status(500).json({ message: "Failed to fetch complaint" });
  }
});

// Admin: Get all complaints
complaintsRouter.get("/admin/all", authenticateJWT, async (req, res) => {
  try {
    if (req.user!.role !== "ADMIN") {
      return res.status(403).json({ message: "Forbidden" });
    }

    const { status } = req.query;

    const where: any = {};
    if (status && status !== "ALL") {
      where.status = status;
    }

    const complaints = await prisma.complaint.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true
          }
        },
        order: {
          select: {
            orderNumber: true,
            stage: true
          }
        }
      },
      orderBy: {
        createdAt: "desc"
      }
    });

    res.json({ complaints });
  } catch (error) {
    console.error("Error fetching complaints:", error);
    res.status(500).json({ message: "Failed to fetch complaints" });
  }
});

// Admin: Update complaint status
complaintsRouter.patch("/admin/:id/status", authenticateJWT, async (req, res) => {
  try {
    if (req.user!.role !== "ADMIN") {
      return res.status(403).json({ message: "Forbidden" });
    }

    const { status, assignedTo } = req.body;

    const validStatuses = ["OPEN", "IN_PROGRESS", "RESOLVED", "CLOSED"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const updateData: any = { status };
    if (assignedTo !== undefined) {
      updateData.assignedTo = assignedTo;
    }

    if (status === "RESOLVED" || status === "CLOSED") {
      updateData.resolvedAt = new Date();
    }

    const complaint = await prisma.complaint.update({
      where: { id: req.params.id },
      data: updateData,
      include: {
        user: {
          select: {
            email: true,
            name: true
          }
        }
      }
    });

    res.json({ complaint });
  } catch (error) {
    console.error("Error updating complaint:", error);
    res.status(500).json({ message: "Failed to update complaint" });
  }
});

// Admin: Add resolution
complaintsRouter.patch("/admin/:id/resolve", authenticateJWT, async (req, res) => {
  try {
    if (req.user!.role !== "ADMIN") {
      return res.status(403).json({ message: "Forbidden" });
    }

    const { resolution, refundAmount } = req.body;

    if (!resolution) {
      return res.status(400).json({ message: "Resolution is required" });
    }

    const updateData: any = {
      resolution,
      status: "RESOLVED",
      resolvedAt: new Date()
    };

    if (refundAmount && refundAmount > 0) {
      updateData.refundAmount = refundAmount;
    }

    const complaint = await prisma.complaint.update({
      where: { id: req.params.id },
      data: updateData
    });

    res.json({ complaint });
  } catch (error) {
    console.error("Error resolving complaint:", error);
    res.status(500).json({ message: "Failed to resolve complaint" });
  }
});

// Admin: Issue refund
complaintsRouter.post("/admin/:id/refund", authenticateJWT, async (req, res) => {
  try {
    if (req.user!.role !== "ADMIN") {
      return res.status(403).json({ message: "Forbidden" });
    }

    const { amount } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ message: "Valid refund amount is required" });
    }

    const complaint = await prisma.complaint.findUnique({
      where: { id: req.params.id }
    });

    if (!complaint) {
      return res.status(404).json({ message: "Complaint not found" });
    }

    if (complaint.refundIssued) {
      return res.status(400).json({ message: "Refund already issued" });
    }

    // TODO: Integrate with Stripe to actually issue refund
    // For now, just mark as refunded in database

    const updated = await prisma.complaint.update({
      where: { id: req.params.id },
      data: {
        refundAmount: amount,
        refundIssued: true,
        refundIssuedAt: new Date()
      }
    });

    res.json({ complaint: updated, message: "Refund issued successfully" });
  } catch (error) {
    console.error("Error issuing refund:", error);
    res.status(500).json({ message: "Failed to issue refund" });
  }
});

// Admin: Get complaint statistics
complaintsRouter.get("/admin/stats", authenticateJWT, async (req, res) => {
  try {
    if (req.user!.role !== "ADMIN") {
      return res.status(403).json({ message: "Forbidden" });
    }

    const [
      totalOpen,
      totalInProgress,
      totalResolved,
      totalClosed,
      byCategory,
      totalRefunds
    ] = await Promise.all([
      prisma.complaint.count({ where: { status: "OPEN" } }),
      prisma.complaint.count({ where: { status: "IN_PROGRESS" } }),
      prisma.complaint.count({ where: { status: "RESOLVED" } }),
      prisma.complaint.count({ where: { status: "CLOSED" } }),
      prisma.complaint.groupBy({
        by: ['category'],
        _count: true
      }),
      prisma.complaint.aggregate({
        _sum: {
          refundAmount: true
        },
        where: {
          refundIssued: true
        }
      })
    ]);

    const categoryBreakdown: any = {};
    byCategory.forEach((item: any) => {
      categoryBreakdown[item.category] = item._count;
    });

    res.json({
      stats: {
        totalOpen,
        totalInProgress,
        totalResolved,
        totalClosed,
        categoryBreakdown,
        totalRefunds: totalRefunds._sum.refundAmount || 0
      }
    });
  } catch (error) {
    console.error("Error fetching complaint stats:", error);
    res.status(500).json({ message: "Failed to fetch complaint stats" });
  }
});
