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
  passwordResetTokens,
  reviews,
  invoices,
  localFees,
  favorites,
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
  type PasswordResetToken,
  type Review,
  type InsertReview,
  type Invoice,
  type InsertInvoice,
  type LocalFee,
  type InsertLocalFee,
  type Favorite,
  type InsertFavorite,
  notifications,
  type Notification,
  type InsertNotification,
} from "@shared/schema";
import { db } from "./db";
import { eq, sql, and, gte, lte, or, ilike } from "drizzle-orm";
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
  
  // Password reset operations
  createPasswordResetToken(userId: number, token: string, expiresAt: Date): Promise<PasswordResetToken>;
  getPasswordResetToken(token: string): Promise<PasswordResetToken | undefined>;
  markPasswordResetTokenUsed(token: string): Promise<void>;
  updateUserPassword(userId: number, hashedPassword: string): Promise<void>;
  
  // Review operations
  getReviewsByBooking(bookingId: number): Promise<Review[]>;
  getReviewsByUser(userId: number, asReviewer?: boolean): Promise<Review[]>;
  getReviewsByBoat(boatId: number): Promise<Review[]>;
  createReview(data: InsertReview): Promise<Review>;
  canUserReview(bookingId: number, userId: number, type: string): Promise<boolean>;
  
  // Invoice operations
  getInvoicesByUser(userId: number): Promise<Invoice[]>;
  getInvoicesByBooking(bookingId: number): Promise<Invoice[]>;
  createInvoice(data: InsertInvoice): Promise<Invoice>;
  getInvoice(id: number): Promise<Invoice | undefined>;
  generateInvoiceNumber(type: string): Promise<string>;
  
  // Local fees operations
  getAllLocalFees(): Promise<LocalFee[]>;
  getLocalFeesByRegion(region: string): Promise<LocalFee[]>;
  getLocalFeesByArea(region?: string, municipality?: string, port?: string): Promise<LocalFee[]>;
  createLocalFee(data: InsertLocalFee): Promise<LocalFee>;
  updateLocalFee(id: number, data: Partial<InsertLocalFee>): Promise<LocalFee | undefined>;
  
  // Favorites operations
  getFavoritesByUser(userId: number): Promise<Favorite[]>;
  addFavorite(data: InsertFavorite): Promise<Favorite>;
  removeFavorite(userId: number, itemType: string, itemId: number): Promise<boolean>;
  isFavorite(userId: number, itemType: string, itemId: number): Promise<boolean>;

  // Notification operations
  getNotificationsByUser(userId: number): Promise<Notification[]>;
  createNotification(data: InsertNotification): Promise<Notification>;
  markNotificationRead(id: number, userId: number): Promise<boolean>;
  markAllNotificationsRead(userId: number): Promise<void>;
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

  // Password reset operations
  async createPasswordResetToken(userId: number, token: string, expiresAt: Date): Promise<PasswordResetToken> {
    const [resetToken] = await db.insert(passwordResetTokens).values({
      userId,
      token,
      expiresAt,
    }).returning();
    return resetToken;
  }

  async getPasswordResetToken(token: string): Promise<PasswordResetToken | undefined> {
    const [resetToken] = await db.select().from(passwordResetTokens).where(eq(passwordResetTokens.token, token));
    return resetToken;
  }

  async markPasswordResetTokenUsed(token: string): Promise<void> {
    await db.update(passwordResetTokens).set({ usedAt: new Date() }).where(eq(passwordResetTokens.token, token));
  }

  async updateUserPassword(userId: number, hashedPassword: string): Promise<void> {
    await db.update(users).set({ password: hashedPassword }).where(eq(users.id, userId));
  }

  // Review operations
  async getReviewsByBooking(bookingId: number): Promise<Review[]> {
    return await db.select().from(reviews).where(eq(reviews.bookingId, bookingId));
  }

  async getReviewsByUser(userId: number, asReviewer: boolean = false): Promise<Review[]> {
    if (asReviewer) {
      return await db.select().from(reviews).where(eq(reviews.reviewerId, userId));
    }
    return await db.select().from(reviews).where(eq(reviews.revieweeId, userId));
  }

  async getReviewsByBoat(boatId: number): Promise<Review[]> {
    return await db.select().from(reviews).where(eq(reviews.boatId, boatId));
  }

  async createReview(data: InsertReview): Promise<Review> {
    const [review] = await db.insert(reviews).values(data).returning();
    return review;
  }

  async canUserReview(bookingId: number, userId: number, type: string): Promise<boolean> {
    // Check if booking exists and is completed
    const booking = await this.getBooking(bookingId);
    if (!booking || booking.status !== 'completed') {
      return false;
    }

    // Check if user is part of the booking
    if (type === 'customer_to_owner') {
      if (booking.customerId !== userId) return false;
    } else if (type === 'owner_to_customer') {
      const boat = await this.getBoat(booking.boatId);
      if (!boat || boat.hostId !== userId) return false;
    }

    // Check if review already exists
    const existingReviews = await db.select().from(reviews).where(
      and(
        eq(reviews.bookingId, bookingId),
        eq(reviews.reviewerId, userId),
        eq(reviews.type, type)
      )
    );
    
    return existingReviews.length === 0;
  }

  // Invoice operations
  async getInvoicesByUser(userId: number): Promise<Invoice[]> {
    return await db.select().from(invoices).where(eq(invoices.userId, userId));
  }

  async getInvoicesByBooking(bookingId: number): Promise<Invoice[]> {
    return await db.select().from(invoices).where(eq(invoices.bookingId, bookingId));
  }

  async createInvoice(data: InsertInvoice): Promise<Invoice> {
    const [invoice] = await db.insert(invoices).values(data).returning();
    return invoice;
  }

  async getInvoice(id: number): Promise<Invoice | undefined> {
    const [invoice] = await db.select().from(invoices).where(eq(invoices.id, id));
    return invoice;
  }

  async generateInvoiceNumber(type: string): Promise<string> {
    const year = new Date().getFullYear();
    const prefix = type === 'customer_receipt' ? 'RIC' : 'REP';
    
    // Get count of invoices of this type this year
    const countResult = await db.select({ count: sql<number>`count(*)` })
      .from(invoices)
      .where(sql`${invoices.type} = ${type} AND EXTRACT(YEAR FROM ${invoices.createdAt}) = ${year}`);
    
    const count = Number(countResult[0]?.count || 0) + 1;
    const paddedCount = count.toString().padStart(6, '0');
    
    return `${prefix}-${year}-${paddedCount}`;
  }

  // Local fees operations
  async getAllLocalFees(): Promise<LocalFee[]> {
    return await db.select().from(localFees).where(eq(localFees.isActive, true));
  }

  async getLocalFeesByRegion(region: string): Promise<LocalFee[]> {
    return await db.select().from(localFees).where(
      and(
        eq(localFees.isActive, true),
        ilike(localFees.region, `%${region}%`)
      )
    );
  }

  async getLocalFeesByArea(region?: string, municipality?: string, port?: string): Promise<LocalFee[]> {
    const conditions = [eq(localFees.isActive, true)];
    
    if (region) {
      conditions.push(ilike(localFees.region, `%${region}%`));
    }
    if (municipality) {
      conditions.push(
        or(
          ilike(localFees.municipality, `%${municipality}%`),
          sql`${localFees.municipality} IS NULL`
        )!
      );
    }
    if (port) {
      conditions.push(
        or(
          ilike(localFees.port, `%${port}%`),
          sql`${localFees.port} IS NULL`
        )!
      );
    }
    
    return await db.select().from(localFees).where(and(...conditions));
  }

  async createLocalFee(data: InsertLocalFee): Promise<LocalFee> {
    const [fee] = await db.insert(localFees).values(data).returning();
    return fee;
  }

  async updateLocalFee(id: number, data: Partial<InsertLocalFee>): Promise<LocalFee | undefined> {
    const [fee] = await db.update(localFees).set({
      ...data,
      updatedAt: new Date(),
    }).where(eq(localFees.id, id)).returning();
    return fee;
  }
  async getFavoritesByUser(userId: number): Promise<Favorite[]> {
    return await db.select().from(favorites).where(eq(favorites.userId, userId));
  }

  async addFavorite(data: InsertFavorite): Promise<Favorite> {
    const existing = await db.select().from(favorites).where(
      and(
        eq(favorites.userId, data.userId),
        eq(favorites.itemType, data.itemType),
        eq(favorites.itemId, data.itemId)
      )
    );
    if (existing.length > 0) return existing[0];
    const [fav] = await db.insert(favorites).values(data).returning();
    return fav;
  }

  async removeFavorite(userId: number, itemType: string, itemId: number): Promise<boolean> {
    const result = await db.delete(favorites).where(
      and(
        eq(favorites.userId, userId),
        eq(favorites.itemType, itemType),
        eq(favorites.itemId, itemId)
      )
    ).returning();
    return result.length > 0;
  }

  async isFavorite(userId: number, itemType: string, itemId: number): Promise<boolean> {
    const result = await db.select().from(favorites).where(
      and(
        eq(favorites.userId, userId),
        eq(favorites.itemType, itemType),
        eq(favorites.itemId, itemId)
      )
    );
    return result.length > 0;
  }

  async getNotificationsByUser(userId: number): Promise<Notification[]> {
    return await db.select().from(notifications)
      .where(eq(notifications.userId, userId))
      .orderBy(sql`${notifications.createdAt} DESC`)
      .limit(50);
  }

  async createNotification(data: InsertNotification): Promise<Notification> {
    const [notif] = await db.insert(notifications).values(data).returning();
    return notif;
  }

  async markNotificationRead(id: number, userId: number): Promise<boolean> {
    const result = await db.update(notifications)
      .set({ read: true })
      .where(and(eq(notifications.id, id), eq(notifications.userId, userId)))
      .returning();
    return result.length > 0;
  }

  async markAllNotificationsRead(userId: number): Promise<void> {
    await db.update(notifications)
      .set({ read: true })
      .where(and(eq(notifications.userId, userId), eq(notifications.read, false)));
  }
}

export const storage = new DatabaseStorage();