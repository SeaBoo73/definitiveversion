import { sql } from 'drizzle-orm';
import {
  index,
  jsonb,
  pgTable,
  timestamp,
  varchar,
  text,
  boolean,
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

// User storage table.
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: varchar("email", { length: 255 }).unique().notNull(),
  password: varchar("password", { length: 255 }).notNull(),
  firstName: varchar("first_name", { length: 100 }),
  lastName: varchar("last_name", { length: 100 }),
  phone: varchar("phone", { length: 20 }),
  dateOfBirth: timestamp("date_of_birth"),
  profileImageUrl: varchar("profile_image_url"),
  userType: varchar("user_type", { length: 20 }).default("customer"), // 'customer' or 'host'
  isEmailVerified: boolean("is_email_verified").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Boats table for hosts
export const boats = pgTable("boats", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  hostId: varchar("host_id").references(() => users.id).notNull(),
  name: varchar("name", { length: 200 }).notNull(),
  description: text("description"),
  type: varchar("type", { length: 50 }).notNull(), // yacht, sailboat, catamaran, etc.
  capacity: varchar("capacity", { length: 20 }),
  location: varchar("location", { length: 200 }).notNull(),
  pricePerDay: varchar("price_per_day", { length: 20 }),
  images: text("images").array(),
  amenities: text("amenities").array(),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
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
}).omit({ id: true, createdAt: true, updatedAt: true });

export const loginSchema = z.object({
  email: z.string().email("Email non valido"),
  password: z.string().min(1, "Password richiesta"),
});

export const insertBoatSchema = createInsertSchema(boats, {
  name: z.string().min(1, "Nome richiesto"),
  type: z.string().min(1, "Tipo richiesto"),
  location: z.string().min(1, "Località richiesta"),
}).omit({ id: true, createdAt: true, updatedAt: true });

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