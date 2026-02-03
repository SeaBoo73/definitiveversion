import type { Express } from "express";
import express from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertUserSchema, insertOwnerSchema, insertUserOnlySchema, loginSchema, insertBoatSchema, insertBookingSchema, insertBoatAvailabilitySchema } from "@shared/schema";
import session from "express-session";
import connectPg from "connect-pg-simple";
import multer from "multer";
import path from "path";
import { fileURLToPath } from 'url';
import Stripe from "stripe";
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import aiChatRouter from "./routes/ai-chat";
import { encryptBankingData, decryptBankingData, maskIban, maskAccountHolder } from "./encryption";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-08-27.basil',
});

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
      profileImage?: string;
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
      secure: false,
      httpOnly: true,
      sameSite: 'lax',
      maxAge: 24 * 60 * 60 * 1000
    }
  }));

  // Passport initialization
  app.use(passport.initialize());
  app.use(passport.session());

  // Passport serialization
  passport.serializeUser((user: any, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id: number, done) => {
    try {
      const user = await storage.getUser(id);
      done(null, user);
    } catch (error) {
      done(error);
    }
  });

  // Register AI Chat router FIRST (before other routes)
  app.use('/api/ai', aiChatRouter);

  // Google OAuth Strategy - use absolute URL for production
  const googleCallbackURL = process.env.NODE_ENV === 'production' 
    ? "https://www.seaboo.it/api/auth/google/callback"
    : "/api/auth/google/callback";
  
  passport.use(new GoogleStrategy({
      clientID: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      callbackURL: googleCallbackURL,
      scope: ["profile", "email"]
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails?.[0]?.value;
        if (!email) {
          return done(new Error("Email non disponibile da Google"));
        }

        // Check if user exists
        let user = await storage.getUserByEmail(email);

        if (!user) {
          // Create new user
          const emailPrefix = email.split('@')[0].replace(/[^a-z0-9]/gi, '').substring(0, 20);
          const randomSuffix = Math.random().toString(36).substring(2, 8);
          const username = `${emailPrefix}_${randomSuffix}`;

          const userData = {
            email,
            password: profile.id, // Use Google ID as password
            username,
            role: 'customer' as const,
            firstName: profile.name?.givenName || undefined,
            lastName: profile.name?.familyName || undefined
          };

          user = await storage.createUser(userData);
        }

        return done(null, user);
      } catch (error) {
        return done(error as Error);
      }
    }
  ));

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
      const role = req.body.role || "customer";
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
        role: user.role || "customer",
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
        role: user.role || "customer",
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

  // Google OAuth routes
  app.get('/api/auth/google', (req, res, next) => {
    // Pass mobile flag via OAuth state parameter (survives redirects)
    const state = req.query.mobile === 'android' ? 'mobile_android' : 'web';
    passport.authenticate('google', { 
      scope: ['profile', 'email'],
      state: state,
      prompt: 'select_account' // FORCE Google to show the account selection screen
    })(req, res, next);
  });

  app.get('/api/auth/google/callback',
    passport.authenticate('google', { failureRedirect: '/auth?tab=login' }),
    async (req, res) => {
      // Store user in session
      const user = req.user as any;
      req.session.user = {
        id: user.id.toString(),
        email: user.email,
        firstName: user.firstName || undefined,
        lastName: user.lastName || undefined,
        role: user.role || "customer",
        userType: user.role === "owner" ? "owner" : "customer",
        businessName: user.businessName || undefined
      };

      // Check if this was a mobile login via state parameter
      const state = req.query.state as string;
      const isMobileAndroid = state === 'mobile_android';
      
      if (isMobileAndroid) {
        // Generate a temporary auth token for mobile
        const crypto = await import('crypto');
        const tempToken = crypto.randomBytes(32).toString('hex');
        const tokenExpiry = Date.now() + 5 * 60 * 1000; // 5 minutes
        
        // Store token temporarily (in memory - for production use Redis)
        if (!(global as any).mobileAuthTokens) {
          (global as any).mobileAuthTokens = new Map();
        }
        (global as any).mobileAuthTokens.set(tempToken, {
          userId: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
          expiry: tokenExpiry
        });
        
        // Clean up expired tokens
        for (const [key, value] of (global as any).mobileAuthTokens.entries()) {
          if ((value as any).expiry < Date.now()) {
            (global as any).mobileAuthTokens.delete(key);
          }
        }
        
        const deepLink = `seaboo://login-success?token=${tempToken}`;
        const intentUrl = `intent://login-success?token=${tempToken}#Intent;scheme=seaboo;package=it.seaboo.app;end`;
        
        // For Android, redirect to a success page with deep link
        res.send(`
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1">
            <title>Accesso completato - SeaBoo</title>
            <style>
              body { 
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                display: flex; 
                justify-content: center; 
                align-items: center; 
                min-height: 100vh; 
                margin: 0;
                background: linear-gradient(135deg, #0066cc 0%, #00a3cc 100%);
                color: white;
                text-align: center;
                padding: 20px;
              }
              .container { max-width: 400px; background: rgba(255,255,255,0.1); padding: 30px; border-radius: 20px; backdrop-filter: blur(10px); }
              h1 { font-size: 28px; margin-bottom: 16px; font-weight: 800; }
              p { font-size: 18px; opacity: 0.9; margin-bottom: 30px; line-height: 1.5; }
              .btn {
                display: block;
                background: white;
                color: #0066cc;
                padding: 18px 32px;
                border-radius: 12px;
                text-decoration: none;
                font-weight: 800;
                font-size: 18px;
                margin: 12px 0;
                transition: transform 0.2s;
                box-shadow: 0 4px 15px rgba(0,0,0,0.1);
              }
              .btn:active { transform: scale(0.98); }
              .btn-alt { background: rgba(255,255,255,0.2); color: white; border: 2px solid white; box-shadow: none; }
              .footer-text { font-size: 14px; opacity: 0.7; margin-top: 20px; }
            </style>
          </head>
          <body>
            <div class="container">
              <h1>Benvenuto a bordo!</h1>
              <p>Il login è stato completato con successo. Clicca il pulsante qui sotto per tornare all'app e iniziare a navigare.</p>
              
              <a href="${intentUrl}" class="btn">TORNA ALL'APP SEABOO</a>
              <a href="${deepLink}" class="btn btn-alt">Problemi? Prova questo link</a>
              
              <p class="footer-text">Una volta tornato nell'app, sarai automaticamente loggato con il tuo account Google.</p>
            </div>
            <script>
              console.log('Login success - waiting for user interaction');
              // Log the specific action for debugging
              window.onclick = function() {
                console.log('User clicked - redirection attempted');
              };
            </script>
          </body>
          </html>
        `);
      } else {
        // Web: redirect to home page
        res.redirect('/');
      }
    }
  );

  // Mobile token exchange endpoint
  app.post('/api/auth/mobile-token', async (req, res) => {
    try {
      const { token } = req.body;
      
      if (!token) {
        return res.status(400).json({ error: "Token mancante" });
      }
      
      // Get token from storage
      const tokenData = (global as any).mobileAuthTokens?.get(token);
      
      if (!tokenData) {
        return res.status(401).json({ error: "Token non valido o scaduto" });
      }
      
      // Check expiry
      if (tokenData.expiry < Date.now()) {
        (global as any).mobileAuthTokens.delete(token);
        return res.status(401).json({ error: "Token scaduto" });
      }
      
      // Delete token (one-time use)
      (global as any).mobileAuthTokens.delete(token);
      
      // Create session
      req.session.user = {
        id: tokenData.userId.toString(),
        email: tokenData.email,
        firstName: tokenData.firstName || undefined,
        lastName: tokenData.lastName || undefined,
        role: tokenData.role || "customer",
        userType: tokenData.role === "owner" ? "owner" : "customer"
      };
      
      // Return user data
      res.json({
        id: tokenData.userId,
        email: tokenData.email,
        firstName: tokenData.firstName,
        lastName: tokenData.lastName,
        role: tokenData.role
      });
      
    } catch (error) {
      console.error('Mobile token exchange error:', error);
      res.status(500).json({ error: "Errore interno" });
    }
  });

  // Apple Sign In endpoint - handles both registration and login
  app.post('/api/auth/apple', async (req, res) => {
    try {
      const { email, appleUserId, firstName, lastName } = req.body;
      
      if (!email || !appleUserId) {
        return res.status(400).json({ error: "Dati Apple mancanti" });
      }
      
      // Check if user already exists by email
      let user = await storage.getUserByEmail(email);
      
      if (user) {
        // User exists - login
        console.log('Apple Sign In: User exists, logging in');
        
        // Store user in session
        req.session.user = {
          id: user.id.toString(),
          email: user.email,
          firstName: user.firstName || undefined,
          lastName: user.lastName || undefined,
          role: user.role || "customer",
          userType: user.role === "owner" ? "owner" : "customer",
          businessName: user.businessName || undefined
        };
        
        return res.json({ 
          success: true, 
          user: {
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            role: user.role,
            userType: user.role === "owner" ? "owner" : "customer"
          },
          redirectTo: "/home"
        });
      }
      
      // User doesn't exist - create new account
      console.log('Apple Sign In: Creating new user');
      
      // Generate unique username based on email
      const emailPrefix = email.split('@')[0].replace(/[^a-z0-9]/gi, '').substring(0, 20);
      const randomSuffix = Math.random().toString(36).substring(2, 8);
      const username = `${emailPrefix}_${randomSuffix}`;
      
      const userData = {
        email,
        password: appleUserId, // Use Apple ID as password
        username,
        role: 'customer' as const,
        firstName: firstName || undefined,
        lastName: lastName || undefined
      };
      
      user = await storage.createUser(userData);
      
      // Store user in session
      req.session.user = {
        id: user.id.toString(),
        email: user.email,
        firstName: user.firstName || undefined,
        lastName: user.lastName || undefined,
        role: user.role || "customer",
        userType: "customer",
      };
      
      res.json({ 
        success: true, 
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
          userType: "customer"
        },
        redirectTo: "/home"
      });
    } catch (error: any) {
      console.error("Apple Sign In error:", error);
      res.status(400).json({ 
        error: error.message || "Errore durante l'autenticazione Apple" 
      });
    }
  });

  // Get current user endpoint
  app.get('/api/user', (req, res) => {
    if (req.session?.user) {
      res.json(req.session.user);
    } else {
      res.status(401).json({ error: "Non autenticato" });
    }
  });

  // Get full user profile from database
  app.get('/api/user/profile', requireAuth, async (req, res) => {
    try {
      const userId = parseInt(req.session.user!.id);
      const user = await storage.getUser(userId);
      
      if (!user) {
        return res.status(404).json({ error: "Utente non trovato" });
      }

      // Decrypt banking data before sending to client
      const decryptedBanking = decryptBankingData({
        iban: user.iban,
        bankName: user.bankName,
        accountHolder: user.accountHolder,
        swiftBic: user.swiftBic
      });

      // Generate masked versions for display
      const ibanMasked = maskIban(decryptedBanking.iban || null);
      const accountHolderMasked = maskAccountHolder(decryptedBanking.accountHolder || null);

      res.json({
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        phone: user.phone,
        profileImage: user.profileImage,
        role: user.role,
        businessName: user.businessName,
        bio: user.bio,
        // Return both masked and full versions
        iban: decryptedBanking.iban,
        ibanMasked,
        bankName: decryptedBanking.bankName,
        accountHolder: decryptedBanking.accountHolder,
        accountHolderMasked,
        swiftBic: decryptedBanking.swiftBic
      });
    } catch (error) {
      console.error("Get profile error:", error);
      res.status(500).json({ error: "Errore durante il recupero del profilo" });
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

  // Update user profile endpoint
  app.patch('/api/user/profile', requireAuth, async (req, res) => {
    try {
      const userId = parseInt(req.session.user!.id);
      const { firstName, lastName, phone, profileImage, bio, iban, bankName, accountHolder, swiftBic } = req.body;
      
      console.log('[PROFILE UPDATE] User ID:', userId, 'Data received:', { firstName, lastName, phone, bio: bio ? 'has bio' : 'no bio', iban: iban ? 'has iban' : 'no iban' });
      
      // Encrypt banking data before saving
      const encryptedBanking = encryptBankingData({ iban, bankName, accountHolder, swiftBic });
      
      const updatedUser = await storage.updateUser(userId, {
        firstName,
        lastName,
        phone,
        profileImage,
        bio,
        iban: encryptedBanking.iban,
        bankName: encryptedBanking.bankName,
        accountHolder: encryptedBanking.accountHolder,
        swiftBic: encryptedBanking.swiftBic
      });
      
      console.log('[PROFILE UPDATE] Updated user:', updatedUser ? 'success' : 'failed');

      if (!updatedUser) {
        return res.status(500).json({ error: "Errore durante l'aggiornamento del profilo" });
      }

      // Update session with new data
      req.session.user = {
        ...req.session.user!,
        firstName: updatedUser.firstName || undefined,
        lastName: updatedUser.lastName || undefined,
        profileImage: updatedUser.profileImage || undefined
      };

      req.session.save((err) => {
        if (err) {
          console.error('Session save error:', err);
          return res.status(500).json({ error: 'Errore nel salvataggio della sessione' });
        }

        res.json({
          success: true,
          user: {
            id: updatedUser.id,
            email: updatedUser.email,
            firstName: updatedUser.firstName,
            lastName: updatedUser.lastName,
            phone: updatedUser.phone,
            profileImage: updatedUser.profileImage,
            role: updatedUser.role
          }
        });
      });
    } catch (error) {
      console.error("Update profile error:", error);
      res.status(500).json({ error: "Errore durante l'aggiornamento del profilo" });
    }
  });

  // Delete account endpoint
  app.delete('/api/user/delete-account', requireAuth, async (req, res) => {
    try {
      const userId = parseInt(req.session.user!.id);
      const deleted = await storage.deleteUser(userId);
      
      if (!deleted) {
        return res.status(500).json({ error: "Errore durante la cancellazione dell'account" });
      }

      req.session.destroy((err) => {
        if (err) {
          console.error("Error destroying session:", err);
        }
        res.json({ success: true, message: "Account eliminato con successo" });
      });
    } catch (error) {
      console.error("Delete account error:", error);
      res.status(500).json({ error: "Errore durante la cancellazione dell'account" });
    }
  });

  // Change password endpoint
  app.post('/api/user/change-password', requireAuth, async (req, res) => {
    try {
      const userId = parseInt(req.session.user!.id);
      const { currentPassword, newPassword } = req.body;

      if (!currentPassword || !newPassword) {
        return res.status(400).json({ error: "Password attuale e nuova password richieste" });
      }

      if (newPassword.length < 6) {
        return res.status(400).json({ error: "La nuova password deve avere almeno 6 caratteri" });
      }

      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ error: "Utente non trovato" });
      }

      const bcrypt = await import('bcryptjs');
      const isValidPassword = await bcrypt.compare(currentPassword, user.password);
      if (!isValidPassword) {
        return res.status(400).json({ error: "Password attuale non corretta" });
      }

      const hashedPassword = await bcrypt.hash(newPassword, 12);
      await storage.updateUser(userId, { password: hashedPassword });

      res.json({ success: true, message: "Password cambiata con successo" });
    } catch (error) {
      console.error("Change password error:", error);
      res.status(500).json({ error: "Errore durante il cambio password" });
    }
  });

  // Upgrade to owner endpoint
  app.post('/api/user/upgrade-to-owner', requireAuth, async (req, res) => {
    try {
      const userId = parseInt(req.session.user!.id);
      const { businessName, businessType, vatNumber, phone } = req.body;
      
      // Update user role to owner
      const updatedUser = await storage.updateUser(userId, {
        role: 'owner',
        businessName,
        businessType,
        vatNumber,
        phone
      });

      if (!updatedUser) {
        return res.status(500).json({ error: "Errore durante l'aggiornamento dell'account" });
      }

      // Update session
      req.session.user = {
        id: req.session.user!.id,
        email: req.session.user!.email,
        firstName: req.session.user!.firstName,
        lastName: req.session.user!.lastName,
        role: 'owner',
        userType: 'owner',
        businessName: updatedUser.businessName || undefined
      };

      req.session.save((err) => {
        if (err) {
          console.error('Session save error:', err);
          return res.status(500).json({ error: 'Errore nel salvataggio della sessione' });
        }

        res.json({
          success: true,
          user: {
            id: updatedUser.id,
            email: updatedUser.email,
            firstName: updatedUser.firstName,
            lastName: updatedUser.lastName,
            role: updatedUser.role,
            userType: 'owner',
            businessName: updatedUser.businessName
          }
        });
      });
    } catch (error) {
      console.error("Upgrade to owner error:", error);
      res.status(500).json({ error: "Errore durante l'aggiornamento dell'account" });
    }
  });

  // Apple Sign In callback endpoint
  app.post('/auth/apple/callback', async (req, res) => {
    try {
      const { id_token, user_info } = req.body;

      if (!id_token) {
        return res.status(400).json({ error: "Token Apple mancante" });
      }

      let email = '';
      let firstName = '';
      let lastName = '';
      let appleUserId = '';

      // Verifica sempre il token Apple reale usando jose
      try {
        const jose = await import('jose');
        const JWKS = jose.createRemoteJWKSet(new URL('https://appleid.apple.com/auth/keys'));
        
        const { payload } = await jose.jwtVerify(id_token, JWKS, {
          issuer: 'https://appleid.apple.com',
          audience: process.env.APPLE_CLIENT_ID || 'it.seaboo.app',
        });

        // Estrai i dati dal token verificato
        email = payload.email as string;
        appleUserId = payload.sub as string;
        
        // I nomi sono forniti solo al primo login e tramite user_info
        if (user_info?.name) {
          firstName = user_info.name.firstName || '';
          lastName = user_info.name.lastName || '';
        }
        
        if (!email) {
          throw new Error('Email mancante nel token Apple');
        }

        console.log('✅ Apple token verified successfully', { email, appleUserId });
      } catch (verifyError: any) {
        console.error('❌ Apple token verification failed:', verifyError);
        return res.status(401).json({ 
          error: 'Token Apple non valido',
          details: verifyError.message 
        });
      }

      // Controlla se l'utente esiste già
      let user = await storage.getUserByEmail(email);

      if (!user) {
        // Crea nuovo utente
        const username = email.split('@')[0];
        const userData = {
          email,
          username,
          password: await import('bcryptjs').then(bcrypt => 
            bcrypt.hash(id_token + Date.now(), 12)
          ), // Password casuale per utenti Apple
          firstName,
          lastName,
          role: 'customer' as const,
        };

        user = await storage.createUser(userData);
      }

      // Salva l'utente nella sessione
      req.session.user = {
        id: user.id.toString(),
        email: user.email,
        firstName: user.firstName || undefined,
        lastName: user.lastName || undefined,
        role: user.role || "customer",
        userType: user.role === "owner" ? "owner" : "customer",
        businessName: user.businessName || undefined
      };

      // Salva esplicitamente la sessione prima di rispondere
      req.session.save((err) => {
        if (err) {
          console.error('❌ Session save error:', err);
          return res.status(500).json({ error: 'Errore nel salvataggio della sessione' });
        }

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
      });
    } catch (error: any) {
      console.error("Apple Sign In error:", error);
      res.status(400).json({
        error: error.message || "Errore durante l'autenticazione Apple"
      });
    }
  });

  // Apple Sign In health check
  app.get('/auth/apple/health', (_req, res) => {
    res.json({ ok: true, service: 'apple-login' });
  });

  // Password Reset - Request reset email
  app.post('/api/auth/forgot-password', async (req, res) => {
    try {
      const { email } = req.body;
      
      if (!email) {
        return res.status(400).json({ error: "Email richiesta" });
      }
      
      const user = await storage.getUserByEmail(email);
      
      // Always return success to prevent email enumeration
      if (!user) {
        return res.json({ 
          success: true, 
          message: "Se l'email esiste, riceverai un link per reimpostare la password" 
        });
      }
      
      // Generate secure token
      const crypto = await import('crypto');
      const token = crypto.randomBytes(32).toString('hex');
      const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
      
      // Save token to database
      await storage.createPasswordResetToken(user.id, token, expiresAt);
      
      // Send email with reset link
      const resetLink = `${process.env.APP_URL || 'https://seaboo.it'}/reset-password?token=${token}`;
      
      try {
        const nodemailer = await import('nodemailer');
        
        if (process.env.GMAIL_USER && process.env.GMAIL_APP_PASSWORD) {
          const transporter = nodemailer.default.createTransport({
            service: 'gmail',
            auth: {
              user: process.env.GMAIL_USER,
              pass: process.env.GMAIL_APP_PASSWORD
            }
          });
          
          await transporter.sendMail({
            from: process.env.GMAIL_USER,
            to: email,
            subject: 'Reimposta la tua password - SeaBoo',
            html: `
              <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #0ea5e9;">Reimposta la tua password</h2>
                <p>Hai richiesto di reimpostare la password del tuo account SeaBoo.</p>
                <p>Clicca il pulsante qui sotto per creare una nuova password:</p>
                <a href="${resetLink}" style="display: inline-block; background-color: #0ea5e9; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0;">Reimposta Password</a>
                <p style="color: #666; font-size: 14px;">Questo link scadrà tra 1 ora.</p>
                <p style="color: #666; font-size: 14px;">Se non hai richiesto questo reset, ignora questa email.</p>
                <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;" />
                <p style="color: #999; font-size: 12px;">SeaBoo - Piattaforma Marittima</p>
              </div>
            `,
          });
          
          console.log('Password reset email sent to:', email);
        } else {
          console.log('⚠️ Credenziali Gmail non configurate per password reset');
        }
      } catch (emailError) {
        console.error('Error sending password reset email:', emailError);
        // Continue even if email fails - log for debugging
      }
      
      res.json({ 
        success: true, 
        message: "Se l'email esiste, riceverai un link per reimpostare la password" 
      });
    } catch (error: any) {
      console.error("Forgot password error:", error);
      res.status(500).json({ error: "Errore durante la richiesta" });
    }
  });

  // Password Reset - Verify token
  app.get('/api/auth/reset-password/:token', async (req, res) => {
    try {
      const { token } = req.params;
      const resetToken = await storage.getPasswordResetToken(token);
      
      if (!resetToken) {
        return res.status(400).json({ valid: false, error: "Token non valido" });
      }
      
      if (resetToken.usedAt) {
        return res.status(400).json({ valid: false, error: "Token già utilizzato" });
      }
      
      if (new Date() > new Date(resetToken.expiresAt)) {
        return res.status(400).json({ valid: false, error: "Token scaduto" });
      }
      
      res.json({ valid: true });
    } catch (error) {
      console.error("Verify reset token error:", error);
      res.status(500).json({ valid: false, error: "Errore durante la verifica" });
    }
  });

  // Password Reset - Set new password
  app.post('/api/auth/reset-password', async (req, res) => {
    try {
      const { token, password } = req.body;
      
      if (!token || !password) {
        return res.status(400).json({ error: "Token e password richiesti" });
      }
      
      if (password.length < 6) {
        return res.status(400).json({ error: "La password deve avere almeno 6 caratteri" });
      }
      
      const resetToken = await storage.getPasswordResetToken(token);
      
      if (!resetToken) {
        return res.status(400).json({ error: "Token non valido" });
      }
      
      if (resetToken.usedAt) {
        return res.status(400).json({ error: "Token già utilizzato" });
      }
      
      if (new Date() > new Date(resetToken.expiresAt)) {
        return res.status(400).json({ error: "Token scaduto" });
      }
      
      // Hash new password
      const bcrypt = await import('bcryptjs');
      const hashedPassword = await bcrypt.hash(password, 12);
      
      // Update user password
      await storage.updateUserPassword(resetToken.userId, hashedPassword);
      
      // Mark token as used
      await storage.markPasswordResetTokenUsed(token);
      
      res.json({ success: true, message: "Password aggiornata con successo" });
    } catch (error) {
      console.error("Reset password error:", error);
      res.status(500).json({ error: "Errore durante il reset della password" });
    }
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
      
      // Map capacity to maxPersons and port to location for frontend compatibility
      const mappedBoats = boats.map(boat => {
        // Log boat 32 images for debugging
        if (boat.id === 32) {
          console.log("Boat 32 images type:", typeof boat.images, "isArray:", Array.isArray(boat.images), "length:", boat.images?.length);
        }
        return {
          ...boat,
          maxPersons: boat.capacity,
          location: boat.port,
        };
      });
      
      res.json({ boats: mappedBoats });
    } catch (error) {
      console.error("Get boats error:", error);
      res.status(500).json({ error: "Errore nel recupero delle barche" });
    }
  });

  app.get('/api/boats/:id', async (req, res) => {
    try {
      const boatId = parseInt(req.params.id);
      const boat = await storage.getBoat(boatId);
      
      if (!boat) {
        return res.status(404).json({ error: "Barca non trovata" });
      }
      
      // Map capacity to maxPersons and port to location for frontend compatibility
      const mappedBoat = {
        ...boat,
        maxPersons: boat.capacity,
        location: boat.port,
      };
      
      res.json(mappedBoat);
    } catch (error) {
      console.error("Get boat error:", error);
      res.status(500).json({ error: "Errore nel recupero della barca" });
    }
  });

  app.get('/api/owner/boats', requireAuth, requireOwner, async (req: any, res) => {
    try {
      const boats = await storage.getBoatsByOwner(req.session.user.id);
      
      // Map capacity to maxPersons for frontend compatibility
      const mappedBoats = boats.map(boat => ({
        ...boat,
        maxPersons: boat.capacity,
      }));
      
      res.json({ boats: mappedBoats });
    } catch (error) {
      console.error("Get owner boats error:", error);
      res.status(500).json({ error: "Errore nel recupero delle barche" });
    }
  });

  app.post('/api/boats', requireAuth, requireOwner, upload.array('images', 5), async (req: any, res) => {
    try {
      console.log('POST /api/boats - req.body:', JSON.stringify(req.body, null, 2));
      
      // Convert empty strings to null ONLY for optional numeric fields
      // capacity is required (maps to max_persons in DB), so don't convert it
      const cleanedBody = {
        ...req.body,
        // Map maxPersons to capacity for the schema
        capacity: req.body.maxPersons,
        length: req.body.length === '' ? null : req.body.length,
        year: req.body.year === '' ? null : req.body.year,
        cabins: req.body.cabins === '' ? null : req.body.cabins,
        bathrooms: req.body.bathrooms === '' ? null : req.body.bathrooms,
        enginePower: req.body.enginePower === '' ? null : req.body.enginePower,
        fuelConsumption: req.body.fuelConsumption === '' ? null : req.body.fuelConsumption,
        latitude: req.body.latitude === '' ? null : req.body.latitude,
        longitude: req.body.longitude === '' ? null : req.body.longitude,
      };
      
      const boatData = insertBoatSchema.parse({
        ...cleanedBody,
        hostId: parseInt(req.session.user.id),
        images: req.files ? req.files.map((file: any) => `/uploads/${file.filename}`) : []
      });

      const boat = await storage.createBoat(boatData);
      
      // Map capacity to maxPersons for frontend compatibility
      const mappedBoat = {
        ...boat,
        maxPersons: boat.capacity,
      };
      
      res.json({ success: true, boat: mappedBoat });
    } catch (error: any) {
      console.error("Create boat error:", error);
      res.status(400).json({ error: error.message || "Errore nella creazione della barca" });
    }
  });

  app.put('/api/boats/:id', requireAuth, requireOwner, async (req: any, res) => {
    try {
      const boatId = parseInt(req.params.id);
      console.log('PUT /api/boats/:id - boatId:', boatId, 'userId:', req.session.user.id);
      
      // Verify boat ownership
      const existingBoat = await storage.getBoat(boatId);
      console.log('existingBoat:', existingBoat ? { id: existingBoat.id, hostId: existingBoat.hostId } : null);
      
      if (!existingBoat) {
        console.log('Boat not found');
        return res.status(404).json({ error: "Barca non trovata" });
      }
      
      if (Number(existingBoat.hostId) !== Number(req.session.user.id)) {
        console.log('Not owner - hostId:', existingBoat.hostId, 'userId:', req.session.user.id);
        return res.status(404).json({ error: "Barca non trovata" });
      }

      // Map maxPersons to capacity for the schema (same as POST)
      const updateData: any = { ...req.body };
      if (req.body.maxPersons !== undefined) {
        updateData.capacity = req.body.maxPersons;
        delete updateData.maxPersons; // Remove the old field
      }
      
      // Handle images - can be base64 strings or existing URLs
      if (req.body.images && Array.isArray(req.body.images)) {
        updateData.images = req.body.images;
      }

      const boat = await storage.updateBoat(boatId, updateData);
      
      // Map capacity to maxPersons for frontend compatibility
      const mappedBoat = {
        ...boat,
        maxPersons: boat.capacity,
      };
      
      res.json({ success: true, boat: mappedBoat });
    } catch (error: any) {
      console.error("Update boat error:", error);
      res.status(400).json({ error: error.message || "Errore nell'aggiornamento della barca" });
    }
  });

  app.delete('/api/boats/:id', requireAuth, requireOwner, async (req: any, res) => {
    try {
      const boatId = parseInt(req.params.id);
      const userId = parseInt(req.session.user.id);
      console.log('DELETE /api/boats/:id - boatId:', boatId, 'userId:', userId);
      
      // Verify boat ownership
      const existingBoat = await storage.getBoat(boatId);
      console.log('Existing boat:', existingBoat);
      
      if (!existingBoat) {
        console.log('Boat not found');
        return res.status(404).json({ error: "Barca non trovata" });
      }
      
      if (existingBoat.hostId !== userId) {
        console.log('Not owner - hostId:', existingBoat.hostId, 'userId:', userId);
        return res.status(403).json({ error: "Non sei il proprietario di questa barca" });
      }

      const success = await storage.deleteBoat(boatId);
      console.log('Delete result:', success);
      
      if (success) {
        res.json({ success: true });
      } else {
        res.status(404).json({ error: "Barca non trovata" });
      }
    } catch (error: any) {
      console.error("Delete boat error:", error);
      // Check if it's a foreign key constraint error
      if (error.code === '23503') {
        return res.status(400).json({ 
          error: "Impossibile eliminare la barca: ci sono prenotazioni attive. Cancella prima le prenotazioni." 
        });
      }
      res.status(500).json({ error: "Errore nell'eliminazione della barca" });
    }
  });

  // Boat Availability endpoints
  
  // Get availability for a specific boat
  app.get('/api/boats/:id/availability', async (req, res) => {
    try {
      const boatId = parseInt(req.params.id);
      const startDate = req.query.startDate ? new Date(req.query.startDate as string) : undefined;
      const endDate = req.query.endDate ? new Date(req.query.endDate as string) : undefined;
      
      const availability = await storage.getBoatAvailability(boatId, startDate, endDate);
      res.json(availability);
    } catch (error: any) {
      console.error("Get boat availability error:", error);
      res.status(500).json({ error: "Errore nel recupero della disponibilità" });
    }
  });

  // Create availability (owner only)
  app.post('/api/availability', requireAuth, requireOwner, async (req: any, res) => {
    try {
      const userId = parseInt(req.session.user.id);
      const availabilityData = insertBoatAvailabilitySchema.parse(req.body);
      
      // Verify boat ownership
      const boat = await storage.getBoat(availabilityData.boatId);
      if (!boat) {
        return res.status(404).json({ error: "Barca non trovata" });
      }
      
      if (boat.hostId !== userId) {
        return res.status(403).json({ error: "Non sei il proprietario di questa barca" });
      }
      
      const availability = await storage.createAvailability(availabilityData);
      res.json(availability);
    } catch (error: any) {
      console.error("Create availability error:", error);
      res.status(400).json({ error: error.message || "Errore nella creazione della disponibilità" });
    }
  });

  // Update availability (owner only)
  app.patch('/api/availability/:id', requireAuth, requireOwner, async (req: any, res) => {
    try {
      const availabilityId = parseInt(req.params.id);
      const userId = parseInt(req.session.user.id);
      const updateData = req.body;
      
      // Get existing availability to verify ownership
      const existingAvailabilities = await storage.getBoatAvailability(updateData.boatId);
      const existingAvailability = existingAvailabilities.find(a => a.id === availabilityId);
      
      if (!existingAvailability) {
        return res.status(404).json({ error: "Disponibilità non trovata" });
      }
      
      // Verify boat ownership
      const boat = await storage.getBoat(existingAvailability.boatId);
      if (!boat || boat.hostId !== userId) {
        return res.status(403).json({ error: "Non sei il proprietario di questa barca" });
      }
      
      const availability = await storage.updateAvailability(availabilityId, updateData);
      res.json(availability);
    } catch (error: any) {
      console.error("Update availability error:", error);
      res.status(400).json({ error: error.message || "Errore nell'aggiornamento della disponibilità" });
    }
  });

  // Delete availability (owner only)
  app.delete('/api/availability/:id', requireAuth, requireOwner, async (req: any, res) => {
    try {
      const availabilityId = parseInt(req.params.id);
      const userId = parseInt(req.session.user.id);
      
      // We need to get the availability first to check ownership
      // Since we don't have a direct method, we'll need to get it through the boat
      const boatId = parseInt(req.query.boatId as string);
      
      if (!boatId) {
        return res.status(400).json({ error: "boatId richiesto" });
      }
      
      // Verify boat ownership
      const boat = await storage.getBoat(boatId);
      if (!boat) {
        return res.status(404).json({ error: "Barca non trovata" });
      }
      
      if (boat.hostId !== userId) {
        return res.status(403).json({ error: "Non sei il proprietario di questa barca" });
      }
      
      const success = await storage.deleteAvailability(availabilityId);
      
      if (success) {
        res.json({ success: true });
      } else {
        res.status(404).json({ error: "Disponibilità non trovata" });
      }
    } catch (error: any) {
      console.error("Delete availability error:", error);
      res.status(500).json({ error: "Errore nell'eliminazione della disponibilità" });
    }
  });

  // Create booking endpoint
  app.post('/api/bookings', requireAuth, async (req, res) => {
    try {
      const bookingData = insertBookingSchema.parse(req.body);
      const booking = await storage.createBooking(bookingData);
      res.json(booking);
    } catch (error: any) {
      console.error("Create booking error:", error);
      res.status(400).json({ error: error.message || "Errore nella creazione della prenotazione" });
    }
  });

  // Get customer bookings endpoint
  app.get('/api/bookings', requireAuth, async (req: any, res) => {
    try {
      const bookings = await storage.getBookingsByCustomer(req.session.user.id);
      res.json({ bookings });
    } catch (error) {
      console.error("Get customer bookings error:", error);
      res.status(500).json({ error: "Errore nel recupero delle prenotazioni" });
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

  // ========== MOORINGS API ==========
  
  // Get owner's moorings
  app.get('/api/owner/moorings', requireAuth, requireOwner, async (req: any, res) => {
    try {
      const moorings = await storage.getMooringsByOwner(req.session.user.id);
      res.json({ moorings });
    } catch (error) {
      console.error("Get owner moorings error:", error);
      res.status(500).json({ error: "Errore nel recupero degli ormeggi" });
    }
  });

  // Create mooring
  app.post('/api/owner/moorings', requireAuth, requireOwner, async (req: any, res) => {
    try {
      const mooringData = {
        ...req.body,
        managerId: req.session.user.id,
      };
      const mooring = await storage.createMooring(mooringData);
      res.json(mooring);
    } catch (error: any) {
      console.error("Create mooring error:", error);
      res.status(400).json({ error: error.message || "Errore nella creazione dell'ormeggio" });
    }
  });

  // Update mooring
  app.patch('/api/owner/moorings/:id', requireAuth, requireOwner, async (req: any, res) => {
    try {
      const mooringId = parseInt(req.params.id);
      const mooring = await storage.updateMooring(mooringId, req.session.user.id, req.body);
      if (!mooring) {
        return res.status(404).json({ error: "Ormeggio non trovato" });
      }
      res.json(mooring);
    } catch (error: any) {
      console.error("Update mooring error:", error);
      res.status(400).json({ error: error.message || "Errore nell'aggiornamento dell'ormeggio" });
    }
  });

  // Delete mooring
  app.delete('/api/owner/moorings/:id', requireAuth, requireOwner, async (req: any, res) => {
    try {
      const mooringId = parseInt(req.params.id);
      await storage.deleteMooring(mooringId, req.session.user.id);
      res.json({ success: true });
    } catch (error: any) {
      console.error("Delete mooring error:", error);
      res.status(400).json({ error: error.message || "Errore nell'eliminazione dell'ormeggio" });
    }
  });

  // Mooring availability endpoints
  app.get('/api/owner/moorings/:id/availability', requireAuth, requireOwner, async (req: any, res) => {
    try {
      const mooringId = parseInt(req.params.id);
      const availability = await storage.getMooringAvailability(mooringId);
      res.json({ availability });
    } catch (error: any) {
      console.error("Get mooring availability error:", error);
      res.status(400).json({ error: error.message || "Errore nel recupero disponibilità" });
    }
  });

  app.post('/api/owner/moorings/:id/availability', requireAuth, requireOwner, async (req: any, res) => {
    try {
      const mooringId = parseInt(req.params.id);
      const availabilityData = {
        ...req.body,
        mooringId,
      };
      const availability = await storage.createMooringAvailability(availabilityData);
      res.json(availability);
    } catch (error: any) {
      console.error("Create mooring availability error:", error);
      res.status(400).json({ error: error.message || "Errore nella creazione disponibilità" });
    }
  });

  app.patch('/api/owner/moorings/:id/availability/:availId', requireAuth, requireOwner, async (req: any, res) => {
    try {
      const availId = parseInt(req.params.availId);
      const availability = await storage.updateMooringAvailability(availId, req.body);
      if (!availability) {
        return res.status(404).json({ error: "Disponibilità non trovata" });
      }
      res.json(availability);
    } catch (error: any) {
      console.error("Update mooring availability error:", error);
      res.status(400).json({ error: error.message || "Errore nell'aggiornamento disponibilità" });
    }
  });

  app.delete('/api/owner/moorings/:id/availability/:availId', requireAuth, requireOwner, async (req: any, res) => {
    try {
      const availId = parseInt(req.params.availId);
      await storage.deleteMooringAvailability(availId);
      res.json({ success: true });
    } catch (error: any) {
      console.error("Delete mooring availability error:", error);
      res.status(400).json({ error: error.message || "Errore nell'eliminazione disponibilità" });
    }
  });

  // =============== EXPERIENCES API ===============
  
  app.get('/api/experiences', async (req, res) => {
    try {
      const experiencesList = await storage.getExperiences();
      res.json(experiencesList);
    } catch (error: any) {
      console.error("Get experiences error:", error);
      res.status(500).json({ error: "Errore nel recupero esperienze" });
    }
  });

  app.get('/api/experiences/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const experience = await storage.getExperience(id);
      if (!experience) {
        return res.status(404).json({ error: "Esperienza non trovata" });
      }
      res.json(experience);
    } catch (error: any) {
      console.error("Get experience error:", error);
      res.status(500).json({ error: "Errore nel recupero esperienza" });
    }
  });

  app.get('/api/owner/experiences', requireAuth, requireOwner, async (req: any, res) => {
    try {
      const userId = parseInt(req.session.user.id);
      const experiencesList = await storage.getExperiencesByOwner(userId);
      res.json(experiencesList);
    } catch (error: any) {
      console.error("Get owner experiences error:", error);
      res.status(500).json({ error: "Errore nel recupero esperienze" });
    }
  });

  app.post('/api/owner/experiences', requireAuth, requireOwner, async (req: any, res) => {
    try {
      const userId = parseInt(req.session.user.id);
      const experienceData = { ...req.body, hostId: userId };
      const experience = await storage.createExperience(experienceData);
      res.status(201).json(experience);
    } catch (error: any) {
      console.error("Create experience error:", error);
      res.status(400).json({ error: error.message || "Errore nella creazione esperienza" });
    }
  });

  app.patch('/api/owner/experiences/:id', requireAuth, requireOwner, async (req: any, res) => {
    try {
      const id = parseInt(req.params.id);
      const userId = parseInt(req.session.user.id);
      const experience = await storage.updateExperience(id, userId, req.body);
      if (!experience) {
        return res.status(404).json({ error: "Esperienza non trovata o non autorizzato" });
      }
      res.json(experience);
    } catch (error: any) {
      console.error("Update experience error:", error);
      res.status(400).json({ error: error.message || "Errore nell'aggiornamento esperienza" });
    }
  });

  app.delete('/api/owner/experiences/:id', requireAuth, requireOwner, async (req: any, res) => {
    try {
      const id = parseInt(req.params.id);
      const userId = parseInt(req.session.user.id);
      const deleted = await storage.deleteExperience(id, userId);
      if (!deleted) {
        return res.status(404).json({ error: "Esperienza non trovata o non autorizzato" });
      }
      res.json({ success: true });
    } catch (error: any) {
      console.error("Delete experience error:", error);
      res.status(400).json({ error: error.message || "Errore nell'eliminazione esperienza" });
    }
  });

  // ============ REVIEWS API ============
  
  // Get reviews for a booking
  app.get('/api/reviews/booking/:bookingId', requireAuth, async (req: any, res) => {
    try {
      const bookingId = parseInt(req.params.bookingId);
      const reviews = await storage.getReviewsByBooking(bookingId);
      res.json(reviews);
    } catch (error: any) {
      console.error("Get reviews by booking error:", error);
      res.status(500).json({ error: "Errore nel recupero recensioni" });
    }
  });

  // Get reviews received by a user (as reviewee)
  app.get('/api/reviews/user/:userId', async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const reviews = await storage.getReviewsByUser(userId, false);
      res.json(reviews);
    } catch (error: any) {
      console.error("Get reviews by user error:", error);
      res.status(500).json({ error: "Errore nel recupero recensioni" });
    }
  });

  // Get reviews for a boat
  app.get('/api/reviews/boat/:boatId', async (req, res) => {
    try {
      const boatId = parseInt(req.params.boatId);
      const reviews = await storage.getReviewsByBoat(boatId);
      res.json(reviews);
    } catch (error: any) {
      console.error("Get reviews by boat error:", error);
      res.status(500).json({ error: "Errore nel recupero recensioni" });
    }
  });

  // Get my reviews (written by me)
  app.get('/api/reviews/my-reviews', requireAuth, async (req: any, res) => {
    try {
      const userId = parseInt(req.session.user.id);
      const reviews = await storage.getReviewsByUser(userId, true);
      res.json(reviews);
    } catch (error: any) {
      console.error("Get my reviews error:", error);
      res.status(500).json({ error: "Errore nel recupero recensioni" });
    }
  });

  // Check if user can write a review
  app.get('/api/reviews/can-review/:bookingId', requireAuth, async (req: any, res) => {
    try {
      const bookingId = parseInt(req.params.bookingId);
      const userId = parseInt(req.session.user.id);
      const userRole = req.session.user.role;
      
      const type = userRole === 'owner' ? 'owner_to_customer' : 'customer_to_owner';
      const canReview = await storage.canUserReview(bookingId, userId, type);
      
      res.json({ canReview, type });
    } catch (error: any) {
      console.error("Can review check error:", error);
      res.status(500).json({ error: "Errore nella verifica" });
    }
  });

  // Create a new review
  app.post('/api/reviews', requireAuth, async (req: any, res) => {
    try {
      const userId = parseInt(req.session.user.id);
      const { bookingId, type, rating, cleanliness, communication, accuracy, value, title, comment } = req.body;
      
      // Validate type
      if (!['customer_to_owner', 'owner_to_customer'].includes(type)) {
        return res.status(400).json({ error: "Tipo recensione non valido" });
      }
      
      // Check if can review
      const canReview = await storage.canUserReview(bookingId, userId, type);
      if (!canReview) {
        return res.status(403).json({ error: "Non puoi scrivere questa recensione" });
      }
      
      // Get booking to determine reviewee
      const booking = await storage.getBooking(bookingId);
      if (!booking) {
        return res.status(404).json({ error: "Prenotazione non trovata" });
      }
      
      let revieweeId: number;
      if (type === 'customer_to_owner') {
        // Customer reviewing owner - get boat owner
        const boat = await storage.getBoat(booking.boatId);
        if (!boat) {
          return res.status(404).json({ error: "Barca non trovata" });
        }
        revieweeId = boat.hostId;
      } else {
        // Owner reviewing customer
        revieweeId = booking.customerId;
      }
      
      const review = await storage.createReview({
        bookingId,
        reviewerId: userId,
        revieweeId,
        boatId: booking.boatId,
        type,
        rating,
        cleanliness,
        communication,
        accuracy,
        value,
        title,
        comment
      });
      
      res.json(review);
    } catch (error: any) {
      console.error("Create review error:", error);
      res.status(500).json({ error: error.message || "Errore nella creazione recensione" });
    }
  });

  // Invoice/Receipt API Routes
  
  // Get all invoices for current user
  app.get('/api/invoices', requireAuth, async (req: any, res) => {
    try {
      const userId = parseInt(req.session.user.id);
      const invoices = await storage.getInvoicesByUser(userId);
      res.json(invoices);
    } catch (error: any) {
      console.error("Get invoices error:", error);
      res.status(500).json({ error: "Errore nel recupero delle fatture" });
    }
  });

  // Get invoice by ID
  app.get('/api/invoices/:id', requireAuth, async (req: any, res) => {
    try {
      const invoiceId = parseInt(req.params.id);
      const userId = parseInt(req.session.user.id);
      
      const invoice = await storage.getInvoice(invoiceId);
      if (!invoice) {
        return res.status(404).json({ error: "Fattura non trovata" });
      }
      
      // Check authorization
      if (invoice.userId !== userId) {
        return res.status(403).json({ error: "Non autorizzato" });
      }
      
      res.json(invoice);
    } catch (error: any) {
      console.error("Get invoice error:", error);
      res.status(500).json({ error: "Errore nel recupero della fattura" });
    }
  });

  // Get invoices for a booking (only authorized users)
  app.get('/api/invoices/booking/:bookingId', requireAuth, async (req: any, res) => {
    try {
      const bookingId = parseInt(req.params.bookingId);
      const userId = parseInt(req.session.user.id);
      
      // Verify user is authorized to see this booking's invoices
      const booking = await storage.getBooking(bookingId);
      if (!booking) {
        return res.status(404).json({ error: "Prenotazione non trovata" });
      }
      
      // Check if user is customer or boat owner
      const boat = await storage.getBoat(booking.boatId);
      if (booking.customerId !== userId && boat?.hostId !== userId) {
        return res.status(403).json({ error: "Non autorizzato" });
      }
      
      const invoices = await storage.getInvoicesByBooking(bookingId);
      res.json(invoices);
    } catch (error: any) {
      console.error("Get invoices by booking error:", error);
      res.status(500).json({ error: "Errore nel recupero delle fatture" });
    }
  });

  // Generate customer receipt for a completed booking
  app.post('/api/invoices/generate-receipt/:bookingId', requireAuth, async (req: any, res) => {
    try {
      const bookingId = parseInt(req.params.bookingId);
      const userId = parseInt(req.session.user.id);
      
      // Get booking
      const booking = await storage.getBooking(bookingId);
      if (!booking) {
        return res.status(404).json({ error: "Prenotazione non trovata" });
      }
      
      // Check if user is the customer
      if (booking.customerId !== userId) {
        return res.status(403).json({ error: "Non autorizzato" });
      }
      
      // Check if booking is completed or confirmed
      if (!['completed', 'confirmed'].includes(booking.status || '')) {
        return res.status(400).json({ error: "La prenotazione deve essere confermata o completata" });
      }
      
      // Check if receipt already exists
      const existingInvoices = await storage.getInvoicesByBooking(bookingId);
      const existingReceipt = existingInvoices.find(i => i.type === 'customer_receipt' && i.userId === userId);
      if (existingReceipt) {
        return res.json(existingReceipt);
      }
      
      // Get boat and user info
      const boat = await storage.getBoat(booking.boatId);
      const user = await storage.getUser(userId);
      
      if (!boat || !user) {
        return res.status(404).json({ error: "Dati non trovati" });
      }
      
      // Generate invoice number
      const invoiceNumber = await storage.generateInvoiceNumber('customer_receipt');
      
      // Calculate amounts
      const subtotal = parseFloat(booking.totalPrice || '0');
      const vat = subtotal * 0.22; // 22% VAT
      const total = subtotal;
      
      // Create receipt
      const receipt = await storage.createInvoice({
        invoiceNumber,
        type: 'customer_receipt',
        userId,
        bookingId,
        boatId: booking.boatId,
        subtotal: (subtotal - vat).toFixed(2),
        vat: vat.toFixed(2),
        total: total.toFixed(2),
        customerName: `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.username,
        customerEmail: user.email,
        boatName: boat.name,
        bookingStartDate: booking.startDate.toISOString().split('T')[0],
        bookingEndDate: booking.endDate.toISOString().split('T')[0],
        status: 'issued',
        paidAt: new Date(),
      });
      
      res.json(receipt);
    } catch (error: any) {
      console.error("Generate receipt error:", error);
      res.status(500).json({ error: error.message || "Errore nella generazione della ricevuta" });
    }
  });

  // Generate monthly report for boat owner
  app.post('/api/invoices/generate-monthly-report', requireAuth, async (req: any, res) => {
    try {
      const userId = parseInt(req.session.user.id);
      const userRole = req.session.user.role;
      
      if (userRole !== 'owner') {
        return res.status(403).json({ error: "Solo i noleggiatori possono generare report mensili" });
      }
      
      const { year, month } = req.body;
      
      if (!year || !month) {
        return res.status(400).json({ error: "Anno e mese richiesti" });
      }
      
      // Get user info
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ error: "Utente non trovato" });
      }
      
      // Get all boats for this owner
      const boats = await storage.getBoatsByOwner(userId);
      const boatIds = boats.map(b => b.id);
      
      // Calculate period
      const periodStart = new Date(year, month - 1, 1);
      const periodEnd = new Date(year, month, 0);
      
      // Check if report already exists
      const existingInvoices = await storage.getInvoicesByUser(userId);
      const existingReport = existingInvoices.find(i => 
        i.type === 'owner_monthly_report' && 
        i.periodStart === periodStart.toISOString().split('T')[0] &&
        i.periodEnd === periodEnd.toISOString().split('T')[0]
      );
      
      if (existingReport) {
        return res.json(existingReport);
      }
      
      // Get all bookings for this period (we'll need to aggregate from booking data)
      // For now, create a summary report
      const invoiceNumber = await storage.generateInvoiceNumber('owner_monthly_report');
      
      // Calculate totals from bookings (simplified - you may want to query actual bookings)
      let totalRevenue = 0;
      let totalCommission = 0;
      
      // For each boat, get completed bookings in period
      for (const boat of boats) {
        const bookings = await storage.getBookingsByOwner(userId);
        const periodBookings = bookings.filter(b => {
          const bookingDate = new Date(b.startDate);
          return b.boatId === boat.id && 
                 b.status === 'completed' &&
                 bookingDate >= periodStart && 
                 bookingDate <= periodEnd;
        });
        
        for (const booking of periodBookings) {
          totalRevenue += parseFloat(booking.totalPrice || '0');
          totalCommission += parseFloat(booking.commission || '0');
        }
      }
      
      const netAmount = totalRevenue - totalCommission;
      
      // Create monthly report
      const report = await storage.createInvoice({
        invoiceNumber,
        type: 'owner_monthly_report',
        userId,
        subtotal: totalRevenue.toFixed(2),
        commission: totalCommission.toFixed(2),
        total: netAmount.toFixed(2),
        periodStart: periodStart.toISOString().split('T')[0],
        periodEnd: periodEnd.toISOString().split('T')[0],
        customerName: user.businessName || `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.username,
        customerEmail: user.email,
        customerVatNumber: user.vatNumber || undefined,
        status: 'issued',
        notes: `Report mensile ${month}/${year} - ${boats.length} barche`,
      });
      
      res.json(report);
    } catch (error: any) {
      console.error("Generate monthly report error:", error);
      res.status(500).json({ error: error.message || "Errore nella generazione del report" });
    }
  });

  // Local Fees API Routes (Oneri Locali e Adempimenti)
  
  // Get all local fees
  app.get('/api/local-fees', async (_req, res) => {
    try {
      const fees = await storage.getAllLocalFees();
      res.json(fees);
    } catch (error: any) {
      console.error("Get local fees error:", error);
      res.status(500).json({ error: "Errore nel recupero degli oneri locali" });
    }
  });

  // Get local fees by region
  app.get('/api/local-fees/region/:region', async (req, res) => {
    try {
      const { region } = req.params;
      const fees = await storage.getLocalFeesByRegion(region);
      res.json(fees);
    } catch (error: any) {
      console.error("Get local fees by region error:", error);
      res.status(500).json({ error: "Errore nel recupero degli oneri locali" });
    }
  });

  // Search local fees by area (query params: region, municipality, port)
  app.get('/api/local-fees/search', async (req, res) => {
    try {
      const { region, municipality, port } = req.query;
      const fees = await storage.getLocalFeesByArea(
        region as string | undefined,
        municipality as string | undefined,
        port as string | undefined
      );
      res.json(fees);
    } catch (error: any) {
      console.error("Search local fees error:", error);
      res.status(500).json({ error: "Errore nella ricerca degli oneri locali" });
    }
  });

  // Create local fee (admin only)
  app.post('/api/local-fees', requireAuth, async (req: any, res) => {
    try {
      const userRole = req.session.user.role;
      if (userRole !== 'admin') {
        return res.status(403).json({ error: "Solo gli amministratori possono creare oneri locali" });
      }
      
      const { insertLocalFeeSchema } = await import("@shared/schema");
      const validatedData = insertLocalFeeSchema.parse(req.body);
      const fee = await storage.createLocalFee(validatedData);
      res.json(fee);
    } catch (error: any) {
      console.error("Create local fee error:", error);
      if (error.name === 'ZodError') {
        return res.status(400).json({ error: "Dati non validi", details: error.errors });
      }
      res.status(500).json({ error: error.message || "Errore nella creazione dell'onere locale" });
    }
  });

  // Update local fee (admin only)
  app.patch('/api/local-fees/:id', requireAuth, async (req: any, res) => {
    try {
      const userRole = req.session.user.role;
      if (userRole !== 'admin') {
        return res.status(403).json({ error: "Solo gli amministratori possono modificare gli oneri locali" });
      }
      
      const { insertLocalFeeSchema } = await import("@shared/schema");
      const partialSchema = insertLocalFeeSchema.partial();
      const validatedData = partialSchema.parse(req.body);
      
      const id = parseInt(req.params.id);
      const fee = await storage.updateLocalFee(id, validatedData);
      
      if (!fee) {
        return res.status(404).json({ error: "Onere locale non trovato" });
      }
      
      res.json(fee);
    } catch (error: any) {
      console.error("Update local fee error:", error);
      if (error.name === 'ZodError') {
        return res.status(400).json({ error: "Dati non validi", details: error.errors });
      }
      res.status(500).json({ error: error.message || "Errore nell'aggiornamento dell'onere locale" });
    }
  });

  // Get unique regions for dropdown
  app.get('/api/local-fees/regions', async (_req, res) => {
    try {
      const fees = await storage.getAllLocalFees();
      const regions = [...new Set(fees.map(f => f.region))].sort();
      res.json(regions);
    } catch (error: any) {
      console.error("Get regions error:", error);
      res.status(500).json({ error: "Errore nel recupero delle regioni" });
    }
  });

  // Serve static files
  app.use('/uploads', (req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    next();
  });

  // Serve mobile native preview
  app.get('/mobile-native-preview', (req, res) => {
    res.sendFile(path.join(__dirname, '../mobile-native-preview.html'));
  });

  // Serve mobile native app viewer
  app.get('/mobile-native-app', (req, res) => {
    res.sendFile(path.join(__dirname, '../mobile-native-app-viewer.html'));
  });

  // Support page for App Store requirement
  app.get('/supporto', (req, res) => {
    res.send(`
<!DOCTYPE html>
<html lang="it">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Supporto - SeaBoo</title>
    <style>
        body { font-family: 'Inter', -apple-system, sans-serif; margin: 0; padding: 20px; background: #f8fafc; }
        .container { max-width: 800px; margin: 0 auto; background: white; padding: 40px; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.1); }
        h1 { color: #0ea5e9; margin-bottom: 30px; }
        h2 { color: #374151; margin-top: 30px; }
        .contact-info { background: #f1f5f9; padding: 20px; border-radius: 8px; margin: 20px 0; }
        .faq { margin: 20px 0; }
        .faq-item { margin-bottom: 15px; padding: 15px; border: 1px solid #e5e7eb; border-radius: 8px; }
        a { color: #0ea5e9; text-decoration: none; }
        .logo { text-align: center; margin-bottom: 30px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="logo">
            <h1>🚤 SeaBoo - Centro Supporto</h1>
        </div>
        
        <h2>📞 Contattaci</h2>
        <div class="contact-info">
            <p><strong>Email Supporto:</strong> <a href="mailto:supporto@seaboo.it">supporto@seaboo.it</a></p>
            <p><strong>Orari:</strong> Lunedì - Venerdì 9:00-18:00</p>
            <p><strong>Emergenze in mare:</strong> <a href="tel:1530">1530 (Guardia Costiera)</a></p>
        </div>

        <h2>❓ Domande Frequenti</h2>
        <div class="faq">
            <div class="faq-item">
                <strong>Come prenotare una barca?</strong><br>
                Usa la ricerca, seleziona date e completa il pagamento.
            </div>
            <div class="faq-item">
                <strong>Posso modificare la prenotazione?</strong><br>
                Modifiche possibili fino a 48h prima della partenza.
            </div>
            <div class="faq-item">
                <strong>Che documenti servono?</strong><br>
                Documento d'identità e patente nautica (se richiesta).
            </div>
            <div class="faq-item">
                <strong>Metodi di pagamento?</strong><br>
                Carte di credito, Apple Pay, Google Pay tramite Stripe.
            </div>
        </div>

        <h2>🔐 Privacy e Sicurezza</h2>
        <p>I tuoi dati sono protetti secondo il GDPR. Le transazioni sono sicure tramite Stripe.</p>
        
        <h2>📱 App Mobile</h2>
        <p>Benvenuto su SeaBoo - La piattaforma per il noleggio barche in Italia.</p>
        
        <p style="text-align: center; margin-top: 40px; color: #6b7280;">
            © 2025 SeaBoo. Tutti i diritti riservati.
        </p>
    </div>
</body>
</html>
    `);
  });

  // Payment Intent Creation Endpoint
  app.post('/api/create-payment-intent', async (req, res) => {
    try {
      const { amount, bookingId, currency = 'eur' } = req.body;

      if (!amount || amount <= 0) {
        return res.status(400).json({ error: 'Invalid amount' });
      }

      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(amount * 100), // Convert to cents
        currency: currency,
        metadata: {
          bookingId: bookingId ? bookingId.toString() : '',
          platform: 'seaboo'
        },
        automatic_payment_methods: {
          enabled: true,
        },
      });

      res.json({
        clientSecret: paymentIntent.client_secret
      });
    } catch (error: any) {
      console.error('Payment Intent creation error:', error);
      res.status(500).json({ error: error.message });
    }
  });

  // Stripe Webhook Endpoint
  app.post('/api/stripe/webhook', express.raw({type: 'application/json'}), async (req, res) => {
    const sig = req.headers['stripe-signature'];
    let event;

    try {
      event = stripe.webhooks.constructEvent(req.body, sig!, process.env.STRIPE_WEBHOOK_SECRET!);
    } catch (err: any) {
      console.error('Webhook signature verification failed:', err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Handle the event
    switch (event.type) {
      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object;
        console.log('Payment succeeded:', paymentIntent.id);
        // Update booking status in database
        break;
      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    res.json({received: true});
  });

  // External Services API Endpoints - Real weather data from Open-Meteo
  app.get('/api/external/weather', async (req, res) => {
    const location = (req.query.location as string) || 'Roma';
    
    // Coordinates for Italian coastal locations
    const locationCoords: Record<string, { lat: number; lon: number }> = {
      'Roma': { lat: 41.9028, lon: 12.4964 },
      'Roma / Fiumicino': { lat: 41.7735, lon: 12.2356 },
      'Gaeta': { lat: 41.2144, lon: 13.5712 },
      'Civitavecchia': { lat: 42.0931, lon: 11.7969 },
      'Anzio': { lat: 41.4475, lon: 12.6203 },
      'Ponza': { lat: 40.8958, lon: 12.9631 },
      'Terracina': { lat: 41.2922, lon: 13.2489 },
      'Formia': { lat: 41.2558, lon: 13.6058 },
      'Nettuno': { lat: 41.4589, lon: 12.6650 },
      'San Felice Circeo': { lat: 41.2286, lon: 13.0883 }
    };
    
    const coords = locationCoords[location] || locationCoords['Roma'];
    
    try {
      // Fetch weather data from Open-Meteo
      const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${coords.lat}&longitude=${coords.lon}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m,wind_direction_10m,surface_pressure&hourly=temperature_2m,weather_code,wind_speed_10m&forecast_days=1&timezone=Europe/Rome`;
      
      // Fetch marine data from Open-Meteo Marine API
      const marineUrl = `https://marine-api.open-meteo.com/v1/marine?latitude=${coords.lat}&longitude=${coords.lon}&current=wave_height,wave_direction,wave_period&hourly=wave_height,wave_period&forecast_days=1&timezone=Europe/Rome`;
      
      const [weatherResponse, marineResponse] = await Promise.all([
        fetch(weatherUrl),
        fetch(marineUrl)
      ]);
      
      const weatherJson = await weatherResponse.json();
      const marineJson = await marineResponse.json();
      
      // Map weather code to description
      const getWeatherDescription = (code: number): string => {
        if (code === 0) return 'Sereno';
        if (code <= 3) return 'Parzialmente nuvoloso';
        if (code <= 48) return 'Nuvoloso';
        if (code <= 67) return 'Pioggia';
        if (code <= 77) return 'Neve';
        if (code <= 82) return 'Acquazzone';
        if (code <= 99) return 'Temporale';
        return 'Variabile';
      };
      
      // Build forecast from hourly data
      const forecast = [];
      const hourlyTimes = weatherJson.hourly?.time || [];
      const hourlyTemps = weatherJson.hourly?.temperature_2m || [];
      const hourlyCodes = weatherJson.hourly?.weather_code || [];
      const hourlyWind = weatherJson.hourly?.wind_speed_10m || [];
      const hourlyWaves = marineJson.hourly?.wave_height || [];
      
      for (let i = 0; i < Math.min(4, hourlyTimes.length); i += 3) {
        const idx = Math.min(i * 3, hourlyTimes.length - 1);
        forecast.push({
          time: hourlyTimes[idx] || new Date(Date.now() + i * 3 * 3600000).toISOString(),
          temperature: Math.round(hourlyTemps[idx] || 20),
          description: getWeatherDescription(hourlyCodes[idx] || 0),
          windSpeed: Math.round(hourlyWind[idx] || 10),
          waves: Number((hourlyWaves[idx] || 0.5).toFixed(1))
        });
      }
      
      const weatherData = {
        location: location,
        temperature: Math.round(weatherJson.current?.temperature_2m || 20),
        description: getWeatherDescription(weatherJson.current?.weather_code || 0),
        windSpeed: Math.round(weatherJson.current?.wind_speed_10m || 10),
        windDirection: Math.round(weatherJson.current?.wind_direction_10m || 180),
        humidity: Math.round(weatherJson.current?.relative_humidity_2m || 65),
        pressure: Math.round(weatherJson.current?.surface_pressure || 1013),
        visibility: 10,
        waves: {
          height: Number((marineJson.current?.wave_height || 0.5).toFixed(1)),
          direction: Math.round(marineJson.current?.wave_direction || 180),
          period: Math.round(marineJson.current?.wave_period || 5)
        },
        forecast: forecast,
        dataSource: 'Open-Meteo',
        lastUpdated: new Date().toISOString()
      };
      
      res.json(weatherData);
    } catch (error) {
      console.error('Error fetching weather data:', error);
      // Fallback to default data if API fails
      res.json({
        location: location,
        temperature: 20,
        description: 'Dati non disponibili',
        windSpeed: 10,
        windDirection: 180,
        humidity: 65,
        pressure: 1013,
        visibility: 10,
        waves: { height: 0.5, direction: 180, period: 5 },
        forecast: [],
        error: 'Impossibile recuperare dati meteo reali'
      });
    }
  });

  app.get('/api/external/fuel-prices', (req, res) => {
    const location = (req.query.location as string) || 'Roma';
    
    // Fuel prices data by location
    const fuelPricesByLocation: Record<string, any[]> = {
      'Roma': [
        { station: 'Porto di Fiumicino', location: 'Fiumicino, RM', gasoline: 1.91, diesel: 1.74, lastUpdated: new Date().toISOString(), distance: 3.2, services: ['Rifornimento 24/7', 'Acqua', 'Elettricità'] },
        { station: 'Marina di Ostia', location: 'Ostia, RM', gasoline: 1.88, diesel: 1.71, lastUpdated: new Date().toISOString(), distance: 5.5, services: ['Rifornimento', 'Bar'] }
      ],
      'Roma / Fiumicino': [
        { station: 'Porto di Fiumicino', location: 'Fiumicino, RM', gasoline: 1.91, diesel: 1.74, lastUpdated: new Date().toISOString(), distance: 1.0, services: ['Rifornimento 24/7', 'Acqua', 'Elettricità'] },
        { station: 'Marina di Fregene', location: 'Fregene, RM', gasoline: 1.93, diesel: 1.76, lastUpdated: new Date().toISOString(), distance: 4.2, services: ['Rifornimento', 'Officina'] }
      ],
      'Gaeta': [
        { station: 'Marina di Gaeta', location: 'Gaeta, LT', gasoline: 1.89, diesel: 1.72, lastUpdated: new Date().toISOString(), distance: 2.5, services: ['Rifornimento 24/7', 'Acqua', 'Elettricità'] },
        { station: 'Porto di Formia', location: 'Formia, LT', gasoline: 1.87, diesel: 1.70, lastUpdated: new Date().toISOString(), distance: 6.8, services: ['Rifornimento', 'Acqua'] }
      ],
      'Civitavecchia': [
        { station: 'Porto di Civitavecchia', location: 'Civitavecchia, RM', gasoline: 1.92, diesel: 1.75, lastUpdated: new Date().toISOString(), distance: 1.5, services: ['Rifornimento', 'Officina', 'Bar'] },
        { station: 'Marina Riva di Traiano', location: 'Civitavecchia, RM', gasoline: 1.94, diesel: 1.77, lastUpdated: new Date().toISOString(), distance: 3.0, services: ['Rifornimento 24/7', 'Ristorante'] }
      ],
      'Anzio': [
        { station: 'Porto di Anzio', location: 'Anzio, RM', gasoline: 1.85, diesel: 1.69, lastUpdated: new Date().toISOString(), distance: 1.2, services: ['Rifornimento', 'Acqua'] },
        { station: 'Marina di Nettuno', location: 'Nettuno, RM', gasoline: 1.86, diesel: 1.70, lastUpdated: new Date().toISOString(), distance: 3.5, services: ['Rifornimento', 'Elettricità'] }
      ],
      'Ponza': [
        { station: 'Porto di Ponza', location: 'Ponza, LT', gasoline: 2.05, diesel: 1.89, lastUpdated: new Date().toISOString(), distance: 0.5, services: ['Rifornimento', 'Acqua'] }
      ],
      'Terracina': [
        { station: 'Porto di Terracina', location: 'Terracina, LT', gasoline: 1.88, diesel: 1.71, lastUpdated: new Date().toISOString(), distance: 1.8, services: ['Rifornimento', 'Acqua', 'Bar'] }
      ],
      'Formia': [
        { station: 'Porto di Formia', location: 'Formia, LT', gasoline: 1.87, diesel: 1.70, lastUpdated: new Date().toISOString(), distance: 1.0, services: ['Rifornimento', 'Acqua'] },
        { station: 'Marina di Gaeta', location: 'Gaeta, LT', gasoline: 1.89, diesel: 1.72, lastUpdated: new Date().toISOString(), distance: 5.5, services: ['Rifornimento 24/7', 'Acqua', 'Elettricità'] }
      ],
      'Nettuno': [
        { station: 'Marina di Nettuno', location: 'Nettuno, RM', gasoline: 1.86, diesel: 1.70, lastUpdated: new Date().toISOString(), distance: 1.0, services: ['Rifornimento', 'Elettricità'] },
        { station: 'Porto di Anzio', location: 'Anzio, RM', gasoline: 1.85, diesel: 1.69, lastUpdated: new Date().toISOString(), distance: 2.5, services: ['Rifornimento', 'Acqua'] }
      ],
      'San Felice Circeo': [
        { station: 'Porto del Circeo', location: 'San Felice Circeo, LT', gasoline: 1.90, diesel: 1.73, lastUpdated: new Date().toISOString(), distance: 1.5, services: ['Rifornimento', 'Bar'] },
        { station: 'Porto di Terracina', location: 'Terracina, LT', gasoline: 1.88, diesel: 1.71, lastUpdated: new Date().toISOString(), distance: 8.0, services: ['Rifornimento', 'Acqua', 'Bar'] }
      ]
    };
    
    const fuelPrices = fuelPricesByLocation[location] || fuelPricesByLocation['Roma'];
    res.json(fuelPrices);
  });

  app.get('/api/external/port-services', (req, res) => {
    const location = (req.query.location as string) || 'Roma';
    
    // Port services by location
    const portsByLocation: Record<string, any[]> = {
      'Roma': [
        { id: 'port-fiumicino', name: 'Porto di Fiumicino', location: 'Fiumicino, Lazio', coordinates: { lat: 41.7735, lng: 12.2356 }, services: { mooring: true, fuel: true, water: true, electricity: true, wifi: true, restaurant: true, repair: true, security: true }, pricing: { mooring: 4.0, fuel: 1.91, water: 0.5, electricity: 0.35 }, contact: { phone: '+39 06 6522901', email: 'info@portodifiumicino.it', vhf: 'Canale 16' }, availability: { total: 600, available: 85, reserved: 515 }, rating: 4.3, reviews: 198 },
        { id: 'port-ostia', name: 'Marina di Ostia', location: 'Ostia, Lazio', coordinates: { lat: 41.7302, lng: 12.2856 }, services: { mooring: true, fuel: true, water: true, electricity: true, wifi: true, restaurant: false, repair: false, security: true }, pricing: { mooring: 3.2, fuel: 1.88, water: 0.4, electricity: 0.3 }, contact: { phone: '+39 06 5612345', email: 'info@marinaostia.it', vhf: 'Canale 9' }, availability: { total: 250, available: 32, reserved: 218 }, rating: 4.0, reviews: 76 }
      ],
      'Roma / Fiumicino': [
        { id: 'port-fiumicino', name: 'Porto di Fiumicino', location: 'Fiumicino, Lazio', coordinates: { lat: 41.7735, lng: 12.2356 }, services: { mooring: true, fuel: true, water: true, electricity: true, wifi: true, restaurant: true, repair: true, security: true }, pricing: { mooring: 4.0, fuel: 1.91, water: 0.5, electricity: 0.35 }, contact: { phone: '+39 06 6522901', email: 'info@portodifiumicino.it', vhf: 'Canale 16' }, availability: { total: 600, available: 85, reserved: 515 }, rating: 4.3, reviews: 198 }
      ],
      'Gaeta': [
        { id: 'port-gaeta', name: 'Marina di Gaeta', location: 'Gaeta, Lazio', coordinates: { lat: 41.2119, lng: 13.5704 }, services: { mooring: true, fuel: true, water: true, electricity: true, wifi: true, restaurant: true, repair: true, security: true }, pricing: { mooring: 3.5, fuel: 1.89, water: 0.5, electricity: 0.3 }, contact: { phone: '+39 0771 123456', email: 'info@marinadigaeta.it', vhf: 'Canale 16' }, availability: { total: 500, available: 45, reserved: 455 }, rating: 4.5, reviews: 128 },
        { id: 'port-formia', name: 'Porto di Formia', location: 'Formia, Lazio', coordinates: { lat: 41.2558, lng: 13.6058 }, services: { mooring: true, fuel: true, water: true, electricity: true, wifi: false, restaurant: true, repair: false, security: true }, pricing: { mooring: 2.8, fuel: 1.87, water: 0.4, electricity: 0.25 }, contact: { phone: '+39 0771 789012', email: 'info@portoformia.it', vhf: 'Canale 9' }, availability: { total: 200, available: 18, reserved: 182 }, rating: 4.1, reviews: 65 }
      ],
      'Civitavecchia': [
        { id: 'port-civitavecchia', name: 'Porto di Civitavecchia', location: 'Civitavecchia, Lazio', coordinates: { lat: 42.0922, lng: 11.7950 }, services: { mooring: true, fuel: true, water: true, electricity: true, wifi: false, restaurant: true, repair: true, security: true }, pricing: { mooring: 4.0, fuel: 1.92, water: 0.6, electricity: 0.35 }, contact: { phone: '+39 0766 987654', email: 'info@portocivitavecchia.it', vhf: 'Canale 12' }, availability: { total: 800, available: 120, reserved: 680 }, rating: 4.2, reviews: 256 },
        { id: 'port-riva', name: 'Riva di Traiano', location: 'Civitavecchia, Lazio', coordinates: { lat: 42.0650, lng: 11.7800 }, services: { mooring: true, fuel: true, water: true, electricity: true, wifi: true, restaurant: true, repair: true, security: true }, pricing: { mooring: 5.0, fuel: 1.94, water: 0.6, electricity: 0.4 }, contact: { phone: '+39 0766 567890', email: 'info@rivaditraiano.it', vhf: 'Canale 16' }, availability: { total: 350, available: 28, reserved: 322 }, rating: 4.6, reviews: 189 }
      ],
      'Anzio': [
        { id: 'port-anzio', name: 'Porto di Anzio', location: 'Anzio, Lazio', coordinates: { lat: 41.4511, lng: 12.6230 }, services: { mooring: true, fuel: true, water: true, electricity: true, wifi: true, restaurant: false, repair: false, security: true }, pricing: { mooring: 3.0, fuel: 1.85, water: 0.4, electricity: 0.25 }, contact: { phone: '+39 06 9845678', email: 'info@portoanzio.it', vhf: 'Canale 9' }, availability: { total: 300, available: 28, reserved: 272 }, rating: 4.0, reviews: 89 }
      ],
      'Nettuno': [
        { id: 'port-nettuno', name: 'Marina di Nettuno', location: 'Nettuno, Lazio', coordinates: { lat: 41.4589, lng: 12.6650 }, services: { mooring: true, fuel: true, water: true, electricity: true, wifi: true, restaurant: true, repair: false, security: true }, pricing: { mooring: 2.8, fuel: 1.86, water: 0.4, electricity: 0.25 }, contact: { phone: '+39 06 9876543', email: 'info@marinanettuno.it', vhf: 'Canale 9' }, availability: { total: 180, available: 15, reserved: 165 }, rating: 4.2, reviews: 54 }
      ],
      'Ponza': [
        { id: 'port-ponza', name: 'Porto di Ponza', location: 'Ponza, Lazio', coordinates: { lat: 40.8958, lng: 12.9631 }, services: { mooring: true, fuel: true, water: true, electricity: true, wifi: false, restaurant: true, repair: false, security: true }, pricing: { mooring: 5.5, fuel: 2.05, water: 0.8, electricity: 0.5 }, contact: { phone: '+39 0771 809090', email: 'info@portoponza.it', vhf: 'Canale 16' }, availability: { total: 150, available: 8, reserved: 142 }, rating: 4.4, reviews: 112 }
      ],
      'Terracina': [
        { id: 'port-terracina', name: 'Porto di Terracina', location: 'Terracina, Lazio', coordinates: { lat: 41.2922, lng: 13.2489 }, services: { mooring: true, fuel: true, water: true, electricity: true, wifi: true, restaurant: true, repair: true, security: true }, pricing: { mooring: 3.0, fuel: 1.88, water: 0.5, electricity: 0.3 }, contact: { phone: '+39 0773 702020', email: 'info@portoterracina.it', vhf: 'Canale 12' }, availability: { total: 280, available: 35, reserved: 245 }, rating: 4.3, reviews: 98 }
      ],
      'Formia': [
        { id: 'port-formia', name: 'Porto di Formia', location: 'Formia, Lazio', coordinates: { lat: 41.2558, lng: 13.6058 }, services: { mooring: true, fuel: true, water: true, electricity: true, wifi: false, restaurant: true, repair: false, security: true }, pricing: { mooring: 2.8, fuel: 1.87, water: 0.4, electricity: 0.25 }, contact: { phone: '+39 0771 789012', email: 'info@portoformia.it', vhf: 'Canale 9' }, availability: { total: 200, available: 18, reserved: 182 }, rating: 4.1, reviews: 65 }
      ],
      'San Felice Circeo': [
        { id: 'port-circeo', name: 'Porto del Circeo', location: 'San Felice Circeo, Lazio', coordinates: { lat: 41.2286, lng: 13.0883 }, services: { mooring: true, fuel: true, water: true, electricity: true, wifi: true, restaurant: true, repair: false, security: true }, pricing: { mooring: 3.5, fuel: 1.90, water: 0.5, electricity: 0.35 }, contact: { phone: '+39 0773 548000', email: 'info@portocirceo.it', vhf: 'Canale 9' }, availability: { total: 220, available: 22, reserved: 198 }, rating: 4.5, reviews: 87 }
      ]
    };
    
    const portServices = portsByLocation[location] || portsByLocation['Roma'];
    res.json(portServices);
  });

  // ===========================================
  // CONVERSATIONS & MESSAGES ENDPOINTS
  // ===========================================

  // Get or create conversation for a booking
  app.get("/api/conversations/:bookingId", async (req, res) => {
    if (!req.session.user) {
      return res.status(401).json({ error: "Non autenticato" });
    }
    
    try {
      const bookingId = parseInt(req.params.bookingId);
      const userId = parseInt(req.session.user.id);
      
      // Get the booking to find customer and owner
      const booking = await storage.getBooking(bookingId);
      if (!booking) {
        return res.status(404).json({ error: "Prenotazione non trovata" });
      }
      
      // Get the boat to find the owner
      const boat = await storage.getBoat(booking.boatId);
      if (!boat) {
        return res.status(404).json({ error: "Barca non trovata" });
      }
      
      // Check if user is part of this booking
      if (booking.customerId !== userId && boat.hostId !== userId) {
        return res.status(403).json({ error: "Non autorizzato" });
      }
      
      // Get or create conversation
      let conversation = await storage.getConversationByBookingId(bookingId);
      
      if (!conversation) {
        conversation = await storage.createConversation({
          bookingId,
          customerId: booking.customerId,
          ownerId: boat.hostId
        });
      }
      
      res.json(conversation);
    } catch (error: any) {
      console.error("Error getting conversation:", error);
      res.status(500).json({ error: error.message });
    }
  });

  // Get messages for a conversation
  app.get("/api/conversations/:conversationId/messages", async (req, res) => {
    if (!req.session.user) {
      return res.status(401).json({ error: "Non autenticato" });
    }
    
    try {
      const conversationId = parseInt(req.params.conversationId);
      const userId = parseInt(req.session.user.id);
      
      // Verify user is part of conversation
      const conversation = await storage.getConversation(conversationId);
      if (!conversation) {
        return res.status(404).json({ error: "Conversazione non trovata" });
      }
      
      if (conversation.customerId !== userId && conversation.ownerId !== userId) {
        return res.status(403).json({ error: "Non autorizzato" });
      }
      
      const messages = await storage.getMessages(conversationId);
      res.json(messages);
    } catch (error: any) {
      console.error("Error getting messages:", error);
      res.status(500).json({ error: error.message });
    }
  });

  // Send a message
  app.post("/api/conversations/:conversationId/messages", async (req, res) => {
    if (!req.session.user) {
      return res.status(401).json({ error: "Non autenticato" });
    }
    
    try {
      const conversationId = parseInt(req.params.conversationId);
      const userId = parseInt(req.session.user.id);
      const { content } = req.body;
      
      if (!content || !content.trim()) {
        return res.status(400).json({ error: "Messaggio richiesto" });
      }
      
      // Check for phone numbers to prevent private bookings
      const phoneRegex = /(?:\+?\d{1,4}[\s.-]?)?(?:\(?\d{2,4}\)?[\s.-]?)?\d{3,4}[\s.-]?\d{3,4}|\d{10,}/gi;
      const cleanedContent = content.replace(/\s/g, '');
      if (phoneRegex.test(content) || /\d{6,}/.test(cleanedContent)) {
        return res.status(400).json({ 
          error: "Non è possibile condividere numeri di telefono nei messaggi. Per garantire la sicurezza delle transazioni, tutte le prenotazioni devono avvenire tramite SeaBoo." 
        });
      }
      
      // Verify user is part of conversation
      const conversation = await storage.getConversation(conversationId);
      if (!conversation) {
        return res.status(404).json({ error: "Conversazione non trovata" });
      }
      
      if (conversation.customerId !== userId && conversation.ownerId !== userId) {
        return res.status(403).json({ error: "Non autorizzato" });
      }
      
      const message = await storage.createMessage({
        conversationId,
        senderId: userId,
        content: content.trim()
      });
      
      // Update conversation last message time
      await storage.updateConversationLastMessage(conversationId);
      
      res.json(message);
    } catch (error: any) {
      console.error("Error sending message:", error);
      res.status(500).json({ error: error.message });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}