import { users, boats, bookings, reviews, conversations, messages, favorites, type User, type InsertUser, type Boat, type InsertBoat, type Booking, type InsertBooking, type Review, type InsertReview, type Conversation, type InsertConversation, type Message, type InsertMessage, type Favorite } from "@shared/schema";
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

  // Conversation methods
  getConversation(id: number): Promise<Conversation | undefined>;
  getConversationByBooking(bookingId: number): Promise<Conversation | undefined>;
  createConversation(conversation: InsertConversation): Promise<Conversation>;
  updateConversation(id: number, updates: Partial<Conversation>): Promise<Conversation>;

  // Message methods
  getMessages(conversationId: number): Promise<Message[]>;
  createMessage(message: InsertMessage): Promise<Message>;
  markMessageAsRead(messageId: number): Promise<void>;
  getUnreadMessagesCount(userId: number): Promise<number>;

  // Legacy message methods (keeping for compatibility)
  getLegacyMessages(filters?: {
    senderId?: number;
    receiverId?: number;
    bookingId?: number;
  }): Promise<Message[]>;

  // Favorite methods
  getFavorites(userId: number): Promise<Favorite[]>;
  addFavorite(userId: number, boatId: number): Promise<Favorite>;
  removeFavorite(userId: number, boatId: number): Promise<void>;

  // Notification methods
  getNotifications(userId: number): Promise<Notification[]>;
  createNotification(notification: any): Promise<Notification>;
  markNotificationAsRead(notificationId: number): Promise<void>;
  markAllNotificationsAsRead(userId: number): Promise<void>;

  // Promotion methods
  getActivePromotions(): Promise<Promotion[]>;
  applyPromotion(code: string, totalAmount: number): Promise<Promotion>;

  // Review methods (enhanced)
  getReviews(boatId: number): Promise<any[]>;
  getReviewStats(boatId: number): Promise<any>;
  createReview(review: any): Promise<Review>;

  // Analytics methods
  getAnalytics(ownerId: number): Promise<Analytics[]>;

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

    if (conditions.length > 0) {
      return await db.select().from(bookings).where(and(...conditions)).orderBy(desc(bookings.createdAt));
    }
    
    return await db.select().from(bookings).orderBy(desc(bookings.createdAt));
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

    if (conditions.length > 0) {
      return await db.select().from(reviews).where(and(...conditions)).orderBy(desc(reviews.createdAt));
    }
    
    return await db.select().from(reviews).orderBy(desc(reviews.createdAt));
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

    if (conditions.length > 0) {
      return await db.select().from(messages).where(and(...conditions)).orderBy(asc(messages.createdAt));
    }
    
    return await db.select().from(messages).orderBy(asc(messages.createdAt));
  }

  // Conversation methods
  async getConversation(id: number) {
    const result = await db
      .select()
      .from(conversations)
      .where(eq(conversations.id, id))
      .limit(1);
    return result[0];
  }

  async getConversationByBooking(bookingId: number) {
    const result = await db
      .select()
      .from(conversations)
      .where(eq(conversations.bookingId, bookingId))
      .limit(1);
    return result[0];
  }

  async createConversation(conversation: InsertConversation) {
    const result = await db.insert(conversations).values(conversation).returning();
    return result[0];
  }

  async updateConversation(id: number, updates: Partial<Conversation>) {
    const result = await db
      .update(conversations)
      .set(updates)
      .where(eq(conversations.id, id))
      .returning();
    return result[0];
  }

  // Message methods with conversation support
  async getMessages(conversationId: number) {
    return await db
      .select({
        id: messages.id,
        conversationId: messages.conversationId,
        senderId: messages.senderId,
        content: messages.content,
        createdAt: messages.createdAt,
        readAt: messages.readAt,
        senderName: sql<string>`COALESCE(${users.firstName} || ' ' || ${users.lastName}, ${users.email})`,
        senderEmail: users.email
      })
      .from(messages)
      .innerJoin(users, eq(messages.senderId, users.id))
      .where(eq(messages.conversationId, conversationId))
      .orderBy(asc(messages.createdAt));
  }

  async createMessage(message: InsertMessage) {
    const result = await db.insert(messages).values(message).returning();
    
    // Update conversation last message time
    await db
      .update(conversations)
      .set({ lastMessageAt: new Date() })
      .where(eq(conversations.id, message.conversationId));
    
    return result[0];
  }

  async markMessageAsRead(messageId: number) {
    await db
      .update(messages)
      .set({ readAt: new Date() })
      .where(eq(messages.id, messageId));
  }

  async getUnreadMessagesCount(userId: number) {
    // Get conversations where the user is involved
    const userConversations = await db
      .select({ conversationId: conversations.id })
      .from(conversations)
      .innerJoin(bookings, eq(conversations.bookingId, bookings.id))
      .innerJoin(boats, eq(bookings.boatId, boats.id))
      .where(or(
        eq(bookings.customerId, userId),
        eq(boats.ownerId, userId)
      ));

    if (userConversations.length === 0) return 0;

    const conversationIds = userConversations.map(c => c.conversationId);
    
    const result = await db
      .select({ count: sql<number>`count(*)` })
      .from(messages)
      .where(
        and(
          sql`${messages.conversationId} = ANY(${conversationIds})`,
          sql`${messages.senderId} != ${userId}`,
          sql`${messages.readAt} IS NULL`
        )
      );

    return result[0]?.count || 0;
  }

  // Legacy message methods
  async getLegacyMessages(filters?: {
    senderId?: number;
    receiverId?: number;
    bookingId?: number;
  }) {
    const conditions = [];
    
    if (filters?.senderId && filters?.receiverId) {
      conditions.push(
        or(
          and(eq(messages.senderId, filters.senderId)),
          and(eq(messages.senderId, filters.receiverId))
        )
      );
    } else if (filters?.senderId) {
      conditions.push(eq(messages.senderId, filters.senderId));
    }

    if (conditions.length > 0) {
      return await db.select().from(messages).where(and(...conditions)).orderBy(asc(messages.createdAt));
    }
    
    return [];
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

  // New methods implementations
  async getNotifications(userId: number): Promise<any[]> {
    return [];
  }

  async createNotification(notification: any): Promise<any> {
    return notification;
  }

  async markNotificationAsRead(notificationId: number): Promise<void> {
    // Implementation placeholder
  }

  async markAllNotificationsAsRead(userId: number): Promise<void> {
    // Implementation placeholder
  }

  async getActivePromotions(): Promise<any[]> {
    return [];
  }

  async applyPromotion(code: string, totalAmount: number): Promise<any> {
    throw new Error("Invalid promotion code");
  }

  async getReviews(boatId: number): Promise<any[]> {
    return [];
  }

  async getReviewStats(boatId: number): Promise<any> {
    return {
      averageRating: 4.5,
      totalReviews: 0,
      distribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
      serviceRating: 4.5,
      cleanlinessRating: 4.5,
      valueRating: 4.5
    };
  }

  async getAnalytics(ownerId: number): Promise<any[]> {
    return [];
  }
}

export const storage = new DatabaseStorage();
