import { sql } from 'drizzle-orm';
import {
  index,
  jsonb,
  pgTable,
  timestamp,
  varchar,
  text,
  boolean,
  serial,
  integer,
  numeric,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table.
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table matching existing database structure
export const users = pgTable("users", {
  id: serial("id").primaryKey(), // Existing database uses serial ID
  username: varchar("username", { length: 100 }).notNull(),
  email: varchar("email", { length: 255 }).unique().notNull(),
  password: varchar("password", { length: 255 }).notNull(),
  role: varchar("role", { length: 20 }).default("customer"), // 'customer', 'owner', or 'admin'
  firstName: varchar("first_name", { length: 100 }),
  lastName: varchar("last_name", { length: 100 }),
  phone: varchar("phone", { length: 20 }),
  verified: boolean("verified").default(false),
  stripeCustomerId: varchar("stripe_customer_id", { length: 255 }),
  createdAt: timestamp("created_at").defaultNow(),
  
  // Customer fields
  customerLevel: varchar("customer_level", { length: 50 }),
  totalBookings: integer("total_bookings").default(0),
  totalSpent: numeric("total_spent").default("0"),
  loyaltyPoints: integer("loyalty_points").default(0),
  
  // Business fields for owners
  businessName: varchar("business_name", { length: 200 }),
  businessType: varchar("business_type", { length: 100 }),
  vatNumber: varchar("vat_number", { length: 50 }),
  website: varchar("website", { length: 255 }),
  instagram: varchar("instagram", { length: 100 }),
});

// Boats table schema that matches existing database structure exactly
export const boats = pgTable("boats", {
  id: serial("id").primaryKey(),
  hostId: integer("host_id").notNull(),
  name: text("name").notNull(),
  manufacturer: text("manufacturer"),
  type: text("type").notNull(),
  year: integer("year"),
  capacity: integer("max_persons"),
  length: numeric("length"),
  motorization: text("motorization"),
  licenseRequired: boolean("license_required"),
  skipperRequired: boolean("skipper_required"),
  location: text("port").notNull(),
  latitude: numeric("latitude"),
  longitude: numeric("longitude"),
  pricePerDay: numeric("price_per_day"),
  description: text("description"),
  images: text("images").array(),
  documentsRequired: text("documents_required"),
  active: boolean("active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  pickupTime: text("pickup_time"),
  returnTime: text("return_time"),
  dailyReturnRequired: boolean("daily_return_required"),
  cancellationPolicy: text("cancellation_policy"),
  refundMethod: text("refund_method"),
  cancellationRules: jsonb("cancellation_rules"),
});

// Bookings table matching the actual database structure
export const bookings = pgTable("bookings", {
  id: serial("id").primaryKey(),
  customerId: integer("customer_id").references(() => users.id).notNull(),
  boatId: integer("boat_id").references(() => boats.id).notNull(),
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date").notNull(),
  totalPrice: numeric("total_price"),
  commission: numeric("commission"),
  status: varchar("status", { length: 20 }).default("pending"),
  stripePaymentIntentId: text("stripe_payment_intent_id"),
  skipperRequested: boolean("skipper_requested"),
  notes: text("notes"),
  originalPrice: numeric("original_price"),
  discountCode: text("discount_code"),
  discountAmount: numeric("discount_amount"),
  loyaltyPointsEarned: integer("loyalty_points_earned"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Zod schemas for validation
export const insertUserSchema = createInsertSchema(users, {
  email: z.string().email("Email non valido"),
  password: z.string().min(6, "Password deve essere almeno 6 caratteri"),
  username: z.string().optional(), // Username is generated automatically from email
  firstName: z.string().min(1, "Nome richiesto").optional(),
  lastName: z.string().min(1, "Cognome richiesto").optional(),
  phone: z.string().optional(),
  role: z.enum(["customer", "owner", "admin"]).default("customer"),
  businessName: z.string().optional(),
  businessType: z.string().optional(),
  vatNumber: z.string().optional(),
  website: z.string().url().optional().or(z.literal("")),
  instagram: z.string().optional(),
}).omit({ id: true, createdAt: true });

// Schema specifico per registrazione owner
export const insertOwnerSchema = insertUserSchema.extend({
  role: z.literal("owner"),
  businessName: z.string().min(1, "Nome attività richiesto"),
  phone: z.string().min(1, "Telefono richiesto"),
  vatNumber: z.string().min(1, "P.IVA/Codice Fiscale richiesto"),
});

// Schema specifico per registrazione customer
export const insertUserOnlySchema = insertUserSchema.extend({
  role: z.literal("customer"),
});

export const loginSchema = z.object({
  email: z.string().email("Email non valido"),
  password: z.string().min(1, "Password richiesta"),
});

export const insertBoatSchema = createInsertSchema(boats, {
  name: z.string().min(1, "Nome richiesto"),
  type: z.string().min(1, "Tipo richiesto"),
  location: z.string().min(1, "Località richiesta"),
}).omit({ id: true, createdAt: true });

export const insertBookingSchema = createInsertSchema(bookings, {
  startDate: z.coerce.date(),
  endDate: z.coerce.date(),
  customerId: z.number(),
  boatId: z.number(),
}).omit({ id: true, createdAt: true });

// Legacy exports for compatibility
export const insertMooringSchema = insertBoatSchema;
export const insertMooringBookingSchema = insertBookingSchema;

export type InsertUser = z.infer<typeof insertUserSchema>;
export type InsertBoat = z.infer<typeof insertBoatSchema>;
export type InsertBooking = z.infer<typeof insertBookingSchema>;
export type User = typeof users.$inferSelect;
export type Boat = typeof boats.$inferSelect;
export type Booking = typeof bookings.$inferSelect;