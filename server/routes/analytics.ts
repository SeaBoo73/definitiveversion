import type { Express } from "express";
import { storage } from "../storage";
import { insertAnalyticsSchema } from "@shared/schema";

export function registerAnalyticsRoutes(app: Express) {
  // Get analytics for owner
  app.get("/api/analytics/:ownerId", async (req, res) => {
    try {
      const ownerId = parseInt(req.params.ownerId);
      const period = req.query.period as string;
      
      const analytics = await storage.getAnalytics(ownerId);
      res.json(analytics);
    } catch (error) {
      console.error("Error fetching analytics:", error);
      res.status(500).json({ error: "Failed to fetch analytics" });
    }
  });

  // Create analytics entry
  app.post("/api/analytics", async (req, res) => {
    try {
      const validatedData = insertAnalyticsSchema.parse(req.body);
      const analytics = await storage.createAnalyticsEntry(validatedData);
      res.json(analytics);
    } catch (error) {
      console.error("Error creating analytics:", error);
      res.status(400).json({ error: "Invalid analytics data" });
    }
  });

  // Get boat-specific analytics
  app.get("/api/analytics/boat/:boatId", async (req, res) => {
    try {
      const boatId = parseInt(req.params.boatId);
      const startDate = req.query.startDate as string;
      const endDate = req.query.endDate as string;
      
      // This would be expanded to get detailed analytics for a specific boat
      res.json({ message: "Boat analytics endpoint - to be implemented" });
    } catch (error) {
      console.error("Error fetching boat analytics:", error);
      res.status(500).json({ error: "Failed to fetch boat analytics" });
    }
  });

  // Get revenue analytics
  app.get("/api/analytics/revenue/:ownerId", async (req, res) => {
    try {
      const ownerId = parseInt(req.params.ownerId);
      const period = req.query.period as string || 'monthly';
      
      const analytics = await storage.getAnalytics(ownerId);
      
      // Group and calculate revenue by period
      const revenueData = analytics.reduce((acc, entry) => {
        const key = entry.date;
        if (!acc[key]) {
          acc[key] = {
            period: key,
            revenue: 0,
            bookings: 0,
            conversionRate: 0
          };
        }
        acc[key].revenue += parseFloat(entry.revenue || "0");
        acc[key].bookings += entry.bookings || 0;
        acc[key].conversionRate = parseFloat(entry.conversionRate || "0");
        return acc;
      }, {} as Record<string, any>);

      res.json(Object.values(revenueData));
    } catch (error) {
      console.error("Error fetching revenue analytics:", error);
      res.status(500).json({ error: "Failed to fetch revenue analytics" });
    }
  });
}