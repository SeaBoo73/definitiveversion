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
  reviewerId: integer("reviewer_id").references(() => users.id).notNull(),
  revieweeId: integer("reviewee_id").references(() => users.id).notNull(),
  rating: integer("rating").notNull(), // 1-5 stars
  comment: text("comment"),
  type: text("type").notNull(), // "boat" or "customer"
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

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type Boat = typeof boats.$inferSelect;
export type InsertBoat = z.infer<typeof insertBoatSchema>;
export type Booking = typeof bookings.$inferSelect;
export type InsertBooking = z.infer<typeof insertBookingSchema>;
export type Review = typeof reviews.$inferSelect;
export type InsertReview = z.infer<typeof insertReviewSchema>;
export type Conversation = typeof conversations.$inferSelect;
export type InsertConversation = z.infer<typeof insertConversationSchema>;
export type Message = typeof messages.$inferSelect;
export type InsertMessage = z.infer<typeof insertMessageSchema>;
export type Favorite = typeof favorites.$inferSelect;

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
  date: text("date").notNull(),
  views: integer("views").default(0),
  bookings: integer("bookings").default(0),
  revenue: decimal("revenue", { precision: 10, scale: 2 }).default("0"),
  averageRating: decimal("average_rating", { precision: 3, scale: 2 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
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
