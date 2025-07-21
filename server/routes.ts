import type { Express } from "express";
import { createServer, type Server } from "http";
import Stripe from "stripe";
import { Server as SocketIOServer } from "socket.io";
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

  // Stripe payment endpoints
  app.post("/api/create-payment-intent", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.sendStatus(401);
    }

    try {
      const { bookingId } = req.body;

      if (!bookingId) {
        return res.status(400).json({ message: "Booking ID required" });
      }

      const booking = await storage.getBooking(bookingId);
      if (!booking) {
        return res.status(404).json({ message: "Booking not found" });
      }

      // Verify booking belongs to the authenticated user
      if (booking.customerId !== req.user.id) {
        return res.status(403).json({ message: "Unauthorized to access this booking" });
      }

      // Get boat details
      const boat = await storage.getBoat(booking.boatId);
      if (!boat) {
        return res.status(404).json({ message: "Boat not found" });
      }

      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(parseFloat(booking.totalPrice) * 100), // Convert to cents
        currency: "eur",
        metadata: {
          bookingId: booking.id.toString(),
          boatName: boat.name,
        },
      });

      // Update booking with payment intent ID
      await storage.updateBooking(booking.id, {
        stripePaymentIntentId: paymentIntent.id,
      });

      res.json({
        clientSecret: paymentIntent.client_secret,
        booking: {
          id: booking.id,
          boatName: boat.name,
          startDate: booking.startDate,
          endDate: booking.endDate,
          totalPrice: booking.totalPrice,
        },
      });
    } catch (error: any) {
      console.error("Payment intent creation error:", error);
      res.status(500).json({ message: "Error creating payment intent: " + error.message });
    }
  });

  // Webhook endpoint for Stripe events (payment confirmation)
  app.post("/api/stripe/webhook", async (req, res) => {
    try {
      const sig = req.headers['stripe-signature'];
      let event;

      try {
        event = stripe.webhooks.constructEvent(req.body, sig!, process.env.STRIPE_WEBHOOK_SECRET!);
      } catch (err) {
        console.error('Webhook signature verification failed:', err);
        return res.status(400).send('Webhook signature verification failed');
      }

      if (event.type === 'payment_intent.succeeded') {
        const paymentIntent = event.data.object;
        const bookingId = paymentIntent.metadata.bookingId;

        if (bookingId) {
          // Update booking status to confirmed
          await storage.updateBooking(parseInt(bookingId), {
            status: 'confirmed',
          });
        }
      }

      res.json({ received: true });
    } catch (error) {
      console.error('Webhook error:', error);
      res.status(500).json({ message: "Webhook error" });
    }
  });

  // Chat endpoints
  app.get("/api/conversations/:bookingId", async (req, res) => {
    try {
      const bookingId = parseInt(req.params.bookingId);
      let conversation = await storage.getConversationByBooking(bookingId);
      
      // Create conversation if it doesn't exist
      if (!conversation) {
        conversation = await storage.createConversation({ bookingId });
      }
      
      res.json(conversation);
    } catch (error) {
      res.status(500).json({ message: "Error fetching conversation" });
    }
  });

  app.get("/api/conversations/:conversationId/messages", async (req, res) => {
    try {
      const conversationId = parseInt(req.params.conversationId);
      const messages = await storage.getMessages(conversationId);
      res.json(messages);
    } catch (error) {
      res.status(500).json({ message: "Error fetching messages" });
    }
  });

  app.post("/api/conversations/:conversationId/messages", async (req, res) => {
    try {
      if (!req.user?.id) {
        return res.status(401).json({ message: "Authentication required" });
      }

      const conversationId = parseInt(req.params.conversationId);
      const messageData = {
        conversationId,
        senderId: req.user.id,
        content: req.body.content
      };

      const message = await storage.createMessage(messageData);
      
      // Broadcast message via WebSocket
      const io = req.app.get('socketio');
      if (io) {
        io.to(`conversation-${conversationId}`).emit('new-message', {
          ...message,
          senderName: req.user.firstName ? `${req.user.firstName} ${req.user.lastName}` : req.user.email,
          senderEmail: req.user.email
        });
      }
      
      res.status(201).json(message);
    } catch (error) {
      res.status(500).json({ message: "Error creating message" });
    }
  });

  app.patch("/api/messages/:messageId/read", async (req, res) => {
    try {
      await storage.markMessageAsRead(parseInt(req.params.messageId));
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ message: "Error marking message as read" });
    }
  });

  app.get("/api/user/unread-messages", async (req, res) => {
    try {
      if (!req.user?.id) {
        return res.status(401).json({ message: "Authentication required" });
      }
      
      const count = await storage.getUnreadMessagesCount(req.user.id);
      res.json({ count });
    } catch (error) {
      res.status(500).json({ message: "Error fetching unread messages count" });
    }
  });

  const httpServer = createServer(app);
  
  // Setup WebSocket
  const io = new SocketIOServer(httpServer, {
    cors: {
      origin: process.env.NODE_ENV === 'production' ? false : "*",
      methods: ["GET", "POST"]
    },
    path: '/ws'
  });

  app.set('socketio', io);

  io.on('connection', (socket: any) => {
    console.log('User connected to chat:', socket.id);

    socket.on('join-conversation', (conversationId: number) => {
      socket.join(`conversation-${conversationId}`);
      console.log(`User ${socket.id} joined conversation ${conversationId}`);
    });

    socket.on('leave-conversation', (conversationId: number) => {
      socket.leave(`conversation-${conversationId}`);
      console.log(`User ${socket.id} left conversation ${conversationId}`);
    });

    socket.on('disconnect', () => {
      console.log('User disconnected from chat:', socket.id);
    });
  });

  return httpServer;
}
