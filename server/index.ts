import 'dotenv/config';
import Stripe from "stripe";
import cors from "cors";
import express, { type Request, Response } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import OpenAI from "openai";

const app = express();
app.enable("trust proxy");

app.use((req, res, next) => {
  const host = String(req.headers["x-forwarded-host"] || req.headers.host || "");
  const proto = String(req.headers["x-forwarded-proto"] || req.protocol || "");

  // solo per i tuoi domini pubblici
  const isOurDomain = /(^|\.)seaboo\.it$/i.test(host);

  if (isOurDomain) {
    // se è il dominio senza www → aggiungi www
    if (/^seaboo\.it$/i.test(host)) {
      return res.redirect(301, `https://www.seaboo.it${req.originalUrl}`);
    }
    // se è www ma su http → forza https
    if (proto !== "https") {
      return res.redirect(301, `https://${host}${req.originalUrl}`);
    }
  }
  next();
});

// middleware base
const ALLOWED_ORIGINS = [
  "https://www.seaboo.it",
  "https://seaboo.it",
  "capacitor://localhost",
  "http://localhost",
  "http://localhost:5173",
  "http://localhost:5000",
  "http://127.0.0.1:5000",
];

app.use(cors({
  origin: (origin, cb) => {
    if (!origin) return cb(null, true);
    if (ALLOWED_ORIGINS.includes(origin)) return cb(null, true);
    if (origin.includes('.replit.dev')) return cb(null, true);
    if (origin.includes('.replit.app')) return cb(null, true);
    return cb(new Error(`CORS blocked: ${origin}`));
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));

// Preflight esplicito
app.options("*", cors({
  origin: ALLOWED_ORIGINS,
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use((req, _res, next) => {
  console.log("[REQ]", req.method, req.path);
  next();
});

// Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2025-08-27.basil",
});

// OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// === API (PRIMA di registerRoutes/serveStatic) ===
app.get("/api/healthz", (_req, res) => res.json({ ok: true })); // test veloce

app.post(
  "/api/create-experience-payment",
  async (req: Request, res: Response) => {
    try {
      console.log("[PAYMENT] Received experience payment request:", req.body);
      
      // Frontend invia prezzoTotale in euro, convertiamo in centesimi
      const prezzoTotale = Number(req.body?.prezzoTotale || req.body?.amount);
      const currency = String(req.body?.currency || "eur");
      
      console.log("[PAYMENT] prezzoTotale:", prezzoTotale, "currency:", currency);
      
      if (!process.env.STRIPE_SECRET_KEY) {
        console.error("[PAYMENT] Missing Stripe secret key");
        return res.status(500).json({ error: "missing_secret" });
      }
      
      if (!Number.isFinite(prezzoTotale) || prezzoTotale <= 0) {
        console.error("[PAYMENT] Invalid amount:", prezzoTotale);
        return res.status(400).json({ error: "bad_amount" });
      }

      // Converti euro in centesimi per Stripe (es. 178 € -> 17800 centesimi)
      const amountInCents = Math.round(prezzoTotale * 100);
      console.log("[PAYMENT] Converting €", prezzoTotale, "to", amountInCents, "cents");
      
      // Genera un ID univoco per la prenotazione
      const bookingId = `exp_${Date.now()}_${Math.random().toString(36).substring(7)}`;
      console.log("[PAYMENT] Generated booking ID:", bookingId);

      console.log("[PAYMENT] Creating Stripe payment intent...");
      const intent = await stripe.paymentIntents.create({
        amount: amountInCents,
        currency,
        automatic_payment_methods: { enabled: true },
        description: "SeaBoo experience booking",
        metadata: {
          bookingId,
          experienceType: req.body?.tipo || "esperienza",
        }
      });

      console.log("[PAYMENT] Payment intent created successfully:", intent.id);
      return res.json({ 
        clientSecret: intent.client_secret,
        bookingId 
      });
    } catch (e: any) {
      console.error("[PAYMENT][ERROR] Full error:", e);
      console.error("[PAYMENT][ERROR] Message:", e?.message);
      console.error("[PAYMENT][ERROR] Stack:", e?.stack);
      return res.status(500).json({ error: "stripe_failed", message: e?.message });
    }
  },
);

// AI Chat Endpoint
app.post('/api/ai/chat', async (req: Request, res: Response) => {
  try {
    const { message } = req.body;

    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Message is required' });
    }

    if (!process.env.OPENAI_API_KEY) {
      console.error('[AI CHAT] Missing OpenAI API key');
      return res.status(503).json({ 
        error: 'AI service not configured',
        response: 'Mi dispiace, il servizio di assistenza AI non è al momento disponibile. Puoi contattarci via email per assistenza.'
      });
    }

    console.log('[AI CHAT] Received message:', message);

    const systemPrompt = `Sei l'assistente virtuale di SeaBoo, una piattaforma italiana di noleggio barche e servizi marittimi. 
      
Il tuo ruolo è aiutare gli utenti con:
- Informazioni su barche disponibili per il noleggio
- Condizioni meteo marine in tempo reale
- Prezzi e disponibilità
- Porti e località marittime in Lazio e Campania
- Prenotazioni e servizi
- Esperienze nautiche (tramonti, tour delle isole, charter)
- Servizi di ormeggio

Rispondi sempre in italiano in modo cordiale e professionale. Se non conosci una risposta specifica, indirizza l'utente a contattare il supporto via email (assistenza@seaboo.it) o telefono.

Ricorda: SeaBoo opera principalmente nelle regioni Lazio e Campania, con porti come Civitavecchia, Gaeta, Ponza, Napoli, Capri, Ischia, Amalfi, Positano.`;

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: message }
      ],
      max_tokens: 500,
      temperature: 0.7,
    });

    const response = completion.choices[0]?.message?.content || 
      'Mi dispiace, non sono riuscito a elaborare la tua richiesta. Prova a riformulare la domanda.';

    console.log('[AI CHAT] Response sent successfully');
    res.json({ response });

  } catch (error: any) {
    console.error('[AI CHAT] Error:', error.message);
    res.status(500).json({ 
      error: 'AI service error',
      response: 'Mi dispiace, al momento non riesco a rispondere. Il servizio potrebbe essere temporaneamente non disponibile. Prova più tardi o contattaci via email.'
    });
  }
});

// routing/statici DOPO le API
(async () => {
  const server = await registerRoutes(app);
  if (process.env.NODE_ENV === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }
  const port = Number(process.env.PORT || 5000);
  server.listen(port, "0.0.0.0", () =>
    log(`🚀 Server running on port ${port}`),
  );
})();
