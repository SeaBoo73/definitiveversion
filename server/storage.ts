import {
  users,
  boats,
  bookings,
  boatAvailability,
  moorings,
  mooringAvailability,
  experiences,
  conversations,
  messages,
  type User,
  type InsertUser,
  type Boat,
  type InsertBoat,
  type Booking,
  type InsertBooking,
  type BoatAvailability,
  type InsertBoatAvailability,
  type Mooring,
  type InsertMooring,
  type MooringAvailability,
  type InsertMooringAvailability,
  type Experience,
  type InsertExperience,
  type Conversation,
  type InsertConversation,
  type Message,
  type InsertMessage,
} from "@shared/schema";
import { db } from "./db";
import { eq, sql, and, gte, lte } from "drizzle-orm";
import bcrypt from "bcryptjs";
import session from "express-session";
import connectPg from "connect-pg-simple";
import { pool } from "./db";

// Interface for storage operations
export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  verifyPassword(email: string, password: string): Promise<User | null>;
  updateUser(id: number, user: Partial<InsertUser>): Promise<User | undefined>;
  deleteUser(id: number): Promise<boolean>;
  sessionStore: session.Store;
  
  // Boat operations
  getBoats(): Promise<Boat[]>;
  getBoatsByOwner(ownerId: number): Promise<Boat[]>;
  getBoat(id: number): Promise<Boat | undefined>;
  createBoat(boat: InsertBoat): Promise<Boat>;
  updateBoat(id: number, boat: Partial<InsertBoat>): Promise<Boat | undefined>;
  deleteBoat(id: number): Promise<boolean>;
  
  // Booking operations
  getBookingsByOwner(ownerId: number): Promise<Booking[]>;
  getBookingsByCustomer(customerId: number): Promise<Booking[]>;
  createBooking(booking: InsertBooking): Promise<Booking>;
  
  // Boat Availability operations
  getBoatAvailability(boatId: number, startDate?: Date, endDate?: Date): Promise<BoatAvailability[]>;
  createAvailability(data: InsertBoatAvailability): Promise<BoatAvailability>;
  updateAvailability(id: number, data: Partial<InsertBoatAvailability>): Promise<BoatAvailability | undefined>;
  deleteAvailability(id: number): Promise<boolean>;
  
  // Mooring operations
  getMooringsByOwner(managerId: number): Promise<Mooring[]>;
  createMooring(data: InsertMooring): Promise<Mooring>;
  updateMooring(id: number, managerId: number, data: Partial<InsertMooring>): Promise<Mooring | undefined>;
  deleteMooring(id: number, managerId: number): Promise<boolean>;
  
  // Mooring availability operations
  getMooringAvailability(mooringId: number): Promise<MooringAvailability[]>;
  createMooringAvailability(data: InsertMooringAvailability): Promise<MooringAvailability>;
  updateMooringAvailability(id: number, data: Partial<InsertMooringAvailability>): Promise<MooringAvailability | undefined>;
  deleteMooringAvailability(id: number): Promise<boolean>;
  
  // Experience operations
  getExperiencesByOwner(hostId: number): Promise<Experience[]>;
  getExperiences(): Promise<Experience[]>;
  getExperience(id: number): Promise<Experience | undefined>;
  createExperience(data: InsertExperience & { hostId: number }): Promise<Experience>;
  updateExperience(id: number, hostId: number, data: Partial<InsertExperience>): Promise<Experience | undefined>;
  deleteExperience(id: number, hostId: number): Promise<boolean>;
  
  // Conversation operations
  getConversation(id: number): Promise<Conversation | undefined>;
  getConversationByBookingId(bookingId: number): Promise<Conversation | undefined>;
  createConversation(data: InsertConversation): Promise<Conversation>;
  updateConversationLastMessage(id: number): Promise<void>;
  
  // Message operations
  getMessages(conversationId: number): Promise<(Message & { senderName?: string; senderEmail?: string })[]>;
  createMessage(data: InsertMessage): Promise<Message>;
  getBooking(id: number): Promise<Booking | undefined>;
}

export class DatabaseStorage implements IStorage {
  public sessionStore: session.Store;

  constructor() {
    const PgStore = connectPg(session);
    this.sessionStore = new PgStore({
      pool: pool,
      tableName: 'sessions',
    });
  }
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
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

