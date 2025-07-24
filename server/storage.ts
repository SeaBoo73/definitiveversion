import { 
  users, boats, bookings, reviews, conversations, messages, favorites, discounts, userDiscounts, documents,
  notifications, promotions, analytics, emergencies, dynamicPricing, boatFeatures, availability, weatherData,
  bookingRules, bookingLocks, priceHistory, conversationParticipants, messageReactions, messageReads, 
  chatNotifications, chatAttachments,
  type User, type InsertUser, type Boat, type InsertBoat, type Booking, type InsertBooking, 
  type Review, type InsertReview, type Conversation, type InsertConversation, 
  type Message, type InsertMessage, type Favorite, type Discount, type UserDiscount, 
  type Document, type InsertDiscount, type InsertDocument,
  type Notification, type InsertNotification, type Promotion, type InsertPromotion,
  type Analytics, type InsertAnalytics, type Emergency, type InsertEmergency,
  type DynamicPricing, type InsertDynamicPricing, type BoatFeature, type InsertBoatFeature,
  type Availability, type InsertAvailability, type WeatherData,
  type BookingRule, type InsertBookingRule, type BookingLock, type InsertBookingLock,
  type PriceHistory, type InsertPriceHistory, type ConversationParticipant, type InsertConversationParticipant,
  type MessageReaction, type InsertMessageReaction, type MessageRead, type InsertMessageRead,
  type ChatNotification, type InsertChatNotification, type ChatAttachment, type InsertChatAttachment
} from "@shared/schema";
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
  getMessage(id: number): Promise<Message | undefined>;
  createMessage(message: InsertMessage): Promise<Message>;
  getMessageWithDetails(id: number): Promise<any>;
  markMessageAsRead(messageId: number, userId: number): Promise<void>;
  
  // Enhanced Conversation methods
  getUserConversations(userId: number): Promise<any[]>;
  getConversationParticipants(conversationId: number): Promise<ConversationParticipant[]>;
  addConversationParticipant(participant: InsertConversationParticipant): Promise<ConversationParticipant>;
  isUserInConversation(conversationId: number, userId: number): Promise<boolean>;
  getUserRoleInConversation(conversationId: number, userId: number): Promise<string | null>;
  updateConversationLastMessage(conversationId: number): Promise<void>;
  getConversationMessages(conversationId: number, page: number, limit: number): Promise<Message[]>;
  
  // Message Reactions
  addMessageReaction(reaction: InsertMessageReaction): Promise<MessageReaction>;
  
  // Chat Notifications
  createChatNotification(notification: InsertChatNotification): Promise<ChatNotification>;
  getUnreadNotifications(userId: number): Promise<ChatNotification[]>;
  markNotificationAsRead(notificationId: number, userId: number): Promise<void>;
  
  // Chat Attachments
  createChatAttachment(attachment: InsertChatAttachment): Promise<ChatAttachment>;
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

  // Discount and loyalty methods
  getAvailableDiscounts(customerLevel: string): Promise<Discount[]>;
  applyDiscount(code: string, totalPrice: number, customerLevel: string, userId: number): Promise<any>;
  updateUserLoyalty(userId: number, totalSpent: string, pointsEarned: number): Promise<User>;

  // Document methods
  getDocuments(bookingId: number): Promise<Document[]>;
  createDocument(document: InsertDocument): Promise<Document>;
  updateDocument(documentId: number, updates: Partial<Document>): Promise<Document>;

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

  // Advanced Availability Management methods
  getBoatAvailability(boatId: number, startDate: Date, endDate: Date): Promise<Availability[]>;
  createAvailability(availability: InsertAvailability): Promise<Availability>;
  updateAvailability(id: number, updates: Partial<Availability>): Promise<Availability>;
  bulkUpdateAvailability(boatId: number, dateRanges: { startDate: Date; endDate: Date }[], updates: Partial<Availability>): Promise<{ updated: number }>;
  
  // Dynamic Pricing methods
  calculateDynamicPricing(boatId: number, startDate: Date, endDate: Date, days: number): Promise<{
    basePrice: number;
    finalPrice: number;
    seasonMultiplier: number;
    demandMultiplier: number;
    appliedDiscounts: any[];
    savings: number;
  }>;
  createPriceHistory(priceHistory: InsertPriceHistory): Promise<PriceHistory>;
  getPricingHistory(boatId: number, startDate?: Date, endDate?: Date): Promise<PriceHistory[]>;
  
  // Booking Rules methods
  getBookingRules(boatId: number): Promise<BookingRule[]>;
  createBookingRule(rule: InsertBookingRule): Promise<BookingRule>;
  updateBookingRule(id: number, updates: Partial<BookingRule>): Promise<BookingRule>;
  calculateApplicableDiscounts(boatId: number, startDate: Date, endDate: Date, userId?: number): Promise<{
    rules: BookingRule[];
    totalDiscount: number;
    savings: number;
  }>;
  
  // Booking Lock methods (real-time availability)
  createBookingLock(lock: InsertBookingLock): Promise<BookingLock>;
  releaseBookingLock(lockId: number, userId: number): Promise<void>;
  checkDateAvailability(boatId: number, startDate: Date, endDate: Date): Promise<boolean>;
  cleanupExpiredLocks(): Promise<number>;

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

  // Get messages by conversation
  async getConversationMessages(conversationId: number) {
    return await db
      .select({
        id: messages.id,
        conversationId: messages.conversationId,
        senderId: messages.senderId,
        content: messages.content,
        createdAt: messages.createdAt,
        senderName: sql<string>`COALESCE(${users.firstName} || ' ' || ${users.lastName}, ${users.email})`,
        senderEmail: users.email
      })
      .from(messages)
      .innerJoin(users, eq(messages.senderId, users.id))
      .where(eq(messages.conversationId, conversationId))
      .orderBy(asc(messages.createdAt));
  }

  async createMessage(message: InsertMessage): Promise<Message> {
    const result = await db.insert(messages).values(message).returning();
    
    // Update conversation last message time
    await db
      .update(conversations)
      .set({ lastMessageAt: new Date() })
      .where(eq(conversations.id, message.conversationId));
    
    return result[0];
  }

  async getMessage(id: number): Promise<Message | undefined> {
    const [message] = await db.select().from(messages).where(eq(messages.id, id));
    return message || undefined;
  }

  async getMessageWithDetails(id: number): Promise<any> {
    const result = await db
      .select({
        id: messages.id,
        conversationId: messages.conversationId,
        senderId: messages.senderId,
        content: messages.content,
        type: messages.type,
        attachments: messages.attachments,
        status: messages.status,
        createdAt: messages.createdAt,
        sender: {
          id: users.id,
          firstName: users.firstName,
          lastName: users.lastName,
          username: users.username
        }
      })
      .from(messages)
      .leftJoin(users, eq(messages.senderId, users.id))
      .where(eq(messages.id, id));
    
    return result[0] || null;
  }

  async markMessageAsRead(messageId: number, userId: number): Promise<void> {
    await db
      .insert(messageReads)
      .values({ messageId, userId })
      .onConflictDoNothing();
  }

  // Enhanced Conversation methods
  async getUserConversations(userId: number): Promise<any[]> {
    const result = await db
      .select({
        id: conversations.id,
        type: conversations.type,
        title: conversations.title,
        isGroup: conversations.isGroup,
        lastMessageAt: conversations.lastMessageAt,
        booking: {
          id: bookings.id,
          boatId: bookings.boatId,
          startDate: bookings.startDate,
          endDate: bookings.endDate
        }
      })
      .from(conversations)
      .leftJoin(conversationParticipants, eq(conversations.id, conversationParticipants.conversationId))
      .leftJoin(bookings, eq(conversations.bookingId, bookings.id))
      .where(and(
        eq(conversationParticipants.userId, userId),
        eq(conversationParticipants.isActive, true),
        eq(conversations.active, true)
      ))
      .orderBy(desc(conversations.lastMessageAt));
    
    return result;
  }

  async getConversationParticipants(conversationId: number): Promise<ConversationParticipant[]> {
    const participants = await db
      .select()
      .from(conversationParticipants)
      .where(and(
        eq(conversationParticipants.conversationId, conversationId),
        eq(conversationParticipants.isActive, true)
      ));
    
    return participants;
  }

  async addConversationParticipant(participant: InsertConversationParticipant): Promise<ConversationParticipant> {
    const [newParticipant] = await db
      .insert(conversationParticipants)
      .values(participant)
      .returning();
    
    return newParticipant;
  }

  async isUserInConversation(conversationId: number, userId: number): Promise<boolean> {
    const [participant] = await db
      .select()
      .from(conversationParticipants)
      .where(and(
        eq(conversationParticipants.conversationId, conversationId),
        eq(conversationParticipants.userId, userId),
        eq(conversationParticipants.isActive, true)
      ));
    
    return !!participant;
  }

  async getUserRoleInConversation(conversationId: number, userId: number): Promise<string | null> {
    const [participant] = await db
      .select({ role: conversationParticipants.role })
      .from(conversationParticipants)
      .where(and(
        eq(conversationParticipants.conversationId, conversationId),
        eq(conversationParticipants.userId, userId),
        eq(conversationParticipants.isActive, true)
      ));
    
    return participant?.role || null;
  }

  async updateConversationLastMessage(conversationId: number): Promise<void> {
    await db
      .update(conversations)
      .set({ lastMessageAt: new Date() })
      .where(eq(conversations.id, conversationId));
  }

  async getConversationMessages(conversationId: number, page: number, limit: number): Promise<Message[]> {
    const offset = (page - 1) * limit;
    
    const result = await db
      .select({
        id: messages.id,
        conversationId: messages.conversationId,
        senderId: messages.senderId,
        content: messages.content,
        type: messages.type,
        attachments: messages.attachments,
        status: messages.status,
        createdAt: messages.createdAt,
        sender: {
          id: users.id,
          firstName: users.firstName,
          lastName: users.lastName,
          username: users.username
        }
      })
      .from(messages)
      .leftJoin(users, eq(messages.senderId, users.id))
      .where(eq(messages.conversationId, conversationId))
      .orderBy(desc(messages.createdAt))
      .limit(limit)
      .offset(offset);
    
    return result as any[];
  }

  // Message Reactions
  async addMessageReaction(reaction: InsertMessageReaction): Promise<MessageReaction> {
    const [newReaction] = await db
      .insert(messageReactions)
      .values(reaction)
      .onConflictDoUpdate({
        target: [messageReactions.messageId, messageReactions.userId],
        set: { emoji: reaction.emoji }
      })
      .returning();
    
    return newReaction;
  }

  // Chat Notifications
  async createChatNotification(notification: InsertChatNotification): Promise<ChatNotification> {
    const [newNotification] = await db
      .insert(chatNotifications)
      .values(notification)
      .returning();
    
    return newNotification;
  }

  async getUnreadNotifications(userId: number): Promise<ChatNotification[]> {
    const notifs = await db
      .select()
      .from(chatNotifications)
      .where(and(
        eq(chatNotifications.userId, userId),
        eq(chatNotifications.read, false)
      ))
      .orderBy(desc(chatNotifications.createdAt));
    
    return notifs;
  }

  async markNotificationAsRead(notificationId: number, userId: number): Promise<void> {
    await db
      .update(chatNotifications)
      .set({ read: true })
      .where(and(
        eq(chatNotifications.id, notificationId),
        eq(chatNotifications.userId, userId)
      ));
  }

  // Chat Attachments
  async createChatAttachment(attachment: InsertChatAttachment): Promise<ChatAttachment> {
    const [newAttachment] = await db
      .insert(chatAttachments)
      .values(attachment)
      .returning();
    
    return newAttachment;
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

  // Discount and loyalty methods implementation
  async getAvailableDiscounts(customerLevel: string): Promise<Discount[]> {
    const discountsList = await db
      .select()
      .from(discounts)
      .where(
        and(
          eq(discounts.active, true),
          gte(discounts.validTo, new Date()),
          lte(discounts.validFrom, new Date()),
          or(
            eq(discounts.requiredLevel, customerLevel),
            eq(discounts.requiredLevel, 'bronze') // Bronze accessible to all
          )
        )
      );
    return discountsList;
  }

  async applyDiscount(code: string, totalPrice: number, customerLevel: string, userId: number): Promise<any> {
    const [discount] = await db
      .select()
      .from(discounts)
      .where(
        and(
          eq(discounts.code, code),
          eq(discounts.active, true),
          gte(discounts.validTo, new Date()),
          lte(discounts.validFrom, new Date())
        )
      );

    if (!discount) {
      throw new Error("Codice sconto non valido o scaduto");
    }

    // Check if user can use this discount level
    const levelOrder = { bronze: 0, silver: 1, gold: 2, platinum: 3 };
    if (levelOrder[discount.requiredLevel] > levelOrder[customerLevel]) {
      throw new Error(`Questo sconto richiede il livello ${discount.requiredLevel}`);
    }

    // Check minimum spend
    if (parseFloat(discount.minSpent) > totalPrice) {
      throw new Error(`Spesa minima richiesta: €${discount.minSpent}`);
    }

    // Check usage limit
    if (discount.usedCount >= discount.usageLimit) {
      throw new Error("Codice sconto esaurito");
    }

    // Calculate discount amount
    let discountAmount = 0;
    if (discount.type === "percentage") {
      discountAmount = (totalPrice * parseFloat(discount.value)) / 100;
      if (discount.maxDiscount) {
        discountAmount = Math.min(discountAmount, parseFloat(discount.maxDiscount));
      }
    } else {
      discountAmount = parseFloat(discount.value);
    }

    // Update usage count
    await db
      .update(discounts)
      .set({ usedCount: sql`${discounts.usedCount} + 1` })
      .where(eq(discounts.id, discount.id));

    // Record user discount usage
    await db
      .insert(userDiscounts)
      .values({
        userId,
        discountId: discount.id,
        bookingId: null
      });

    return {
      code: discount.code,
      discountAmount,
      finalPrice: totalPrice - discountAmount
    };
  }

  async updateUserLoyalty(userId: number, totalSpent: string, pointsEarned: number): Promise<User> {
    const user = await this.getUser(userId);
    if (!user) throw new Error("User not found");

    const newTotalSpent = parseFloat(user.totalSpent) + parseFloat(totalSpent);
    const newLoyaltyPoints = user.loyaltyPoints + pointsEarned;
    const newTotalBookings = user.totalBookings + 1;

    // Determine new customer level based on total bookings
    let newLevel = user.customerLevel;
    if (newTotalBookings >= 30) newLevel = "platinum";
    else if (newTotalBookings >= 16) newLevel = "gold";
    else if (newTotalBookings >= 6) newLevel = "silver";
    else newLevel = "bronze";

    const [updatedUser] = await db
      .update(users)
      .set({
        totalSpent: newTotalSpent.toFixed(2),
        loyaltyPoints: newLoyaltyPoints,
        totalBookings: newTotalBookings,
        customerLevel: newLevel
      })
      .where(eq(users.id, userId))
      .returning();

    return updatedUser;
  }

  // Document methods implementation
  async getDocuments(bookingId: number): Promise<Document[]> {
    const docs = await db
      .select()
      .from(documents)
      .where(eq(documents.bookingId, bookingId))
      .orderBy(desc(documents.createdAt));
    return docs;
  }

  async createDocument(document: InsertDocument): Promise<Document> {
    const [newDocument] = await db
      .insert(documents)
      .values(document)
      .returning();
    return newDocument;
  }

  async updateDocument(documentId: number, updates: Partial<Document>): Promise<Document> {
    const [updatedDocument] = await db
      .update(documents)
      .set(updates)
      .where(eq(documents.id, documentId))
      .returning();
    return updatedDocument;
  }

  // Advanced feature implementations

  async createAnalyticsEntry(analyticsData: InsertAnalytics): Promise<Analytics> {
    const [newAnalytics] = await db
      .insert(analytics)
      .values(analyticsData)
      .returning();
    return newAnalytics;
  }

  async createEmergency(emergency: InsertEmergency): Promise<Emergency> {
    const [newEmergency] = await db
      .insert(emergencies)
      .values(emergency)
      .returning();
    return newEmergency;
  }

  async getEmergencies(bookingId?: number): Promise<Emergency[]> {
    let query = db.select().from(emergencies);
    if (bookingId) {
      query = query.where(eq(emergencies.bookingId, bookingId));
    }
    return await query.orderBy(desc(emergencies.createdAt));
  }

  async updateEmergencyStatus(emergencyId: number, status: string, resolution?: string): Promise<Emergency> {
    const updates: any = { status };
    if (resolution) {
      updates.resolution = resolution;
      updates.resolvedAt = new Date();
    }
    
    const [emergency] = await db
      .update(emergencies)
      .set(updates)
      .where(eq(emergencies.id, emergencyId))
      .returning();
    return emergency;
  }

  async getDynamicPricing(boatId: number, date: Date): Promise<DynamicPricing | undefined> {
    const [pricing] = await db
      .select()
      .from(dynamicPricing)
      .where(
        and(
          eq(dynamicPricing.boatId, boatId),
          lte(dynamicPricing.startDate, date),
          gte(dynamicPricing.endDate, date),
          eq(dynamicPricing.active, true)
        )
      );
    return pricing;
  }

  async createDynamicPricing(pricing: InsertDynamicPricing): Promise<DynamicPricing> {
    const [newPricing] = await db
      .insert(dynamicPricing)
      .values(pricing)
      .returning();
    return newPricing;
  }

  async getBoatFeatures(boatId: number): Promise<BoatFeature[]> {
    return await db
      .select()
      .from(boatFeatures)
      .where(eq(boatFeatures.boatId, boatId))
      .orderBy(asc(boatFeatures.category));
  }

  async createBoatFeature(feature: InsertBoatFeature): Promise<BoatFeature> {
    const [newFeature] = await db
      .insert(boatFeatures)
      .values(feature)
      .returning();
    return newFeature;
  }

  async getAvailability(boatId: number, startDate: Date, endDate: Date): Promise<Availability[]> {
    return await db
      .select()
      .from(availability)
      .where(
        and(
          eq(availability.boatId, boatId),
          gte(availability.date, startDate),
          lte(availability.date, endDate)
        )
      )
      .orderBy(asc(availability.date));
  }

  async setAvailability(availabilityData: InsertAvailability): Promise<Availability> {
    const [newAvailability] = await db
      .insert(availability)
      .values(availabilityData)
      .returning();
    return newAvailability;
  }

  async getWeatherData(location: string, date: Date): Promise<WeatherData | undefined> {
    const [weather] = await db
      .select()
      .from(weatherData)
      .where(
        and(
          eq(weatherData.location, location),
          eq(weatherData.date, date)
        )
      );
    return weather;
  }

  // Advanced Availability Management Methods
  async getBoatAvailability(boatId: number, startDate: Date, endDate: Date): Promise<Availability[]> {
    return await db
      .select()
      .from(availability)
      .where(
        and(
          eq(availability.boatId, boatId),
          gte(availability.date, startDate),
          lte(availability.date, endDate)
        )
      )
      .orderBy(asc(availability.date));
  }

  async createAvailability(availabilityData: InsertAvailability): Promise<Availability> {
    const [newAvailability] = await db
      .insert(availability)
      .values(availabilityData)
      .returning();
    return newAvailability;
  }

  async updateAvailability(id: number, updates: Partial<Availability>): Promise<Availability> {
    const [updatedAvailability] = await db
      .update(availability)
      .set({ ...updates, lastUpdated: new Date() })
      .where(eq(availability.id, id))
      .returning();
    return updatedAvailability;
  }

  async bulkUpdateAvailability(
    boatId: number, 
    dateRanges: { startDate: Date; endDate: Date }[], 
    updates: Partial<Availability>
  ): Promise<{ updated: number }> {
    let totalUpdated = 0;
    
    for (const range of dateRanges) {
      const result = await db
        .update(availability)
        .set({ ...updates, lastUpdated: new Date() })
        .where(
          and(
            eq(availability.boatId, boatId),
            gte(availability.date, range.startDate),
            lte(availability.date, range.endDate)
          )
        );
      totalUpdated++;
    }
    
    return { updated: totalUpdated };
  }

  // Dynamic Pricing Methods
  async calculateDynamicPricing(boatId: number, startDate: Date, endDate: Date, days: number) {
    const boat = await this.getBoat(boatId);
    if (!boat) throw new Error("Boat not found");

    const basePrice = parseFloat(boat.pricePerDay);
    let seasonMultiplier = 1.0;
    let demandMultiplier = 1.0;
    const appliedDiscounts: any[] = [];

    // Get seasonal pricing
    const month = startDate.getMonth() + 1;
    if (month >= 6 && month <= 8) {
      seasonMultiplier = 1.5; // High season (summer)
    } else if (month >= 4 && month <= 5 || month >= 9 && month <= 10) {
      seasonMultiplier = 1.2; // Medium season (spring/fall)
    } else {
      seasonMultiplier = 0.8; // Low season (winter)
    }

    // Calculate demand multiplier based on existing bookings
    const existingBookings = await db
      .select()
      .from(bookings)
      .where(
        and(
          eq(bookings.boatId, boatId),
          gte(bookings.startDate, startDate),
          lte(bookings.endDate, endDate)
        )
      );

    if (existingBookings.length > 2) {
      demandMultiplier = 1.3; // High demand
    } else if (existingBookings.length > 0) {
      demandMultiplier = 1.1; // Medium demand
    }

    // Get applicable booking rules/discounts
    const rules = await this.getBookingRules(boatId);
    const applicableRules = rules.filter(rule => {
      if (!rule.active) return false;
      
      const now = new Date();
      const daysFromNow = Math.ceil((startDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
      
      switch (rule.ruleType) {
        case 'multiple_days':
          return days >= (rule.minimumDays || 0);
        case 'last_minute':
          return daysFromNow <= (rule.advanceBookingDays || 7);
        case 'early_bird':
          return daysFromNow >= (rule.advanceBookingDays || 30);
        default:
          return true;
      }
    });

    let totalDiscountPercentage = 0;
    for (const rule of applicableRules) {
      totalDiscountPercentage += parseFloat(rule.discountPercentage);
      appliedDiscounts.push({
        name: rule.name,
        percentage: parseFloat(rule.discountPercentage),
        description: rule.description
      });
    }

    const finalPrice = basePrice * days * seasonMultiplier * demandMultiplier * (1 - totalDiscountPercentage / 100);
    const savings = (basePrice * days * seasonMultiplier * demandMultiplier) - finalPrice;

    return {
      basePrice,
      finalPrice: Math.round(finalPrice * 100) / 100,
      seasonMultiplier,
      demandMultiplier,
      appliedDiscounts,
      savings: Math.round(savings * 100) / 100
    };
  }

  async createPriceHistory(priceHistoryData: InsertPriceHistory): Promise<PriceHistory> {
    const [newPriceHistory] = await db
      .insert(priceHistory)
      .values(priceHistoryData)
      .returning();
    return newPriceHistory;
  }

  async getPricingHistory(boatId: number, startDate?: Date, endDate?: Date): Promise<PriceHistory[]> {
    const conditions = [eq(priceHistory.boatId, boatId)];
    
    if (startDate) {
      conditions.push(gte(priceHistory.date, startDate));
    }
    if (endDate) {
      conditions.push(lte(priceHistory.date, endDate));
    }

    return await db
      .select()
      .from(priceHistory)
      .where(and(...conditions))
      .orderBy(desc(priceHistory.date));
  }

  // Booking Rules Methods
  async getBookingRules(boatId: number): Promise<BookingRule[]> {
    return await db
      .select()
      .from(bookingRules)
      .where(eq(bookingRules.boatId, boatId))
      .orderBy(desc(bookingRules.priority), asc(bookingRules.createdAt));
  }

  async createBookingRule(ruleData: InsertBookingRule): Promise<BookingRule> {
    const [newRule] = await db
      .insert(bookingRules)
      .values(ruleData)
      .returning();
    return newRule;
  }

  async updateBookingRule(id: number, updates: Partial<BookingRule>): Promise<BookingRule> {
    const [updatedRule] = await db
      .update(bookingRules)
      .set(updates)
      .where(eq(bookingRules.id, id))
      .returning();
    return updatedRule;
  }

  async calculateApplicableDiscounts(boatId: number, startDate: Date, endDate: Date, userId?: number) {
    const rules = await this.getBookingRules(boatId);
    const days = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    const daysFromNow = Math.ceil((startDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
    
    const applicableRules = rules.filter(rule => {
      if (!rule.active) return false;
      
      switch (rule.ruleType) {
        case 'multiple_days':
          return days >= (rule.minimumDays || 0) && days <= (rule.maximumDays || 999);
        case 'last_minute':
          return daysFromNow <= (rule.advanceBookingDays || 7);
        case 'early_bird':
          return daysFromNow >= (rule.advanceBookingDays || 30);
        case 'seasonal':
          const now = new Date();
          return (!rule.validFrom || now >= rule.validFrom) && (!rule.validTo || now <= rule.validTo);
        default:
          return true;
      }
    });

    const totalDiscount = applicableRules.reduce((sum, rule) => sum + parseFloat(rule.discountPercentage), 0);
    const boat = await this.getBoat(boatId);
    const basePrice = parseFloat(boat?.pricePerDay || "0") * days;
    const savings = (basePrice * totalDiscount) / 100;

    return {
      rules: applicableRules,
      totalDiscount,
      savings: Math.round(savings * 100) / 100
    };
  }

  // Booking Lock Methods (Real-time availability)
  async createBookingLock(lockData: InsertBookingLock): Promise<BookingLock> {
    // First cleanup expired locks
    await this.cleanupExpiredLocks();
    
    const [newLock] = await db
      .insert(bookingLocks)
      .values(lockData)
      .returning();
    return newLock;
  }

  async releaseBookingLock(lockId: number, userId: number): Promise<void> {
    await db
      .update(bookingLocks)
      .set({ locked: false })
      .where(
        and(
          eq(bookingLocks.id, lockId),
          eq(bookingLocks.userId, userId)
        )
      );
  }

  async checkDateAvailability(boatId: number, startDate: Date, endDate: Date): Promise<boolean> {
    // Check for existing bookings
    const existingBookings = await db
      .select()
      .from(bookings)
      .where(
        and(
          eq(bookings.boatId, boatId),
          or(
            and(gte(bookings.startDate, startDate), lte(bookings.startDate, endDate)),
            and(gte(bookings.endDate, startDate), lte(bookings.endDate, endDate)),
            and(lte(bookings.startDate, startDate), gte(bookings.endDate, endDate))
          ),
          or(
            eq(bookings.status, "confirmed"),
            eq(bookings.status, "pending")
          )
        )
      );

    if (existingBookings.length > 0) return false;

    // Check for active locks from other users
    const activeLocks = await db
      .select()
      .from(bookingLocks)
      .where(
        and(
          eq(bookingLocks.boatId, boatId),
          eq(bookingLocks.locked, true),
          gte(bookingLocks.expiresAt, new Date()),
          or(
            and(gte(bookingLocks.startDate, startDate), lte(bookingLocks.startDate, endDate)),
            and(gte(bookingLocks.endDate, startDate), lte(bookingLocks.endDate, endDate)),
            and(lte(bookingLocks.startDate, startDate), gte(bookingLocks.endDate, endDate))
          )
        )
      );

    return activeLocks.length === 0;
  }

  async cleanupExpiredLocks(): Promise<number> {
    const result = await db
      .update(bookingLocks)
      .set({ locked: false })
      .where(lte(bookingLocks.expiresAt, new Date()));
    
    return 0; // Return count would require additional query
  }
  // Document management methods
  async createDocument(document: InsertDocument): Promise<Document> {
    const [newDocument] = await db.insert(documents).values({
      ...document,
      createdAt: new Date(),
      updatedAt: new Date()
    }).returning();
    
    // Log action
    await this.createDocumentAuditLog({
      documentId: newDocument.id,
      userId: document.userId,
      action: 'uploaded',
      newStatus: document.status || 'pending',
      details: { fileName: document.fileName, type: document.type },
      ipAddress: '127.0.0.1',
      userAgent: 'SeaGO-App'
    });
    
    return newDocument;
  }

  async getDocument(id: number): Promise<Document | undefined> {
    const [document] = await db.select().from(documents).where(eq(documents.id, id));
    return document;
  }

  async getUserDocuments(userId: number, type?: string): Promise<Document[]> {
    let query = db.select().from(documents).where(eq(documents.userId, userId));
    
    if (type) {
      query = query.where(eq(documents.type, type));
    }
    
    return await query.orderBy(desc(documents.createdAt));
  }

  async getBoatDocuments(boatId: number): Promise<Document[]> {
    return await db.select().from(documents)
      .where(eq(documents.boatId, boatId))
      .orderBy(desc(documents.createdAt));
  }

  async updateDocument(id: number, updates: Partial<Document>): Promise<Document | undefined> {
    const [updatedDocument] = await db
      .update(documents)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(documents.id, id))
      .returning();

    return updatedDocument;
  }

  async deleteDocument(id: number): Promise<boolean> {
    const [document] = await db.select().from(documents).where(eq(documents.id, id));
    if (!document) return false;

    await db.delete(documents).where(eq(documents.id, id));

    // Log action
    await this.createDocumentAuditLog({
      documentId: id,
      userId: document.userId,
      action: 'deleted',
      previousStatus: document.status,
      details: { fileName: document.fileName },
      ipAddress: '127.0.0.1',
      userAgent: 'SeaGO-App'
    });

    return true;
  }

  async verifyDocument(documentId: number, verifierId: number, verification: Omit<InsertDocumentVerification, 'documentId' | 'verifierId'>): Promise<DocumentVerification> {
    const [newVerification] = await db.insert(documentVerifications).values({
      documentId,
      verifierId,
      ...verification,
      verificationDate: new Date()
    }).returning();

    // Update document status
    await this.updateDocument(documentId, {
      status: verification.status,
      verificationStatus: verification.status === 'approved' ? 'verified' : 'failed',
      verifiedAt: verification.status === 'approved' ? new Date() : undefined,
      verifiedBy: verification.status === 'approved' ? verifierId : undefined,
      rejectionReason: verification.status === 'rejected' ? verification.notes : undefined
    });

    return newVerification;
  }

  async getDocumentVerifications(documentId: number): Promise<DocumentVerification[]> {
    return await db.select().from(documentVerifications)
      .where(eq(documentVerifications.documentId, documentId))
      .orderBy(desc(documentVerifications.verificationDate));
  }

  async getPendingDocuments(): Promise<Document[]> {
    return await db.select().from(documents)
      .where(eq(documents.status, 'pending'))
      .orderBy(asc(documents.createdAt));
  }

  async getExpiringDocuments(days: number = 30): Promise<Document[]> {
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + days);
    
    return await db.select().from(documents)
      .where(
        and(
          isNotNull(documents.expiryDate),
          lte(documents.expiryDate, futureDate.toISOString().split('T')[0]),
          gt(documents.expiryDate, new Date().toISOString().split('T')[0])
        )
      )
      .orderBy(asc(documents.expiryDate));
  }

  async createDocumentTemplate(template: InsertDocumentTemplate): Promise<DocumentTemplate> {
    const [newTemplate] = await db.insert(documentTemplates).values({
      ...template,
      createdAt: new Date()
    }).returning();
    return newTemplate;
  }

  async getDocumentTemplates(type?: string): Promise<DocumentTemplate[]> {
    let query = db.select().from(documentTemplates).where(eq(documentTemplates.isActive, true));
    
    if (type) {
      query = query.where(eq(documentTemplates.type, type));
    }
    
    return await query.orderBy(asc(documentTemplates.name));
  }

  async createUserDocumentRequirement(requirement: InsertUserDocumentRequirement): Promise<UserDocumentRequirement> {
    const [newRequirement] = await db.insert(userDocumentRequirements).values({
      ...requirement,
      createdAt: new Date()
    }).returning();
    return newRequirement;
  }

  async getUserDocumentRequirements(userId: number): Promise<UserDocumentRequirement[]> {
    return await db.select().from(userDocumentRequirements)
      .where(eq(userDocumentRequirements.userId, userId))
      .orderBy(asc(userDocumentRequirements.createdAt));
  }

  async updateUserDocumentRequirement(userId: number, documentType: string, status: string): Promise<void> {
    await db
      .update(userDocumentRequirements)
      .set({ status })
      .where(
        and(
          eq(userDocumentRequirements.userId, userId),
          eq(userDocumentRequirements.documentType, documentType)
        )
      );
  }

  async createDocumentAuditLog(log: InsertDocumentAuditLog): Promise<DocumentAuditLog> {
    const [newLog] = await db.insert(documentAuditLog).values({
      ...log,
      createdAt: new Date()
    }).returning();
    return newLog;
  }

  async getDocumentAuditLogs(documentId: number): Promise<DocumentAuditLog[]> {
    return await db.select().from(documentAuditLog)
      .where(eq(documentAuditLog.documentId, documentId))
      .orderBy(desc(documentAuditLog.createdAt));
  }

  async runAutomatedDocumentChecks(documentId: number): Promise<any> {
    const document = await this.getDocument(documentId);
    if (!document) return null;

    // Controlli automatici simulati con AI/OCR
    const checks = {
      fileIntegrity: true,
      formatValid: document.mimeType.includes('pdf') || document.mimeType.includes('image'),
      sizeValid: document.fileSize < 10 * 1024 * 1024, // 10MB limit
      expiryValid: document.expiryDate ? new Date(document.expiryDate) > new Date() : true,
      textExtraction: true, // Simula OCR
      documentNumberFound: !!document.documentNumber,
      timestamp: new Date()
    };

    const passedChecks = Object.values(checks).filter(check => typeof check === 'boolean' && check).length;
    const totalChecks = Object.values(checks).filter(check => typeof check === 'boolean').length;
    const confidence = (passedChecks / totalChecks) * 100;

    return {
      documentId,
      checks,
      confidence,
      passed: confidence >= 80
    };
  }
}

export const storage = new DatabaseStorage();
