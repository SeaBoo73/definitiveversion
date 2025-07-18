import type { Express } from "express";
import { createServer, type Server } from "http";
import Stripe from "stripe";
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
  // Setup authentication
  setupAuth(app);

  // Boats endpoints
  app.get("/api/boats", async (req, res) => {
    try {
      const { type, location, startDate, endDate, maxPersons, skipperRequired, fuelIncluded, ownerId } = req.query;
      
      const filters = {
        type: type as string,
        location: location as string,
        startDate: startDate ? new Date(startDate as string) : undefined,
        endDate: endDate ? new Date(endDate as string) : undefined,
        maxPersons: maxPersons ? parseInt(maxPersons as string) : undefined,
        skipperRequired: skipperRequired === 'true',
        fuelIncluded: fuelIncluded === 'true',
        ownerId: ownerId ? parseInt(ownerId as string) : undefined,
      };

      const boats = await storage.getBoats(filters);
      res.json(boats);
    } catch (error) {
      res.status(500).json({ message: "Error fetching boats" });
    }
  });

  app.get("/api/boats/:id", async (req, res) => {
    try {
      const boat = await storage.getBoat(parseInt(req.params.id));
      if (!boat) {
        return res.status(404).json({ message: "Boat not found" });
      }
      res.json(boat);
    } catch (error) {
      res.status(500).json({ message: "Error fetching boat" });
    }
  });

  app.post("/api/boats", async (req, res) => {
    if (!req.isAuthenticated() || (req.user.role !== "owner" && req.user.role !== "admin")) {
      return res.sendStatus(403);
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
      res.status(500).json({ message: "Error creating boat" });
    }
  });

  app.put("/api/boats/:id", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.sendStatus(401);
    }

    try {
      const boatId = parseInt(req.params.id);
      const boat = await storage.getBoat(boatId);
      
      if (!boat) {
        return res.status(404).json({ message: "Boat not found" });
      }

      if (boat.ownerId !== req.user.id && req.user.role !== "admin") {
        return res.sendStatus(403);
      }

      const updatedBoat = await storage.updateBoat(boatId, req.body);
      res.json(updatedBoat);
    } catch (error) {
      res.status(500).json({ message: "Error updating boat" });
    }
  });

  app.delete("/api/boats/:id", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.sendStatus(401);
    }

    try {
      const boatId = parseInt(req.params.id);
      const boat = await storage.getBoat(boatId);
      
      if (!boat) {
        return res.status(404).json({ message: "Boat not found" });
      }

      if (boat.ownerId !== req.user.id && req.user.role !== "admin") {
        return res.sendStatus(403);
      }

      await storage.deleteBoat(boatId);
      res.sendStatus(204);
    } catch (error) {
      res.status(500).json({ message: "Error deleting boat" });
    }
  });

  // Bookings endpoints
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
      const validation = insertBookingSchema.safeParse(req.body);
      if (!validation.success) {
        return res.status(400).json({ message: "Invalid booking data" });
      }

      const booking = await storage.createBooking({
        ...validation.data,
        customerId: req.user.id,
      });

      res.status(201).json(booking);
    } catch (error) {
      res.status(500).json({ message: "Error creating booking" });
    }
  });

  app.put("/api/bookings/:id", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.sendStatus(401);
    }

    try {
      const bookingId = parseInt(req.params.id);
      const booking = await storage.getBooking(bookingId);
      
      if (!booking) {
        return res.status(404).json({ message: "Booking not found" });
      }

      if (booking.customerId !== req.user.id && req.user.role !== "admin") {
        return res.sendStatus(403);
      }

      const updatedBooking = await storage.updateBooking(bookingId, req.body);
      res.json(updatedBooking);
    } catch (error) {
      res.status(500).json({ message: "Error updating booking" });
    }
  });

  // Payment endpoints
  app.post("/api/create-payment-intent", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.sendStatus(401);
    }

    try {
      const { amount, bookingId } = req.body;
      
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(amount * 100), // Convert to cents
        currency: "eur",
        metadata: {
          bookingId: bookingId.toString(),
          customerId: req.user.id.toString(),
        },
      });

      res.json({ clientSecret: paymentIntent.client_secret });
    } catch (error) {
      res.status(500).json({ message: "Error creating payment intent" });
    }
  });

  // Reviews endpoints
  app.get("/api/reviews", async (req, res) => {
    try {
      const { bookingId, revieweeId, type } = req.query;
      
      const filters = {
        bookingId: bookingId ? parseInt(bookingId as string) : undefined,
        revieweeId: revieweeId ? parseInt(revieweeId as string) : undefined,
        type: type as string,
      };

      const reviews = await storage.getReviews(filters);
      res.json(reviews);
    } catch (error) {
      res.status(500).json({ message: "Error fetching reviews" });
    }
  });

  app.post("/api/reviews", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.sendStatus(401);
    }

    try {
      const validation = insertReviewSchema.safeParse(req.body);
      if (!validation.success) {
        return res.status(400).json({ message: "Invalid review data" });
      }

      const review = await storage.createReview({
        ...validation.data,
        reviewerId: req.user.id,
      });

      res.status(201).json(review);
    } catch (error) {
      res.status(500).json({ message: "Error creating review" });
    }
  });

  // Messages endpoints
  app.get("/api/messages", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.sendStatus(401);
    }

    try {
      const { senderId, receiverId, bookingId } = req.query;
      
      const filters = {
        senderId: senderId ? parseInt(senderId as string) : undefined,
        receiverId: receiverId ? parseInt(receiverId as string) : undefined,
        bookingId: bookingId ? parseInt(bookingId as string) : undefined,
      };

      const messages = await storage.getMessages(filters);
      res.json(messages);
    } catch (error) {
      res.status(500).json({ message: "Error fetching messages" });
    }
  });

  app.post("/api/messages", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.sendStatus(401);
    }

    try {
      const validation = insertMessageSchema.safeParse(req.body);
      if (!validation.success) {
        return res.status(400).json({ message: "Invalid message data" });
      }

      const message = await storage.createMessage({
        ...validation.data,
        senderId: req.user.id,
      });

      res.status(201).json(message);
    } catch (error) {
      res.status(500).json({ message: "Error creating message" });
    }
  });

  // Favorites endpoints
  app.get("/api/favorites", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.sendStatus(401);
    }

    try {
      const favorites = await storage.getFavorites(req.user.id);
      res.json(favorites);
    } catch (error) {
      res.status(500).json({ message: "Error fetching favorites" });
    }
  });

  app.post("/api/favorites", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.sendStatus(401);
    }

    try {
      const { boatId } = req.body;
      const favorite = await storage.addFavorite(req.user.id, boatId);
      res.status(201).json(favorite);
    } catch (error) {
      res.status(500).json({ message: "Error adding favorite" });
    }
  });

  app.delete("/api/favorites/:boatId", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.sendStatus(401);
    }

    try {
      const boatId = parseInt(req.params.boatId);
      await storage.removeFavorite(req.user.id, boatId);
      res.sendStatus(204);
    } catch (error) {
      res.status(500).json({ message: "Error removing favorite" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