  async updateUser(id: number, userData: Partial<InsertUser>): Promise<User | undefined> {
    const [user] = await db
      .update(users)
      .set(userData)
      .where(eq(users.id, id))
      .returning();
    return user;
  }

  async deleteUser(id: number): Promise<boolean> {
    try {
      await db.delete(bookings).where(eq(bookings.customerId, id));
      await db.delete(boats).where(eq(boats.hostId, id));
      const result = await db.delete(users).where(eq(users.id, id));
      return (result.rowCount ?? 0) > 0;
    } catch (error) {
      console.error("Error deleting user:", error);
      return false;
    }
  }

  // Boat operations
  async getBoats(): Promise<Boat[]> {
    return await db.select().from(boats).where(eq(boats.active, true));
  }

  async getBoatsByOwner(ownerId: number): Promise<Boat[]> {
    return await db.select().from(boats).where(eq(boats.hostId, ownerId));
  }

  async getBoat(id: number): Promise<Boat | undefined> {
    const [boat] = await db.select().from(boats).where(eq(boats.id, id));
    return boat;
  }

  async createBoat(boatData: InsertBoat): Promise<Boat> {
    const [boat] = await db.insert(boats).values(boatData).returning();
    return boat;
  }

  async updateBoat(id: number, boatData: Partial<InsertBoat>): Promise<Boat | undefined> {
    const [boat] = await db
      .update(boats)
      .set(boatData)
      .where(eq(boats.id, id))
      .returning();
    return boat;
  }

  async deleteBoat(id: number): Promise<boolean> {
    const result = await db.delete(boats).where(eq(boats.id, id));
    return (result.rowCount ?? 0) > 0;
  }

  // Booking operations
  async getBookingsByOwner(ownerId: number): Promise<Booking[]> {
    // First get all boats owned by this owner
    const ownerBoats = await db
      .select({ id: boats.id })
      .from(boats)
      .where(eq(boats.hostId, ownerId));
    
    if (ownerBoats.length === 0) {
      return [];
    }
    
    const boatIds = ownerBoats.map(b => b.id);
    
    // Then get all bookings for those boats
    const results = await db
      .select()
      .from(bookings)
      .where(
        sql`${bookings.boatId} IN (${sql.join(boatIds.map(id => sql`${id}`), sql`, `)})`
      );
    
    return results;
  }

  async getBookingsByCustomer(customerId: number): Promise<Booking[]> {
    return await db.select().from(bookings).where(eq(bookings.customerId, customerId));
  }

  async createBooking(bookingData: InsertBooking): Promise<Booking> {
    const [booking] = await db.insert(bookings).values(bookingData).returning();
    return booking;
  }

  // Boat Availability operations
  async getBoatAvailability(boatId: number, startDate?: Date, endDate?: Date): Promise<BoatAvailability[]> {
    const conditions = [eq(boatAvailability.boatId, boatId)];
    
    if (startDate && endDate) {
      conditions.push(
        and(
          gte(boatAvailability.endDate, startDate),
          lte(boatAvailability.startDate, endDate)
        )!
      );
    }
    
    return await db
      .select()
      .from(boatAvailability)
      .where(and(...conditions));
  }

  async createAvailability(data: InsertBoatAvailability): Promise<BoatAvailability> {
    const [availability] = await db
      .insert(boatAvailability)
      .values(data)
      .returning();
    return availability;
  }

  async updateAvailability(id: number, data: Partial<InsertBoatAvailability>): Promise<BoatAvailability | undefined> {
    const [availability] = await db
      .update(boatAvailability)
      .set(data)
      .where(eq(boatAvailability.id, id))
      .returning();
    return availability;
  }

  async deleteAvailability(id: number): Promise<boolean> {
    const result = await db.delete(boatAvailability).where(eq(boatAvailability.id, id));
    return (result.rowCount ?? 0) > 0;
  }

  // Mooring operations
  async getMooringsByOwner(managerId: number): Promise<Mooring[]> {
    return await db.select().from(moorings).where(eq(moorings.managerId, managerId));
  }

  async createMooring(data: InsertMooring): Promise<Mooring> {
    const [mooring] = await db.insert(moorings).values(data).returning();
    return mooring;
  }

