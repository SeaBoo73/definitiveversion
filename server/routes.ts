import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertUserSchema, insertOwnerSchema, insertUserOnlySchema, loginSchema, insertBoatSchema } from "@shared/schema";
import session from "express-session";
import connectPg from "connect-pg-simple";
import multer from "multer";
import path from "path";

// Extend session type
declare module 'express-session' {
  interface SessionData {
    user?: {
      id: string;
      email: string;
      firstName?: string;
      lastName?: string;
      role: string;
      userType: string;
      businessName?: string;
    };
  }
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Session setup
  const pgStore = connectPg(session);
  app.use(session({
    store: new pgStore({
      conString: process.env.DATABASE_URL,
      createTableIfMissing: true,
    }),
    secret: process.env.SESSION_SECRET || 'seaboo-secret-key-development',
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false, // set to true in production with HTTPS
      maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }
  }));

  // Auth middleware
  const requireAuth = (req: any, res: any, next: any) => {
    if (!req.session?.user) {
      return res.status(401).json({ error: "Non autenticato" });
    }
    next();
  };

  // Register endpoint with role-based validation
  app.post('/api/register', async (req, res) => {
    try {
      // Determine which schema to use based on role
      const role = req.body.role || "user";
      let userData;
      
      if (role === "owner") {
        userData = insertOwnerSchema.parse(req.body);
      } else {
        userData = insertUserOnlySchema.parse(req.body);
      }
      
      // Check if user already exists
      const existingUser = await storage.getUserByEmail(userData.email);
      if (existingUser) {
        return res.status(400).json({ error: "Email già registrata" });
      }

      // Create user
      const user = await storage.createUser(userData);
      
      // Store user in session (login automatically after registration)
      req.session.user = {
        id: user.id.toString(),
        email: user.email,
        firstName: user.firstName || undefined,
        lastName: user.lastName || undefined,
        role: user.role || "user",
        userType: user.role === "owner" ? "owner" : "customer",
        businessName: user.businessName || undefined
      };

      res.json({ 
        success: true, 
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
          userType: user.role === "owner" ? "owner" : "customer",
          businessName: user.businessName
        },
        redirectTo: role === "owner" ? "/owner/dashboard" : "/home"
      });
    } catch (error: any) {
      console.error("Registration error:", error);
      res.status(400).json({ 
        error: error.message || "Errore durante la registrazione" 
      });
    }
  });

  // Login endpoint
  app.post('/api/login', async (req, res) => {
    try {
      const loginData = loginSchema.parse(req.body);
      
      const user = await storage.verifyPassword(loginData.email, loginData.password);
      if (!user) {
        return res.status(401).json({ error: "Email o password non validi" });
      }

      // Store user in session
      req.session.user = {
        id: user.id.toString(),
        email: user.email,
        firstName: user.firstName || undefined,
        lastName: user.lastName || undefined,
        role: user.role || "user",
        userType: user.role === "owner" ? "owner" : "customer",
        businessName: user.businessName || undefined
      };

      res.json({ 
        success: true, 
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          userType: user.role === "owner" ? "owner" : "customer"
        }
      });
    } catch (error: any) {
      console.error("Login error:", error);
      res.status(400).json({ 
        error: error.message || "Errore durante il login" 
      });
    }
  });

  // Get current user endpoint
  app.get('/api/user', (req, res) => {
    if (req.session?.user) {
      res.json({ user: req.session.user });
    } else {
      res.status(401).json({ error: "Non autenticato" });
    }
  });

  // Logout endpoint
  app.post('/api/logout', (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ error: "Errore durante il logout" });
      }
      res.json({ success: true });
    });
  });

  // Protected route example
  app.get("/api/profile", requireAuth, async (req: any, res) => {
    try {
      const user = await storage.getUser(req.session.user.id);
      if (!user) {
        return res.status(404).json({ error: "Utente non trovato" });
      }
      
      // Don't send password
      const { password, ...userProfile } = user;
      res.json({ user: userProfile });
    } catch (error) {
      console.error("Profile error:", error);
      res.status(500).json({ error: "Errore nel recupero del profilo" });
    }
  });

  // Multer setup for file uploads
  const upload = multer({
    dest: 'uploads/',
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
    fileFilter: (req, file, cb) => {
      if (file.mimetype.startsWith('image/')) {
        cb(null, true);
      } else {
        cb(new Error('Solo immagini sono permesse'));
      }
    }
  });

  // Owner-only middleware
  const requireOwner = (req: any, res: any, next: any) => {
    if (!req.session?.user || req.session.user.role !== 'owner') {
      return res.status(403).json({ error: "Accesso negato: solo per noleggiatori" });
    }
    next();
  };

  // Boat management endpoints
  app.get('/api/boats', async (req, res) => {
    try {
      console.log("Fetching boats...");
      const boats = await storage.getBoats();
      console.log("Boats fetched:", boats?.length || 0, "boats");
      res.json({ boats });
    } catch (error) {
      console.error("Get boats error:", error);
      res.status(500).json({ error: "Errore nel recupero delle barche" });
    }
  });

  app.get('/api/owner/boats', requireAuth, requireOwner, async (req: any, res) => {
    try {
      const boats = await storage.getBoatsByOwner(req.session.user.id);
      res.json({ boats });
    } catch (error) {
      console.error("Get owner boats error:", error);
      res.status(500).json({ error: "Errore nel recupero delle barche" });
    }
  });

  app.post('/api/boats', requireAuth, requireOwner, upload.array('images', 5), async (req: any, res) => {
    try {
      const boatData = insertBoatSchema.parse({
        ...req.body,
        hostId: parseInt(req.session.user.id),
        images: req.files ? req.files.map((file: any) => `/uploads/${file.filename}`) : []
      });

      const boat = await storage.createBoat(boatData);
      res.json({ success: true, boat });
    } catch (error: any) {
      console.error("Create boat error:", error);
      res.status(400).json({ error: error.message || "Errore nella creazione della barca" });
    }
  });

  app.put('/api/boats/:id', requireAuth, requireOwner, upload.array('images', 5), async (req: any, res) => {
    try {
      const { id } = req.params;
      
      // Verify boat ownership
      const existingBoat = await storage.getBoat(id);
      if (!existingBoat || existingBoat.hostId !== parseInt(req.session.user.id)) {
        return res.status(404).json({ error: "Barca non trovata" });
      }

      const updateData: any = { ...req.body };
      if (req.files && req.files.length > 0) {
        updateData.images = req.files.map((file: any) => `/uploads/${file.filename}`);
      }

      const boat = await storage.updateBoat(id, updateData);
      res.json({ success: true, boat });
    } catch (error: any) {
      console.error("Update boat error:", error);
      res.status(400).json({ error: error.message || "Errore nell'aggiornamento della barca" });
    }
  });

  app.delete('/api/boats/:id', requireAuth, requireOwner, async (req: any, res) => {
    try {
      const { id } = req.params;
      
      // Verify boat ownership
      const existingBoat = await storage.getBoat(id);
      if (!existingBoat || existingBoat.hostId !== parseInt(req.session.user.id)) {
        return res.status(404).json({ error: "Barca non trovata" });
      }

      const success = await storage.deleteBoat(id);
      if (success) {
        res.json({ success: true });
      } else {
        res.status(404).json({ error: "Barca non trovata" });
      }
    } catch (error) {
      console.error("Delete boat error:", error);
      res.status(500).json({ error: "Errore nell'eliminazione della barca" });
    }
  });

  // Owner bookings endpoint
  app.get('/api/owner/bookings', requireAuth, requireOwner, async (req: any, res) => {
    try {
      const bookings = await storage.getBookingsByOwner(req.session.user.id);
      res.json({ bookings });
    } catch (error) {
      console.error("Get owner bookings error:", error);
      res.status(500).json({ error: "Errore nel recupero delle prenotazioni" });
    }
  });

  // Serve static files
  app.use('/uploads', (req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    next();
  });

  const httpServer = createServer(app);
  return httpServer;
}