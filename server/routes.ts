import type { Express } from "express";
import { createServer, type Server } from "http";
import Stripe from "stripe";
import { registerOwnerRoutes } from "./routes/owner-registration";
import { registerAnalyticsRoutes } from "./routes/analytics";
import { registerEmergencyRoutes } from "./routes/emergencies";
import { registerFeatureRoutes } from "./routes/features";
import { registerAvailabilityRoutes } from "./routes/availability-management";
import emergencyRoutes from "./routes/emergency";
import externalRoutes from "./routes/external";
import { Server as SocketIOServer } from "socket.io";
import { aiService } from "./ai-service";
import { storage } from "./storage";
import { setupAuth } from "./auth";
import { insertBoatSchema, insertBookingSchema, insertReviewSchema, insertMessageSchema } from "@shared/schema";
import { z } from "zod";

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('Missing required Stripe secret: STRIPE_SECRET_KEY');
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2025-06-30.basil",
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Register owner routes
  registerOwnerRoutes(app);
  
  // Register advanced feature routes
  registerAnalyticsRoutes(app);
  registerEmergencyRoutes(app);
  registerFeatureRoutes(app);
  registerAvailabilityRoutes(app);
  
  // Emergency system routes
  app.use('/api/emergency', emergencyRoutes);
  
  // External services routes
  app.use('/api/external', externalRoutes);
  
  // AI Chat routes
  const aiChatRoutes = await import("./routes/ai-chat");
  app.use('/api/ai', aiChatRoutes.default);
  
  // Review routes
  const { registerReviewRoutes } = await import("./routes/reviews");
  registerReviewRoutes(app);
  
  // Messaging routes
  const { registerMessagingRoutes } = await import("./routes/messaging");
  registerMessagingRoutes(app);
  
  // Document management routes
  const { registerDocumentRoutes } = await import("./routes/document-management");
  registerDocumentRoutes(app);
  
  // Setup authentication
  setupAuth(app);

  // User endpoints
  app.get("/api/user", (req, res) => {
    if (req.isAuthenticated()) {
      res.json(req.user);
    } else {
      res.status(401).json({ message: "Not authenticated" });
    }
  });

  // Boats endpoints
  app.get("/api/boats", async (req, res) => {
    try {
      const boats = await storage.getBoats();
      res.json(boats);
    } catch (error) {
      res.status(500).json({ message: "Error fetching boats" });
    }
  });

  app.get("/api/boats/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const boat = await storage.getBoat(id);
      
      if (!boat) {
        return res.status(404).json({ message: "Boat not found" });
      }

      res.json(boat);
    } catch (error) {
      res.status(500).json({ message: "Error fetching boat" });
    }
  });

  app.post("/api/boats", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.sendStatus(401);
    }

    try {
      const validation = insertBoatSchema.safeParse(req.body);
      if (!validation.success) {
        return res.status(400).json({ message: "Invalid boat data" });
      }

      const boat = await storage.createBoat({
        ...validation.data,
        ownerId: req.user.id,
      });

      res.status(201).json(boat);
    } catch (error) {
      console.error("Error creating boat:", error);
      res.status(500).json({ message: "Error creating boat" });
    }
  });

  // Booking endpoints
  app.get("/api/bookings", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.sendStatus(401);
    }

    try {
      const { customerId, boatId, ownerId, status } = req.query;
      
      const filters = {
        customerId: customerId ? parseInt(customerId as string) : undefined,
        boatId: boatId ? parseInt(boatId as string) : undefined,
        ownerId: ownerId ? parseInt(ownerId as string) : undefined,
        status: status as string,
      };

      const bookings = await storage.getBookings(filters);
      res.json(bookings);
    } catch (error) {
      res.status(500).json({ message: "Error fetching bookings" });
    }
  });

  app.post("/api/bookings", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.sendStatus(401);
    }

    try {
      const boat = await storage.getBoat(req.body.boatId);
      if (!boat) {
        return res.status(404).json({ error: "Boat not found" });
      }

      const bookingData = {
        ...req.body,
        customerId: req.user.id,
        ownerId: boat.ownerId,
        status: "pending" as const,
        createdAt: new Date(),
      };

      const booking = await storage.createBooking(bookingData);
      res.status(201).json(booking);
    } catch (error) {
      console.error("Error creating booking:", error);
      res.status(500).json({ message: "Error creating booking" });
    }
  });

  // Stripe payment route for one-time payments
  app.post("/api/create-payment-intent", async (req, res) => {
    try {
      const { amount, currency = "eur" } = req.body;
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(amount * 100), // Convert to cents
        currency: currency,
        automatic_payment_methods: {
          enabled: true,
        },
      });
      res.json({ clientSecret: paymentIntent.client_secret });
    } catch (error: any) {
      res
        .status(500)
        .json({ message: "Error creating payment intent: " + error.message });
    }
  });

  // Configuration endpoint for API keys
  app.get("/api/config", (req, res) => {
    res.json({
      googleMapsApiKey: process.env.GOOGLE_MAPS_API_KEY || "AIzaSyDTjTGKA-CO281BTK3-WEx5vyfQ-_ah4Bo",
    });
  });

  // Static file serving for images
  app.get("/api/images/:filename", (req, res) => {
    const filename = req.params.filename;
    const imagePath = `./attached_assets/${filename}`;
    res.sendFile(imagePath, { root: "." });
  });

  const httpServer = createServer(app);

  // Socket.IO for real-time features
  const io = new SocketIOServer(httpServer, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"]
    }
  });

  io.on("connection", (socket) => {
    console.log("User connected");

    socket.on("disconnect", () => {
      console.log("User disconnected");
    });
  });

  return httpServer;
}