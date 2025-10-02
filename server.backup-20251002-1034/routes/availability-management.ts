import type { Express } from "express";
import { storage } from "../storage";
import { 
  insertAvailabilitySchema, 
  insertBookingRuleSchema, 
  insertBookingLockSchema,
  insertPriceHistorySchema
} from "@shared/schema";
import { z } from "zod";

// Advanced availability management routes
export function registerAvailabilityRoutes(app: Express) {
  
  // Get boat availability calendar with dynamic pricing
  app.get("/api/boats/:id/availability", async (req, res) => {
    try {
      const boatId = parseInt(req.params.id);
      const { startDate, endDate } = req.query;
      
      if (!startDate || !endDate) {
        return res.status(400).json({ message: "Start and end dates required" });
      }

      const availability = await storage.getBoatAvailability(
        boatId,
        new Date(startDate as string),
        new Date(endDate as string)
      );

      res.json(availability);
    } catch (error) {
      console.error("Error fetching availability:", error);
      res.status(500).json({ message: "Error fetching availability" });
    }
  });

  // Update boat availability calendar (owner only)
  app.post("/api/boats/:id/availability", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.sendStatus(401);
    }

    try {
      const boatId = parseInt(req.params.id);
      const boat = await storage.getBoat(boatId);
      
      if (!boat || (boat.ownerId !== req.user.id && req.user.role !== "admin")) {
        return res.sendStatus(403);
      }

      const validation = insertAvailabilitySchema.safeParse(req.body);
      if (!validation.success) {
        return res.status(400).json({ message: "Invalid availability data" });
      }

      const availability = await storage.createAvailability({
        ...validation.data,
        boatId,
      });

      res.status(201).json(availability);
    } catch (error) {
      console.error("Error creating availability:", error);
      res.status(500).json({ message: "Error creating availability" });
    }
  });

  // Get dynamic pricing for a boat with seasonal adjustments
  app.get("/api/boats/:id/pricing", async (req, res) => {
    try {
      const boatId = parseInt(req.params.id);
      const { startDate, endDate, days } = req.query;
      
      if (!startDate || !endDate) {
        return res.status(400).json({ message: "Start and end dates required" });
      }

      const pricing = await storage.calculateDynamicPricing(
        boatId,
        new Date(startDate as string),
        new Date(endDate as string),
        parseInt(days as string) || 1
      );

      res.json(pricing);
    } catch (error) {
      console.error("Error calculating pricing:", error);
      res.status(500).json({ message: "Error calculating pricing" });
    }
  });

  // Create or update booking rules (owner only)
  app.post("/api/boats/:id/booking-rules", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.sendStatus(401);
    }

    try {
      const boatId = parseInt(req.params.id);
      const boat = await storage.getBoat(boatId);
      
      if (!boat || (boat.ownerId !== req.user.id && req.user.role !== "admin")) {
        return res.sendStatus(403);
      }

      const validation = insertBookingRuleSchema.safeParse(req.body);
      if (!validation.success) {
        return res.status(400).json({ message: "Invalid booking rule data" });
      }

      const rule = await storage.createBookingRule({
        ...validation.data,
        boatId,
      });

      res.status(201).json(rule);
    } catch (error) {
      console.error("Error creating booking rule:", error);
      res.status(500).json({ message: "Error creating booking rule" });
    }
  });

  // Get booking rules for a boat
  app.get("/api/boats/:id/booking-rules", async (req, res) => {
    try {
      const boatId = parseInt(req.params.id);
      const rules = await storage.getBookingRules(boatId);
      res.json(rules);
    } catch (error) {
      console.error("Error fetching booking rules:", error);
      res.status(500).json({ message: "Error fetching booking rules" });
    }
  });

  // Create booking lock for real-time availability (temporary hold during booking process)
  app.post("/api/boats/:id/booking-lock", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.sendStatus(401);
    }

    try {
      const boatId = parseInt(req.params.id);
      const { startDate, endDate } = req.body;
      
      if (!startDate || !endDate) {
        return res.status(400).json({ message: "Start and end dates required" });
      }

      // Check if dates are available
      const isAvailable = await storage.checkDateAvailability(
        boatId,
        new Date(startDate),
        new Date(endDate)
      );

      if (!isAvailable) {
        return res.status(409).json({ message: "Dates not available" });
      }

      // Create temporary lock (15 minutes)
      const expiresAt = new Date(Date.now() + 15 * 60 * 1000);
      const lock = await storage.createBookingLock({
        boatId,
        userId: req.user.id,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        sessionId: req.sessionID,
        locked: true,
        expiresAt,
      });

      res.status(201).json(lock);
    } catch (error) {
      console.error("Error creating booking lock:", error);
      res.status(500).json({ message: "Error creating booking lock" });
    }
  });

  // Release booking lock
  app.delete("/api/booking-locks/:id", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.sendStatus(401);
    }

    try {
      const lockId = parseInt(req.params.id);
      await storage.releaseBookingLock(lockId, req.user.id);
      res.sendStatus(204);
    } catch (error) {
      console.error("Error releasing booking lock:", error);
      res.status(500).json({ message: "Error releasing booking lock" });
    }
  });

  // Bulk update availability (owner dashboard feature)
  app.patch("/api/boats/:id/availability/bulk", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.sendStatus(401);
    }

    try {
      const boatId = parseInt(req.params.id);
      const boat = await storage.getBoat(boatId);
      
      if (!boat || (boat.ownerId !== req.user.id && req.user.role !== "admin")) {
        return res.sendStatus(403);
      }

      const { dateRanges, seasonType, priceMultiplier, blockReason } = req.body;
      
      const result = await storage.bulkUpdateAvailability(
        boatId,
        dateRanges,
        { seasonType, priceMultiplier, blockReason }
      );

      res.json(result);
    } catch (error) {
      console.error("Error bulk updating availability:", error);
      res.status(500).json({ message: "Error bulk updating availability" });
    }
  });

  // Get pricing history and analytics
  app.get("/api/boats/:id/pricing-history", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.sendStatus(401);
    }

    try {
      const boatId = parseInt(req.params.id);
      const boat = await storage.getBoat(boatId);
      
      if (!boat || (boat.ownerId !== req.user.id && req.user.role !== "admin")) {
        return res.sendStatus(403);
      }

      const { startDate, endDate } = req.query;
      const history = await storage.getPricingHistory(
        boatId,
        startDate ? new Date(startDate as string) : undefined,
        endDate ? new Date(endDate as string) : undefined
      );

      res.json(history);
    } catch (error) {
      console.error("Error fetching pricing history:", error);
      res.status(500).json({ message: "Error fetching pricing history" });
    }
  });

  // Get applicable discounts for a booking
  app.post("/api/boats/:id/calculate-discounts", async (req, res) => {
    try {
      const boatId = parseInt(req.params.id);
      const { startDate, endDate, userId } = req.body;
      
      if (!startDate || !endDate) {
        return res.status(400).json({ message: "Start and end dates required" });
      }

      const discounts = await storage.calculateApplicableDiscounts(
        boatId,
        new Date(startDate),
        new Date(endDate),
        userId
      );

      res.json(discounts);
    } catch (error) {
      console.error("Error calculating discounts:", error);
      res.status(500).json({ message: "Error calculating discounts" });
    }
  });
}