import { users, boats, bookings, reviews, messages, favorites, type User, type InsertUser, type Boat, type InsertBoat, type Booking, type InsertBooking, type Review, type InsertReview, type Message, type InsertMessage, type Favorite } from "@shared/schema";
import { db } from "./db";
import { eq, and, or, desc, asc, gte, lte, ilike, sql } from "drizzle-orm";
import session from "express-session";
import connectPg from "connect-pg-simple";
import { pool } from "./db";

const PostgresSessionStore = connectPg(session);

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, updates: Partial<User>): Promise<User>;

  // Boat methods
  getBoat(id: number): Promise<Boat | undefined>;
  getBoats(filters?: {
    type?: string;
    location?: string;
    startDate?: Date;
    endDate?: Date;
    maxPersons?: number;
    skipperRequired?: boolean;
    fuelIncluded?: boolean;
    ownerId?: number;
  }): Promise<Boat[]>;
  createBoat(boat: InsertBoat): Promise<Boat>;
  updateBoat(id: number, updates: Partial<Boat>): Promise<Boat>;
  deleteBoat(id: number): Promise<void>;

  // Booking methods
  getBooking(id: number): Promise<Booking | undefined>;
  getBookings(filters?: {
    customerId?: number;
    boatId?: number;
    ownerId?: number;
    status?: string;
  }): Promise<Booking[]>;
  createBooking(booking: InsertBooking): Promise<Booking>;
  updateBooking(id: number, updates: Partial<Booking>): Promise<Booking>;

  // Review methods
  getReviews(filters?: {
    bookingId?: number;
    revieweeId?: number;
    type?: string;
  }): Promise<Review[]>;
  createReview(review: InsertReview): Promise<Review>;

  // Message methods
  getMessages(filters?: {
    senderId?: number;
    receiverId?: number;
    bookingId?: number;
  }): Promise<Message[]>;
  createMessage(message: InsertMessage): Promise<Message>;
  markMessageAsRead(id: number): Promise<void>;

  // Favorite methods
  getFavorites(userId: number): Promise<Favorite[]>;
  addFavorite(userId: number, boatId: number): Promise<Favorite>;
  removeFavorite(userId: number, boatId: number): Promise<void>;

  // Session store
  sessionStore: connectPg.PGStore;
}

export class DatabaseStorage implements IStorage {
  sessionStore: connectPg.PGStore;

  constructor() {
    this.sessionStore = new PostgresSessionStore({ 
      pool, 
      createTableIfMissing: true 
    });
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  async updateUser(id: number, updates: Partial<User>): Promise<User> {
    const [user] = await db
      .update(users)
      .set(updates)
      .where(eq(users.id, id))
      .returning();
    return user;
  }

  // Boat methods
  async getBoat(id: number): Promise<Boat | undefined> {
    const [boat] = await db.select().from(boats).where(eq(boats.id, id));
    return boat || undefined;
  }

  async getBoats(filters?: {
    type?: string;
    location?: string;
    startDate?: Date;
    endDate?: Date;
    maxPersons?: number;
    skipperRequired?: boolean;
    fuelIncluded?: boolean;
    ownerId?: number;
  }): Promise<Boat[]> {
    const conditions = [eq(boats.active, true)];

    if (filters?.type) {
      conditions.push(eq(boats.type, filters.type as any));
    }
    if (filters?.location) {
      conditions.push(ilike(boats.port, `%${filters.location}%`));
    }
    if (filters?.maxPersons) {
      conditions.push(gte(boats.maxPersons, filters.maxPersons));
    }
    if (filters?.skipperRequired !== undefined) {
      conditions.push(eq(boats.skipperRequired, filters.skipperRequired));
    }
    if (filters?.ownerId) {
      conditions.push(eq(boats.ownerId, filters.ownerId));
    }

    return await db.select().from(boats).where(and(...conditions));
  }

  async createBoat(boat: InsertBoat): Promise<Boat> {
    const [newBoat] = await db
      .insert(boats)
      .values(boat)
      .returning();
    return newBoat;
  }

  async updateBoat(id: number, updates: Partial<Boat>): Promise<Boat> {
    const [boat] = await db
      .update(boats)
      .set(updates)
      .where(eq(boats.id, id))
      .returning();
    return boat;
  }

  async deleteBoat(id: number): Promise<void> {
    await db.update(boats).set({ active: false }).where(eq(boats.id, id));
  }

  // Booking methods
  async getBooking(id: number): Promise<Booking | undefined> {
    const [booking] = await db.select().from(bookings).where(eq(bookings.id, id));
    return booking || undefined;
  }

  async getBookings(filters?: {
    customerId?: number;
    boatId?: number;
    ownerId?: number;
    status?: string;
  }): Promise<Booking[]> {
    const conditions = [];

    if (filters?.customerId) {
      conditions.push(eq(bookings.customerId, filters.customerId));
    }
    if (filters?.boatId) {
      conditions.push(eq(bookings.boatId, filters.boatId));
    }
    if (filters?.status) {
      conditions.push(eq(bookings.status, filters.status as any));
    }

    let query = db.select().from(bookings);
    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }

    return await query.orderBy(desc(bookings.createdAt));
  }

