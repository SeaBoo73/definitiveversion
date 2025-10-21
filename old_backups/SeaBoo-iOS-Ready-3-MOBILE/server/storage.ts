import {
  users,
  boats,
  bookings,
  type User,
  type InsertUser,
  type Boat,
  type InsertBoat,
  type Booking,
  type InsertBooking,
} from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";

// Interface for storage operations
export interface IStorage {
  // User operations
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  verifyPassword(email: string, password: string): Promise<User | null>;
  
  // Boat operations
  getBoats(): Promise<Boat[]>;
  getBoatsByOwner(ownerId: string): Promise<Boat[]>;
  getBoat(id: string): Promise<Boat | undefined>;
  createBoat(boat: InsertBoat): Promise<Boat>;
  updateBoat(id: string, boat: Partial<InsertBoat>): Promise<Boat | undefined>;
  deleteBoat(id: string): Promise<boolean>;
  
  // Booking operations
  getBookingsByOwner(ownerId: string): Promise<Booking[]>;
  getBookingsByCustomer(customerId: string): Promise<Booking[]>;
  createBooking(booking: InsertBooking): Promise<Booking>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, parseInt(id)));
    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }

  async createUser(userData: InsertUser): Promise<User> {
    // Hash password before storing
    const hashedPassword = await bcrypt.hash(userData.password, 12);
    
    // Generate username from email if not provided
    const username = userData.username || userData.email.split('@')[0];
    
    const [user] = await db
      .insert(users)
      .values({
        ...userData,
        username,
        password: hashedPassword,
      })
      .returning();
    return user;
  }

  async verifyPassword(email: string, password: string): Promise<User | null> {
    const user = await this.getUserByEmail(email);
    if (!user) return null;

    const isValid = await bcrypt.compare(password, user.password);
    return isValid ? user : null;
  }

  // Boat operations
  async getBoats(): Promise<Boat[]> {
    return await db.select().from(boats).where(eq(boats.active, true));
  }

  async getBoatsByOwner(ownerId: string): Promise<Boat[]> {
    return await db.select().from(boats).where(eq(boats.hostId, parseInt(ownerId)));
  }

  async getBoat(id: string): Promise<Boat | undefined> {
    const [boat] = await db.select().from(boats).where(eq(boats.id, parseInt(id)));
    return boat;
  }

  async createBoat(boatData: InsertBoat): Promise<Boat> {
    const [boat] = await db.insert(boats).values(boatData).returning();
    return boat;
  }

  async updateBoat(id: string, boatData: Partial<InsertBoat>): Promise<Boat | undefined> {
    const [boat] = await db
      .update(boats)
      .set(boatData)
      .where(eq(boats.id, parseInt(id)))
      .returning();
    return boat;
  }

  async deleteBoat(id: string): Promise<boolean> {
    const result = await db.delete(boats).where(eq(boats.id, parseInt(id)));
    return (result.rowCount ?? 0) > 0;
  }

  // Booking operations
  async getBookingsByOwner(ownerId: string): Promise<Booking[]> {
    const results = await db
      .select({
        id: bookings.id,
        createdAt: bookings.createdAt,
        customerId: bookings.customerId,
        boatId: bookings.boatId,
        startDate: bookings.startDate,
        endDate: bookings.endDate,
        totalPrice: bookings.totalPrice,
        status: bookings.status,
        specialRequests: bookings.specialRequests,
        updatedAt: bookings.updatedAt,
      })
      .from(bookings)
      .innerJoin(boats, eq(bookings.boatId, boats.id))
      .where(eq(boats.hostId, parseInt(ownerId)));
    return results;
  }

  async getBookingsByCustomer(customerId: string): Promise<Booking[]> {
    return await db.select().from(bookings).where(eq(bookings.customerId, customerId));
  }

  async createBooking(bookingData: InsertBooking): Promise<Booking> {
    const [booking] = await db.insert(bookings).values(bookingData).returning();
    return booking;
  }
}

export const storage = new DatabaseStorage();