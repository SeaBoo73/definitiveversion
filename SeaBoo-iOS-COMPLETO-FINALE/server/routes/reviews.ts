import type { Express } from "express";
import { db } from "../db";
import { reviews, boats, users, bookings } from "../../shared/schema";
import { eq, and, desc, avg, count } from "drizzle-orm";
// Auth middleware function - using the same pattern from main routes
const isAuthenticated = (req: any, res: any, next: any) => {
  if (!req.user) {
    return res.status(401).json({ message: "Authentication required" });
  }
  next();
};

export function registerReviewRoutes(app: Express) {
  // Get reviews for a boat
  app.get("/api/reviews/boat/:boatId", async (req, res) => {
    try {
      const boatId = parseInt(req.params.boatId);
      
      const boatReviews = await db
        .select({
          id: reviews.id,
          bookingId: reviews.bookingId,
          boatId: reviews.boatId,
          reviewerId: reviews.reviewerId,
          rating: reviews.rating,
          cleanlinessRating: reviews.cleanlinessRating,
          communicationRating: reviews.communicationRating,
          locationRating: reviews.locationRating,
          valueRating: reviews.valueRating,
          title: reviews.title,
          comment: reviews.comment,
          pros: reviews.pros,
          cons: reviews.cons,
          photos: reviews.photos,
          verified: reviews.verified,
          helpful: reviews.helpful,
          response: reviews.response,
          responseDate: reviews.responseDate,
          createdAt: reviews.createdAt,
          reviewer: {
            id: users.id,
            firstName: users.firstName,
            lastName: users.lastName,
            customerLevel: users.customerLevel,
            totalBookings: users.totalBookings
          }
        })
        .from(reviews)
        .innerJoin(users, eq(reviews.reviewerId, users.id))
        .where(eq(reviews.boatId, boatId))
        .orderBy(desc(reviews.createdAt));

      res.json(boatReviews);
    } catch (error) {
      console.error("Error fetching boat reviews:", error);
      res.status(500).json({ message: "Failed to fetch reviews" });
    }
  });

  // Get review statistics for a boat
  app.get("/api/reviews/stats/:boatId", async (req, res) => {
    try {
      const boatId = parseInt(req.params.boatId);
      
      const stats = await db
        .select({
          averageRating: avg(reviews.rating),
          cleanlinessAvg: avg(reviews.cleanlinessRating),
          communicationAvg: avg(reviews.communicationRating),
          locationAvg: avg(reviews.locationRating),
          valueAvg: avg(reviews.valueRating),
          totalReviews: count(reviews.id)
        })
        .from(reviews)
        .where(eq(reviews.boatId, boatId));

      const result = stats[0] || {
        averageRating: 0,
        cleanlinessAvg: 0,
        communicationAvg: 0,
        locationAvg: 0,
        valueAvg: 0,
        totalReviews: 0
      };

      res.json(result);
    } catch (error) {
      console.error("Error fetching review stats:", error);
      res.status(500).json({ message: "Failed to fetch review statistics" });
    }
  });

  // Create a new review
  app.post("/api/reviews", isAuthenticated, async (req, res) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const {
        boatId,
        bookingId,
        rating,
        cleanlinessRating,
        communicationRating,
        locationRating,
        valueRating,
        title,
        comment,
        pros,
        cons,
        photos
      } = req.body;

      // Verify the user actually booked this boat
      const booking = await db
        .select()
        .from(bookings)
        .where(
          and(
            eq(bookings.id, bookingId),
            eq(bookings.customerId, userId),
            eq(bookings.boatId, boatId)
          )
        );

      if (booking.length === 0) {
        return res.status(403).json({ message: "You can only review boats you have booked" });
      }

      // Check if review already exists
      const existingReview = await db
        .select()
        .from(reviews)
        .where(
          and(
            eq(reviews.bookingId, bookingId),
            eq(reviews.reviewerId, userId)
          )
        );

      if (existingReview.length > 0) {
        return res.status(400).json({ message: "You have already reviewed this booking" });
      }

      // Get boat owner ID
      const boat = await db
        .select({ ownerId: boats.ownerId })
        .from(boats)
        .where(eq(boats.id, boatId));

      if (boat.length === 0) {
        return res.status(404).json({ message: "Boat not found" });
      }

      // Create review
      const [review] = await db
        .insert(reviews)
        .values({
          bookingId,
          boatId,
          reviewerId: userId,
          revieweeId: boat[0].ownerId,
          rating,
          cleanlinessRating,
          communicationRating,
          locationRating,
          valueRating,
          title,
          comment,
          pros: pros?.filter((p: string) => p.trim()) || [],
          cons: cons?.filter((c: string) => c.trim()) || [],
          photos: photos || [],
          verified: true, // Auto-verify since it's from a real booking
          type: "boat"
        })
        .returning();

      res.status(201).json(review);
    } catch (error) {
      console.error("Error creating review:", error);
      res.status(500).json({ message: "Failed to create review" });
    }
  });

  // Mark review as helpful
  app.post("/api/reviews/:reviewId/helpful", isAuthenticated, async (req, res) => {
    try {
      const reviewId = parseInt(req.params.reviewId);
      
      const [updatedReview] = await db
        .update(reviews)
        .set({
          helpful: 0 // We'll increment this properly later
        })
        .where(eq(reviews.id, reviewId))
        .returning();

      res.json(updatedReview);
    } catch (error) {
      console.error("Error updating helpful count:", error);
      res.status(500).json({ message: "Failed to update helpful count" });
    }
  });

  // Owner responds to review
  app.post("/api/reviews/:reviewId/respond", isAuthenticated, async (req, res) => {
    try {
      const userId = req.user?.id;
      const reviewId = parseInt(req.params.reviewId);
      const { response } = req.body;

      // Verify the user is the boat owner
      const review = await db
        .select()
        .from(reviews)
        .where(eq(reviews.id, reviewId));

      if (review.length === 0) {
        return res.status(404).json({ message: "Review not found" });
      }

      if (review[0].revieweeId !== userId) {
        return res.status(403).json({ message: "You can only respond to reviews of your boats" });
      }

      const [updatedReview] = await db
        .update(reviews)
        .set({
          response,
          responseDate: new Date()
        })
        .where(eq(reviews.id, reviewId))
        .returning();

      res.json(updatedReview);
    } catch (error) {
      console.error("Error responding to review:", error);
      res.status(500).json({ message: "Failed to respond to review" });
    }
  });

  // Get reviews by user (customer or owner)
  app.get("/api/reviews/user/:userId", isAuthenticated, async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const currentUserId = req.user?.id;

      // Users can only see their own reviews unless they're admin
      if (userId !== currentUserId && req.user?.role !== 'admin') {
        return res.status(403).json({ message: "Unauthorized" });
      }

      const userReviews = await db
        .select({
          id: reviews.id,
          boatId: reviews.boatId,
          rating: reviews.rating,
          title: reviews.title,
          comment: reviews.comment,
          verified: reviews.verified,
          helpful: reviews.helpful,
          response: reviews.response,
          responseDate: reviews.responseDate,
          createdAt: reviews.createdAt,
          boat: {
            id: boats.id,
            name: boats.name,
            type: boats.type
          }
        })
        .from(reviews)
        .innerJoin(boats, eq(reviews.boatId, boats.id))
        .where(eq(reviews.reviewerId, userId))
        .orderBy(desc(reviews.createdAt));

      res.json(userReviews);
    } catch (error) {
      console.error("Error fetching user reviews:", error);
      res.status(500).json({ message: "Failed to fetch user reviews" });
    }
  });

  // Get reviews received by owner
  app.get("/api/reviews/received/:ownerId", isAuthenticated, async (req, res) => {
    try {
      const ownerId = parseInt(req.params.ownerId);
      const currentUserId = req.user?.id;

      // Owners can only see reviews they received
      if (ownerId !== currentUserId && req.user?.role !== 'admin') {
        return res.status(403).json({ message: "Unauthorized" });
      }

      const receivedReviews = await db
        .select({
          id: reviews.id,
          boatId: reviews.boatId,
          rating: reviews.rating,
          title: reviews.title,
          comment: reviews.comment,
          verified: reviews.verified,
          helpful: reviews.helpful,
          response: reviews.response,
          responseDate: reviews.responseDate,
          createdAt: reviews.createdAt,
          reviewer: {
            firstName: users.firstName,
            lastName: users.lastName,
            customerLevel: users.customerLevel
          },
          boat: {
            id: boats.id,
            name: boats.name,
            type: boats.type
          }
        })
        .from(reviews)
        .innerJoin(users, eq(reviews.reviewerId, users.id))
        .innerJoin(boats, eq(reviews.boatId, boats.id))
        .where(eq(reviews.revieweeId, ownerId))
        .orderBy(desc(reviews.createdAt));

      res.json(receivedReviews);
    } catch (error) {
      console.error("Error fetching received reviews:", error);
      res.status(500).json({ message: "Failed to fetch received reviews" });
    }
  });
}