  async createBooking(booking: InsertBooking): Promise<Booking> {
    const commission = Number(booking.totalPrice) * 0.15; // 15% commission
    const [newBooking] = await db
      .insert(bookings)
      .values({ ...booking, commission: commission.toString() })
      .returning();
    return newBooking;
  }

  async updateBooking(id: number, updates: Partial<Booking>): Promise<Booking> {
    const [booking] = await db
      .update(bookings)
      .set(updates)
      .where(eq(bookings.id, id))
      .returning();
    return booking;
  }

  // Review methods
  async getReviews(filters?: {
    bookingId?: number;
    revieweeId?: number;
    type?: string;
  }): Promise<Review[]> {
    const conditions = [];

    if (filters?.bookingId) {
      conditions.push(eq(reviews.bookingId, filters.bookingId));
    }
    if (filters?.revieweeId) {
      conditions.push(eq(reviews.revieweeId, filters.revieweeId));
    }
    if (filters?.type) {
      conditions.push(eq(reviews.type, filters.type));
    }

    let query = db.select().from(reviews);
    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }

    return await query.orderBy(desc(reviews.createdAt));
  }

  async createReview(review: InsertReview): Promise<Review> {
    const [newReview] = await db
      .insert(reviews)
      .values(review)
      .returning();
    return newReview;
  }

  // Message methods
  async getMessages(filters?: {
    senderId?: number;
    receiverId?: number;
    bookingId?: number;
  }): Promise<Message[]> {
    const conditions = [];

    if (filters?.senderId && filters?.receiverId) {
      conditions.push(
        or(
          and(eq(messages.senderId, filters.senderId), eq(messages.receiverId, filters.receiverId)),
          and(eq(messages.senderId, filters.receiverId), eq(messages.receiverId, filters.senderId))
        )
      );
    } else if (filters?.senderId) {
      conditions.push(eq(messages.senderId, filters.senderId));
    } else if (filters?.receiverId) {
      conditions.push(eq(messages.receiverId, filters.receiverId));
    }

    if (filters?.bookingId) {
      conditions.push(eq(messages.bookingId, filters.bookingId));
    }

    let query = db.select().from(messages);
    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }

    return await query.orderBy(asc(messages.createdAt));
  }

  async createMessage(message: InsertMessage): Promise<Message> {
    const [newMessage] = await db
      .insert(messages)
      .values(message)
      .returning();
    return newMessage;
  }

  async markMessageAsRead(id: number): Promise<void> {
    await db
      .update(messages)
      .set({ status: "read" })
      .where(eq(messages.id, id));
  }

  // Favorite methods
  async getFavorites(userId: number): Promise<Favorite[]> {
    return await db.select().from(favorites).where(eq(favorites.userId, userId));
  }

  async addFavorite(userId: number, boatId: number): Promise<Favorite> {
    const [favorite] = await db
      .insert(favorites)
      .values({ userId, boatId })
      .returning();
    return favorite;
  }

  async removeFavorite(userId: number, boatId: number): Promise<void> {
    await db
      .delete(favorites)
      .where(and(eq(favorites.userId, userId), eq(favorites.boatId, boatId)));
  }
}

export const storage = new DatabaseStorage();
