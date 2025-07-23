import { pgTable, text, serial, integer, boolean, timestamp, decimal, pgEnum } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const userRoleEnum = pgEnum("user_role", ["customer", "owner", "admin"]);
export const customerLevelEnum = pgEnum("customer_level", ["bronze", "silver", "gold", "platinum"]);
export const discountTypeEnum = pgEnum("discount_type", ["percentage", "fixed", "loyalty", "early_bird", "last_minute"]);
export const boatTypeEnum = pgEnum("boat_type", ["gommone", "barche-senza-patente", "yacht", "catamarano", "jetski", "sailboat", "kayak", "charter", "houseboat"]);
export const bookingStatusEnum = pgEnum("booking_status", ["pending", "confirmed", "cancelled", "completed"]);
export const messageStatusEnum = pgEnum("message_status", ["sent", "read"]);

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  role: userRoleEnum("role").notNull().default("customer"),
  firstName: text("first_name"),
  lastName: text("last_name"),
  phone: text("phone"),
  verified: boolean("verified").default(false),
  stripeCustomerId: text("stripe_customer_id"),
  customerLevel: customerLevelEnum("customer_level").default("bronze"),
  totalBookings: integer("total_bookings").default(0),
  totalSpent: decimal("total_spent", { precision: 10, scale: 2 }).default("0.00"),
  loyaltyPoints: integer("loyalty_points").default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

