import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertUserSchema, insertOwnerSchema, insertUserOnlySchema, loginSchema } from "@shared/schema";
import session from "express-session";
import connectPg from "connect-pg-simple";

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
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        userType: user.userType
      };

      res.json({ 
        success: true, 
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
          userType: user.userType,
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
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        userType: user.userType
      };

      res.json({ 
        success: true, 
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          userType: user.userType
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

  const httpServer = createServer(app);
  return httpServer;
}