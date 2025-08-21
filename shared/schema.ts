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
  role: varchar("role", { length: 20 }).default("user"), // 'user' or 'owner'
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
  isActive: boolean("active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  pickupTime: text("pickup_time"),
  returnTime: text("return_time"),
  dailyReturnRequired: boolean("daily_return_required"),
  cancellationPolicy: text("cancellation_policy"),
  refundMethod: text("refund_method"),
  cancellationRules: jsonb("cancellation_rules"),
});

// Bookings table
export const bookings = pgTable("bookings", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  customerId: varchar("customer_id").references(() => users.id).notNull(),
  boatId: varchar("boat_id").references(() => boats.id).notNull(),
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date").notNull(),
  totalPrice: varchar("total_price", { length: 20 }),
  status: varchar("status", { length: 20 }).default("pending"), // pending, confirmed, cancelled
  specialRequests: text("special_requests"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Zod schemas for validation
export const insertUserSchema = createInsertSchema(users, {
  email: z.string().email("Email non valido"),
  password: z.string().min(6, "Password deve essere almeno 6 caratteri"),
  firstName: z.string().min(1, "Nome richiesto").optional(),
  lastName: z.string().min(1, "Cognome richiesto").optional(),
  phone: z.string().optional(),
  role: z.enum(["user", "owner"]).default("user"),
  businessName: z.string().optional(),
  businessType: z.string().optional(),
  vatNumber: z.string().optional(),
  website: z.string().url().optional().or(z.literal("")),
  instagram: z.string().optional(),
}).omit({ id: true, createdAt: true, updatedAt: true });

// Schema specifico per registrazione owner
export const insertOwnerSchema = insertUserSchema.extend({
  role: z.literal("owner"),
  businessName: z.string().min(1, "Nome attività richiesto"),
  phone: z.string().min(1, "Telefono richiesto"),
  vatNumber: z.string().min(1, "P.IVA/Codice Fiscale richiesto"),
});

// Schema specifico per registrazione user
export const insertUserOnlySchema = insertUserSchema.extend({
  role: z.literal("user"),
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
}).omit({ id: true, createdAt: true, updatedAt: true });

// Legacy exports for compatibility
export const insertMooringSchema = insertBoatSchema;
export const insertMooringBookingSchema = insertBookingSchema;

export type InsertUser = z.infer<typeof insertUserSchema>;
export type InsertBoat = z.infer<typeof insertBoatSchema>;
export type InsertBooking = z.infer<typeof insertBookingSchema>;
export type User = typeof users.$inferSelect;
export type Boat = typeof boats.$inferSelect;
export type Booking = typeof bookings.$inferSelect;