export const boats = pgTable("boats", {
  id: serial("id").primaryKey(),
  ownerId: integer("owner_id").references(() => users.id).notNull(),
  name: text("name").notNull(),
  manufacturer: text("manufacturer"),
  type: boatTypeEnum("type").notNull(),
  year: integer("year"),
  maxPersons: integer("max_persons").notNull(),
  length: decimal("length", { precision: 4, scale: 2 }),
  motorization: text("motorization"),
  licenseRequired: boolean("license_required").default(false),
  skipperRequired: boolean("skipper_required").default(false),
  port: text("port").notNull(),
  latitude: decimal("latitude", { precision: 10, scale: 8 }),
  longitude: decimal("longitude", { precision: 11, scale: 8 }),
  pricePerDay: decimal("price_per_day", { precision: 8, scale: 2 }).notNull(),
  description: text("description"),
  images: text("images").array(),
  documentsRequired: text("documents_required"),
  pickupTime: text("pickup_time").default("09:00"), // Orario ritiro (es. 09:00)
  returnTime: text("return_time").default("18:00"), // Orario riconsegna (es. 18:00)
  dailyReturnRequired: boolean("daily_return_required").default(true), // Ritorno serale obbligatorio
  active: boolean("active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

export const bookings = pgTable("bookings", {
  id: serial("id").primaryKey(),
  customerId: integer("customer_id").references(() => users.id).notNull(),
  boatId: integer("boat_id").references(() => boats.id).notNull(),
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date").notNull(),
  totalPrice: decimal("total_price", { precision: 8, scale: 2 }).notNull(),
  originalPrice: decimal("original_price", { precision: 8, scale: 2 }).notNull(),
  discountCode: text("discount_code"),
  discountAmount: decimal("discount_amount", { precision: 8, scale: 2 }).default("0.00"),
  commission: decimal("commission", { precision: 8, scale: 2 }).notNull(),
  loyaltyPointsEarned: integer("loyalty_points_earned").default(0),
  status: bookingStatusEnum("status").default("pending"),
  stripePaymentIntentId: text("stripe_payment_intent_id"),
  skipperRequested: boolean("skipper_requested").default(false),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const reviews = pgTable("reviews", {
  id: serial("id").primaryKey(),
  bookingId: integer("booking_id").references(() => bookings.id).notNull(),
  boatId: integer("boat_id").references(() => boats.id).notNull(),
  reviewerId: integer("reviewer_id").references(() => users.id).notNull(),
  revieweeId: integer("reviewee_id").references(() => users.id).notNull(),
  rating: integer("rating").notNull(), // 1-5 stars overall
  cleanlinessRating: integer("cleanliness_rating"),
  communicationRating: integer("communication_rating"),
  locationRating: integer("location_rating"),
  valueRating: integer("value_rating"),
  title: text("title"),
  comment: text("comment"),
  pros: text("pros").array(),
  cons: text("cons").array(),
  photos: text("photos").array(), // URLs to review photos
  verified: boolean("verified").default(false),
  helpful: integer("helpful").default(0),
  type: text("type").notNull(), // "boat" or "customer"
  response: text("response"), // Owner response
  responseDate: timestamp("response_date"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Chat tables
export const conversations = pgTable("conversations", {
  id: serial("id").primaryKey(),
  bookingId: integer("booking_id").references(() => bookings.id).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  lastMessageAt: timestamp("last_message_at").defaultNow().notNull(),
});

export const messages = pgTable("messages", {
  id: serial("id").primaryKey(),
  conversationId: integer("conversation_id").references(() => conversations.id).notNull(),
  senderId: integer("sender_id").references(() => users.id).notNull(),
  content: text("content").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  readAt: timestamp("read_at"),
});

export const favorites = pgTable("favorites", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  boatId: integer("boat_id").references(() => boats.id).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Loyalty and Discounts system
export const discounts = pgTable("discounts", {
  id: serial("id").primaryKey(),
  code: text("code").notNull().unique(),
  name: text("name").notNull(),
  description: text("description"),
  type: discountTypeEnum("type").notNull(),
  value: decimal("value", { precision: 8, scale: 2 }).notNull(), // percentage or fixed amount
  minSpent: decimal("min_spent", { precision: 8, scale: 2 }).default("0.00"),
  maxDiscount: decimal("max_discount", { precision: 8, scale: 2 }),
  requiredLevel: customerLevelEnum("required_level").default("bronze"),
  validFrom: timestamp("valid_from").notNull(),
  validTo: timestamp("valid_to").notNull(),
  usageLimit: integer("usage_limit").default(1),
  usedCount: integer("used_count").default(0),
  active: boolean("active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

export const userDiscounts = pgTable("user_discounts", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  discountId: integer("discount_id").references(() => discounts.id).notNull(),
  bookingId: integer("booking_id").references(() => bookings.id),
  usedAt: timestamp("used_at").defaultNow(),
});

export const documents = pgTable("documents", {
  id: serial("id").primaryKey(),
  bookingId: integer("booking_id").references(() => bookings.id).notNull(),
  type: text("type").notNull(), // "contract", "identity", "license", "deposit_receipt"
  fileName: text("file_name").notNull(),
  filePath: text("file_path").notNull(),
  uploadedBy: integer("uploaded_by").references(() => users.id).notNull(),
  verified: boolean("verified").default(false),
  verifiedBy: integer("verified_by").references(() => users.id),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  ownedBoats: many(boats),
  bookings: many(bookings),
  sentMessages: many(messages),
  givenReviews: many(reviews, { relationName: "reviewer" }),
  receivedReviews: many(reviews, { relationName: "reviewee" }),
  favorites: many(favorites),
}));

export const boatsRelations = relations(boats, ({ one, many }) => ({
  owner: one(users, {
    fields: [boats.ownerId],
    references: [users.id],
  }),
  bookings: many(bookings),
  favorites: many(favorites),
}));

export const bookingsRelations = relations(bookings, ({ one, many }) => ({
  customer: one(users, {
    fields: [bookings.customerId],
    references: [users.id],
  }),
  boat: one(boats, {
    fields: [bookings.boatId],
    references: [boats.id],
  }),
  reviews: many(reviews),
  conversations: many(conversations),
}));

export const reviewsRelations = relations(reviews, ({ one }) => ({
  booking: one(bookings, {
    fields: [reviews.bookingId],
    references: [bookings.id],
  }),
  reviewer: one(users, {
    fields: [reviews.reviewerId],
    references: [users.id],
    relationName: "reviewer",
  }),
  reviewee: one(users, {
    fields: [reviews.revieweeId],
    references: [users.id],
    relationName: "reviewee",
  }),
}));

export const conversationsRelations = relations(conversations, ({ one, many }) => ({
  booking: one(bookings, {
    fields: [conversations.bookingId],
    references: [bookings.id],
  }),
  messages: many(messages),
}));

export const messagesRelations = relations(messages, ({ one }) => ({
  conversation: one(conversations, {
    fields: [messages.conversationId],
    references: [conversations.id],
  }),
  sender: one(users, {
    fields: [messages.senderId],
    references: [users.id],
  }),
}));

export const favoritesRelations = relations(favorites, ({ one }) => ({
  user: one(users, {
    fields: [favorites.userId],
    references: [users.id],
  }),
  boat: one(boats, {
    fields: [favorites.boatId],
    references: [boats.id],
  }),
}));

// Insert schemas
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  email: true,
  password: true,
  role: true,
  firstName: true,
  lastName: true,
  phone: true,
});

export const insertBoatSchema = createInsertSchema(boats).omit({
  id: true,
  createdAt: true,
});

export const insertBookingSchema = createInsertSchema(bookings).omit({
  id: true,
  commission: true,
  status: true,
  stripePaymentIntentId: true,
  createdAt: true,
});

export const insertReviewSchema = createInsertSchema(reviews).omit({
  id: true,
  createdAt: true,
});

export const insertConversationSchema = createInsertSchema(conversations).omit({
  id: true,
  createdAt: true,
  lastMessageAt: true,
});

export const insertMessageSchema = createInsertSchema(messages).omit({
  id: true,
  createdAt: true,
  readAt: true,
});

export const insertDiscountSchema = createInsertSchema(discounts).omit({
  id: true,
  usedCount: true,
  createdAt: true,
});

export const insertDocumentSchema = createInsertSchema(documents).omit({
  id: true,
  verified: true,
  verifiedBy: true,
  createdAt: true,
});

// Types
export type User = typeof users.$inferSelect;
export type Boat = typeof boats.$inferSelect;
export type Booking = typeof bookings.$inferSelect;
export type Review = typeof reviews.$inferSelect;
export type Conversation = typeof conversations.$inferSelect;
export type Message = typeof messages.$inferSelect;
export type Favorite = typeof favorites.$inferSelect;
export type Discount = typeof discounts.$inferSelect;
export type UserDiscount = typeof userDiscounts.$inferSelect;
export type Document = typeof documents.$inferSelect;

export type InsertUser = z.infer<typeof insertUserSchema>;
export type InsertBoat = z.infer<typeof insertBoatSchema>;
export type InsertBooking = z.infer<typeof insertBookingSchema>;
export type InsertReview = z.infer<typeof insertReviewSchema>;
export type InsertConversation = z.infer<typeof insertConversationSchema>;
export type InsertMessage = z.infer<typeof insertMessageSchema>;
export type InsertDiscount = z.infer<typeof insertDiscountSchema>;
export type InsertDocument = z.infer<typeof insertDocumentSchema>;



// New advanced tables
export const notifications = pgTable("notifications", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  title: text("title").notNull(),
  message: text("message").notNull(),
  type: text("type").notNull(),
  read: boolean("read").default(false),
  data: text("data"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const promotions = pgTable("promotions", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  discountType: text("discount_type").notNull(),
  discountValue: decimal("discount_value", { precision: 10, scale: 2 }).notNull(),
  code: text("code").unique(),
  minAmount: decimal("min_amount", { precision: 10, scale: 2 }),
  maxUses: integer("max_uses"),
  currentUses: integer("current_uses").default(0),
  validFrom: timestamp("valid_from").notNull(),
  validTo: timestamp("valid_to").notNull(),
  active: boolean("active").default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const analytics = pgTable("analytics", {
  id: serial("id").primaryKey(),
  ownerId: integer("owner_id").references(() => users.id).notNull(),
  boatId: integer("boat_id").references(() => boats.id),
  date: text("date").notNull(),
  period: text("period").default("daily"), // "daily", "weekly", "monthly"
  views: integer("views").default(0),
  bookings: integer("bookings").default(0),
  revenue: decimal("revenue", { precision: 10, scale: 2 }).default("0"),
  conversionRate: decimal("conversion_rate", { precision: 5, scale: 2 }).default("0.00"),
  averageRating: decimal("average_rating", { precision: 3, scale: 2 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Emergency System
export const emergencies = pgTable("emergencies", {
  id: serial("id").primaryKey(),
  bookingId: integer("booking_id").references(() => bookings.id).notNull(),
  reportedBy: integer("reported_by").references(() => users.id).notNull(),
  type: text("type").notNull(), // "mechanical", "medical", "weather", "accident"
  severity: text("severity").notNull(), // "low", "medium", "high", "critical"
  description: text("description").notNull(),
  location: text("location"), // GPS coordinates or address
  status: text("status").default("open"), // "open", "in_progress", "resolved", "closed"
  assignedTo: integer("assigned_to").references(() => users.id),
  resolution: text("resolution"),
  resolvedAt: timestamp("resolved_at"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Weather Integration
export const weatherData = pgTable("weather_data", {
  id: serial("id").primaryKey(),
  location: text("location").notNull(),
  latitude: decimal("latitude", { precision: 10, scale: 8 }).notNull(),
  longitude: decimal("longitude", { precision: 11, scale: 8 }).notNull(),
  date: timestamp("date").notNull(),
  temperature: decimal("temperature", { precision: 4, scale: 1 }),
  windSpeed: decimal("wind_speed", { precision: 4, scale: 1 }),
  windDirection: integer("wind_direction"),
  waveHeight: decimal("wave_height", { precision: 4, scale: 2 }),
  visibility: decimal("visibility", { precision: 4, scale: 1 }),
  weatherCondition: text("weather_condition"),
  seaCondition: text("sea_condition"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Dynamic Pricing
export const dynamicPricing = pgTable("dynamic_pricing", {
  id: serial("id").primaryKey(),
  boatId: integer("boat_id").references(() => boats.id).notNull(),
  seasonType: text("season_type").notNull(), // "high", "medium", "low"
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date").notNull(),
  priceMultiplier: decimal("price_multiplier", { precision: 4, scale: 2 }).default("1.00"),
  minimumDays: integer("minimum_days").default(1),
  discountPercentage: decimal("discount_percentage", { precision: 5, scale: 2 }).default("0.00"),
  active: boolean("active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

// Boat Features
export const boatFeatures = pgTable("boat_features", {
  id: serial("id").primaryKey(),
  boatId: integer("boat_id").references(() => boats.id).notNull(),
  category: text("category").notNull(), // "safety", "comfort", "navigation", "entertainment"
  feature: text("feature").notNull(),
  description: text("description"),
  available: boolean("available").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

// Availability Calendar - Enhanced for advanced management
export const availability = pgTable("availability", {
  id: serial("id").primaryKey(),
  boatId: integer("boat_id").references(() => boats.id).notNull(),
  date: timestamp("date").notNull(),
  available: boolean("available").default(true),
  price: decimal("price", { precision: 8, scale: 2 }),
  seasonType: text("season_type").default("medium"), // "high", "medium", "low"
  priceMultiplier: decimal("price_multiplier", { precision: 4, scale: 2 }).default("1.00"),
  minimumDays: integer("minimum_days").default(1),
  blockReason: text("block_reason"), // "booked", "maintenance", "owner_block", "weather"
  lastUpdated: timestamp("last_updated").defaultNow(),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Booking Rules and Discounts
export const bookingRules = pgTable("booking_rules", {
  id: serial("id").primaryKey(),
  boatId: integer("boat_id").references(() => boats.id).notNull(),
  ruleType: text("rule_type").notNull(), // "multiple_days", "last_minute", "early_bird", "seasonal"
  name: text("name").notNull(),
  description: text("description"),
  discountPercentage: decimal("discount_percentage", { precision: 5, scale: 2 }).default("0.00"),
  minimumDays: integer("minimum_days"),
  maximumDays: integer("maximum_days"),
  advanceBookingDays: integer("advance_booking_days"), // For early bird/last minute
  validFrom: timestamp("valid_from"),
  validTo: timestamp("valid_to"),
  active: boolean("active").default(true),
  priority: integer("priority").default(1), // Higher priority rules apply first
  createdAt: timestamp("created_at").defaultNow(),
});

// Real-time booking locks to prevent double bookings
export const bookingLocks = pgTable("booking_locks", {
  id: serial("id").primaryKey(),
  boatId: integer("boat_id").references(() => boats.id).notNull(),
  userId: integer("user_id").references(() => users.id).notNull(),
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date").notNull(),
  sessionId: text("session_id").notNull(),
  locked: boolean("locked").default(true),
  expiresAt: timestamp("expires_at").notNull(), // Lock expires after 15 minutes
  createdAt: timestamp("created_at").defaultNow(),
});

// Advanced pricing history for analytics
export const priceHistory = pgTable("price_history", {
  id: serial("id").primaryKey(),
  boatId: integer("boat_id").references(() => boats.id).notNull(),
  date: timestamp("date").notNull(),
  basePrice: decimal("base_price", { precision: 8, scale: 2 }).notNull(),
  finalPrice: decimal("final_price", { precision: 8, scale: 2 }).notNull(),
  seasonMultiplier: decimal("season_multiplier", { precision: 4, scale: 2 }).default("1.00"),
  demandMultiplier: decimal("demand_multiplier", { precision: 4, scale: 2 }).default("1.00"),
  appliedRules: text("applied_rules").array(), // JSON array of applied discount rules
  createdAt: timestamp("created_at").defaultNow(),
});

export const aiInteractions = pgTable("ai_interactions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  prompt: text("prompt").notNull(),
  response: text("response").notNull(),
  interactionType: text("interaction_type").notNull(),
  metadata: text("metadata"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// New types
export type Notification = typeof notifications.$inferSelect;
export type Promotion = typeof promotions.$inferSelect;
export type Analytics = typeof analytics.$inferSelect;
export type AiInteraction = typeof aiInteractions.$inferSelect;

// New insert schemas
export const insertNotificationSchema = createInsertSchema(notifications).omit({
  id: true,
  createdAt: true,
});

export const insertPromotionSchema = createInsertSchema(promotions).omit({
  id: true,
  createdAt: true,
  currentUses: true,
});

export const insertAnalyticsSchema = createInsertSchema(analytics).omit({
  id: true,
  createdAt: true,
});

export const insertAiInteractionSchema = createInsertSchema(aiInteractions).omit({
  id: true,
  createdAt: true,
});

export type InsertNotification = z.infer<typeof insertNotificationSchema>;
export type InsertPromotion = z.infer<typeof insertPromotionSchema>;
export type InsertAnalytics = z.infer<typeof insertAnalyticsSchema>;
export type InsertAiInteraction = z.infer<typeof insertAiInteractionSchema>;

// Advanced availability management schemas
export const insertAvailabilitySchema = createInsertSchema(availability).omit({
  id: true,
  createdAt: true,
  lastUpdated: true,
});

export const insertBookingRuleSchema = createInsertSchema(bookingRules).omit({
  id: true,
  createdAt: true,
});

export const insertBookingLockSchema = createInsertSchema(bookingLocks).omit({
  id: true,
  createdAt: true,
});

export const insertPriceHistorySchema = createInsertSchema(priceHistory).omit({
  id: true,
  createdAt: true,
});

// New types for advanced availability
export type Availability = typeof availability.$inferSelect;
export type BookingRule = typeof bookingRules.$inferSelect;
export type BookingLock = typeof bookingLocks.$inferSelect;
export type PriceHistory = typeof priceHistory.$inferSelect;

export type InsertAvailability = z.infer<typeof insertAvailabilitySchema>;
export type InsertBookingRule = z.infer<typeof insertBookingRuleSchema>;
export type InsertBookingLock = z.infer<typeof insertBookingLockSchema>;
export type InsertPriceHistory = z.infer<typeof insertPriceHistorySchema>;

// Additional schemas for other advanced tables
export const insertEmergencySchema = createInsertSchema(emergencies).omit({
  id: true,
  status: true,
  assignedTo: true,
  resolution: true,
  resolvedAt: true,
  createdAt: true,
});

export const insertDynamicPricingSchema = createInsertSchema(dynamicPricing).omit({
  id: true,
  createdAt: true,
});

export const insertBoatFeatureSchema = createInsertSchema(boatFeatures).omit({
  id: true,
  createdAt: true,
});

// Additional types for new tables
export type Emergency = typeof emergencies.$inferSelect;
export type WeatherData = typeof weatherData.$inferSelect;
export type DynamicPricing = typeof dynamicPricing.$inferSelect;
export type BoatFeature = typeof boatFeatures.$inferSelect;

export type InsertEmergency = z.infer<typeof insertEmergencySchema>;
export type InsertDynamicPricing = z.infer<typeof insertDynamicPricingSchema>;
export type InsertBoatFeature = z.infer<typeof insertBoatFeatureSchema>;
