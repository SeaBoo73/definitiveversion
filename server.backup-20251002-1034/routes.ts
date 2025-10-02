import type { Express } from "express";
import express from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertUserSchema, insertOwnerSchema, insertUserOnlySchema, loginSchema, insertBoatSchema } from "@shared/schema";
import session from "express-session";
import connectPg from "connect-pg-simple";
import multer from "multer";
import path from "path";
import { fileURLToPath } from 'url';
import Stripe from "stripe";
// Convertiti in ES modules
import { verifyAppleIdToken } from './appleAuth.js';
import { verifyReceipt } from './iap.js';

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
        <p>Scarica l'app SeaBoo dall'App Store per un'esperienza ottimizzata su mobile.</p>
        
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

  // Health generico
  app.get('/health', (_req, res) => {
    res.json({ ok: true, services: { siwa: true, iap: true } });
  });

  // ---- REVIEW SELF-CHECK ----
  app.get('/review/info', (_req, res) => {
    res.json({
      ok: true,
      reviewMode: REVIEW_MODE,
      env: [
        safeFlag('APPLE_CLIENT_ID', !!process.env.APPLE_CLIENT_ID),
        safeFlag('BUNDLE_ID', !!process.env.BUNDLE_ID),
        safeFlag('APPLE_SHARED_SECRET', !!process.env.APPLE_SHARED_SECRET)
      ],
      services: {
        support: true,
        siwa: true,
        iap: true,
        payments: true
      }
    });
  });

  // ---- Sign in with Apple ----
  app.get('/auth/apple/health', (_req, res) => {
    res.status(200).json({ ok: true, service: 'apple-login' });
  });

  app.post('/auth/apple/callback', async (req, res) => {
    try {
      const { id_token, user_info } = req.body || {};
      
      // Set default audience if environment variables are missing (for development/testing)
      const audience = process.env.APPLE_CLIENT_ID || process.env.BUNDLE_ID || 'com.seaboo.app';
      
      if (!id_token) {
        return res.status(400).json({ ok: false, error: 'missing_id_token' });
      }

      const payload = await verifyAppleIdToken(id_token, audience);
      
      // Handle user creation/update logic
      let user;
      const existingUser = await storage.getUserByEmail(payload.email || '');
      
      if (existingUser) {
        // User exists, update Apple ID if needed
        user = existingUser;
      } else {
        // Create new user from Apple ID token
        const userData = {
          email: payload.email || `apple_${payload.sub}@seaboo.temp`,
          password: '', // No password for Apple users
          firstName: user_info?.name?.firstName || 'User',
          lastName: user_info?.name?.lastName || '',
          role: 'user',
          appleId: payload.sub
        };
        
        try {
          user = await storage.createUser(userData);
        } catch (error) {
          // If user creation fails (e.g., email exists), try to find by Apple ID
          console.log('User creation failed, trying to authenticate existing user:', error);
          user = existingUser || await storage.getUserByEmail(payload.email || '');
        }
      }

      if (!user) {
        return res.status(400).json({ ok: false, error: 'user_creation_failed' });
      }

      // Create session for the user
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
        ok: true, 
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          userType: user.role === "owner" ? "owner" : "customer"
        },
        redirectTo: user.role === "owner" ? "/owner/dashboard" : "/home"
      });
    } catch (e) {
      console.error('Apple auth error:', e);
      res.status(401).json({ ok: false, error: 'invalid_apple_token', details: e.message });
    }
  });

  // ---- In-App Purchases / StoreKit ----
  app.get('/iap/health', (_req, res) => {
    res.status(200).json({ ok: true, service: 'iap' });
  });

  app.post('/iap/verify', async (req, res) => {
    try {
      const { receiptBase64 } = req.body || {};
      const result = await verifyReceipt({
        base64Receipt: receiptBase64,
        password: process.env.APPLE_SHARED_SECRET,
        useSandbox: process.env.IAP_USE_SANDBOX === 'true'
      });
      res.json({ ok: true, result });
    } catch (e) {
      console.error('IAP verify error:', e);
      res.status(400).json({ ok: false, error: 'iap_verify_failed' });
    }
  });

  // App Store Server Notifications (minimo: logging)
  app.post('/appstore/notifications', async (req, res) => {
    try {
      console.log('ASSN incoming:', JSON.stringify(req.body));
      res.status(200).json({ ok: true });
    } catch (e) {
      console.error('ASSN error:', e);
      res.status(200).json({ ok: true });
    }
  });

  // --- REVIEW MODE TOGGLE ---
  const REVIEW_MODE = process.env.REVIEW_MODE === 'true';
  
  // Safe flag helper
  function safeFlag(name: string, present: boolean) { 
    return { name, present: !!present }; 
  }

  // helper: risposta standard pagamento riuscito (mock)
  function mockPaymentSuccess(amount: number, currency = 'EUR') {
    return {
      ok: true,
      mode: 'review',
      payment: {
        status: 'succeeded',
        provider: 'mock',
        amount,
        currency,
        id: 'pm_mock_' + Date.now()
      }
    };
  }

  // Health per pagamenti
  app.get('/payments/health', (_req, res) => {
    res.json({ ok: true, reviewMode: REVIEW_MODE });
  });

  // Crea un "intent" di pagamento (mock in review)
  app.post('/payments/intents', (req, res) => {
    const { amount, currency = 'EUR' } = req.body || {};
    if (REVIEW_MODE) {
      return res.json(mockPaymentSuccess(amount, currency));
    }
    // TODO: qui codice reale PSP (Stripe/PayPal) quando REVIEW_MODE=false
    return res.status(501).json({ ok: false, error: 'provider_not_implemented' });
  });

  // Conferma pagamento (mock in review)
  app.post('/payments/confirm', (req, res) => {
    const { paymentMethodId, amount, currency = 'EUR' } = req.body || {};
    if (REVIEW_MODE) {
      return res.json(mockPaymentSuccess(amount, currency));
    }
    // TODO: qui conferma reale col PSP
    return res.status(501).json({ ok: false, error: 'provider_not_implemented' });
  });

  // Endpoint prenotazione che accetta pagamento mock se review
  app.post('/bookings/create', async (req, res) => {
    try {
      const { boatId, startDate, endDate, amount, currency = 'EUR' } = req.body || {};
      if (!boatId || !startDate || !endDate) {
        return res.status(400).json({ ok: false, error: 'missing_fields' });
      }
      let paymentResult = null;
      if (REVIEW_MODE) {
        paymentResult = mockPaymentSuccess(amount, currency);
      } else {
        // In produzione richiedi prima /payments/intents o /payments/confirm con PSP reale
        return res.status(402).json({ ok: false, error: 'payment_required' });
      }
      // TODO: salva prenotazione nel DB
      res.json({
        ok: true,
        booking: {
          id: 'bk_' + Date.now(),
          boatId, startDate, endDate,
          amount, currency,
          paymentStatus: 'paid_demo'
        },
        paymentResult
      });
    } catch (e) {
      console.error('booking error', e);
      res.status(500).json({ ok: false, error: 'booking_failed' });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}