  async updateMooring(id: number, managerId: number, data: Partial<InsertMooring>): Promise<Mooring | undefined> {
    const [mooring] = await db
      .update(moorings)
      .set(data)
      .where(and(eq(moorings.id, id), eq(moorings.managerId, managerId)))
      .returning();
    return mooring;
  }

  async deleteMooring(id: number, managerId: number): Promise<boolean> {
    const result = await db
      .delete(moorings)
      .where(and(eq(moorings.id, id), eq(moorings.managerId, managerId)));
    return (result.rowCount ?? 0) > 0;
  }

  // Mooring availability operations
  async getMooringAvailability(mooringId: number): Promise<MooringAvailability[]> {
    return await db
      .select()
      .from(mooringAvailability)
      .where(eq(mooringAvailability.mooringId, mooringId));
  }

  async createMooringAvailability(data: InsertMooringAvailability): Promise<MooringAvailability> {
    const [availability] = await db
      .insert(mooringAvailability)
      .values(data)
      .returning();
    return availability;
  }

  async updateMooringAvailability(id: number, data: Partial<InsertMooringAvailability>): Promise<MooringAvailability | undefined> {
    const [availability] = await db
      .update(mooringAvailability)
      .set(data)
      .where(eq(mooringAvailability.id, id))
      .returning();
    return availability;
  }

  async deleteMooringAvailability(id: number): Promise<boolean> {
    const result = await db.delete(mooringAvailability).where(eq(mooringAvailability.id, id));
    return (result.rowCount ?? 0) > 0;
  }

  // Experience operations
  async getExperiencesByOwner(hostId: number): Promise<Experience[]> {
    return await db.select().from(experiences).where(eq(experiences.hostId, hostId));
  }

  async getExperiences(): Promise<Experience[]> {
    return await db.select().from(experiences).where(eq(experiences.active, true));
  }

  async getExperience(id: number): Promise<Experience | undefined> {
    const [experience] = await db.select().from(experiences).where(eq(experiences.id, id));
    return experience;
  }

  async createExperience(data: InsertExperience & { hostId: number }): Promise<Experience> {
    const [experience] = await db.insert(experiences).values(data).returning();
    return experience;
  }

  async updateExperience(id: number, hostId: number, data: Partial<InsertExperience>): Promise<Experience | undefined> {
    const [experience] = await db
      .update(experiences)
      .set(data)
      .where(and(eq(experiences.id, id), eq(experiences.hostId, hostId)))
      .returning();
    return experience;
  }

  async deleteExperience(id: number, hostId: number): Promise<boolean> {
    const result = await db
      .delete(experiences)
      .where(and(eq(experiences.id, id), eq(experiences.hostId, hostId)));
    return (result.rowCount ?? 0) > 0;
  }

  // Conversation operations
  async getConversation(id: number): Promise<Conversation | undefined> {
    const [conversation] = await db.select().from(conversations).where(eq(conversations.id, id));
    return conversation;
  }

  async getConversationByBookingId(bookingId: number): Promise<Conversation | undefined> {
    const [conversation] = await db.select().from(conversations).where(eq(conversations.bookingId, bookingId));
    return conversation;
  }

  async createConversation(data: InsertConversation): Promise<Conversation> {
    const [conversation] = await db.insert(conversations).values(data).returning();
    return conversation;
  }

  async updateConversationLastMessage(id: number): Promise<void> {
    await db.update(conversations).set({ lastMessageAt: new Date() }).where(eq(conversations.id, id));
  }

  // Message operations
  async getMessages(conversationId: number): Promise<(Message & { senderName?: string; senderEmail?: string })[]> {
    const messagesList = await db.select().from(messages).where(eq(messages.conversationId, conversationId));
    
    // Get sender info for each message
    const messagesWithSenders = await Promise.all(
      messagesList.map(async (msg) => {
        const sender = await this.getUser(msg.senderId);
        return {
          ...msg,
          senderName: sender ? `${sender.firstName || ''} ${sender.lastName || ''}`.trim() || sender.username : undefined,
          senderEmail: sender?.email
        };
      })
    );
    
    return messagesWithSenders;
  }

  async createMessage(data: InsertMessage): Promise<Message> {
    const [message] = await db.insert(messages).values(data).returning();
    return message;
  }

  async getBooking(id: number): Promise<Booking | undefined> {
    const [booking] = await db.select().from(bookings).where(eq(bookings.id, id));
    return booking;
  }
}

export const storage = new DatabaseStorage();