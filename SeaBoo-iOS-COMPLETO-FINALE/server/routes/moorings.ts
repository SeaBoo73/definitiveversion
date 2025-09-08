import type { Express } from "express";
import { storage } from "../storage";
import { insertMooringSchema, insertMooringBookingSchema } from "@shared/schema";
import { EmailService } from "../email-service";
import Stripe from "stripe";

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('Missing required Stripe secret: STRIPE_SECRET_KEY');
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2025-06-30.basil",
});

let mooringBookingCounter = 1;

function generateMooringBookingCode(): string {
  return `OMR${String(mooringBookingCounter++).padStart(6, '0')}`;
}

export function registerMooringRoutes(app: Express) {
  // Get all moorings with filters
  app.get("/api/moorings", async (req, res) => {
    try {
      const { type, location, port, managerId, maxLength, featured } = req.query;
      
      const moorings = await storage.getMoorings({
        type: type as string,
        location: location as string,
        port: port as string,
        managerId: managerId ? Number(managerId) : undefined,
        maxLength: maxLength ? Number(maxLength) : undefined,
        featured: featured === 'true' ? true : featured === 'false' ? false : undefined,
      });
      
      res.json(moorings);
    } catch (error) {
      console.error("Error fetching moorings:", error);
      res.status(500).json({ error: "Failed to fetch moorings" });
    }
  });

  // Get single mooring
  app.get("/api/moorings/:id", async (req, res) => {
    try {
      const mooring = await storage.getMooring(Number(req.params.id));
      if (!mooring) {
        return res.status(404).json({ error: "Mooring not found" });
      }
      res.json(mooring);
    } catch (error) {
      console.error("Error fetching mooring:", error);
      res.status(500).json({ error: "Failed to fetch mooring" });
    }
  });

  // Create new mooring (for managers/owners)
  app.post("/api/moorings", async (req, res) => {
    try {
      if (!req.user) {
        return res.status(401).json({ error: "Authentication required" });
      }

      const validatedData = insertMooringSchema.parse({
        ...req.body,
        managerId: req.user.id,
      });

      const mooring = await storage.createMooring(validatedData);
      res.status(201).json(mooring);
    } catch (error) {
      console.error("Error creating mooring:", error);
      res.status(500).json({ error: "Failed to create mooring" });
    }
  });

  // Update mooring
  app.put("/api/moorings/:id", async (req, res) => {
    try {
      if (!req.user) {
        return res.status(401).json({ error: "Authentication required" });
      }

      const mooringId = Number(req.params.id);
      const existingMooring = await storage.getMooring(mooringId);
      
      if (!existingMooring) {
        return res.status(404).json({ error: "Mooring not found" });
      }

      // Check if user owns this mooring
      if (existingMooring.managerId !== req.user.id) {
        return res.status(403).json({ error: "Not authorized to update this mooring" });
      }

      const mooring = await storage.updateMooring(mooringId, req.body);
      res.json(mooring);
    } catch (error) {
      console.error("Error updating mooring:", error);
      res.status(500).json({ error: "Failed to update mooring" });
    }
  });

  // Delete mooring
  app.delete("/api/moorings/:id", async (req, res) => {
    try {
      if (!req.user) {
        return res.status(401).json({ error: "Authentication required" });
      }

      const mooringId = Number(req.params.id);
      const mooring = await storage.getMooring(mooringId);
      
      if (!mooring) {
        return res.status(404).json({ error: "Mooring not found" });
      }

      if (mooring.managerId !== req.user.id) {
        return res.status(403).json({ error: "Not authorized to delete this mooring" });
      }

      await storage.deleteMooring(mooringId);
      res.json({ message: "Mooring deleted successfully" });
    } catch (error) {
      console.error("Error deleting mooring:", error);
      res.status(500).json({ error: "Failed to delete mooring" });
    }
  });

  // Get mooring bookings
  app.get("/api/mooring-bookings", async (req, res) => {
    try {
      // Temporary: skip auth for testing

      const { customerId, mooringId, managerId, status } = req.query;
      
      const bookings = await storage.getMooringBookings({
        customerId: customerId ? Number(customerId) : undefined,
        mooringId: mooringId ? Number(mooringId) : undefined,
        managerId: managerId ? Number(managerId) : undefined,
        status: status as string,
      });
      
      res.json(bookings);
    } catch (error) {
      console.error("Error fetching mooring bookings:", error);
      res.status(500).json({ error: "Failed to fetch bookings" });
    }
  });

  // Create mooring booking
  app.post("/api/mooring-bookings", async (req, res) => {
    try {
      // For testing, use customerId from request body or default to user 5 (customer@test.com)
      const customerId = req.body.customerId || (req.user ? req.user.id : 5);

      // Prepare booking data with proper types
      const validatedData = {
        mooringId: req.body.mooringId,
        customerId: customerId,
        startDate: new Date(req.body.startDate),
        endDate: new Date(req.body.endDate),
        boatLength: req.body.boatLength.toString(),
        boatName: req.body.boatName,
        boatType: req.body.boatType,
        totalPrice: req.body.totalPrice.toString(),
        originalPrice: req.body.totalPrice.toString(),
        specialRequests: req.body.specialRequests || null,
        notes: req.body.notes || null,
      };

      const booking = await storage.createMooringBooking(validatedData);
      res.status(201).json(booking);
    } catch (error) {
      console.error("Error creating mooring booking:", error);
      res.status(500).json({ error: "Failed to create booking" });
    }
  });

  // Create payment intent for mooring booking
  app.post("/api/create-mooring-payment-intent", async (req, res) => {
    try {
      if (!req.user) {
        return res.status(401).json({ error: "Authentication required" });
      }

      const { amount, currency = "eur", mooringBookingId } = req.body;

      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(amount * 100), // Convert to cents
        currency,
        metadata: {
          type: "mooring_booking",
          mooringBookingId: mooringBookingId.toString(),
          userId: req.user.id.toString(),
        },
      });

      res.json({ clientSecret: paymentIntent.client_secret });
    } catch (error) {
      console.error("Error creating payment intent:", error);
      res.status(500).json({ error: "Failed to create payment intent" });
    }
  });

  // Confirm mooring payment and send notifications
  app.post("/api/confirm-mooring-payment", async (req, res) => {
    try {
      if (!req.user) {
        return res.status(401).json({ error: "Authentication required" });
      }

      const { paymentIntentId, mooringBookingId } = req.body;

      // Update booking status
      const booking = await storage.updateMooringBooking(mooringBookingId, {
        status: "confirmed",
        stripePaymentIntentId: paymentIntentId,
      });

      // Generate booking code
      const bookingCode = generateMooringBookingCode();

      // Get complete booking data for email
      const [fullBooking] = await storage.getMooringBookings({ 
        customerId: booking.customerId,
        mooringId: booking.mooringId 
      });

      if (fullBooking && fullBooking.mooring && fullBooking.customer) {
        // Get manager details
        const manager = await storage.getUser(fullBooking.mooring.managerId);
        
        if (manager) {
          // Send email notification
          const emailData = {
            customerName: `${fullBooking.customer.firstName} ${fullBooking.customer.lastName}`,
            customerEmail: fullBooking.customer.email,
            ownerName: `${manager.firstName} ${manager.lastName}`,
            ownerEmail: manager.email,
            startDate: new Date(fullBooking.startDate).toLocaleDateString('it-IT'),
            endDate: new Date(fullBooking.endDate).toLocaleDateString('it-IT'),
            boatType: "Ormeggio",
            boatName: fullBooking.mooring.name,
            totalPrice: Number(fullBooking.totalPrice),
            paymentMethod: "Stripe",
            bookingCode: bookingCode,
          };

          await EmailService.sendBookingNotification(emailData);
        }
      }

      res.json({ success: true, bookingCode });
    } catch (error) {
      console.error("Error confirming mooring payment:", error);
      res.status(500).json({ error: "Failed to confirm payment" });
    }
  });
}